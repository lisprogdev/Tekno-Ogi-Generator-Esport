// main.js - Fungsi utama untuk Tekno Ogi Generator Esport

// DOM Elements - with null checks
const mobileMenuButton = document.getElementById('mobile-menu-button');
const mobileMenu = document.getElementById('mobile-menu');
const backToTopButton = document.getElementById('back-to-top');

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    
    // Initialize core functionality
    initializeMobileMenuClickOutside();
    
    // Show welcome message if on main page
    if (window.location.pathname === '/' || window.location.pathname.endsWith('index.html')) {
        setTimeout(() => {
            console.log('Selamat datang di Tekno Ogi Generator Esport!');
        }, 1000);
    }
});

// Mobile menu toggle - only if elements exist
if (mobileMenuButton && mobileMenu) {
    mobileMenuButton.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
    });

    // Close mobile menu when clicking on a link
    const mobileLinks = mobileMenu.querySelectorAll('a');
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.add('hidden');
        });
    });
}

// Close mobile menu when clicking outside - only if elements exist
function initializeMobileMenuClickOutside() {
    if (mobileMenu && mobileMenuButton) {
        document.addEventListener('click', function(e) {
            if (!mobileMenu.contains(e.target) && !mobileMenuButton.contains(e.target)) {
                mobileMenu.classList.add('hidden');
            }
        });
    }
}

// Show/hide back to top button based on scroll position - only if element exists
if (backToTopButton) {
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTopButton.classList.remove('opacity-0', 'invisible');
            backToTopButton.classList.add('opacity-100', 'visible');
        } else {
            backToTopButton.classList.remove('opacity-100', 'visible');
            backToTopButton.classList.add('opacity-0', 'invisible');
        }
        
        // Active navigation based on scroll position
        let current = '';
        const sections = document.querySelectorAll('section');
        const navLinks = document.querySelectorAll('nav a[href^="#"]');
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (pageYOffset >= (sectionTop - sectionHeight / 3)) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('nav-active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('nav-active');
            }
        });
    });
}

// Smooth scrolling for all anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// Performance monitoring
window.addEventListener('load', function() {
    setTimeout(() => {
        if (performance.navigation.type === performance.navigation.TYPE_RELOAD) {
            console.log('Page was reloaded');
        } else {
            console.log('Page loaded for the first time');
        }
        
        // Report loading time
        const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
        console.log(`Page load time: ${loadTime}ms`);
    }, 0);
});