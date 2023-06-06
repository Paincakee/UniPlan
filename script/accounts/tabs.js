// Get references to the tabs and tables
const accountsTab = document.getElementById('accounts-tab');
const projectsTab = document.getElementById('projects-tab');
const accountsTable = document.getElementById('accounts-table');
const projectsTable = document.getElementById('projects-table');

// Add event listeners to the tabs
accountsTab.addEventListener('click', () => {
    showTable(accountsTable);
    hideTable(projectsTable);
});

projectsTab.addEventListener('click', () => {
    showTable(projectsTable);
    hideTable(accountsTable);
});

// Function to show a table
function showTable(table) {
    table.style.display = 'table';
}

// Function to hide a table
function hideTable(table) {
    table.style.display = 'none';
}

hideTable(projectsTable);