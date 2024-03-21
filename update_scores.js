const express = require('express');
const { Client } = require('pg');
const app = express();
const port = 3003;

app.use(express.static('public'));

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});


// find leaderboard for tournament - use number to change Tournament
//501 = 2023 Masters, 651 = 2024 Masters, 647 = Players Championship. Uses "Leaderboard" Get request
const url = 'https://golf-leaderboard-data.p.rapidapi.com/leaderboard/501';
const options = {
	method: 'GET',
	headers: {
		'X-RapidAPI-Key': '9242b70074mshea89133fe702f38p1f8cb6jsn500fdda52e8b',
		'X-RapidAPI-Host': 'golf-leaderboard-data.p.rapidapi.com'
	}
};

// Connect to your PostgreSQL database
const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'mastersbettingpool',
  password: 'chris14',
  port: 5432,
});

// fetch entry list from RapidAPI for tournament into JSON
async function refresh_scores () {
  try {
    const response = await fetch(url, options);
    const result = await response.json();

    // focus on just the part we need
    const result2 = result.results.leaderboard;

    // connect to database
    await client.connect();

    // clear out the Players table
    const query0 = 'TRUNCATE TABLE "PlayerScores_v2"';
    await client.query(query0);

    // Loop over the result and insert each player into the table
    for (const playerName in result2) {
      const player = result2[playerName];
      // Insert new PlayerID into PlayerScores table
      const query1 = 'INSERT INTO "PlayerScores_v2" ("PlayerID", "PlayerName", r1, r2, r3, r4, score) VALUES ($1, $2, $3, $4, $5, $6, $7)';
      
      let r1 = player.rounds[0].total_to_par;
      let r2 = player.rounds[1].total_to_par;
      let r3 = player.rounds[2].total_to_par;
      let r4 = player.rounds[3].total_to_par;
      let score = player.total_to_par;

      // Update Cut Score to 99 if player is cut
      if (player.status === 'cut') {
        r3 = 99;
        r4 = 99;
        score = 99;
      }

      // Update round score to 99 if player withdraws
      if (player.status === 'withdrawn') {
        r1 = 99;
        r2 = 99;
        r3 = 99;
        r4 = 99;
        score = 99;
      }

      const values1 = [player.player_id, player.first_name + " " + player.last_name, r1, r2, r3, r4, score];
      await client.query(query1, values1);

    }

    // close the connection
    await client.end();


  } catch (error) {
    console.error(error);
  }
}

refresh_scores()