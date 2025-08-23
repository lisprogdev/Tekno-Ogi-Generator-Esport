// Mobile Menu JavaScript - Tekno Ogi Generator Esport
console.log('Mobile menu script loaded');

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing mobile menu...');
    
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    
    console.log('Elements found:', {
        button: mobileMenuButton,
        menu: mobileMenu,
        buttonExists: !!mobileMenuButton,
        menuExists: !!mobileMenu
    });
    
    if (!mobileMenuButton || !mobileMenu) {
        console.error('Mobile menu elements not found!');
        return;
    }
    
    // Toggle mobile menu
    mobileMenuButton.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        console.log('Button clicked!');
        console.log('Menu current classes:', mobileMenu.className);
        console.log('Is hidden?', mobileMenu.classList.contains('hidden'));
        
        // Toggle hidden class
        if (mobileMenu.classList.contains('hidden')) {
            mobileMenu.classList.remove('hidden');
            console.log('Menu shown - hidden class removed');
            console.log('Menu new classes:', mobileMenu.className);
        } else {
            mobileMenu.classList.add('hidden');
            console.log('Menu hidden - hidden class added');
            console.log('Menu new classes:', mobileMenu.className);
        }
    });
    
    // Close menu when clicking on links
    const mobileLinks = mobileMenu.querySelectorAll('a');
    console.log('Found mobile links:', mobileLinks.length);
    
    mobileLinks.forEach(link => {
        link.addEventListener('click', function() {
            mobileMenu.classList.add('hidden');
            console.log('Menu closed after link click');
        });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!mobileMenu.contains(e.target) && !mobileMenuButton.contains(e.target)) {
            mobileMenu.classList.add('hidden');
            console.log('Menu closed after outside click');
        }
    });
    
    // Close menu on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            mobileMenu.classList.add('hidden');
            console.log('Menu closed with Escape key');
        }
    });
    
    console.log('Mobile menu initialized successfully!');
});
