// ui.js - Fungsi-fungsi antarmuka pengguna untuk Tekno Ogi Generator Esport

// Generate particles for decorative effect
function createParticles() {
    const particleContainers = document.querySelectorAll('.particles');
    
    particleContainers.forEach(container => {
        // Clear existing particles
        container.innerHTML = '';
        
        // Generate new particles
        const particleCount = 30;
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.classList.add('particle');
            
            // Random size
            const size = Math.random() * 5 + 1;
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            
            // Random position
            particle.style.top = `${Math.random() * 100}%`;
            particle.style.left = `${Math.random() * 100}%`;
            
            // Random opacity
            particle.style.opacity = Math.random() * 0.5 + 0.1;
            
            // Random animation
            const duration = Math.random() * 10 + 10;
            const delay = Math.random() * 5;
            particle.style.animation = `floating ${duration}s ease-in-out ${delay}s infinite`;
            
            container.appendChild(particle);
        }
    });
}

// Create notification element for storage permission
function createNotification() {
    const notification = document.createElement('div');
    notification.classList.add('notification');
    notification.innerHTML = `
        <div class="notification-title">
            <i class="fas fa-database"></i>
            <span>Izin Akses Penyimpanan</span>
        </div>
        <div class="notification-content">
            Tekno Ogi memerlukan akses ke penyimpanan lokal perangkat Anda untuk menyimpan data event esport. Data ini hanya disimpan di perangkat Anda dan tidak dikirim ke server.
        </div>
        <div class="notification-buttons">
            <button id="notification-accept" class="notification-btn notification-btn-primary">
                <i class="fas fa-check mr-2"></i>Izinkan
            </button>
            <button id="notification-later" class="notification-btn notification-btn-secondary">
                <i class="fas fa-clock mr-2"></i>Nanti
            </button>
        </div>
    `;
    document.body.appendChild(notification);
    
    // Show notification after a short delay
    setTimeout(() => {
        notification.classList.add('show');
    }, 2000);
    
    // Add event listeners to buttons
    document.getElementById('notification-accept').addEventListener('click', () => {
        requestStoragePermission();
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    });
    
    document.getElementById('notification-later').addEventListener('click', () => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    });
}

// Show toast message
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
    toast.style.backdropFilter = 'blur(10px)'
    
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
        toast.innerHTML = `<i class="fas fa-info-circle mr-2"></i>${message}`
    }
    
    document.body.appendChild(toast);
    
    // Show toast
    setTimeout(() => {
        toast.style.transform = 'translateX(0)';
        toast.style.opacity = '1';
    }, 100);
    
    // Hide and remove toast
    setTimeout(() => {
        toast.style.transform = 'translateX(400px)';
        toast.style.opacity = '0';
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 3000);
}

// Tool button functionality
function initializeToolButtons() {
    const toolButtons = document.querySelectorAll('.tool-card button');
    
    toolButtons.forEach(button => {
        button.addEventListener('click', function() {
            const toolName = this.closest('.tool-card').querySelector('h3').textContent;
            showToast(`${toolName} akan segera tersedia!`, 'info');
            
            // Add click animation
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
        });
    });
}

// Intersection Observer for animations
function initializeAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fadeInUp');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    document.querySelectorAll('.feature-card, .tool-card').forEach(el => {
        observer.observe(el);
    });
}

// Add CSS animations
function addAnimationStyles() {
    const style = document.createElement('style');
    style.textContent = `
        /* Notification styles */
        .notification {
            position: fixed;
            bottom: 30px;
            left: 50%;
            transform: translateX(-50%) translateY(100px);
            background-color: rgba(15, 23, 42, 0.95);
            color: white;
            padding: 20px;
            border-radius: 12px;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
            z-index: 1000;
            max-width: 400px;
            width: 90%;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
        }
        
        .notification.show {
            opacity: 1;
            visibility: visible;
            transform: translateX(-50%) translateY(0);
        }
        
        .notification-title {
            display: flex;
            align-items: center;
            margin-bottom: 10px;
            font-weight: bold;
            font-size: 1.1rem;
            color: #93c5fd;
        }
        
        .notification-title i {
            margin-right: 10px;
        }
        
        .notification-content {
            margin-bottom: 15px;
            line-height: 1.5;
        }
        
        .notification-buttons {
            display: flex;
            gap: 10px;
        }
        
        .notification-btn {
            padding: 8px 16px;
            border-radius: 6px;
            border: none;
            font-weight: bold;
            cursor: pointer;
            transition: background-color 0.3s;
            flex: 1;
        }
        
        .notification-btn-primary {
            background-color: #3b82f6;
            color: white;
        }
        
        .notification-btn-primary:hover {
            background-color: #2563eb;
        }
        
        .notification-btn-secondary {
            background-color: rgba(255, 255, 255, 0.1);
            color: white;
        }
        
        .notification-btn-secondary:hover {
            background-color: rgba(255, 255, 255, 0.2);
        }
        
        /* Animation classes */
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .animate-fadeInUp {
            animation: fadeInUp 0.6s ease forwards;
        }
        
        /* Blob animations */
        @keyframes blob {
            0% { transform: scale(1); }
            33% { transform: scale(1.1); }
            66% { transform: scale(0.9); }
            100% { transform: scale(1); }
        }
        
        .animate-blob {
            animation: blob 7s infinite;
        }
        
        .animation-delay-2000 {
            animation-delay: 2s;
        }
        
        .animation-delay-4000 {
            animation-delay: 4s;
        }
        
        /* Loading states */
        .loading {
            position: relative;
            overflow: hidden;
        }
        
        .loading::after {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
            animation: loading 1.5s infinite;
        }
        
        @keyframes loading {
            100% {
                left: 100%;
            }
        }
    `;
    document.head.appendChild(style);
}

// Handle form submissions
function initializeForms() {
    const contactForm = document.querySelector('#kontak form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const data = Object.fromEntries(formData);
            
            // Simulate form submission
            showToast('Pesan Anda sedang dikirim...', 'info');
            
            setTimeout(() => {
                showToast('Terima kasih! Pesan Anda berhasil dikirim.', 'success');
                this.reset();
            }, 2000);
        });
    }
}