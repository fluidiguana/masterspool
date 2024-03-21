const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');

const app = express();
const port = 3001;

// set up CORS to allow running from different port than app.js
const cors = require('cors');
app.use(cors());


// Connect to your PostgreSQL database
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'mastersbettingpool',
  password: 'chris14',
  port: 5432,
});

// Serve static files from the public directory
app.use(express.static('public'));

// API endpoint for the leaderboard
app.get('/api/leaderboard', async (_req, res) => {
  try {
      const results = await pool.query(`
          SELECT tds."TeamName", ps."PlayerName", ps.r1 as p_r1, ps.r2 as p_r2, ps.r3 as p_r3, ps.r4 as p_r4, ps.score as score
          FROM teamdailyscores tds
          JOIN "Teams" ON tds."TeamName" = "Teams"."TeamName"
          JOIN "PlayerScores_v2" ps ON ps."PlayerName" IN ("Teams"."Player1", "Teams"."Player2", "Teams"."Player3", "Teams"."Player4", "Teams"."Player5", "Teams"."Player6", "Teams"."Player7", "Teams"."Player8", "Teams"."Player9", "Teams"."Player10")
          ORDER BY tds.r1, tds.r2, tds.r3, tds.r4, tds."Overall" DESC
      `);

      const simplifiedRows = results.rows.map(row => {
        return {
            TeamName: row.TeamName,
            PlayerName: row.PlayerName,
            r1: row.p_r1,
            r2: row.p_r2,
            r3: row.p_r3,
            r4: row.p_r4,
            overall: row.score
        };
    });
    
    res.json(simplifiedRows);
      
  } catch (err) {
      console.error('Error executing query', err.stack);
      res.status(500).json({ error: 'Internal server error' });
  }
});

// API endpoint to populate the draft
app.get('/Players_v2/:group', async (req, res) => {
  const group = req.params.group;
  try {
    const queryText = 'SELECT "PlayerName" FROM "Players_v2" WHERE "Group" = $1';
    const queryValues = [group];
    const players = await pool.query(queryText, queryValues);
    res.json(players.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }
});


// API endpoint to accept results of the draft
app.use(bodyParser.json());
app.post('/draft', async (req, res) => {
  const { teamName, picks, winnersScoreToPar,randomNumbers } = req.body; // picks should be an array of player IDs

  try {
    // Begin transaction
    await pool.query('BEGIN');
  
    // Insert the team into the database
    const insertTeamText = 'INSERT INTO "Teams"("TeamName", "Tiebreaker", "Random Numbers") VALUES($1, $2, $3) RETURNING "TeamID"';
    const insertTeamValues = [teamName, winnersScoreToPar,randomNumbers];
    const teamResponse = await pool.query(insertTeamText, insertTeamValues);
    const teamId = teamResponse.rows[0].TeamID;
  
    // Insert the draft picks into the database
    let playerCount = 1;
    for (const pick of picks) {
      const playerColumnName = `Player${playerCount}`; // Dynamically set the column name
      const updatePickText = `UPDATE "Teams" SET "${playerColumnName}" = $1 WHERE "TeamID" = $2`;
      const updatePickValues = [pick, teamId];
      await pool.query(updatePickText, updatePickValues);
      playerCount++;
    }

    // Commit transaction
    await pool.query('COMMIT');

    res.status(201).json({ message: "Draft successful", teamId });
  } catch (error) {
    // Rollback transaction on error
    await pool.query('ROLLBACK');
    console.error('Error executing query:', error.message);
    console.error('Detailed error:', error);
    console.error('Draft Error:', error);
    res.status(500).json({ error: "Internal server error" });
  }
})

// Endpoint to get team data
app.get('/api/teams', async (_req, res) => {
  try {
    const query = 'SELECT "TeamName", "Player1", "Player2", "Player3", "Player4", "Player5", "Player6", "Player7", "Player8", "Player9", "Player10" FROM "Teams"';
    const { rows } = await pool.query(query);
    res.json(rows);
  } catch (err) {
    console.error('Error executing query', err.stack);
    res.status(500).send('Internal server error');
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});