/**
 * jadwal-free-fire.js
 * File khusus untuk fungsi jadwal Free Fire
 */

document.addEventListener('DOMContentLoaded', function() {
    // Pastikan file ini hanya dijalankan jika game yang dipilih adalah Free Fire
    const gameSelect = document.getElementById('gameSelect');
    if (!gameSelect) return;

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
        
        // Panggil fungsi generateGroups dari jadwal-generator.js dengan jumlah pot yang sesuai
        if (typeof generateGroups === 'function') {
            generateGroups(selectedOption.value);
        }
        
        // Tambahkan informasi khusus Free Fire ke hasil
        const resultsSection = document.getElementById('resultsSection');
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
        
        // Buat style untuk print yang khusus untuk Free Fire
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
                /* Styling khusus untuk jadwal Free Fire */
                #printableSchedule table, #scheduleContainer table {
                    border-collapse: collapse;
                    width: 100%;
                }
                #printableSchedule th, #scheduleContainer th {
                    background-color: #ff6b00 !important;
                    color: white !important;
                    font-weight: bold;
                    padding: 10px;
                    border: 1px solid #ff6b00;
                }
                #printableSchedule td, #scheduleContainer td {
                    padding: 8px;
                    border: 1px solid #ddd;
                }
                #printableSchedule tr:nth-child(even), #scheduleContainer tr:nth-child(even) {
                    background-color: #fff5e6 !important;
                }
                #printableSchedule tr:nth-child(odd), #scheduleContainer tr:nth-child(odd) {
                    background-color: white !important;
                }
                /* Tambahkan logo Free Fire di header */
                #printableSchedule::before, #scheduleContainer::before {
                    content: "Free Fire Tournament Schedule";
                    display: block;
                    text-align: center;
                    font-size: 18pt;
                    font-weight: bold;
                    color: #ff6b00;
                    margin-bottom: 20px;
                }
            }
        `;
        document.head.appendChild(printStyle);
        
        window.print();
        
        // Hapus style setelah print
        document.head.removeChild(printStyle);
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