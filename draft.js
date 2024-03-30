// Function to populate the draft page. Uses results of server.js and passes into UI
function populatePlayers(group, selectId) {
    const selectElement = document.getElementById(selectId);
  
    fetch(`http://localhost:3001/Players_v2/${group}`)
      .then(response => response.json())
      .then(Players => {
        Players.forEach(player => {
          const option = document.createElement('option');
          option.value = player.PlayerName;
          option.textContent = player.PlayerName;
          selectElement.appendChild(option);
        });
      })
      .catch(error => {
        console.error('Error fetching players:', error);
      });
  }
  
  // Populate dropdown on page load
  document.addEventListener('DOMContentLoaded', () => {
    populatePlayers('A', 'groupAPlayer1')
    populatePlayers('A', 'groupAPlayer2')
    populatePlayers('B', 'groupBPlayer1')
    populatePlayers('B', 'groupBPlayer2')
    populatePlayers('C', 'groupCPlayer1')
    populatePlayers('C', 'groupCPlayer2')
    populatePlayers('D', 'groupDPlayer1')
    populatePlayers('D', 'groupDPlayer2')
    populatePlayers('E', 'groupEPlayer1')
    populatePlayers('F', 'groupFPlayer1');
  });
  
  // Draft API to BE
  document.getElementById('draftForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Prevent duplicate selections
    // Get the selected players for each group
    const groupAPlayer1 = document.getElementById('groupAPlayer1').value;
    const groupAPlayer2 = document.getElementById('groupAPlayer2').value;
    const groupBPlayer1 = document.getElementById('groupBPlayer1').value;
    const groupBPlayer2 = document.getElementById('groupBPlayer2').value;
    const groupCPlayer1 = document.getElementById('groupCPlayer1').value;
    const groupCPlayer2 = document.getElementById('groupCPlayer2').value;
    const groupDPlayer1 = document.getElementById('groupDPlayer1').value;
    const groupDPlayer2 = document.getElementById('groupDPlayer2').value;

    console.log(groupAPlayer1, groupAPlayer2, groupBPlayer1, groupBPlayer2, groupCPlayer1, groupCPlayer2, groupDPlayer1, groupDPlayer2)

    // Check if the selected players within the same group are different
    if (groupAPlayer1 === groupAPlayer2) {
      alert('You must pick different players within group A');
      return;
    }
    if (groupBPlayer1 === groupBPlayer2) {
      alert('You must pick different players within group B');
      return;
    }

    if (groupCPlayer1 === groupCPlayer2) {
      alert('You must pick different players within group C');
      return;
    }

    if (groupDPlayer1 === groupDPlayer2) {
      alert('You must pick different players within group D');
      return;
    }

    // Get the team name and picks
    const teamName = document.getElementById('teamName').value;
    const picks = [
      document.getElementById('groupAPlayer1').value,
      document.getElementById('groupAPlayer2').value,
      document.getElementById('groupBPlayer1').value,
      document.getElementById('groupBPlayer2').value,
      document.getElementById('groupCPlayer1').value,
      document.getElementById('groupCPlayer2').value,
      document.getElementById('groupDPlayer1').value,
      document.getElementById('groupDPlayer2').value,
      document.getElementById('groupEPlayer1').value,
      document.getElementById('groupFPlayer1').value,
    ];
    const winnersScoreToPar = document.getElementById('winnersScoreToPar').value;

    console.log('Sending data:', { teamName, picks, winnersScoreToPar});

    fetch('http://localhost:3001/draft', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ teamName, picks, winnersScoreToPar }),
    })
    .then(response => response.json())
    .then(data => {
      // Handle response, such as showing success message or handling errors
      console.log(data);
    })
    .catch((error) => {
      console.error('Error:', error);
    });

    // Show the popup
    alert('Please venmo @chris Gradone $50 to lock in your team');
    
  });



