/**
 * jadwal-free-fire.js
 * File khusus untuk fungsi jadwal Free Fire
 */

document.addEventListener('DOMContentLoaded', function() {
    // Pastikan file ini hanya dijalankan jika game yang dipilih adalah Free Fire
    const gameSelect = document.getElementById('gameSelect');
    if (!gameSelect) return;
    
    // Referensi ke elemen-elemen UI
    const initialContent = document.getElementById('initialContent');
    const resultsSection = document.getElementById('resultsSection');
    const scheduleContainer = document.getElementById('scheduleContainer');
    const gameIconContainer = document.getElementById('gameIconContainer');
    const resetFormBtn = document.getElementById('resetForm');

    // Konfigurasi khusus untuk Free Fire
    const freeFireConfig = {
        // Jenis pertandingan Free Fire
        matchTypes: ['kualifikasi', 'semifinal', 'final'],
        
        // Durasi default untuk pertandingan Free Fire (dalam menit)
        defaultDurations: {
            kualifikasi: 20,
            semifinal: 25,
            final: 30
        },
        
        // Jumlah maksimum tim per pot untuk Free Fire
        maxTeamsPerPot: 12,
        
        // Jumlah default pot untuk Free Fire
        defaultPotCount: 4,
        
        // Opsi grup untuk Free Fire
        groupOptions: [
            { id: 'ff_4pot', name: '4 Pot (Standard)', value: 4, description: 'Format standar turnamen Free Fire dengan 4 pot', matchInputs: ['kualifikasi', 'semifinal', 'final'] },
            { id: 'ff_6pot', name: '6 Pot (Extended)', value: 6, description: 'Format turnamen besar Free Fire dengan 6 pot', matchInputs: ['kualifikasi', 'semifinal', 'final'] },
            { id: 'ff_3pot', name: '3 Pot (Small)', value: 3, description: 'Format turnamen kecil Free Fire dengan 3 pot', matchInputs: ['kualifikasi', 'final'] }
        ],
        
        // Aturan khusus untuk Free Fire
        rules: {
            // Jumlah maksimum pertandingan per hari
            maxMatchesPerDay: 8,
            // Waktu istirahat minimum antar pertandingan (dalam menit)
            minBreakTime: 10,
            // Jumlah pemain per tim
            playersPerTeam: 4
        }
    };

    // Fungsi untuk menginisialisasi konfigurasi Free Fire
    function initializeFreeFireConfig() {
        // Hanya jalankan jika game yang dipilih adalah Free Fire
        if (gameSelect.value === 'free-fire') {
            console.log('Initializing Free Fire configuration');
            
            // Set durasi default untuk pertandingan Free Fire
            const matchDurationInput = document.getElementById('matchDuration');
            if (matchDurationInput) {
                matchDurationInput.value = freeFireConfig.defaultDurations.kualifikasi;
            }
            
            // Set waktu istirahat default
            const breakTimeInput = document.getElementById('breakTime');
            if (breakTimeInput) {
                breakTimeInput.value = freeFireConfig.rules.minBreakTime;
            }
            
            // Set opsi grup untuk Free Fire
            const groupCountSelect = document.getElementById('groupCountSelect');
            if (groupCountSelect) {
                // Hapus opsi yang ada
                groupCountSelect.innerHTML = '';
                
                // Tambahkan opsi grup Free Fire
                freeFireConfig.groupOptions.forEach(option => {
                    const optElement = document.createElement('option');
                    optElement.value = option.id;
                    optElement.textContent = option.name;
                    groupCountSelect.appendChild(optElement);
                });
                
                // Trigger event change untuk memperbarui UI
                const event = new Event('change');
                groupCountSelect.dispatchEvent(event);
            }
            
            // Tambahkan informasi tambahan untuk Free Fire
            const gameInfoContainer = document.getElementById('gameInfoContainer');
            if (gameInfoContainer) {
                gameInfoContainer.innerHTML = `
                    <div class="mt-4 p-4 bg-orange-50 border border-orange-200 rounded-lg">
                        <h4 class="text-lg font-semibold text-orange-700 mb-2">Informasi Free Fire</h4>
                        <ul class="text-sm text-orange-600 space-y-1">
                            <li>• Jumlah pemain per tim: ${freeFireConfig.rules.playersPerTeam}</li>
                            <li>• Durasi pertandingan kualifikasi: ${freeFireConfig.defaultDurations.kualifikasi} menit</li>
                            <li>• Durasi pertandingan semifinal: ${freeFireConfig.defaultDurations.semifinal} menit</li>
                            <li>• Durasi pertandingan final: ${freeFireConfig.defaultDurations.final} menit</li>
                            <li>• Waktu istirahat minimum: ${freeFireConfig.rules.minBreakTime} menit</li>
                        </ul>
                    </div>
                `;
            }
        }
    }

    // Fungsi untuk menghasilkan jadwal khusus Free Fire
    function generateFreeFireSchedule() {
        // Hanya jalankan jika game yang dipilih adalah Free Fire
        if (gameSelect.value !== 'free-fire') return;
        
        console.log('Generating Free Fire schedule');
        
        // Dapatkan informasi pot yang dipilih
        const groupCountSelect = document.getElementById('groupCountSelect');
        const selectedOption = freeFireConfig.groupOptions.find(option => option.id === groupCountSelect.value);
        
        if (!selectedOption) return;
        
        // Panggil fungsi generateFreeFireGroups dengan jumlah pot yang sesuai
        generateFreeFireGroups(selectedOption.value);
        
        // Tambahkan informasi khusus Free Fire ke hasil
        if (resultsSection) {
            // Tambahkan informasi khusus Free Fire ke hasil
            const freeFireInfo = document.createElement('div');
            freeFireInfo.className = 'mt-6 p-4 bg-orange-50 border border-orange-200 rounded-lg';
            freeFireInfo.innerHTML = `
                <div class="flex items-center mb-3">
                    <img src="../../images/games/free-fire.svg" alt="Free Fire" class="w-8 h-8 mr-3">
                    <h4 class="text-lg font-bold text-orange-700">Aturan Khusus Free Fire</h4>
                </div>
                <ul class="text-sm text-orange-600 space-y-1">
                    <li>• Setiap tim terdiri dari ${freeFireConfig.rules.playersPerTeam} pemain</li>
                    <li>• Maksimal ${freeFireConfig.maxTeamsPerPot} tim per pot</li>
                    <li>• Maksimal ${freeFireConfig.rules.maxMatchesPerDay} pertandingan per hari</li>
                    <li>• Waktu istirahat minimum antar pertandingan: ${freeFireConfig.rules.minBreakTime} menit</li>
                </ul>
            `;
            
            // Tambahkan ke bagian atas hasil setelah header
            const headerElement = resultsSection.querySelector('h3');
            if (headerElement && headerElement.parentNode) {
                headerElement.parentNode.insertBefore(freeFireInfo, headerElement.nextSibling);
            } else {
                resultsSection.appendChild(freeFireInfo);
            }
        }
    }
    
    // Fungsi untuk menghasilkan grup dan jadwal Free Fire
    function generateFreeFireGroups(groupCount) {
        // Sembunyikan konten awal dan tampilkan bagian hasil
        initialContent.style.display = 'none';
        resultsSection.style.display = 'block';
        
        // Dapatkan nilai dari input
        const gameId = gameSelect.value;
        const gameName = getGameNameById(gameId);
        
        // Dapatkan deskripsi grup
        const groupCountSelect = document.getElementById('groupCountSelect');
        const selectedOption = freeFireConfig.groupOptions.find(option => option.id === groupCountSelect.value);
        const groupDescription = selectedOption ? selectedOption.description : '';
        
        // Dapatkan tanggal, waktu, durasi, dan timezone
        const startDate = document.getElementById('startDate').value;
        const endDate = document.getElementById('endDate').value;
        const startTime = document.getElementById('startTime').value;
        const endTime = document.getElementById('endTime').value;
        const matchDuration = parseInt(document.getElementById('matchDuration').value);
        const breakTime = parseInt(document.getElementById('breakTime').value);
        const timezone = document.getElementById('timezone').value;
        
        // Validasi input
        if (!startDate || !endDate || !startTime || !endTime) {
            showToast('Silakan isi semua tanggal dan waktu!', 'error');
            return;
        }
        
        // Konversi tanggal dan waktu ke objek Date
        const startDateTime = new Date(`${startDate}T${startTime}`);
        const endDateTime = new Date(`${endDate}T${endTime}`);
        
        // Validasi tanggal
        if (startDateTime > endDateTime) {
            showToast('Tanggal dan waktu mulai harus sebelum tanggal dan waktu selesai!', 'error');
            return;
        }
        
        // Hitung jumlah match berdasarkan jenis
        const matchCounts = {};
        const matchTypes = ['kualifikasi', 'semifinal', 'final'];
        
        matchTypes.forEach(type => {
            const input = document.getElementById(`matchCount_${type}`);
            if (input) {
                matchCounts[type] = parseInt(input.value);
            } else {
                matchCounts[type] = 0;
            }
        });
        
        // Dapatkan opsi main bersamaan
        let playTogether = 'random';
        const playTogetherRadios = document.querySelectorAll('input[name="playTogether"]');
        playTogetherRadios.forEach(radio => {
            if (radio.checked) {
                playTogether = radio.value;
            }
        });
        
        // Buat array untuk menyimpan data match
        const matches = [];
        
        // Tentukan pot berdasarkan jenis match dan opsi yang dipilih
        const pots = determinePots(matchCounts, playTogether, groupCount);
        
        // Generate data match dan kelompokkan berdasarkan pot
        const matchGroups = generateMatchData(pots, matchCounts, matchDuration, breakTime);
        
        // Buat jadwal dengan mempertimbangkan tanggal mulai, tanggal selesai, dan jam operasional
        const schedule = createScheduleWithDateRange(matchGroups, startDateTime, endDateTime, startTime, endTime, matchDuration, breakTime);
        
        // Buat tabel jadwal
        renderScheduleTable(schedule, gameName, startDate, endDate, timezone);
        
        // Tampilkan toast sukses
        showToast(`Berhasil membuat ${groupCount} pot!`, 'success');
        createParticles(window.innerWidth / 2, window.innerHeight / 4, 30);
    }
    
    // Fungsi untuk menentukan pot berdasarkan jenis match dan opsi yang dipilih
    function determinePots(matchCounts, playTogether, groupCount) {
        const pots = [];
        const potLetters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];
        
        // Buat pot berdasarkan jumlah grup
        for (let i = 0; i < groupCount; i++) {
            if (i < potLetters.length) {
                pots.push(potLetters[i]);
            }
        }
        
        return pots;
    }
    
    // Fungsi untuk menghasilkan data match dan mengelompokkannya
    function generateMatchData(pots, matchCounts, matchDuration, breakTime) {
        const matchGroups = [];
        
        // Buat match untuk setiap jenis
        Object.keys(matchCounts).forEach(type => {
            if (matchCounts[type] > 0) {
                for (let i = 0; i < matchCounts[type]; i++) {
                    pots.forEach(pot => {
                        matchGroups.push({
                            type: type,
                            pot: pot,
                            matchNumber: i + 1,
                            duration: matchDuration,
                            breakTime: breakTime
                        });
                    });
                }
            }
        });
        
        return matchGroups;
    }
    
    // Fungsi untuk membuat jadwal dengan mempertimbangkan tanggal mulai, tanggal selesai, dan jam operasional
    function createScheduleWithDateRange(matchGroups, startDateTime, endDateTime, startTimeStr, endTimeStr, matchDuration, breakTime) {
        const schedule = [];
        let currentDateTime = new Date(startDateTime);
        
        // Parsing jam mulai dan jam selesai operasional
        const [startHour, startMinute] = startTimeStr.split(':').map(Number);
        const [endHour, endMinute] = endTimeStr.split(':').map(Number);
        
        // Konversi ke menit untuk perhitungan yang lebih mudah
        const startTimeMinutes = startHour * 60 + startMinute;
        const endTimeMinutes = endHour * 60 + endMinute;
        
        // Jika waktu akhir lebih kecil dari waktu mulai, berarti melewati tengah malam
        const operationalMinutes = endTimeMinutes < startTimeMinutes ? 
            (24 * 60 - startTimeMinutes) + endTimeMinutes : 
            endTimeMinutes - startTimeMinutes;
        
        for (let i = 0; i < matchGroups.length; i++) {
            const match = matchGroups[i];
            const totalMatchTime = match.duration + match.breakTime; // dalam menit
            
            // Cek apakah waktu saat ini masih dalam jam operasional
            let currentTimeMinutes = currentDateTime.getHours() * 60 + currentDateTime.getMinutes();
            
            // Jika waktu saat ini di luar jam operasional, atur ke jam mulai operasional hari berikutnya
            if (currentTimeMinutes < startTimeMinutes || currentTimeMinutes + totalMatchTime > endTimeMinutes) {
                // Pindah ke hari berikutnya
                currentDateTime.setDate(currentDateTime.getDate() + 1);
                currentDateTime.setHours(startHour, startMinute, 0, 0);
                currentTimeMinutes = startTimeMinutes;
            }
            
            // Cek apakah sudah melewati tanggal akhir
            if (currentDateTime > endDateTime) {
                break; // Hentikan pembuatan jadwal jika sudah melewati tanggal akhir
            }
            
            // Tambahkan match ke jadwal
            const matchEndTime = new Date(currentDateTime.getTime() + match.duration * 60000);
            
            schedule.push({
                ...match,
                startTime: new Date(currentDateTime),
                endTime: matchEndTime
            });
            
            // Perbarui waktu saat ini untuk match berikutnya
            currentDateTime = new Date(matchEndTime.getTime() + match.breakTime * 60000);
        }
        
        return schedule;
    }
    
    // Fungsi untuk merender tabel jadwal
    function renderScheduleTable(schedule, gameName, startDate, endDate, timezone) {
        // Bersihkan container jadwal
        scheduleContainer.innerHTML = '';
        
        // Buat tabel jadwal yang dapat dicetak
        const printableSchedule = document.createElement('div');
        printableSchedule.id = 'printableSchedule';
        printableSchedule.className = 'overflow-x-auto';
        
        // Tambahkan informasi turnamen
        const tournamentInfo = document.createElement('div');
        tournamentInfo.className = 'mb-6 grid grid-cols-1 md:grid-cols-2 gap-4';
        tournamentInfo.innerHTML = `
            <div>
                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-1">Nama Turnamen</label>
                    <input type="text" id="tournamentName" class="w-full p-2 border border-gray-300 rounded-md" placeholder="Masukkan nama turnamen">
                </div>
                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-1">Nama Tim</label>
                    <input type="text" id="teamName" class="w-full p-2 border border-gray-300 rounded-md" placeholder="Masukkan nama tim penyelenggara">
                </div>
                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-1">Nama Grup</label>
                    <input type="text" id="groupName" class="w-full p-2 border border-gray-300 rounded-md" placeholder="Masukkan nama grup">
                </div>
            </div>
            <div>
                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-1">Nama Game</label>
                    <input type="text" id="gameName" class="w-full p-2 border border-gray-300 rounded-md" value="${gameName}" readonly>
                </div>
                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-1">Tanggal</label>
                    <input type="text" id="dateRange" class="w-full p-2 border border-gray-300 rounded-md" value="${startDate} - ${endDate}" readonly>
                </div>
                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-1">Timezone</label>
                    <input type="text" id="timezoneDisplay" class="w-full p-2 border border-gray-300 rounded-md" value="${timezone.toUpperCase()}" readonly>
                </div>
            </div>
        `;
        
        // Buat tabel
        const table = document.createElement('table');
        table.className = 'min-w-full bg-white border border-gray-300';
        
        // Buat header tabel
        const thead = document.createElement('thead');
        thead.className = 'bg-orange-500 text-white';
        thead.innerHTML = `
            <tr>
                <th class="py-2 px-4 border-b border-orange-400 text-left">No</th>
                <th class="py-2 px-4 border-b border-orange-400 text-left">Tanggal</th>
                <th class="py-2 px-4 border-b border-orange-400 text-left">Waktu</th>
                <th class="py-2 px-4 border-b border-orange-400 text-left">Jenis</th>
                <th class="py-2 px-4 border-b border-orange-400 text-left">Pot</th>
                <th class="py-2 px-4 border-b border-orange-400 text-left">Match</th>
                <th class="py-2 px-4 border-b border-orange-400 text-left">Durasi</th>
            </tr>
        `;
        
        // Buat body tabel
        const tbody = document.createElement('tbody');
        
        // Kelompokkan baris berdasarkan tanggal
        let currentDate = '';
        let rowCount = 1;
        
        schedule.forEach((match, index) => {
            const row = document.createElement('tr');
            row.className = index % 2 === 0 ? 'bg-white' : 'bg-orange-50';
            
            // Format tanggal dan waktu
            const matchDate = match.startTime.toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' });
            const startTimeStr = match.startTime.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
            const endTimeStr = match.endTime.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
            
            // Jika tanggal berubah, tambahkan header tanggal
            if (matchDate !== currentDate) {
                currentDate = matchDate;
                const dateHeader = document.createElement('tr');
                dateHeader.className = 'bg-orange-200';
                dateHeader.innerHTML = `
                    <td colspan="7" class="py-2 px-4 font-semibold text-orange-800">
                        Tanggal: ${matchDate}
                    </td>
                `;
                tbody.appendChild(dateHeader);
            }
            
            // Isi baris dengan data match
            row.innerHTML = `
                <td class="py-2 px-4 border-b border-gray-200">${rowCount}</td>
                <td class="py-2 px-4 border-b border-gray-200">${matchDate}</td>
                <td class="py-2 px-4 border-b border-gray-200">${startTimeStr} - ${endTimeStr}</td>
                <td class="py-2 px-4 border-b border-gray-200 capitalize">${match.type}</td>
                <td class="py-2 px-4 border-b border-gray-200">Pot ${match.pot}</td>
                <td class="py-2 px-4 border-b border-gray-200">Match ${match.matchNumber}</td>
                <td class="py-2 px-4 border-b border-gray-200">${match.duration} menit</td>
            `;
            
            tbody.appendChild(row);
            rowCount++;
        });
        
        // Tambahkan header dan body ke tabel
        table.appendChild(thead);
        table.appendChild(tbody);
        
        // Tambahkan tabel ke container yang dapat dicetak
        printableSchedule.appendChild(tournamentInfo);
        printableSchedule.appendChild(table);
        
        // Tambahkan container yang dapat dicetak ke container jadwal
        scheduleContainer.appendChild(printableSchedule);
    }

    // Event listener untuk perubahan game
    gameSelect.addEventListener('change', function() {
        if (this.value === 'free-fire') {
            initializeFreeFireConfig();
        }
    });

    // Fungsi untuk mencetak jadwal Free Fire
    function printFreeFireSchedule() {
        // Hanya jalankan jika game yang dipilih adalah Free Fire
        if (gameSelect.value !== 'free-fire') return;
        
        console.log('Printing Free Fire schedule');
        
        // Buat style khusus untuk print
        const printStyle = document.createElement('style');
        printStyle.type = 'text/css';
        printStyle.media = 'print';
        printStyle.innerHTML = `
            @page {
                size: auto;
                margin: 10mm;
            }
            /* Enhanced print styles for Free Fire schedule */
            body {
                -webkit-print-color-adjust: exact !important;
                color-adjust: exact !important;
            }
            @media print {
                body * {
                    visibility: hidden;
                }
                #printableSchedule, #printableSchedule *, #scheduleContainer, #scheduleContainer * {
                    visibility: visible;
                }
                #printableSchedule, #scheduleContainer {
                    position: absolute;
                    left: 0;
                    top: 0;
                    width: 100%;
                    padding: 1cm;
                }
                /* Ensure all elements are visible during printing */
                #printableSchedule *, #scheduleContainer * {
                    visibility: visible;
                }
                /* Ensure table elements display correctly */
                #printableSchedule table, #scheduleContainer table {
                    display: table !important;
                }
                #printableSchedule thead, #scheduleContainer thead {
                    display: table-header-group !important;
                }
                #printableSchedule tbody, #scheduleContainer tbody {
                    display: table-row-group !important;
                }
                #printableSchedule tr, #scheduleContainer tr {
                    display: table-row !important;
                }
                #printableSchedule th, #scheduleContainer th,
                #printableSchedule td, #scheduleContainer td {
                    display: table-cell !important;
                }
                /* Styling khusus untuk jadwal Free Fire */
                #printableSchedule table, #scheduleContainer table {
                    border-collapse: collapse;
                    width: 100%;
                    page-break-inside: auto;
                }
                #printableSchedule thead, #scheduleContainer thead {
                    display: table-header-group;
                }
                #printableSchedule tr, #scheduleContainer tr {
                    page-break-inside: avoid;
                    page-break-after: auto;
                }
                #printableSchedule th, #scheduleContainer th {
                    background-color: #ff6b00 !important;
                    color: white !important;
                    font-weight: bold;
                    padding: 8px;
                    border: 1px solid #ff6b00;
                    display: table-cell !important;
                }
                #printableSchedule td, #scheduleContainer td {
                    padding: 6px;
                    border: 1px solid #ddd;
                    display: table-cell !important;
                }
                #printableSchedule tr:nth-child(even), #scheduleContainer tr:nth-child(even) {
                    background-color: #fff5e6 !important;
                }
                /* Tambahkan header Free Fire */
                #printableSchedule::before, #scheduleContainer::before {
                    content: "Free Fire Tournament Schedule";
                    display: block;
                    text-align: center;
                    font-size: 16pt;
                    font-weight: bold;
                    color: #ff6b00;
                    margin-bottom: 15px;
                    page-break-after: avoid;
                }
                /* Pastikan informasi turnamen muncul di halaman pertama */
                .tournament-info {
                    page-break-after: avoid !important;
                    margin-bottom: 20px !important;
                    display: grid !important;
                }
                /* Improve form fields display in print */
                input[type="text"] {
                    border: 1px solid #ddd !important;
                    padding: 4px !important;
                    background-color: #fff !important;
                    color: #000 !important;
                }
                /* Ensure date headers stand out */
                tr.bg-orange-200 td {
                    background-color: #ffedd5 !important;
                    font-weight: bold !important;
                    color: #9a3412 !important;
                }
            }
        `;
        document.head.appendChild(printStyle);
        
        // Dapatkan nilai dari input turnamen dengan pengecekan null yang lebih ketat
        // Tetapkan nilai default terlebih dahulu untuk menghindari TypeError jika elemen tidak ditemukan
        // Nilai default ini akan digunakan jika elemen input tidak ditemukan atau nilainya kosong
        let tournamentName = 'Free Fire Tournament'; // Default untuk nama turnamen
        let teamName = 'Tournament Organizer';       // Default untuk nama tim penyelenggara
        let groupName = 'All Groups';                // Default untuk nama grup
        
        try {
            // Cek apakah elemen tournamentName ada dan memiliki nilai
            const tournamentNameEl = document.getElementById('tournamentName');
            if (tournamentNameEl && tournamentNameEl.value) {
                tournamentName = tournamentNameEl.value;
            }
            // Jika elemen tidak ditemukan atau nilai kosong, gunakan nilai default 'Free Fire Tournament'
            
            // Cek apakah elemen teamName ada dan memiliki nilai
            const teamNameEl = document.getElementById('teamName');
            if (teamNameEl && teamNameEl.value) {
                teamName = teamNameEl.value;
            }
            // Jika elemen tidak ditemukan atau nilai kosong, gunakan nilai default 'Tournament Organizer'
            
            // Cek apakah elemen groupName ada dan memiliki nilai
            const groupNameEl = document.getElementById('groupName');
            if (groupNameEl && groupNameEl.value) {
                groupName = groupNameEl.value;
            }
            // Jika elemen tidak ditemukan atau nilai kosong, gunakan nilai default 'All Groups'
        } catch (error) {
            console.error('Error accessing form elements:', error);
            // Gunakan nilai default yang sudah ditetapkan di atas
        }
        
        // Tambahkan judul dinamis ke dokumen
        const titleElement = document.createElement('title');
        titleElement.textContent = `${tournamentName} - ${groupName}`;
        document.head.appendChild(titleElement);
        
        window.print();
        
        // Hapus style dan judul setelah print
        document.head.removeChild(printStyle);
        document.head.removeChild(titleElement);
    }

    // Event listener untuk tombol generate jadwal
    const generateScheduleBtn = document.getElementById('generateSchedule');
    if (generateScheduleBtn) {
        generateScheduleBtn.addEventListener('click', function() {
            if (gameSelect.value === 'free-fire') {
                generateFreeFireSchedule();
            }
        });
    }

    // Event listener untuk tombol Print di header
    document.addEventListener('click', function(e) {
        if (e.target && e.target.id === 'printGroups' && gameSelect.value === 'free-fire') {
            e.preventDefault();
            printFreeFireSchedule();
        }
    });

    // Inisialisasi jika game yang dipilih adalah Free Fire
    if (gameSelect.value === 'free-fire') {
        initializeFreeFireConfig();
    }
});