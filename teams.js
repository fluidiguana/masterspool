function fetchTeams() {
  const apiKey = '6cc00315d47e53a4e24aed427a82217ccb0c1a5c	'; // Replace this with your actual API key
  const spreadsheetId = '13UdzO_PF24UcxXdVJGseIzhfsB9HkMO9mp8aT7c-pR4'; // Use your actual Spreadsheet ID
  const range = 'Teams'; // Adjust based on your actual data range, e.g., 'Sheet1!A2:K'
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?key=${apiKey}`;

  fetch(url)
    .then(response => response.json())
    .then(data => {
      const rows = data.values; // 'values' contains an array of arrays, each representing a row of the sheet.
      teamsTableBody.innerHTML = ''; // Clear existing rows

      // Assuming the first row in 'rows' contains column headers and actual data starts from the second row
      rows.slice(1).forEach((row, index) => {
        const teamRow = document.createElement('tr');
        teamRow.innerHTML = row.map(cell => `<td>${cell}</td>`).join(''); // Create a cell for each column
        teamsTableBody.appendChild(teamRow);
      });
    })
    .catch(error => console.error('Error:', error));
}
