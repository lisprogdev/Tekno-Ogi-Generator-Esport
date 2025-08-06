// error.js - Fungsi-fungsi penanganan kesalahan untuk Tekno Ogi Generator Esport

// Handle errors gracefully
function initializeErrorHandling() {
    window.addEventListener('error', function(e) {
        console.error('Application error:', e.error);
        
        // Don't show error toasts for resource loading failures
        if (e.target && (e.target.tagName === 'IFRAME' || e.target.tagName === 'IMG' || e.target.tagName === 'SCRIPT')) {
            console.warn(`Resource failed to load: ${e.target.src || e.target.href}`);
            return;
        }
        
        // Show error message for other types of errors
        if (typeof showToast === 'function') {
            showToast('Terjadi kesalahan. Silakan refresh halaman.', 'error');
        }
    });
    
    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', function(e) {
        console.error('Unhandled promise rejection:', e.reason);
        e.preventDefault();
    });
}

// Performance monitoring
function initializePerformanceMonitoring() {
    window.addEventListener('load', function() {
        setTimeout(() => {
            if (performance.navigation && performance.navigation.type === performance.navigation.TYPE_RELOAD) {
                console.log('Page was reloaded');
            } else {
                console.log('Page loaded for the first time');
            }
            
            // Report loading time
            if (performance.timing) {
                const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
                console.log(`Page load time: ${loadTime}ms`);
                
                // Report to analytics if load time is too high
                if (loadTime > 3000) {
                    console.warn('Page load time is high: ' + loadTime + 'ms');
                }
            }
        }, 0);
    });
}