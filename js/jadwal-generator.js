document.addEventListener('DOMContentLoaded', function() {
    const gameSelect = document.getElementById('gameSelect');
    const gameIconContainer = document.getElementById('gameIconContainer');
    const generateScheduleBtn = document.getElementById('generateSchedule');
    const resetFormBtn = document.getElementById('resetForm');
    const initialContent = document.getElementById('initialContent');
    const resultsSection = document.getElementById('resultsSection');
    function generateGroups(groupCount) {
        initialContent.style.display = 'none';
        resultsSection.style.display = 'block';
        resultsSection.innerHTML = '';
        
        // Dapatkan informasi pot yang dipilih
        const groupCountSelect = document.getElementById('groupCountSelect');
        const selectedOption = groupOptions.find(option => option.id === groupCountSelect.value);
        let groupDescription = '';
        if (selectedOption && selectedOption.description) {
            groupDescription = selectedOption.description;
        }
        
        // Dapatkan informasi tanggal dan waktu
        const startDate = document.getElementById('startDate').value;
        const endDate = document.getElementById('endDate').value;
        const startTime = document.getElementById('startTime').value;
        const endTime = document.getElementById('endTime').value;
        const matchDuration = document.getElementById('matchDuration').value;
        const breakTime = document.getElementById('breakTime')?.value || '0';
        const timezone = document.getElementById('timezone').value;
        
        // Dapatkan jumlah match berdasarkan jenis match yang tersedia
        let matchCounts = {};
        if (selectedOption && selectedOption.matchInputs) {
            selectedOption.matchInputs.forEach(matchType => {
                const matchCountInput = document.getElementById(`matchCount_${matchType}`);
                if (matchCountInput) {
                    matchCounts[matchType] = parseInt(matchCountInput.value);
                }
            });
        }
        
        // Buat header dengan informasi jadwal
        const header = document.createElement('div');
        header.className = 'flex justify-between items-center mb-6';
        
        let scheduleInfo = '';
        if (startDate && endDate) {
            const formattedStartDate = new Date(startDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
            const formattedEndDate = new Date(endDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
            scheduleInfo += `<p class="text-sm text-gray-600">Periode: ${formattedStartDate} - ${formattedEndDate}</p>`;
        }
        
        if (startTime && endTime) {
            scheduleInfo += `<p class="text-sm text-gray-600">Waktu: ${startTime} - ${endTime}</p>`;
        }
        
        if (matchDuration) {
            scheduleInfo += `<p class="text-sm text-gray-600">Durasi per match: ${matchDuration} menit</p>`;
        }
        
        if (breakTime && parseInt(breakTime) > 0) {
            scheduleInfo += `<p class="text-sm text-gray-600">Waktu istirahat: ${breakTime} menit</p>`;
        }
        
        // Tampilkan informasi jumlah match berdasarkan jenis
        if (Object.keys(matchCounts).length > 0) {
            let matchInfo = '<p class="text-sm text-gray-600">Jumlah Match: ';
            if (matchCounts.kualifikasi) {
                matchInfo += `Kualifikasi (${matchCounts.kualifikasi}), `;
            }
            if (matchCounts.semifinal) {
                matchInfo += `Semifinal (${matchCounts.semifinal}), `;
            }
            if (matchCounts.final) {
                matchInfo += `Final (${matchCounts.final})`;
            }
            // Hapus koma terakhir jika ada
            if (matchInfo.endsWith(', ')) {
                matchInfo = matchInfo.slice(0, -2);
            }
            matchInfo += '</p>';
            scheduleInfo += matchInfo;
        }
        
        // Tampilkan timezone
        if (timezone) {
            const selectedTimezone = timezoneOptions.find(option => option.id === timezone);
            if (selectedTimezone) {
                scheduleInfo += `<p class="text-sm text-gray-600">Zona Waktu: ${selectedTimezone.name}</p>`;
            }
        }
        
        header.innerHTML = `
            <div>
                <h3 class="text-xl font-bold text-blue-900">Hasil Pembagian Pot</h3>
                ${groupDescription ? `<p class="text-sm text-gray-600 mt-1">${groupDescription}</p>` : ''}
                ${scheduleInfo ? `<div class="mt-2">${scheduleInfo}</div>` : ''}
            </div>
            <div class="flex space-x-2">
                <button id="printGroups" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center">
                    <i class="fas fa-print mr-2"></i> Print
                </button>
                <button id="exportGroups" class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center">
                    <i class="fas fa-file-export mr-2"></i> Export
                </button>
            </div>
        `;
        resultsSection.appendChild(header);
        
        // Buat jadwal pertandingan jika data lengkap
        if (startDate && endDate && startTime && endTime && matchDuration && Object.keys(matchCounts).length > 0) {
            // Buat container untuk jadwal yang dapat dicetak
            const printableSchedule = document.createElement('div');
            printableSchedule.id = 'printableSchedule';
            printableSchedule.className = 'mb-6 bg-white rounded-lg shadow-md p-4';
            printableSchedule.innerHTML = `
                <h4 class="text-lg font-bold text-blue-900 mb-3">Jadwal Pertandingan</h4>
                <div class="overflow-x-auto">
                    <table class="w-full text-sm text-left text-gray-700">
                        <thead class="text-xs text-gray-700 uppercase bg-gray-100">
                            <tr>
                                <th class="px-4 py-2">Tanggal</th>
                                <th class="px-4 py-2">Waktu</th>
                                <th class="px-4 py-2">Match</th>
                                <th class="px-4 py-2">Jenis</th>
                                <th class="px-4 py-2">Pot</th>
                                <th class="px-4 py-2">Keterangan</th>
                            </tr>
                        </thead>
                        <tbody id="scheduleTableBody">
                            <!-- Jadwal akan diisi secara dinamis -->
                        </tbody>
                    </table>
                </div>
            `;
            resultsSection.appendChild(printableSchedule);
            
            // Juga tambahkan jadwal ke scheduleContainer yang ada di HTML
            const scheduleContainer = document.getElementById('scheduleContainer');
            if (scheduleContainer) {
                scheduleContainer.innerHTML = printableSchedule.innerHTML;
            }
            
            // Generate jadwal pertandingan sederhana
            const tableBody = document.getElementById('scheduleTableBody');
            const start = new Date(startDate + 'T' + startTime);
            const end = new Date(endDate + 'T' + endTime);
            const durationInMs = parseInt(matchDuration) * 60 * 1000;
            const breakTimeMs = parseInt(breakTime) * 60 * 1000;
            
            // Hitung total match dari semua jenis match
            let totalMatches = 0;
            let matchTypes = [];
            
            // Buat array untuk menyimpan jenis match dan jumlahnya
            if (matchCounts.kualifikasi) {
                for (let i = 0; i < matchCounts.kualifikasi; i++) {
                    matchTypes.push('Kualifikasi');
                }
                totalMatches += matchCounts.kualifikasi;
            }
            
            if (matchCounts.semifinal) {
                for (let i = 0; i < matchCounts.semifinal; i++) {
                    matchTypes.push('Semifinal');
                }
                totalMatches += matchCounts.semifinal;
            }
            
            if (matchCounts.final) {
                for (let i = 0; i < matchCounts.final; i++) {
                    matchTypes.push('Final');
                }
                totalMatches += matchCounts.final;
            }
            
            // Hitung interval waktu antara pertandingan (termasuk waktu istirahat)
            const totalDurationMs = end - start;
            const totalTimeNeeded = (durationInMs * totalMatches) + (breakTimeMs * (totalMatches - 1));
            
            // Jika total waktu yang dibutuhkan lebih dari waktu yang tersedia, sesuaikan interval
            let matchInterval;
            if (totalTimeNeeded <= totalDurationMs) {
                matchInterval = durationInMs + breakTimeMs;
            } else {
                matchInterval = Math.floor(totalDurationMs / totalMatches);
            }
            
            // Struktur data untuk mengelompokkan pertandingan berdasarkan tanggal dan jenis
            let groupedMatches = {};
            
            // Buat data pertandingan terlebih dahulu
            let matchesData = [];
            
            // Dapatkan opsi Main Bersamaan Pot yang dipilih
            let playTogetherOption = 'random'; // Default: Main Acak Pot
            const randomPlayRadio = document.getElementById('randomPlay');
            const allPotsRadio = document.getElementById('allPots');
            const samePotRadio = document.getElementById('samePot');
            
            if (randomPlayRadio && randomPlayRadio.checked) {
                playTogetherOption = 'random';
            } else if (allPotsRadio && allPotsRadio.checked) {
                playTogetherOption = 'all';
            } else if (samePotRadio && samePotRadio.checked) {
                playTogetherOption = 'same';
            }
            
            // Fungsi untuk menentukan pot berdasarkan jenis pertandingan dan opsi yang dipilih
            function determinePot(index, matchType) {
                let pot = '-';
                if (matchType === 'Kualifikasi') {
                    if (playTogetherOption === 'random') {
                        // Distribusikan pertandingan kualifikasi ke pot A, B, C secara merata (acak)
                        const potIndex = Math.floor(index % groupCount);
                        pot = String.fromCharCode(65 + potIndex); // A, B, C, dst.
                    } else if (playTogetherOption === 'all') {
                        // Semua pot bermain bersamaan (pot sama untuk beberapa match berurutan)
                        const potIndex = Math.floor(index / matchCounts.kualifikasi * groupCount);
                        pot = String.fromCharCode(65 + potIndex);
                    } else if (playTogetherOption === 'same') {
                        // Pot yang sama bermain bersamaan
                        const matchesPerPot = Math.ceil(matchCounts.kualifikasi / groupCount);
                        const potIndex = Math.floor(index / matchesPerPot);
                        pot = String.fromCharCode(65 + potIndex % groupCount);
                    }
                } else if (matchType === 'Semifinal') {
                    if (playTogetherOption === 'random') {
                        // Distribusikan pertandingan semifinal ke pot A dan B secara bergantian
                        pot = index % 2 === 0 ? 'A' : 'B';
                    } else if (playTogetherOption === 'all' || playTogetherOption === 'same') {
                        // Untuk semifinal dengan opsi 'all' atau 'same', bagi menjadi dua bagian
                        pot = index < matchCounts.semifinal / 2 ? 'A' : 'B';
                    }
                }
                return pot;
            }
            
            for (let i = 0; i < totalMatches; i++) {
                const matchDate = new Date(start.getTime() + (matchInterval * i));
                const matchEndTime = new Date(matchDate.getTime() + durationInMs);
                
                const formattedDate = matchDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
                const formattedStartTime = matchDate.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
                const formattedEndTime = matchEndTime.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
                const matchType = matchTypes[i] || '-';
                
                // Tentukan pot berdasarkan jenis pertandingan dan opsi yang dipilih
                const pot = determinePot(i, matchType);
                
                // Buat kunci untuk pengelompokan (tanggal + jenis)
                const groupKey = `${formattedDate}-${matchType}`;
                
                // Tambahkan data pertandingan
                matchesData.push({
                    date: formattedDate,
                    time: `${formattedStartTime} - ${formattedEndTime}`,
                    match: `Match ${i + 1}`,
                    type: matchType,
                    pot: pot,
                    note: '-',
                    groupKey: groupKey
                });
                
                // Kelompokkan pertandingan
                if (!groupedMatches[groupKey]) {
                    groupedMatches[groupKey] = [];
                }
                groupedMatches[groupKey].push(matchesData[matchesData.length - 1]);
            }
            
            // Render tabel dengan pengelompokan
            Object.keys(groupedMatches).forEach((groupKey, groupIndex) => {
                const matches = groupedMatches[groupKey];
                const [date, type] = groupKey.split('-');
                
                // Buat baris untuk setiap kelompok
                matches.forEach((match, matchIndex) => {
                    const row = document.createElement('tr');
                    row.className = groupIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50';
                    
                    // Jika ini adalah pertandingan pertama dalam kelompok, tambahkan sel dengan rowspan
                    if (matchIndex === 0) {
                        const dateCell = document.createElement('td');
                        dateCell.className = 'px-4 py-2';
                        dateCell.rowSpan = matches.length;
                        dateCell.textContent = date;
                        row.appendChild(dateCell);
                        
                        // Tambahkan sel waktu
                        const timeCell = document.createElement('td');
                        timeCell.className = 'px-4 py-2';
                        timeCell.textContent = match.time;
                        row.appendChild(timeCell);
                        
                        // Tambahkan sel match
                        const matchCell = document.createElement('td');
                        matchCell.className = 'px-4 py-2';
                        matchCell.textContent = match.match;
                        row.appendChild(matchCell);
                        
                        // Tambahkan sel jenis dengan rowspan
                        const typeCell = document.createElement('td');
                        typeCell.className = 'px-4 py-2';
                        typeCell.rowSpan = matches.length;
                        typeCell.textContent = type;
                        row.appendChild(typeCell);
                        
                        // Tambahkan sel pot dan keterangan
                        const potCell = document.createElement('td');
                        potCell.className = 'px-4 py-2';
                        potCell.textContent = match.pot;
                        row.appendChild(potCell);
                        
                        const noteCell = document.createElement('td');
                        noteCell.className = 'px-4 py-2';
                        noteCell.textContent = match.note;
                        row.appendChild(noteCell);
                    } else {
                        // Untuk pertandingan berikutnya dalam kelompok, hanya tambahkan sel waktu, match, pot, dan keterangan
                        const timeCell = document.createElement('td');
                        timeCell.className = 'px-4 py-2';
                        timeCell.textContent = match.time;
                        row.appendChild(timeCell);
                        
                        const matchCell = document.createElement('td');
                        matchCell.className = 'px-4 py-2';
                        matchCell.textContent = match.match;
                        row.appendChild(matchCell);
                        
                        // Sel jenis tidak perlu ditambahkan karena sudah di-span dengan rowspan
                        
                        const potCell = document.createElement('td');
                        potCell.className = 'px-4 py-2';
                        potCell.textContent = match.pot;
                        row.appendChild(potCell);
                        
                        const noteCell = document.createElement('td');
                        noteCell.className = 'px-4 py-2';
                        noteCell.textContent = match.note;
                        row.appendChild(noteCell);
                    }
                    
                    tableBody.appendChild(row);
                });
            });
        }
        
        // Buat container untuk pot
        const groupsContainer = document.createElement('div');
        groupsContainer.className = 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4';
        
        for (let i = 0; i < groupCount; i++) {
            const groupLetter = String.fromCharCode(65 + i); 
            const groupCard = document.createElement('div');
            groupCard.className = 'bg-white rounded-lg shadow-md p-4';
            groupCard.innerHTML = `
                <div class="flex items-center justify-between mb-3">
                    <h4 class="text-lg font-bold text-blue-900">Pot ${groupLetter}</h4>
                    <span class="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">Battle Royale</span>
                </div>
                <div class="text-gray-500 text-sm">
                    <p>Tambahkan tim ke pot ini dengan mengklik tombol di bawah.</p>
                </div>
                <button class="add-team-btn mt-3 w-full bg-gray-100 hover:bg-gray-200 text-gray-800 py-1 px-3 rounded-lg text-sm flex items-center justify-center" data-pot="${groupLetter}">
                    <i class="fas fa-plus mr-1"></i> Tambah Tim
                </button>
                <div class="team-options-container hidden mt-2 bg-gray-50 p-2 rounded-lg">
                    <div class="grid grid-cols-1 gap-2">
                        <button class="single-input-btn w-full bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded-lg text-sm flex items-center justify-center" data-pot="${groupLetter}">
                            <i class="fas fa-user-plus mr-1"></i> Inputan Satuan
                        </button>
                        <button class="bulk-input-btn w-full bg-purple-500 hover:bg-purple-600 text-white py-1 px-3 rounded-lg text-sm flex items-center justify-center" data-pot="${groupLetter}">
                            <i class="fas fa-users mr-1"></i> Input Massal
                        </button>
                        <button class="excel-input-btn w-full bg-gray-400 hover:bg-gray-500 text-white py-1 px-3 rounded-lg text-sm flex items-center justify-center relative overflow-hidden" data-pot="${groupLetter}">
                            <div class="absolute inset-0 flex items-center justify-center bg-gray-500 bg-opacity-90">
                                <span class="text-white font-medium">Coming Soon</span>
                            </div>
                            <i class="fas fa-file-excel mr-1"></i> Export Excel
                        </button>
                    </div>
                </div>
            `;
            groupsContainer.appendChild(groupCard);
        }
        
        resultsSection.appendChild(groupsContainer);
        
        // Tambahkan event listener untuk tombol Print di header
        document.getElementById('printGroups').addEventListener('click', function() {
            // Buat style untuk print yang hanya menampilkan jadwal
            const printStyle = document.createElement('style');
            printStyle.id = 'printStyle';
            printStyle.innerHTML = `
                @media print {
                    body * {
                        visibility: hidden;
                    }
                    #printableSchedule, #printableSchedule *,
                    #scheduleContainer, #scheduleContainer * {
                        visibility: visible;
                    }
                    #printableSchedule, #scheduleContainer {
                        position: absolute;
                        left: 0;
                        top: 0;
                        width: 100%;
                    }
                }
            `;
            document.head.appendChild(printStyle);
            
            window.print();
            
            // Hapus style setelah print
            document.head.removeChild(printStyle);
        });
        
        // Tambahkan event listener untuk tombol Print di bagian hasil
        const printScheduleBtn = document.getElementById('printSchedule');
        if (printScheduleBtn) {
            printScheduleBtn.addEventListener('click', function() {
                // Buat style untuk print yang hanya menampilkan jadwal
                const printStyle = document.createElement('style');
                printStyle.id = 'printStyle';
                printStyle.innerHTML = `
                    @media print {
                         body * {
                             visibility: hidden;
                         }
                         #printableSchedule, #printableSchedule *,
                         #scheduleContainer, #scheduleContainer * {
                             visibility: visible;
                         }
                         #printableSchedule, #scheduleContainer {
                             position: absolute;
                             left: 0;
                             top: 0;
                             width: 100%;
                         }
                     }
                `;
                document.head.appendChild(printStyle);
                
                window.print();
                
                // Hapus style setelah print
                document.head.removeChild(printStyle);
            });
        }
        
        document.getElementById('exportGroups').addEventListener('click', function() {
            exportToExcel();
        });
        
        // Tambahkan event listener untuk tombol Tambah Tim
        const addTeamButtons = document.querySelectorAll('.add-team-btn');
        addTeamButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Toggle tampilan opsi tim
                const optionsContainer = this.nextElementSibling;
                optionsContainer.classList.toggle('hidden');
            });
        });
        
        // Tambahkan event listener untuk tombol Inputan Satuan
        const singleInputButtons = document.querySelectorAll('.single-input-btn');
        singleInputButtons.forEach(button => {
            button.addEventListener('click', function() {
                const potLetter = this.getAttribute('data-pot');
                // Tampilkan form input satuan
                const singleTeamForm = document.getElementById('singleTeamForm');
                if (singleTeamForm) {
                    // Set pot yang dipilih
                    const teamPotSelect = document.getElementById('teamPot');
                    if (teamPotSelect) {
                        // Cari opsi dengan nilai yang sesuai dengan pot yang dipilih
                        const options = teamPotSelect.options;
                        for (let i = 0; i < options.length; i++) {
                            if (options[i].value === potLetter) {
                                teamPotSelect.selectedIndex = i;
                                break;
                            }
                        }
                    }
                    singleTeamForm.classList.remove('hidden');
                } else {
                    // Jika form belum ada, tambahkan form
                    addTeamsToGroups();
                    // Kemudian tampilkan form input satuan
                    const newSingleTeamForm = document.getElementById('singleTeamForm');
                    if (newSingleTeamForm) {
                        newSingleTeamForm.classList.remove('hidden');
                    }
                }
            });
        });
        
        // Tambahkan event listener untuk tombol Input Massal
        const bulkInputButtons = document.querySelectorAll('.bulk-input-btn');
        bulkInputButtons.forEach(button => {
            button.addEventListener('click', function() {
                const potLetter = this.getAttribute('data-pot');
                // Tampilkan form input massal
                const bulkTeamsForm = document.getElementById('bulkTeamsForm');
                if (bulkTeamsForm) {
                    bulkTeamsForm.classList.remove('hidden');
                } else {
                    // Jika form belum ada, tambahkan form
                    addTeamsToGroups();
                    // Kemudian tampilkan form input massal
                    const newBulkTeamsForm = document.getElementById('bulkTeamsForm');
                    if (newBulkTeamsForm) {
                        newBulkTeamsForm.classList.remove('hidden');
                    }
                }
            });
        });
        
        // Tambahkan event listener untuk tombol Export Excel
        const excelInputButtons = document.querySelectorAll('.excel-input-btn');
        excelInputButtons.forEach(button => {
            button.addEventListener('click', function() {
                const potLetter = this.getAttribute('data-pot');
                exportTeamListToExcel(potLetter);
            });
        });
        
        showToast(`Berhasil membuat ${groupCount} pot!`, 'success');
        createParticles(window.innerWidth / 2, window.innerHeight / 4, 30);
    }
    
    // Fungsi untuk menambahkan tim ke dalam pot
    function addTeamsToGroups() {
        const teamsContainer = document.createElement('div');
        teamsContainer.className = 'mt-8 bg-white rounded-lg shadow-md p-6';
        teamsContainer.innerHTML = `
            <h4 class="text-lg font-bold text-blue-900 mb-3">Tambah Tim</h4>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div class="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200 hover:shadow-md transition duration-300 ease-in-out transform hover:-translate-y-1">
                    <h5 class="text-md font-semibold text-blue-800 mb-2">Tambah Satuan</h5>
                    <p class="text-sm text-gray-600 mb-3">Tambahkan tim satu per satu dengan mengisi form.</p>
                    <button id="addSingleTeam" class="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center justify-center">
                        <i class="fas fa-user-plus mr-2"></i> Tambah Tim Satuan
                    </button>
                </div>
                
                <div class="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200 hover:shadow-md transition duration-300 ease-in-out transform hover:-translate-y-1">
                    <h5 class="text-md font-semibold text-purple-800 mb-2">Tambah Massal</h5>
                    <p class="text-sm text-gray-600 mb-3">Tambahkan beberapa tim sekaligus dengan input massal.</p>
                    <button id="addBulkTeams" class="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center justify-center">
                        <i class="fas fa-users mr-2"></i> Tambah Tim Massal
                    </button>
                </div>
                
                <div class="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border border-green-200 hover:shadow-md transition duration-300 ease-in-out transform hover:-translate-y-1">
                    <h5 class="text-md font-semibold text-green-800 mb-2">Upload Excel</h5>
                    <p class="text-sm text-gray-600 mb-3">Upload file Excel dengan format yang telah ditentukan.</p>
                    <div class="flex flex-col space-y-2">
                        <button id="downloadTemplate" class="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center justify-center">
                            <i class="fas fa-download mr-2"></i> Download Template
                        </button>
                        <button id="uploadExcel" class="w-full bg-gray-500 text-white px-4 py-2 rounded-lg flex items-center justify-center relative overflow-hidden">
                            <div class="absolute inset-0 flex items-center justify-center bg-gray-500 bg-opacity-90">
                                <span class="text-white font-medium">Coming Soon</span>
                            </div>
                            <i class="fas fa-file-upload mr-2"></i> Upload Excel
                        </button>
                    </div>
                </div>
            </div>
            
            <!-- Form untuk tambah tim satuan (hidden by default) -->
            <div id="singleTeamForm" class="hidden bg-blue-50 p-4 rounded-lg mb-4">
                <h5 class="text-md font-semibold text-blue-800 mb-3">Tambah Tim Baru</h5>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label for="teamName" class="block text-sm font-medium text-gray-700 mb-1">Nama Tim</label>
                        <input type="text" id="teamName" class="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Masukkan nama tim">
                    </div>
                    <div>
                        <label for="teamPot" class="block text-sm font-medium text-gray-700 mb-1">Pot</label>
                        <select id="teamPot" class="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <option value="">Pilih Pot</option>
                            <option value="A">Pot A</option>
                            <option value="B">Pot B</option>
                            <option value="C">Pot C</option>
                        </select>
                    </div>
                    <div>
                        <label for="teamLogo" class="block text-sm font-medium text-gray-700 mb-1">Logo Tim (URL)</label>
                        <input type="text" id="teamLogo" class="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="https://example.com/logo.png">
                    </div>
                    <div>
                        <label for="teamContact" class="block text-sm font-medium text-gray-700 mb-1">Kontak</label>
                        <input type="text" id="teamContact" class="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Nomor telepon atau email">
                    </div>
                </div>
                <div class="flex justify-end mt-4 space-x-2">
                    <button id="cancelSingleTeam" class="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-lg">
                        Batal
                    </button>
                    <button id="saveSingleTeam" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
                        <i class="fas fa-save mr-2"></i> Simpan
                    </button>
                </div>
            </div>
            
            <!-- Form untuk tambah tim massal (hidden by default) -->
            <div id="bulkTeamsForm" class="hidden bg-purple-50 p-4 rounded-lg mb-4">
                <h5 class="text-md font-semibold text-purple-800 mb-3">Tambah Tim Massal</h5>
                <div>
                    <label for="bulkTeamInput" class="block text-sm font-medium text-gray-700 mb-1">Daftar Tim</label>
                    <textarea id="bulkTeamInput" rows="6" class="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="Format: Nama Tim, Pot (A/B/C), URL Logo (opsional), Kontak (opsional)\nContoh:\nTeam Alpha, A, https://example.com/logo1.png, contact@alpha.com\nTeam Beta, B, , 081234567890"></textarea>
                    <p class="text-xs text-gray-500 mt-1">Satu tim per baris. Format: Nama Tim, Pot (A/B/C), URL Logo (opsional), Kontak (opsional)</p>
                </div>
                <div class="flex justify-end mt-4 space-x-2">
                    <button id="cancelBulkTeams" class="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-lg">
                        Batal
                    </button>
                    <button id="saveBulkTeams" class="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg">
                        <i class="fas fa-save mr-2"></i> Simpan Semua
                    </button>
                </div>
            </div>
            
            <!-- Tabel tim yang sudah ditambahkan -->
            <div id="teamsTable" class="hidden mt-6">
                <h5 class="text-md font-semibold text-blue-800 mb-3">Daftar Tim</h5>
                <div class="overflow-x-auto">
                    <table class="w-full text-sm text-left text-gray-700">
                        <thead class="text-xs text-gray-700 uppercase bg-gray-100">
                            <tr>
                                <th class="px-4 py-2">No</th>
                                <th class="px-4 py-2">Nama Tim</th>
                                <th class="px-4 py-2">Pot</th>
                                <th class="px-4 py-2">Logo</th>
                                <th class="px-4 py-2">Kontak</th>
                                <th class="px-4 py-2">Aksi</th>
                            </tr>
                        </thead>
                        <tbody id="teamsList">
                            <!-- Tim akan ditampilkan di sini -->
                        </tbody>
                    </table>
                </div>
            </div>
        `;
        resultsSection.appendChild(teamsContainer);
        
        // Event listener untuk tombol tambah tim satuan
        document.getElementById('addSingleTeam').addEventListener('click', function() {
            document.getElementById('singleTeamForm').classList.remove('hidden');
            document.getElementById('bulkTeamsForm').classList.add('hidden');
        });
        
        // Event listener untuk tombol batal tambah tim satuan
        document.getElementById('cancelSingleTeam').addEventListener('click', function() {
            document.getElementById('singleTeamForm').classList.add('hidden');
        });
        
        // Event listener untuk tombol tambah tim massal
        document.getElementById('addBulkTeams').addEventListener('click', function() {
            document.getElementById('bulkTeamsForm').classList.remove('hidden');
            document.getElementById('singleTeamForm').classList.add('hidden');
        });
        
        // Event listener untuk tombol batal tambah tim massal
        document.getElementById('cancelBulkTeams').addEventListener('click', function() {
            document.getElementById('bulkTeamsForm').classList.add('hidden');
        });
        
        // Event listener untuk tombol download template
        document.getElementById('downloadTemplate').addEventListener('click', function() {
            // Buat workbook Excel sederhana
            const wb = XLSX.utils.book_new();
            const wsData = [
                ['Nama Tim', 'Pot (A/B/C)', 'URL Logo (opsional)', 'Kontak (opsional)'],
                ['Team Alpha', 'A', 'https://example.com/logo1.png', 'contact@alpha.com'],
                ['Team Beta', 'B', '', '081234567890'],
                ['Team Gamma', 'C', '', ''],
            ];
            const ws = XLSX.utils.aoa_to_sheet(wsData);
            XLSX.utils.book_append_sheet(wb, ws, 'Template Tim');
            
            // Simpan file
            XLSX.writeFile(wb, 'template_tim.xlsx');
            
            showToast('Template berhasil diunduh!', 'success');
        });
        
        // Event listener untuk tombol simpan tim satuan
        document.getElementById('saveSingleTeam').addEventListener('click', function() {
            const teamName = document.getElementById('teamName').value;
            const teamPot = document.getElementById('teamPot').value;
            const teamLogo = document.getElementById('teamLogo').value;
            const teamContact = document.getElementById('teamContact').value;
            
            if (!teamName || !teamPot) {
                showToast('Nama tim dan pot harus diisi!', 'error');
                return;
            }
            
            // Simpan data tim (untuk demo, hanya tampilkan di tabel)
            addTeamToTable({
                name: teamName,
                pot: teamPot,
                logo: teamLogo,
                contact: teamContact
            });
            
            // Reset form
            document.getElementById('teamName').value = '';
            document.getElementById('teamPot').value = '';
            document.getElementById('teamLogo').value = '';
            document.getElementById('teamContact').value = '';
            document.getElementById('singleTeamForm').classList.add('hidden');
            
            showToast('Tim berhasil ditambahkan!', 'success');
        });
        
        // Event listener untuk tombol simpan tim massal
        document.getElementById('saveBulkTeams').addEventListener('click', function() {
            const bulkInput = document.getElementById('bulkTeamInput').value;
            if (!bulkInput) {
                showToast('Daftar tim tidak boleh kosong!', 'error');
                return;
            }
            
            const lines = bulkInput.split('\n');
            let successCount = 0;
            
            lines.forEach(line => {
                if (line.trim()) {
                    const parts = line.split(',').map(part => part.trim());
                    if (parts.length >= 2) {
                        const team = {
                            name: parts[0],
                            pot: parts[1],
                            logo: parts[2] || '',
                            contact: parts[3] || ''
                        };
                        
                        if (team.name && (team.pot === 'A' || team.pot === 'B' || team.pot === 'C')) {
                            addTeamToTable(team);
                            successCount++;
                        }
                    }
                }
            });
            
            // Reset form
            document.getElementById('bulkTeamInput').value = '';
            document.getElementById('bulkTeamsForm').classList.add('hidden');
            
            if (successCount > 0) {
                showToast(`${successCount} tim berhasil ditambahkan!`, 'success');
            } else {
                showToast('Tidak ada tim yang valid untuk ditambahkan!', 'error');
            }
        });
    }
    
    // Fungsi untuk menambahkan tim ke tabel
    function addTeamToTable(team) {
        const teamsTable = document.getElementById('teamsTable');
        const teamsList = document.getElementById('teamsList');
        
        // Tampilkan tabel jika belum ditampilkan
        if (teamsTable.classList.contains('hidden')) {
            teamsTable.classList.remove('hidden');
        }
        
        // Hitung jumlah baris yang sudah ada
        const rowCount = teamsList.getElementsByTagName('tr').length;
        
        // Buat baris baru
        const row = document.createElement('tr');
        row.className = rowCount % 2 === 0 ? 'bg-white' : 'bg-gray-50';
        
        // Isi baris dengan data tim
        row.innerHTML = `
            <td class="px-4 py-2">${rowCount + 1}</td>
            <td class="px-4 py-2">${team.name}</td>
            <td class="px-4 py-2">Pot ${team.pot}</td>
            <td class="px-4 py-2">${team.logo ? `<img src="${team.logo}" alt="${team.name}" class="h-6 w-6 object-contain">` : '-'}</td>
            <td class="px-4 py-2">${team.contact || '-'}</td>
            <td class="px-4 py-2">
                <button class="text-red-600 hover:text-red-800 delete-team" data-index="${rowCount}">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        
        // Tambahkan baris ke tabel
        teamsList.appendChild(row);
        
        // Tambahkan event listener untuk tombol hapus
        row.querySelector('.delete-team').addEventListener('click', function() {
            row.remove();
            
            // Perbarui nomor urut
            const rows = teamsList.getElementsByTagName('tr');
            for (let i = 0; i < rows.length; i++) {
                rows[i].getElementsByTagName('td')[0].textContent = i + 1;
            }
            
            // Sembunyikan tabel jika tidak ada tim
            if (rows.length === 0) {
                teamsTable.classList.add('hidden');
            }
            
            showToast('Tim berhasil dihapus!', 'success');
        });
    }
    checkNotificationPermission();
    function showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.style.position = 'fixed';
        toast.style.top = '20px';
        toast.style.right = '20px';
        toast.style.padding = '12px 20px';
        toast.style.borderRadius = '8px';
        toast.style.zIndex = '9999';
        toast.style.maxWidth = '300px';
        toast.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
        toast.style.transition = 'all 0.3s ease';
        toast.style.transform = 'translateX(400px)';
        toast.style.opacity = '0';
        toast.style.backdropFilter = 'blur(10px)';
        if (type === 'success') {
            toast.style.backgroundColor = 'rgba(16, 185, 129, 0.95)';
            toast.style.color = 'white';
            toast.innerHTML = `<i class="fas fa-check-circle mr-2"></i>${message}`;
        } else if (type === 'error') {
            toast.style.backgroundColor = 'rgba(239, 68, 68, 0.95)';
            toast.style.color = 'white';
            toast.innerHTML = `<i class="fas fa-exclamation-circle mr-2"></i>${message}`;
        } else {
            toast.style.backgroundColor = 'rgba(59, 130, 246, 0.95)';
            toast.style.color = 'white';
            toast.innerHTML = `<i class="fas fa-info-circle mr-2"></i>${message}`;
        }
        document.body.appendChild(toast);
        setTimeout(() => {
            toast.style.transform = 'translateX(0)';
            toast.style.opacity = '1';
        }, 100);
        setTimeout(() => {
            toast.style.transform = 'translateX(400px)';
            toast.style.opacity = '0';
            setTimeout(() => {
                toast.remove();
            }, 300);
        }, 3000);
    }
    function showDonationModal() {
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
            document.getElementById('closeDonationModal').addEventListener('click', () => {
                donationModal.style.display = 'none';
            });
            donationModal.addEventListener('click', (e) => {
                if (e.target === donationModal) {
                    donationModal.style.display = 'none';
                }
            });
        }
        donationModal.style.display = 'flex';
    }
    const games = [
        { id: 'free-fire', name: 'Free Fire', available: true },
        { id: 'mobile-legends', name: 'Mobile Legends', available: false },
        { id: 'honor-of-kings', name: 'Honor Of Kings', available: false },
        { id: 'pubg-mobile', name: 'PUBG Mobile', available: false },
        { id: 'efootball', name: 'E-Football', available: false }
    ];
const gameModes = {
    'free-fire': [
        { id: 'battle-royale', name: 'Battle Royale', available: true },
        { id: 'clash-squad', name: 'Clash Squad', available: false },
        { id: 'liga', name: 'Liga', available: false }
    ]
};
// Definisikan opsi timezone
const timezoneOptions = [
    {
        id: 'wib',
        name: 'WIB (GMT+7)',
        offset: 7
    },
    {
        id: 'wita',
        name: 'WITA (GMT+8)',
        offset: 8
    },
    {
        id: 'wit',
        name: 'WIT (GMT+9)',
        offset: 9
    }
];

// Definisikan opsi grup
const groupOptions = [
    {
        id: 'grandFinal',
        name: 'Grand Final',
        count: 1,
        description: 'Grand Final adalah pertandingan puncak yang menentukan juara turnamen.',
        matchInputs: ['final']
    },
    {
        id: 'semifinalV1',
        name: 'Semifinal V1',
        count: 2,
        description: 'Semifinal V1 terdiri dari 2 grup yang akan memperebutkan tempat di Grand Final.',
        matchInputs: ['semifinal', 'final']
    },
    {
        id: 'semifinalV2',
        name: 'Semifinal V2',
        count: 2,
        description: 'Semifinal V2 terdiri dari 2 grup yang akan memperebutkan tempat di Grand Final.',
        matchInputs: ['semifinal', 'final']
    },
    {
        id: 'kualifikasiV1',
        name: 'Kualifikasi V1',
        count: 3,
        description: 'Kualifikasi V1 terdiri dari 3 grup yang akan memperebutkan tempat di Semifinal.',
        matchInputs: ['kualifikasi', 'semifinal', 'final']
    },
    {
        id: 'kualifikasiV2',
        name: 'Kualifikasi V2',
        count: 3,
        description: 'Kualifikasi V2 terdiri dari 3 grup yang akan memperebutkan tempat di Semifinal.',
        matchInputs: ['kualifikasi', 'semifinal', 'final']
    },
    {
        id: 'kualifikasiV3',
        name: 'Kualifikasi V3',
        count: 3,
        description: 'Kualifikasi V3 terdiri dari 3 grup yang akan memperebutkan tempat di Semifinal.',
        matchInputs: ['kualifikasi', 'semifinal', 'final']
    }
];
    function initializeGameOptions() {
        gameSelect.innerHTML = '<option value="" disabled selected>Pilih Game</option>';
        games.forEach(game => {
            const option = document.createElement('option');
            option.value = game.id;
            option.textContent = game.name;
            if (!game.available) {
                option.textContent += ' (Coming Soon)';
                option.disabled = true;
            }
            gameSelect.appendChild(option);
        });
    }
    function displayGameIcon(gameId) {
        gameIconContainer.innerHTML = '';
        if (gameId) {
            const iconPath = `../../images/games/${gameId}.svg`;
            const img = document.createElement('img');
            img.src = iconPath;
            img.alt = `${getGameNameById(gameId)} Icon`;
            img.className = 'h-8 w-8 mr-2';
            gameIconContainer.appendChild(img);
            const gameName = document.createElement('span');
            gameName.textContent = getGameNameById(gameId);
            gameName.className = 'text-blue-800 font-medium';
            gameIconContainer.appendChild(gameName);
        }
    }
    function getGameNameById(gameId) {
        const game = games.find(g => g.id === gameId);
        return game ? game.name : '';
    }
function addGameModeOptions(gameId) {
    let gameModeSelect = document.getElementById('gameModeSelect');
    let gameModeContainer = document.getElementById('gameModeContainer');
    if (!gameModeContainer) {
        gameModeContainer = document.createElement('div');
        gameModeContainer.id = 'gameModeContainer';
        gameModeContainer.className = 'mt-6';
        const label = document.createElement('label');
        label.htmlFor = 'gameModeSelect';
        label.className = 'block text-sm font-medium text-blue-800 mb-2';
        label.textContent = 'Pilih Mode';
        gameModeSelect = document.createElement('select');
        gameModeSelect.id = 'gameModeSelect';
        gameModeSelect.name = 'gameModeSelect';
        gameModeSelect.className = 'w-full px-4 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition';
        gameModeContainer.appendChild(label);
        gameModeContainer.appendChild(gameModeSelect);
        const parentElement = gameSelect.parentElement;
        parentElement.insertBefore(gameModeContainer, parentElement.lastElementChild);
    }
    gameModeSelect.innerHTML = '<option value="" disabled selected>Pilih Mode Game</option>';
    if (gameModes[gameId]) {
        gameModes[gameId].forEach(mode => {
            const option = document.createElement('option');
            option.value = mode.id;
            option.textContent = mode.name;
            if (mode.hasOwnProperty('available') && !mode.available) {
                option.textContent += ' (Coming Soon)';
                option.disabled = true;
            }
            gameModeSelect.appendChild(option);
        });
        gameModeContainer.style.display = 'block';
        gameModeSelect.addEventListener('change', function() {
            const selectedMode = this.value;
            if (selectedMode === 'battle-royale') {
                addGroupCountOptions();
            } else {
                const groupCountContainer = document.getElementById('groupCountContainer');
                if (groupCountContainer) {
                    groupCountContainer.remove();
                }
            }
        });
    } else {
        gameModeContainer.style.display = 'none';
    }
}
// Fungsi untuk menambahkan input jumlah match berdasarkan jenis match
function addMatchCountInput(matchType, parentContainer) {
    const matchCountContainer = document.createElement('div');
    matchCountContainer.className = 'mt-4 match-input-container';
    matchCountContainer.dataset.matchType = matchType;
    
    const matchCountLabel = document.createElement('label');
    matchCountLabel.htmlFor = `matchCount_${matchType}`;
    matchCountLabel.className = 'block text-sm font-medium text-blue-800 mb-2';
    
    // Set label berdasarkan jenis match
    if (matchType === 'final') {
        matchCountLabel.textContent = 'Jumlah Match Final';
    } else if (matchType === 'semifinal') {
        matchCountLabel.textContent = 'Jumlah Match Semifinal';
    } else if (matchType === 'kualifikasi') {
        matchCountLabel.textContent = 'Jumlah Match Kualifikasi';
    }
    
    const matchCountInput = document.createElement('input');
    matchCountInput.type = 'number';
    matchCountInput.id = `matchCount_${matchType}`;
    matchCountInput.name = `matchCount_${matchType}`;
    matchCountInput.min = '1';
    matchCountInput.value = '6';
    matchCountInput.className = 'w-full px-4 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition';
    
    matchCountContainer.appendChild(matchCountLabel);
    matchCountContainer.appendChild(matchCountInput);
    parentContainer.appendChild(matchCountContainer);
    
    // Tambahkan radio button untuk Main Bersamaan Pot jika ini adalah input terakhir
    if (matchType === 'kualifikasi' || (matchType === 'semifinal' && !document.getElementById('matchCount_kualifikasi')) || (matchType === 'final' && !document.getElementById('matchCount_semifinal') && !document.getElementById('matchCount_kualifikasi'))) {
        // Hapus container yang sudah ada jika ada
        const existingContainer = document.getElementById('playTogetherContainer');
        if (existingContainer) {
            existingContainer.remove();
        }
        
        const playTogetherContainer = document.createElement('div');
        playTogetherContainer.id = 'playTogetherContainer';
        playTogetherContainer.className = 'mt-4';
        
        const playTogetherLabel = document.createElement('label');
        playTogetherLabel.className = 'block text-sm font-medium text-blue-800 mb-2';
        playTogetherLabel.textContent = 'Main Bersamaan Pot';
        playTogetherContainer.appendChild(playTogetherLabel);
        
        // Radio button untuk Main Acak
        const randomPlayContainer = document.createElement('div');
        randomPlayContainer.className = 'flex items-center mb-2';
        
        const randomPlayRadio = document.createElement('input');
        randomPlayRadio.type = 'radio';
        randomPlayRadio.id = 'randomPlay';
        randomPlayRadio.name = 'playTogether';
        randomPlayRadio.value = 'random';
        randomPlayRadio.className = 'mr-2';
        randomPlayRadio.checked = true;
        
        const randomPlayLabel = document.createElement('label');
        randomPlayLabel.htmlFor = 'randomPlay';
        randomPlayLabel.className = 'text-sm text-gray-700';
        randomPlayLabel.textContent = 'Main Acak Pot';
        
        randomPlayContainer.appendChild(randomPlayRadio);
        randomPlayContainer.appendChild(randomPlayLabel);
        playTogetherContainer.appendChild(randomPlayContainer);
        
        // Radio button untuk Main Bersamaan Semua Pot
        const allPotsContainer = document.createElement('div');
        allPotsContainer.className = 'flex items-center mb-2';
        
        const allPotsRadio = document.createElement('input');
        allPotsRadio.type = 'radio';
        allPotsRadio.id = 'allPots';
        allPotsRadio.name = 'playTogether';
        allPotsRadio.value = 'all';
        allPotsRadio.className = 'mr-2';
        
        const allPotsLabel = document.createElement('label');
        allPotsLabel.htmlFor = 'allPots';
        allPotsLabel.className = 'text-sm text-gray-700';
        allPotsLabel.textContent = 'Main Bersamaan Semua Pot';
        
        allPotsContainer.appendChild(allPotsRadio);
        allPotsContainer.appendChild(allPotsLabel);
        playTogetherContainer.appendChild(allPotsContainer);
        
        // Radio button untuk Main Bersamaan Pot yang Sama
        const samePotContainer = document.createElement('div');
        samePotContainer.className = 'flex items-center';
        
        const samePotRadio = document.createElement('input');
        samePotRadio.type = 'radio';
        samePotRadio.id = 'samePot';
        samePotRadio.name = 'playTogether';
        samePotRadio.value = 'same';
        samePotRadio.className = 'mr-2';
        
        const samePotLabel = document.createElement('label');
        samePotLabel.htmlFor = 'samePot';
        samePotLabel.className = 'text-sm text-gray-700';
        samePotLabel.textContent = 'Main Bersamaan Pot yang Sama';
        
        samePotContainer.appendChild(samePotRadio);
        samePotContainer.appendChild(samePotLabel);
        playTogetherContainer.appendChild(samePotContainer);
        
        parentContainer.appendChild(playTogetherContainer);
    }
}

function addGroupCountOptions() {
    let groupCountContainer = document.getElementById('groupCountContainer');
    if (groupCountContainer) {
        groupCountContainer.remove();
    }
    groupCountContainer = document.createElement('div');
    groupCountContainer.id = 'groupCountContainer';
    groupCountContainer.className = 'mt-6';
    
    // Pilih Jumlah Pot
    const potLabel = document.createElement('label');
    potLabel.htmlFor = 'groupCountSelect';
    potLabel.className = 'block text-sm font-medium text-blue-800 mb-2';
    potLabel.textContent = 'Pilih Jumlah Pot';
    const groupCountSelect = document.createElement('select');
    groupCountSelect.id = 'groupCountSelect';
    groupCountSelect.name = 'groupCountSelect';
    groupCountSelect.className = 'w-full px-4 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition';
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = 'Pilih Jumlah Pot';
    defaultOption.disabled = true;
    defaultOption.selected = true;
    groupCountSelect.appendChild(defaultOption);
    groupOptions.forEach(option => {
        const optionElement = document.createElement('option');
        optionElement.value = option.id;
        optionElement.textContent = option.name;
        groupCountSelect.appendChild(optionElement);
    });
    groupCountContainer.appendChild(potLabel);
    groupCountContainer.appendChild(groupCountSelect);
    
    // Tambahkan div untuk keterangan
    const descriptionDiv = document.createElement('div');
    descriptionDiv.id = 'groupDescription';
    descriptionDiv.className = 'mt-2 text-sm text-gray-600 italic';
    descriptionDiv.style.minHeight = '48px';
    groupCountContainer.appendChild(descriptionDiv);
    
    // Tambahkan event listener untuk menampilkan keterangan dan mengatur input match yang sesuai
    groupCountSelect.addEventListener('change', function() {
        const selectedOption = groupOptions.find(option => option.id === this.value);
        if (selectedOption && selectedOption.description) {
            descriptionDiv.textContent = selectedOption.description;
            descriptionDiv.style.display = 'block';
            
            // Hapus input match yang ada sebelumnya
            const existingMatchInputs = document.querySelectorAll('.match-input-container');
            existingMatchInputs.forEach(input => input.remove());
            
            // Tambahkan input match sesuai dengan opsi grup yang dipilih
            if (selectedOption.matchInputs && selectedOption.matchInputs.length > 0) {
                selectedOption.matchInputs.forEach((matchType, index) => {
                    addMatchCountInput(matchType, groupCountContainer);
                });
            }
        } else {
            descriptionDiv.textContent = '';
            descriptionDiv.style.display = 'none';
        }
    });
    
    // Tambahkan input tanggal mulai
    const startDateContainer = document.createElement('div');
    startDateContainer.className = 'mt-4';
    const startDateLabel = document.createElement('label');
    startDateLabel.htmlFor = 'startDate';
    startDateLabel.className = 'block text-sm font-medium text-blue-800 mb-2';
    startDateLabel.textContent = 'Tanggal Mulai';
    const startDateInput = document.createElement('input');
    startDateInput.type = 'date';
    startDateInput.id = 'startDate';
    startDateInput.name = 'startDate';
    startDateInput.className = 'w-full px-4 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition';
    startDateContainer.appendChild(startDateLabel);
    startDateContainer.appendChild(startDateInput);
    groupCountContainer.appendChild(startDateContainer);
    
    // Tambahkan input tanggal selesai
    const endDateContainer = document.createElement('div');
    endDateContainer.className = 'mt-4';
    const endDateLabel = document.createElement('label');
    endDateLabel.htmlFor = 'endDate';
    endDateLabel.className = 'block text-sm font-medium text-blue-800 mb-2';
    endDateLabel.textContent = 'Tanggal Selesai';
    const endDateInput = document.createElement('input');
    endDateInput.type = 'date';
    endDateInput.id = 'endDate';
    endDateInput.name = 'endDate';
    endDateInput.className = 'w-full px-4 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition';
    endDateContainer.appendChild(endDateLabel);
    endDateContainer.appendChild(endDateInput);
    groupCountContainer.appendChild(endDateContainer);
    
    // Tambahkan input jam mulai
    const startTimeContainer = document.createElement('div');
    startTimeContainer.className = 'mt-4';
    const startTimeLabel = document.createElement('label');
    startTimeLabel.htmlFor = 'startTime';
    startTimeLabel.className = 'block text-sm font-medium text-blue-800 mb-2';
    startTimeLabel.textContent = 'Jam Mulai';
    const startTimeInput = document.createElement('input');
    startTimeInput.type = 'time';
    startTimeInput.id = 'startTime';
    startTimeInput.name = 'startTime';
    startTimeInput.className = 'w-full px-4 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition';
    startTimeContainer.appendChild(startTimeLabel);
    startTimeContainer.appendChild(startTimeInput);
    groupCountContainer.appendChild(startTimeContainer);
    
    // Tambahkan input jam selesai
    const endTimeContainer = document.createElement('div');
    endTimeContainer.className = 'mt-4';
    const endTimeLabel = document.createElement('label');
    endTimeLabel.htmlFor = 'endTime';
    endTimeLabel.className = 'block text-sm font-medium text-blue-800 mb-2';
    endTimeLabel.textContent = 'Jam Selesai';
    const endTimeInput = document.createElement('input');
    endTimeInput.type = 'time';
    endTimeInput.id = 'endTime';
    endTimeInput.name = 'endTime';
    endTimeInput.className = 'w-full px-4 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition';
    endTimeContainer.appendChild(endTimeLabel);
    endTimeContainer.appendChild(endTimeInput);
    groupCountContainer.appendChild(endTimeContainer);
    
    // Tambahkan input estimasi durasi 1 match
    const matchDurationContainer = document.createElement('div');
    matchDurationContainer.className = 'mt-4';
    const matchDurationLabel = document.createElement('label');
    matchDurationLabel.htmlFor = 'matchDuration';
    matchDurationLabel.className = 'block text-sm font-medium text-blue-800 mb-2';
    matchDurationLabel.textContent = 'Estimasi Durasi 1 Match (menit)';
    const matchDurationInput = document.createElement('input');
    matchDurationInput.type = 'number';
    matchDurationInput.id = 'matchDuration';
    matchDurationInput.name = 'matchDuration';
    matchDurationInput.min = '1';
    matchDurationInput.value = '30';
    matchDurationInput.className = 'w-full px-4 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition';
    matchDurationContainer.appendChild(matchDurationLabel);
    matchDurationContainer.appendChild(matchDurationInput);
    groupCountContainer.appendChild(matchDurationContainer);
    
    // Tambahkan input waktu istirahat
    const breakTimeContainer = document.createElement('div');
    breakTimeContainer.className = 'mt-4';
    const breakTimeLabel = document.createElement('label');
    breakTimeLabel.htmlFor = 'breakTime';
    breakTimeLabel.className = 'block text-sm font-medium text-blue-800 mb-2';
    breakTimeLabel.textContent = 'Waktu Istirahat (menit)';
    const breakTimeInput = document.createElement('input');
    breakTimeInput.type = 'number';
    breakTimeInput.id = 'breakTime';
    breakTimeInput.name = 'breakTime';
    breakTimeInput.min = '0';
    breakTimeInput.value = '5';
    breakTimeInput.className = 'w-full px-4 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition';
    const breakTimeHint = document.createElement('p');
    breakTimeHint.className = 'text-xs text-gray-500 mt-1';
    breakTimeHint.textContent = 'Waktu jeda antar pertandingan';
    breakTimeContainer.appendChild(breakTimeLabel);
    breakTimeContainer.appendChild(breakTimeInput);
    breakTimeContainer.appendChild(breakTimeHint);
    groupCountContainer.appendChild(breakTimeContainer);
    
    // Tambahkan input timezone
    const timezoneContainer = document.createElement('div');
    timezoneContainer.className = 'mt-4';
    const timezoneLabel = document.createElement('label');
    timezoneLabel.htmlFor = 'timezone';
    timezoneLabel.className = 'block text-sm font-medium text-blue-800 mb-2';
    timezoneLabel.textContent = 'Zona Waktu';
    const timezoneSelect = document.createElement('select');
    timezoneSelect.id = 'timezone';
    timezoneSelect.name = 'timezone';
    timezoneSelect.className = 'w-full px-4 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition';
    
    timezoneOptions.forEach(option => {
        const optionElement = document.createElement('option');
        optionElement.value = option.id;
        optionElement.textContent = option.name;
        timezoneSelect.appendChild(optionElement);
    });
    
    timezoneContainer.appendChild(timezoneLabel);
    timezoneContainer.appendChild(timezoneSelect);
    groupCountContainer.appendChild(timezoneContainer);
    
    const gameModeContainer = document.getElementById('gameModeContainer');
    const parentElement = gameModeContainer.parentElement;
    parentElement.insertBefore(groupCountContainer, parentElement.lastElementChild);
}
gameSelect.addEventListener('change', function() {
    const selectedGameId = this.value;
    displayGameIcon(selectedGameId);
    if (selectedGameId) {
        addGameModeOptions(selectedGameId);
    }
    const groupCountContainer = document.getElementById('groupCountContainer');
    if (groupCountContainer) {
        groupCountContainer.remove();
    }
});
resetFormBtn.addEventListener('click', function() {
    gameSelect.value = '';
    gameIconContainer.innerHTML = '';
    const gameModeContainer = document.getElementById('gameModeContainer');
    if (gameModeContainer) {
        gameModeContainer.style.display = 'none';
    }
    const groupCountContainer = document.getElementById('groupCountContainer');
    if (groupCountContainer) {
        groupCountContainer.remove();
    }
    initialContent.style.display = 'block';
    resultsSection.style.display = 'none';
    showToast('Semua data telah dihapus', 'info');
});
generateScheduleBtn.addEventListener('click', function() {
    const selectedGameId = gameSelect.value;
    const gameModeSelect = document.getElementById('gameModeSelect');
    if (!selectedGameId) {
        showToast('Silakan pilih game terlebih dahulu!', 'error');
        return;
    }
    if (gameModeSelect && gameModeSelect.style.display !== 'none' && !gameModeSelect.value) {
        showToast('Silakan pilih mode game terlebih dahulu!', 'error');
        return;
    }
    if (gameModeSelect.value === 'battle-royale') {
        const groupCountSelect = document.getElementById('groupCountSelect');
        if (groupCountSelect && !groupCountSelect.value) {
            showToast('Silakan pilih jumlah grup terlebih dahulu!', 'error');
            return;
        }
        const selectedOption = groupOptions.find(option => option.id === groupCountSelect.value);
        if (selectedOption) {
            generateGroups(selectedOption.count);
            return;
        }
    }
    showToast('Fitur pembuatan jadwal akan segera tersedia!', 'info');
    showDonationModal();
});
    initializeGameOptions();
    function checkNotificationPermission() {
        if (!('Notification' in window)) {
            return;
        }
        if (Notification.permission === 'granted') {
            return;
        } else if (Notification.permission !== 'denied') {
            Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                    showToast('Terima kasih! Anda akan menerima notifikasi penting dari kami.', 'success');
                }
            });
        }
    }
    function showNotification(title, message) {
        if (!('Notification' in window) || Notification.permission !== 'granted') {
            return;
        }
        const notification = new Notification(title, {
            body: message,
            icon: '../../images/logo.png'
        });
        setTimeout(() => {
            notification.close();
        }, 5000);
        notification.onclick = function() {
            window.focus();
            this.close();
        };
    }
    function createParticles(x, y, count = 30, colors = ['#3B82F6', '#10B981', '#F59E0B']) {
        const container = document.createElement('div');
        container.style.position = 'fixed';
        container.style.left = '0';
        container.style.top = '0';
        container.style.width = '100%';
        container.style.height = '100%';
        container.style.pointerEvents = 'none';
        container.style.zIndex = '9999';
        document.body.appendChild(container);
        for (let i = 0; i < count; i++) {
            const particle = document.createElement('div');
            particle.style.position = 'absolute';
            particle.style.left = `${x}px`;
            particle.style.top = `${y}px`;
            particle.style.width = `${Math.random() * 10 + 5}px`;
            particle.style.height = particle.style.width;
            particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            particle.style.borderRadius = '50%';
            particle.style.opacity = Math.random() * 0.5 + 0.5;
            container.appendChild(particle);
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 5 + 2;
            const vx = Math.cos(angle) * speed;
            const vy = Math.sin(angle) * speed;
            const startTime = Date.now();
            function animate() {
                const elapsed = Date.now() - startTime;
                const x = parseFloat(particle.style.left) + vx;
                const y = parseFloat(particle.style.top) + vy + 0.1 * elapsed / 20; 
                particle.style.left = `${x}px`;
                particle.style.top = `${y}px`;
                particle.style.opacity = Math.max(0, 1 - elapsed / 1000);
                if (elapsed < 1000) {
                    requestAnimationFrame(animate);
                } else {
                    particle.remove();
                    if (container.children.length === 0) {
                        container.remove();
                    }
                }
            }
            requestAnimationFrame(animate);
        }
    }
    function createNotification(message, type = 'success', duration = 3000) {
        showToast(message, type);
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        createParticles(windowWidth / 2, windowHeight / 4, 20);
        const dummyElement = document.createElement('div');
        return dummyElement;
    }
    
    // Fungsi untuk export jadwal ke Excel
    function exportToExcel() {
        const tournamentName = document.getElementById('tournamentName').value || 'Tournament';
        const workbook = XLSX.utils.book_new();
        
        // Create worksheet data
        const wsData = [];
        
        // Add website info and logo (as text representation)
        wsData.push(['TO', 'Tekno Ogi - Generator Esport']);
        wsData.push([]);
        
        // Add title
        wsData.push([tournamentName]);
        wsData.push(['Jadwal Pertandingan']);
        wsData.push([]);
        
        // Add metadata
        wsData.push([`Tanggal: ${new Date().toLocaleDateString('id-ID')}`]);
        wsData.push([`Waktu: ${new Date().toLocaleTimeString('id-ID')}`]);
        wsData.push([]);
        
        // Add tournament info
        const gameSelect = document.getElementById('gameSelect');
        const selectedGame = gameSelect.options[gameSelect.selectedIndex]?.text || 'Game';
        wsData.push([`Game: ${selectedGame}`]);
        
        const startDate = document.getElementById('startDate').value;
        const endDate = document.getElementById('endDate').value;
        wsData.push([`Periode: ${startDate} s/d ${endDate}`]);
        
        const timezoneSelect = document.getElementById('timezoneSelect');
        const selectedTimezone = timezoneSelect.options[timezoneSelect.selectedIndex]?.text || 'WIB';
        wsData.push([`Timezone: ${selectedTimezone}`]);
        wsData.push([]);
        
        // Add headers
        wsData.push(['Tanggal', 'Waktu', 'Match', 'Jenis', 'Pot', 'Keterangan']);
        
        // Get all rows from the schedule table
        const scheduleTableBody = document.getElementById('scheduleTableBody');
        const rows = scheduleTableBody.querySelectorAll('tr');
        
        // Add schedule data
        rows.forEach(row => {
            const cells = row.querySelectorAll('td');
            const rowData = [];
            
            // Extract data from each cell
            cells.forEach(cell => {
                rowData.push(cell.textContent.trim());
            });
            
            wsData.push(rowData);
        });
        
        // Add footer
        wsData.push([]);
        wsData.push(['© 2025 Tekno Ogi - Generator Esport. All Rights Reserved.']);
        wsData.push(['https://teknoogi.com']);
        
        // Create worksheet and add to workbook
        const ws = XLSX.utils.aoa_to_sheet(wsData);
        
        // Apply some styling (limited in XLSX)
        // Set column widths
        const colWidths = [{ wch: 15 }, { wch: 15 }, { wch: 25 }, { wch: 15 }, { wch: 10 }, { wch: 30 }];
        ws['!cols'] = colWidths;
        
        XLSX.utils.book_append_sheet(workbook, ws, 'Jadwal');
        
        // Generate Excel file and trigger download
        XLSX.writeFile(workbook, `${tournamentName.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_jadwal.xlsx`);
        
        // Log export activity
        if (typeof exportLog !== 'undefined') {
            exportLog.logExport('Excel', tournamentName);
        }
        
        // Show donation modal after export
        showDonationModal();
        
        showToast('File Excel berhasil diunduh!', 'success');
    }
    
    // Fungsi untuk export daftar tim ke Excel
    function exportTeamListToExcel(potLetter) {
        const tournamentName = document.getElementById('tournamentName').value || 'Tournament';
        const workbook = XLSX.utils.book_new();
        
        // Create worksheet data
        const wsData = [];
        
        // Add website info and logo (as text representation)
        wsData.push(['TO', 'Tekno Ogi - Generator Esport']);
        wsData.push([]);
        
        // Add title
        wsData.push([tournamentName]);
        wsData.push([`Daftar Tim - Pot ${potLetter}`]);
        wsData.push([]);
        
        // Add metadata
        wsData.push([`Tanggal: ${new Date().toLocaleDateString('id-ID')}`]);
        wsData.push([`Waktu: ${new Date().toLocaleTimeString('id-ID')}`]);
        wsData.push([]);
        
        // Add headers
        wsData.push(['No', 'Nama Tim', 'Logo', 'Kontak']);
        
        // Get teams from the table
        const teamsTable = document.getElementById('teamsTable');
        if (teamsTable) {
            const rows = teamsTable.querySelectorAll('tbody tr');
            
            // Filter teams by pot
            let rowNumber = 1;
            rows.forEach(row => {
                const cells = row.querySelectorAll('td');
                const teamPot = cells[2].textContent.trim();
                
                if (teamPot === potLetter) {
                    const rowData = [
                        rowNumber++,
                        cells[1].textContent.trim(), // Nama Tim
                        cells[3].textContent.trim(), // Logo
                        cells[4].textContent.trim()  // Kontak
                    ];
                    wsData.push(rowData);
                }
            });
        }
        
        // Add footer
        wsData.push([]);
        wsData.push(['© 2025 Tekno Ogi - Generator Esport. All Rights Reserved.']);
        wsData.push(['https://teknoogi.com']);
        
        // Create worksheet and add to workbook
        const ws = XLSX.utils.aoa_to_sheet(wsData);
        
        // Apply some styling (limited in XLSX)
        // Set column widths
        const colWidths = [{ wch: 5 }, { wch: 25 }, { wch: 30 }, { wch: 20 }];
        ws['!cols'] = colWidths;
        
        XLSX.utils.book_append_sheet(workbook, ws, `Tim Pot ${potLetter}`);
        
        // Generate Excel file and trigger download
        XLSX.writeFile(workbook, `${tournamentName.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_tim_pot_${potLetter.toLowerCase()}.xlsx`);
        
        // Log export activity
        if (typeof exportLog !== 'undefined') {
            exportLog.logExport('Excel', `${tournamentName} - Tim Pot ${potLetter}`);
        }
        
        showToast(`Daftar tim Pot ${potLetter} berhasil diunduh!`, 'success');
    }
});