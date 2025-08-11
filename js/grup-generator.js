// grup-generator.js - Fungsi-fungsi untuk Grup Generator Esport

// Global variables
let tournamentNameInput;
let groupCountInput;
let teamsPerGroupInput;
let seedingSelect;
let massTeamInput;
let individualTeamInputs;
let teamInputContainer;
let individualInputContainer;
let generateButton;
let resultsContainer;
let groupsContainer;
let exportExcelButton;
let printButton;
let resetButton;
let addTeamButton;
let removeTeamButton;
let increaseGroupsButton;
let decreaseGroupsButton;
let increaseTeamsButton;
let decreaseTeamsButton;

// Data
let teams = [];
let groups = [];

// Initialize Grup Generator
function initializeGrupGenerator() {
    // Initialize DOM elements
    tournamentNameInput = document.getElementById('tournamentName');
    groupCountInput = document.getElementById('groupCount');
    teamsPerGroupInput = document.getElementById('teamsPerGroup');
    seedingSelect = document.getElementById('seedingOption');
    massTeamInput = document.getElementById('bulkTeamInput');
    individualTeamInputs = document.getElementById('teamInputFields');
    teamInputContainer = document.getElementById('bulkInputContainer');
    individualInputContainer = document.getElementById('individualInputContainer');
    generateButton = document.getElementById('generateGroups');
    resultsContainer = document.getElementById('resultsSection');
    groupsContainer = document.getElementById('groupsContainer');
    exportExcelButton = document.getElementById('exportExcel');
    printButton = document.getElementById('printGroups');
    resetButton = document.getElementById('resetForm');
    addTeamButton = document.getElementById('addTeam');
    removeTeamButton = document.querySelector('.remove-team');
    increaseGroupsButton = document.getElementById('increaseGroups');
    decreaseGroupsButton = document.getElementById('decreaseGroups');
    increaseTeamsButton = document.getElementById('increaseTeams');
    decreaseTeamsButton = document.getElementById('decreaseTeams');
    
    // Disable export buttons at initialization
    exportExcelButton.disabled = true;
    printButton.disabled = true;
    
    // Add event listeners
    // Add event listeners to input method radio buttons
    const inputMethodRadios = document.querySelectorAll('input[name="inputMethod"]');
    inputMethodRadios.forEach(radio => {
        radio.addEventListener('change', toggleTeamInputMethod);
    });
    
    if (groupCountInput) {
        groupCountInput.addEventListener('change', updateTeamInputs);
        teamsPerGroupInput.addEventListener('change', updateTeamInputs);
    }
    
    if (increaseGroupsButton) {
        increaseGroupsButton.addEventListener('click', () => {
            groupCountInput.value = parseInt(groupCountInput.value) + 1 || 3;
            updateTeamInputs();
        });
    }
    
    if (decreaseGroupsButton) {
        decreaseGroupsButton.addEventListener('click', () => {
            const currentValue = parseInt(groupCountInput.value) || 2;
            if (currentValue > 1) {
                groupCountInput.value = currentValue - 1;
                updateTeamInputs();
            }
        });
    }
    
    if (increaseTeamsButton) {
        increaseTeamsButton.addEventListener('click', () => {
            teamsPerGroupInput.value = parseInt(teamsPerGroupInput.value) + 1 || 5;
            updateTeamInputs();
        });
    }
    
    if (decreaseTeamsButton) {
        decreaseTeamsButton.addEventListener('click', () => {
            const currentValue = parseInt(teamsPerGroupInput.value) || 4;
            if (currentValue > 1) {
                teamsPerGroupInput.value = currentValue - 1;
                updateTeamInputs();
            }
        });
    }
    
    if (generateButton) {
        generateButton.addEventListener('click', generateGroups);
    }
    
    if (exportExcelButton) {
        exportExcelButton.addEventListener('click', exportToExcel);
    }
    
    if (printButton) {
        printButton.addEventListener('click', printGroups);
    }
    
    if (resetButton) {
        resetButton.addEventListener('click', resetForm);
    }
    
    if (addTeamButton) {
        addTeamButton.addEventListener('click', addTeamInput);
    }
    
    if (removeTeamButton) {
        removeTeamButton.addEventListener('click', removeTeamInput);
    }
    
    // Initialize team inputs
    updateTeamInputs();
    toggleTeamInputMethod();
    
    // Disable export buttons initially
    exportExcelButton.disabled = true;
    printButton.disabled = true;
    
    // Initialize Sortable.js for drag and drop
    initializeSortable();
}

