document.addEventListener('DOMContentLoaded', function() {
    const teamsTableBody = document.getElementById('teamsTableBody');
  
    function fetchTeams() {
      fetch('http://localhost:3001/api/teams')
        .then(response => response.json())
        .then(data => {
          teamsTableBody.innerHTML = ''; // Clear existing rows
          data.forEach(team => {
            const row = document.createElement('tr');
            row.innerHTML = `
              <td class ="bold-column">${team.TeamName}</td>
              <td>${team.Player1}</td>
              <td>${team.Player2}</td>
              <td>${team.Player3}</td>
              <td>${team.Player4}</td>
              <td>${team.Player5}</td>
              <td>${team.Player6}</td>
              <td>${team.Player7}</td>
              <td>${team.Player8}</td>
              <td>${team.Player9}</td>
              <td>${team.Player10}</td>
            `;
            teamsTableBody.appendChild(row);
          });
        })
        .catch(error => console.error('Error:', error));
    }
    
    fetchTeams(); // Fetch teams when the page loads
  });
