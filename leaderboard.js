// Grid API: Access to Grid API methods
let gridApi;

function sumOfLowestFour({values}) {
    // Sort the values in ascending order
    const sortedValues = values.sort((a, b) => a - b);


    // Take the first 4 values and sum them
    const lowestFour = sortedValues.slice(0, 4);
    const sum = lowestFour.reduce((a, b) => a + b, 0);
    return sum;
  }

const gridOptions = {
    
    // Data to be displayed
  rowData: [],
  // Columns to be displayed (Should match rowData properties)
  suppressAggFuncInHeader: true,
  columnDefs: [
    {
      field: 'TeamName',
      flex: 1,
      rowGroup: true,
      hide: true,
    },

    {
      field: 'r1',
      headerName: 'Round 1',
      width: 120,
      aggFunc: sumOfLowestFour,
    },
    {
      field: 'r2',
      headerName: 'Round 2',
      width: 120,
      aggFunc: sumOfLowestFour,
    },
    {
      field: 'r3',
      headerName: 'Round 3',
      width: 120,
      aggFunc: sumOfLowestFour,
    },
    {
      field: 'r4',
      headerName: 'Round 4',
      width: 120,
      aggFunc: sumOfLowestFour,
    },
    {
      field: 'overall',
      headerName: 'Overall',
      width: 120,
      aggFunc: sumOfLowestFour,
    },
  ],


  autoGroupColumnDef: {
    headerName: 'Team Name', // Replace with your desired column name
    field: 'TeamName',
    cellRendererParams: {
        suppressCount: true, // This will remove the (x) count after the group
        innerRenderer: function(params) {
            if (params.node.group) {
              return params.value;
            } else {
              return params.data.PlayerName;
            }
          },  
    },
  },

  // Configurations applied to all columns
  defaultColDef: {
    filter: true,
    editable: true,
  },
  // Grid Options & Callbacks
  pagination: true,
  rowSelection: 'multiple',
  onSelectionChanged: (event) => {
    console.log('Row Selection Event!');
  },
  onCellValueChanged: (event) => {
    console.log(`New Cell Value: ${event.value}`);
  },
};

// Create Grid: Create new grid within the #myGrid div, using the Grid Options object
gridApi = agGrid.createGrid(document.querySelector('#myGrid'), gridOptions);

// Fetch Remote Data
// Old: fetch('http://localhost:3001/api/leaderboard')
fetch('leaderboard.json')
  .then((response) => response.json())
  .then((data) => {
    // Parse numeric fields back to numbers
    data.forEach(row => {
      row.p_r1 = parseFloat(row.p_r1);
      row.p_r2 = parseFloat(row.p_r2);
      row.p_r3 = parseFloat(row.p_r3);
      row.p_r4 = parseFloat(row.p_r4);
      row.score = parseFloat(row.score);
    });

    return data;  // Add this line
  })
  .then((data) => gridApi.setGridOption('rowData', data));