// Toggle between mass and individual team input methods
function toggleTeamInputMethod() {
    // Get the selected radio button value
    const method = document.querySelector('input[name="inputMethod"]:checked').value;
    
    if (method === 'bulk') {
        teamInputContainer.classList.remove('hidden');
        individualInputContainer.classList.add('hidden');
    } else {
        teamInputContainer.classList.add('hidden');
        individualInputContainer.classList.remove('hidden');
        updateIndividualTeamInputs();
    }
}

// Update individual team input fields based on group count and teams per group
function updateTeamInputs() {
    const groupCount = parseInt(groupCountInput.value) || 2;
    const teamsPerGroup = parseInt(teamsPerGroupInput.value) || 4;
    const totalTeams = groupCount * teamsPerGroup;
    
    // Update placeholder for mass input
    massTeamInput.placeholder = `Masukkan ${totalTeams} tim, satu tim per baris`;
    
    // Update individual inputs
    const selectedMethod = document.querySelector('input[name="inputMethod"]:checked').value;
    if (selectedMethod === 'individual') {
        updateIndividualTeamInputs();
    }
}

// Update individual team input fields
function updateIndividualTeamInputs() {
    const groupCount = parseInt(groupCountInput.value) || 2;
    const teamsPerGroup = parseInt(teamsPerGroupInput.value) || 4;
    const totalTeams = groupCount * teamsPerGroup;
    
    // Clear existing inputs
    individualTeamInputs.innerHTML = '';
    
    // Create new input fields
    for (let i = 0; i < totalTeams; i++) {
        addTeamInput();
    }
}

// Add a new team input field
function addTeamInput() {
    const index = individualTeamInputs.querySelectorAll('.team-input-row').length;
    
    const row = document.createElement('div');
    row.className = 'team-input-row mb-2';
    
    const inputGroup = document.createElement('div');
    inputGroup.className = 'flex items-center';
    
    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'team-input flex-grow px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500';
    input.placeholder = `Tim ${index + 1}`;
    input.dataset.index = index;
    
    // Always add seeding option regardless of seeding method
    const seedingDropdown = document.createElement('select');
    seedingDropdown.className = 'seeding-select ml-2 px-2 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500';
    seedingDropdown.disabled = seedingSelect.value === 'random';
    
    const notSeededOption = document.createElement('option');
    notSeededOption.value = '';
    notSeededOption.textContent = 'Not Seeded';
    
    const seededOption = document.createElement('option');
    seededOption.value = 'seeded';
    seededOption.textContent = 'Seeded';
    
    seedingDropdown.appendChild(notSeededOption);
    seedingDropdown.appendChild(seededOption);
    
    inputGroup.appendChild(input);
    inputGroup.appendChild(seedingDropdown);
    
    row.appendChild(inputGroup);
    individualTeamInputs.appendChild(row);
}

// Remove the last team input field
function removeTeamInput() {
    const rows = individualTeamInputs.querySelectorAll('.team-input-row');
    if (rows.length > 0) {
        individualTeamInputs.removeChild(rows[rows.length - 1]);
    }
}

