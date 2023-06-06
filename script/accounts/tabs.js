// Get references to the tabs and tables
const tabs = document.querySelectorAll('.tab');
const tables = document.querySelectorAll('.table');

// Add event listeners to the tabs
tabs.forEach((tab, index) => {
  tab.addEventListener('click', () => {
    showTable(index);
    hideOtherTables(index);
  });
});

// Function to show a table
function showTable(index) {
  tables[index].style.display = 'table';
}

// Function to hide other tables
function hideOtherTables(index) {
  tables.forEach((table, i) => {
    if (i !== index) {
      table.style.display = 'none';
    }
  });
}

// Hide all tables initially
tables.forEach((table) => {
  table.style.display = 'none';
});

// Show the first table by default
showTable(0);
