const express = require('express');
const { Client } = require('pg');
const app = express();
const port = 3003;

app.use(express.static('public'));

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});


// find entry list for tournament - use number to change Tournament
//501 = 2023 Masters, 651 = 2024 Masters, 647 = Players Championship. Uses "Fixtures" Get request
const url = 'https://golf-leaderboard-data.p.rapidapi.com/entry-list/501';
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
async function tournament_init () {
  try {
    const response = await fetch(url, options);
    const result = await response.json();

    // focus on just the part we need
    const result2 = result.results.entry_list;

    // connect to database
    await client.connect();

    // Counter for WorldGolfRank
    let rank = 1;

    // clear out the Players table
    const query0 = 'TRUNCATE TABLE "Players_v2"';
    await client.query(query0);

    // Loop over the result and insert each player into the table
    for (const playerName in result2) {
      const player = result2[playerName];
      // Insert new PlayerID into Players table
      const query1 = 'INSERT INTO "Players_v2" ("PlayerID", "PlayerName", "Group") VALUES ($1, $2, $3)';
      const group = rank <= 5 ? 'A' : rank <= 5+8 ? 'B' : rank <= 5+8+(88-13)/4 ? 'C' : rank <= 5+8+2*(88-13)/4 ? 'D' : rank <= 5+8+3*(88-13)/4 ? 'E' : 'F';
      rank++;
      const values1 = [player.player_id, player.first_name + " " + player.last_name, group];
      await client.query(query1, values1);     
      
    }

    rank = rank -1;
    console.log('Tournament initialized with ' + rank + ' players')

    // close the connection
    await client.end();


  } catch (error) {
    console.error(error);
  }
}

tournament_init()