// Generate groups based on input
function generateGroups() {
    const tournamentName = tournamentNameInput.value || 'Tournament';
    const groupCount = parseInt(groupCountInput.value) || 2;
    const teamsPerGroup = parseInt(teamsPerGroupInput.value) || 4;
    const seedingMethod = seedingSelect.value;
    const inputMethod = document.querySelector('input[name="inputMethod"]:checked').value;
    
    // Get teams
    teams = [];
    
    if (inputMethod === 'bulk') {
        // Get teams from mass input
        const massInput = massTeamInput.value.trim();
        if (massInput) {
            teams = massInput.split('\n')
                .map(team => {
                    // Check if team has seeding info [S1], [S2], etc.
                    const seedMatch = team.match(/\[(S\d+)\]/);
                    const isSeeded = seedMatch !== null;
                    const cleanName = team.replace(/\[(S\d+)\]/g, '').trim();
                    
                    return {
                        name: cleanName,
                        seeded: isSeeded
                    };
                })
                .filter(team => team.name.length > 0);
        }
    } else {
        // Get teams from individual inputs
        const teamRows = individualTeamInputs.querySelectorAll('.team-input');
        const seedingSelects = individualTeamInputs.querySelectorAll('.seeding-select');
        
        for (let i = 0; i < teamRows.length; i++) {
            const teamName = teamRows[i].value.trim();
            if (teamName) {
                const seedingValue = seedingSelects[i].value;
                const isSeeded = seedingValue !== '';
                
                teams.push({
                    name: teamName,
                    seeded: isSeeded
                });
            }
        }
    }
    
    // Validate team count
    const requiredTeams = groupCount * teamsPerGroup;
    if (teams.length < requiredTeams) {
        showToast(`Anda perlu memasukkan minimal ${requiredTeams} tim.`, 'error');
        return;
    }
    
    // Prepare teams for grouping
    let teamsForGrouping = [];
    
    if (seedingMethod === 'random') {
        // For random seeding, ignore any seeded status
        teamsForGrouping = teams.map(team => ({
            name: team.name,
            seeded: false
        }));
    } else {
        // For seeded or manual, use the seeded status from the input
        teamsForGrouping = teams;
    }
    
    // Divide teams into groups
    groups = divideIntoGroups(teamsForGrouping, groupCount, seedingMethod);
    
    // Display results
    displayResults(tournamentName, groups);
    
    // Show success message
    showToast('Grup berhasil dibuat!', 'success');
    
    // Enable export buttons
    exportExcelButton.disabled = false;
    printButton.disabled = false;
    
    // Show donation modal after generate groups
    showDonationModal();
    
    // Make sure the results section is visible with animation
    resultsContainer.classList.remove('hidden');
    resultsContainer.classList.add('animate-fadeInUp');
    if (groupsContainer) {
        groupsContainer.classList.remove('hidden');
    }
    
    // Make sure export buttons are visible
    const exportButtonsContainer = document.querySelector('#resultsSection .flex.flex-wrap.gap-3');
    if (exportButtonsContainer) {
        exportButtonsContainer.style.display = 'flex';
    }
    
    // Scroll to results
    resultsContainer.scrollIntoView({ behavior: 'smooth' });
}

// Divide teams into groups based on seeding method
function divideIntoGroups(teams, groupCount, seedingMethod) {
    const groups = Array.from({ length: groupCount }, () => []);
    
    // Handle seeded teams first if using seeding
    if (seedingMethod !== 'none') {
        const seededTeams = teams.filter(team => team.seeded);
        const unseededTeams = teams.filter(team => !team.seeded);
        
        // Distribute seeded teams across groups
        seededTeams.forEach((team, index) => {
            const groupIndex = index % groupCount;
            groups[groupIndex].push(team);
        });
        
        // Shuffle unseeded teams
        const shuffledUnseeded = shuffleArray([...unseededTeams]);
        
        // Distribute unseeded teams
        if (seedingMethod === 'snake') {
            // Snake distribution (zigzag)
            let forward = true;
            let currentGroup = seededTeams.length % groupCount;
            
            shuffledUnseeded.forEach(team => {
                groups[currentGroup].push(team);
                
                if (forward) {
                    currentGroup++;
                    if (currentGroup >= groupCount) {
                        currentGroup = groupCount - 2;
                        forward = false;
                    }
                } else {
                    currentGroup--;
                    if (currentGroup < 0) {
                        currentGroup = 1;
                        forward = true;
                    }
                }
            });
        } else {
            // Standard distribution
            let currentGroup = 0;
            
            shuffledUnseeded.forEach(team => {
                // Find the group with the fewest teams
                currentGroup = groups.indexOf(groups.reduce((min, group) => 
                    group.length < min.length ? group : min, groups[0]));
                
                groups[currentGroup].push(team);
            });
        }
    } else {
        // No seeding, just random distribution
        const shuffledTeams = shuffleArray([...teams]);
        
        shuffledTeams.forEach((team, index) => {
            const groupIndex = index % groupCount;
            groups[groupIndex].push(team);
        });
    }
    
    return groups;
}

