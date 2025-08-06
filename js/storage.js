// storage.js - Fungsi-fungsi penyimpanan untuk Tekno Ogi Generator Esport

// Request storage permission
function requestStoragePermission() {
    // Check if storage permission has already been granted
    if (localStorage.getItem('storage_permission') === 'granted') {
        return;
    }
    
    try {
        // Try to access localStorage
        localStorage.setItem('storage_test', 'test');
        localStorage.removeItem('storage_test');
        
        // If successful, mark permission as granted
        localStorage.setItem('storage_permission', 'granted');
        localStorage.setItem('permission_date', currentDate);
        localStorage.setItem('user', currentUser);
        
        // Show success message
        showToast('Akses penyimpanan berhasil diizinkan!', 'success');
    } catch (e) {
        // If there's an error, show error message
        showToast('Gagal mengakses penyimpanan lokal.', 'error');
    }
}

// Check and request storage persistence if available
async function requestStoragePersistence() {
    if (navigator.storage && navigator.storage.persist) {
        const isPersisted = await navigator.storage.persisted();
        if (!isPersisted) {
            const persistenceResult = await navigator.storage.persist();
            if (persistenceResult) {
                console.log('Storage persistence granted');
            } else {
                console.log('Storage persistence denied');
            }
        } else {
            console.log('Storage persistence already granted');
        }
    }
}

// Check if storage is available
function checkStorageAvailability() {
    const storageAvailable = function(type) {
        try {
            const storage = window[type];
            const x = '__storage_test__';
            storage.setItem(x, x);
            storage.removeItem(x);
            return true;
        } catch(e) {
            return false;
        }
    };
    
    if (storageAvailable('localStorage')) {
        console.log('Local storage is available - All generated data will be stored locally');
        return true;
    } else {
        console.warn('Local storage is not available - Data persistence will be limited');
        showToast('Penyimpanan lokal tidak tersedia. Beberapa fitur mungkin tidak berfungsi dengan baik.', 'error');
        return false;
    }
}