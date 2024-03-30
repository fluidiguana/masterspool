function fetchTeams() {
  const documentId = '2PACX-1vTdEdeCu-lXdlVu0Z4VHHlpb094arTOFhCVpeANpxdA9PHf6LcAQ-awuBr72rey7hNMslAWiVoxXh4c';
  fetch(`https://spreadsheets.google.com/feeds/cells/${documentId}/1/public/full?alt=json`)
    .then(response => response.json())
    .then(data => {
      teamsTableBody.innerHTML = ''; // Clear existing rows

      // The actual data starts at the 8th entry in the feed.entry array
      const teams = data.feed.entry.slice(1);

      teams.forEach(team => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td class ="bold-column">${team.Teams$team.$t}</td>
          <td>${team.Teams$Player1.$t}</td>
          <td>${team.Teams$Player2.$t}</td>
          <td>${team.Teams$Player3.$t}</td>
          <td>${team.Teams$Player4.$t}</td>
          <td>${team.Teams$Player5.$t}</td>
          <td>${team.Teams$Player6.$t}</td>
          <td>${team.Teams$Player7.$t}</td>
          <td>${team.Teams$Player8.$t}</td>
          <td>${team.Teams$Player9.$t}</td>
          <td>${team.Teams$Player10.$t}</td>
        `;
        teamsTableBody.appendChild(row);
      });
    })
    .catch(error => console.error('Error:', error));
}