// Display results in the UI
function displayResults(tournamentName, groups) {
    // Recreate the entire results section to ensure proper structure
    resultsContainer.innerHTML = `
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <h2 class="text-2xl font-bold text-blue-900">Hasil Grup</h2>
            <div class="flex flex-wrap gap-3">
                <button type="button" id="exportExcel" class="export-button excel">
                    <i class="fas fa-file-excel mr-2"></i> Excel
                </button>
                <button type="button" id="printGroups" class="export-button print">
                    <i class="fas fa-print mr-2"></i> Print
                </button>
            </div>
        </div>
    `;
    
    // Clear groupsContainer
    if (groupsContainer) {
        groupsContainer.innerHTML = '';
    }
    
    // Re-initialize DOM elements for export buttons
    exportExcelButton = document.getElementById('exportExcel');
    printButton = document.getElementById('printGroups');
    
    // Re-attach event listeners
    if (exportExcelButton) {
        exportExcelButton.addEventListener('click', exportToExcel);
    }
    
    if (printButton) {
        printButton.addEventListener('click', printGroups);
    }
    
    // Create results header
    const header = document.createElement('div');
    header.className = 'mb-6 text-center';
    header.innerHTML = `
        <h3 class="text-2xl font-bold text-blue-900 mb-2">${tournamentName}</h3>
        <p class="text-gray-600">Hasil Pembagian Grup</p>
    `;
    
    // Set groups container class
    groupsContainer.className = 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6';
    
    // Create each group card
    groups.forEach((group, groupIndex) => {
        const groupCard = document.createElement('div');
        groupCard.className = 'group-card animate-fadeInUp';
        
        // Group header
        const groupHeader = document.createElement('div');
        groupHeader.className = 'group-header';
        groupHeader.innerHTML = `<h4 class="font-bold text-lg">Grup ${String.fromCharCode(65 + groupIndex)}</h4>`;
        
        // Group body
        const groupBody = document.createElement('div');
        groupBody.className = 'p-4';
        
        // Team list
        const teamList = document.createElement('ul');
        teamList.className = 'team-list';
        teamList.dataset.groupIndex = groupIndex;
        
        // Add teams to the list
        group.forEach((team) => {
            const teamItem = document.createElement('li');
            teamItem.className = 'team-item';
            // No team number
            // Team name with seeded indicator if applicable
            const teamName = document.createElement('div');
            teamName.className = 'flex items-center';
            if (team.seeded) {
                teamName.innerHTML = `
                    <span class="seeded-indicator">
                        <i class="fas fa-star"></i>
                    </span>
                    <span>${team.name}</span>
                `;
            } else {
                teamName.innerHTML = `
                    <span>${team.name}</span>
                `;
            }
            // Drag handle
            const dragHandle = document.createElement('div');
            dragHandle.className = 'drag-handle';
            dragHandle.innerHTML = '<i class="fas fa-grip-lines"></i>';
            teamItem.appendChild(teamName);
            teamItem.appendChild(dragHandle);
            teamList.appendChild(teamItem);
        });
        
        groupBody.appendChild(teamList);
        groupCard.appendChild(groupHeader);
        groupCard.appendChild(groupBody);
        groupsContainer.appendChild(groupCard);
    });
    
    // Add header to results container if it's empty
    if (!resultsContainer.querySelector('.mb-6.text-center')) {
        resultsContainer.appendChild(header);
    }
    
    // Make sure groupsContainer is in resultsContainer
    if (!resultsContainer.contains(groupsContainer)) {
        resultsContainer.appendChild(groupsContainer);
    }
    
    // Show results container
    resultsContainer.classList.remove('hidden');
    groupsContainer.classList.remove('hidden');
    
    // Initialize sortable on team lists
    initializeSortableOnTeamLists();
}

