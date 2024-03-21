const express = require('express');
const app = express();
const port = 3000;

app.use(express.static('public'));

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});


// Steps to refresh each year
// - Update dates and times in the Rules page
// https://rapidapi.com/sportcontentapi/api/golf-leaderboard-data
// API Params:
// orgId = 1
// tournId = 014
// year = 2023
// playerID = X (Colin Morikawa = 50525)
// roundId = 1