// Initialize Sortable.js for drag and drop functionality
function initializeSortable() {
    // Instead of using deprecated DOMNodeInserted, we'll use a function to initialize sortable
    // that will be called after groups are generated
    // This avoids the deprecation warning
}

// Function to initialize sortable on team lists
function initializeSortableOnTeamLists() {
    // Get all team lists and initialize Sortable on each
    document.querySelectorAll('.team-list').forEach(list => {
        new Sortable(list, {
            group: 'teams',
            animation: 150,
            ghostClass: 'bg-blue-100',
            onEnd: function(evt) {
                // Update the groups array after drag and drop
                updateGroupsAfterDragDrop();
            }
        });
    });
}

// Update groups array after drag and drop
function updateGroupsAfterDragDrop() {
    const teamLists = document.querySelectorAll('.team-list');
    const newGroups = Array.from({ length: groups.length }, () => []);
    
    teamLists.forEach(list => {
        const groupIndex = parseInt(list.dataset.groupIndex);
        const teamItems = list.querySelectorAll('li');
        
        teamItems.forEach(item => {
            const teamName = item.querySelector('span:last-child').textContent;
            const isSeeded = item.querySelector('.bg-yellow-500') !== null;
            
            newGroups[groupIndex].push({
                name: teamName,
                seeded: isSeeded
            });
        });
    });
    
    // Update the groups array
    groups = newGroups;
}

// Export to Excel
function exportToExcel() {
    const tournamentName = tournamentNameInput.value || 'Tournament';
    const workbook = XLSX.utils.book_new();
    
    // Create worksheet data
    const wsData = [];
    
    // Add website info and logo (as text representation)
    wsData.push(['TO', 'Tekno Ogi - Generator Esport']);
    wsData.push([]);
    
    // Add title
    wsData.push([tournamentName]);
    wsData.push(['Hasil Pembagian Grup']);
    wsData.push([]);
    
    // Add metadata
    wsData.push([`Tanggal: ${new Date().toLocaleDateString('id-ID')}`]);
    wsData.push([`Waktu: ${new Date().toLocaleTimeString('id-ID')}`]);
    wsData.push([]);
    
    // Find the maximum number of teams in any group
    const maxTeams = Math.max(...groups.map(group => group.length));
    
    // Add headers
    const headers = groups.map((_, i) => `Grup ${String.fromCharCode(65 + i)}`);
    wsData.push(headers);
    
    // Add team data
    for (let i = 0; i < maxTeams; i++) {
        const row = [];
        for (let j = 0; j < groups.length; j++) {
            const team = groups[j][i];
            row.push(team ? (team.seeded ? `${team.name} (Seeded)` : team.name) : '');
        }
        wsData.push(row);
    }
    
    // Add footer
    wsData.push([]);
    wsData.push(['© 2025 Tekno Ogi - Generator Esport. All Rights Reserved.']);
    wsData.push(['https://teknoogi.com']);
    
    // Create worksheet and add to workbook
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    
    // Apply some styling (limited in XLSX)
    // Set column widths
    const colWidths = headers.map(() => ({ wch: 25 }));
    ws['!cols'] = colWidths;
    
    XLSX.utils.book_append_sheet(workbook, ws, 'Grup');
    
    // Generate Excel file and trigger download
    XLSX.writeFile(workbook, `${tournamentName.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_grup.xlsx`);
    
    // Log export activity
    if (typeof exportLog !== 'undefined') {
        exportLog.logExport('Excel', tournamentName);
    }
    
    // Show donation modal after export
    showDonationModal();
    
    showToast('File Excel berhasil diunduh!', 'success');
}

// PDF export functions have been removed as they are no longer needed

// Print groups
function printGroups() {
    const printWindow = window.open('', '_blank');
    const tournamentName = tournamentNameInput.value || 'Tournament';
    
    // Create print content
    let printContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>${tournamentName} - Grup</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
                .header { text-align: center; margin-bottom: 30px; }
                .logo-container { display: flex; justify-content: center; align-items: center; margin-bottom: 15px; }
                .logo { width: 50px; height: 50px; background-color: #4338ca; border-radius: 5px; display: flex; justify-content: center; align-items: center; color: white; font-weight: bold; margin-right: 15px; }
                .site-name { font-size: 24px; font-weight: bold; color: #1e3a8a; }
                h1 { text-align: center; margin-bottom: 5px; color: #1e40af; }
                h3 { text-align: center; color: #666; margin-top: 0; margin-bottom: 30px; }
                .groups-container { display: flex; flex-wrap: wrap; justify-content: center; gap: 20px; }
                .group { border: 1px solid #ddd; border-radius: 5px; overflow: hidden; width: 250px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); }
                .group-header { background-color: #2563eb; color: white; padding: 10px; font-weight: bold; }
                .team-list { list-style: none; padding: 0; margin: 0; }
                .team-item { padding: 10px; border-bottom: 1px solid #eee; }
                .team-item:last-child { border-bottom: none; }
                .team-item:nth-child(even) { background-color: #f8fafc; }
                .seeded { font-weight: bold; }
                .seeded::after { content: ' ⭐'; color: #eab308; }
                .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #666; }
                .metadata { text-align: center; margin-bottom: 20px; color: #666; font-size: 14px; }
                @media print {
                    body { padding: 0; }
                    .groups-container { gap: 15px; }
                    .group { page-break-inside: avoid; }
                }
            </style>
        </head>
        <body>
            <div class="header">
                <div class="logo-container">
                    <div class="logo">TO</div>
                    <div class="site-name">Tekno Ogi - Generator Esport</div>
                </div>
                <h1>${tournamentName}</h1>
                <h3>Hasil Pembagian Grup</h3>
            </div>
            
            <div class="metadata">
                <p>Tanggal: ${new Date().toLocaleDateString('id-ID')} | Waktu: ${new Date().toLocaleTimeString('id-ID')}</p>
            </div>
            
            <div class="groups-container">
    `;
    
    // Add each group
    groups.forEach((group, groupIndex) => {
        printContent += `
            <div class="group">
                <div class="group-header">Grup ${String.fromCharCode(65 + groupIndex)}</div>
                <ul class="team-list">
        `;
        
        group.forEach((team) => {
            printContent += `
                <li class="team-item ${team.seeded ? 'seeded' : ''}">${team.name}</li>
            `;
        });
        
        printContent += `
                </ul>
            </div>
        `;
    });
    
    printContent += `
            </div>
            <div class="footer">
                <p>© 2025 Tekno Ogi - Generator Esport. All Rights Reserved.</p>
                <p>https://teknoogi.com</p>
                <p>Dicetak pada: ${new Date().toLocaleString('id-ID')}</p>
            </div>
            <script>
                window.onload = function() {
                    window.print();
                    setTimeout(function() { window.close(); }, 500);
                }
            </script>
        </body>
        </html>
    `;
    
    printWindow.document.open();
    printWindow.document.write(printContent);
    printWindow.document.close();
    
    // Log print activity
    if (typeof exportLog !== 'undefined') {
        exportLog.logExport('Print', tournamentName);
    }
    
    // Show donation modal after print
    showDonationModal();
    
    showToast('Menyiapkan halaman cetak...', 'info');
}

// Reset form inputs and clear results
function resetForm() {
    // Clear inputs
    tournamentNameInput.value = '';
    groupCountInput.value = '2';
    teamsPerGroupInput.value = '4';
    seedingSelect.value = 'standard';
    
    // Reset input method to bulk
    document.querySelector('input[name="inputMethod"][value="bulk"]').checked = true;
    
    massTeamInput.value = '';
    
    // Clear individual inputs
    individualTeamInputs.innerHTML = '';
    
    // Reset UI
    toggleTeamInputMethod();
    updateTeamInputs();
    
    // Disable export buttons
    exportExcelButton.disabled = true;
    printButton.disabled = true;
    
    // Clear results
    resultsContainer.innerHTML = '';
    resultsContainer.classList.add('hidden');
    if (groupsContainer) {
        groupsContainer.innerHTML = '';
        groupsContainer.classList.add('hidden');
    }
    
    // Disable export buttons
    exportExcelButton.disabled = true;
    exportPdfButton.disabled = true;
    exportPdfCustomButton.disabled = true;
    printButton.disabled = true;
    
    // Reset data
    teams = [];
    groups = [];
    
    showToast('Semua data telah dihapus', 'info');
}

// Utility function to shuffle an array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Show donation modal
function showDonationModal() {
    // Create modal element if it doesn't exist
    let donationModal = document.getElementById('donationModal');
    
    if (!donationModal) {
        donationModal = document.createElement('div');
        donationModal.id = 'donationModal';
        donationModal.className = 'fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50';
        donationModal.style.display = 'none';
        
        const modalContent = document.createElement('div');
        modalContent.className = 'bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4';
        
        modalContent.innerHTML = `
            <div class="text-center">
                <div class="mx-auto bg-blue-600 text-white w-16 h-16 rounded-full flex items-center justify-center mb-4">
                    <i class="fas fa-heart text-2xl"></i>
                </div>
                <h3 class="text-xl font-bold text-gray-900 mb-2">Dukung Pengembangan</h3>
                <p class="text-gray-600 mb-6">Jika Anda merasa terbantu dengan tool ini, pertimbangkan untuk memberikan dukungan agar kami dapat terus mengembangkan fitur-fitur baru.</p>
                
                <a href="https://saweria.co/khalisdev" target="_blank" class="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-full transition-colors duration-300 mb-4">
                    <i class="fas fa-donate mr-2"></i> Donasi via Saweria
                </a>
                
                <div class="mt-4">
                    <button id="closeDonationModal" class="text-gray-500 hover:text-gray-700 font-medium transition-colors duration-300">
                        Tutup
                    </button>
                </div>
            </div>
        `;
        
        donationModal.appendChild(modalContent);
        document.body.appendChild(donationModal);
        
        // Add event listener to close button
        document.getElementById('closeDonationModal').addEventListener('click', () => {
            donationModal.style.display = 'none';
        });
        
        // Close modal when clicking outside
        donationModal.addEventListener('click', (e) => {
            if (e.target === donationModal) {
                donationModal.style.display = 'none';
            }
        });
    }
    
    // Show the modal
    donationModal.style.display = 'flex';
}

// Initialize FAQ accordion functionality
function initializeFAQ() {
    const faqToggles = document.querySelectorAll('.faq-toggle');
    
    faqToggles.forEach(toggle => {
        toggle.addEventListener('click', () => {
            // Toggle the active state of the current button
            toggle.classList.toggle('active');
            
            // Toggle the icon rotation
            const icon = toggle.querySelector('i');
            if (icon) {
                icon.style.transform = toggle.classList.contains('active') ? 'rotate(180deg)' : '';
            }
            
            // Toggle the content visibility
            const content = toggle.nextElementSibling;
            if (content) {
                content.classList.toggle('hidden');
            }
        });
    });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initializeGrupGenerator();
    initializeFAQ();
});