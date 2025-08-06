/**
 * Tools Page JavaScript
 * Contains functionality specific to the tools page
 */

// DOM Elements for tools page
let categoryButtons;
let toolCards;


/**
 * Initialize the tools page functionality
 */
function initializeToolsPage() {
  console.log("Tools page initialized");

  // Get DOM elements
  categoryButtons = document.querySelectorAll(".category-filter");
  toolCards = document.querySelectorAll(".tool-card");

  // Initialize functionality
  initializeCategoryFilter();
  initializeToolButtons();

  // Show welcome message
  setTimeout(() => {
    showToast("Selamat datang di halaman Tools Tekno Ogi!", "info");
  }, 1000);
}

/**
 * Initialize mobile menu functionality
 */
function initializeMobileMenu() {
  if (mobileMenuButton && mobileMenu) {
    // Mobile menu toggle
    mobileMenuButton.addEventListener("click", () => {
      mobileMenu.classList.toggle("hidden");
    });

    // Close mobile menu when clicking on a link
    const mobileLinks = mobileMenu.querySelectorAll("a");
    mobileLinks.forEach((link) => {
      link.addEventListener("click", () => {
        mobileMenu.classList.add("hidden");
      });
    });
  }
}

/**
 * Initialize back to top button functionality
 */
function initializeBackToTop() {
  if (backToTopButton) {
    // Show/hide back to top button based on scroll position
    window.addEventListener("scroll", () => {
      if (window.pageYOffset > 300) {
        backToTopButton.classList.remove("opacity-0", "invisible");
        backToTopButton.classList.add("opacity-100", "visible");
      } else {
        backToTopButton.classList.remove("opacity-100", "visible");
        backToTopButton.classList.add("opacity-0", "invisible");
      }
    });

    // Scroll to top when clicking the button
    backToTopButton.addEventListener("click", (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
}

/**
 * Initialize smooth scrolling for anchor links
 */
function initializeSmoothScrolling() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();

      const targetId = this.getAttribute("href");
      if (targetId === "#") return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 80,
          behavior: "smooth",
        });
      }
    });
  });
}

/**
 * Initialize category filter functionality
 */
function initializeCategoryFilter() {
  if (categoryButtons && toolCards) {
    categoryButtons.forEach((button) => {
      button.addEventListener("click", () => {
        // Remove active class from all buttons
        categoryButtons.forEach((btn) => btn.classList.remove("active"));

        // Add active class to clicked button
        button.classList.add("active");

        // Get selected category
        const selectedCategory = button.getAttribute("data-category");

        // Filter tool cards
        toolCards.forEach((card) => {
          const cardCategory = card.getAttribute("data-category");

          if (
            selectedCategory === "all" ||
            cardCategory === selectedCategory
          ) {
            card.style.display = "block";
            setTimeout(() => {
              card.style.opacity = "1";
              card.style.transform = "translateY(0)";
            }, 100);
          } else {
            card.style.opacity = "0";
            card.style.transform = "translateY(20px)";
            setTimeout(() => {
              card.style.display = "none";
            }, 300);
          }
        });
      });
    });
  }
}

/**
 * Generate particles for decorative effect
 */
function createParticles() {
  const particleContainers = document.querySelectorAll(".particles");

  particleContainers.forEach((container) => {
    container.innerHTML = "";

    const particleCount = 20;
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement("div");
      particle.classList.add("particle");

      const size = Math.random() * 4 + 2;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;

      particle.style.top = `${Math.random() * 100}%`;
      particle.style.left = `${Math.random() * 100}%`;

      particle.style.opacity = Math.random() * 0.3 + 0.1;

      const duration = Math.random() * 15 + 10;
      const delay = Math.random() * 5;
      particle.style.animation = `floating ${duration}s ease-in-out ${delay}s infinite`;

      container.appendChild(particle);
    }
  });
}

/**
 * Initialize tool buttons functionality
 */
function initializeToolButtons() {
  const toolButtons = document.querySelectorAll(
    ".tool-card button:not([disabled])"
  );

  toolButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const toolName =
        this.closest(".tool-card").querySelector("h3").textContent;

      // Add click animation
      this.style.transform = "scale(0.95)";
      setTimeout(() => {
        this.style.transform = "scale(1)";
      }, 150);

      // Show notification
      showToast(`${toolName} akan segera tersedia!`, "info");
    });
  });
}

/**
 * Show toast message
 * @param {string} message - The message to display
 * @param {string} type - The type of toast (info, success, error)
 */
function showToast(message, type = "info") {
  const toast = document.createElement("div");
  toast.style.position = "fixed";
  toast.style.top = "20px";
  toast.style.right = "20px";
  toast.style.padding = "12px 20px";
  toast.style.borderRadius = "8px";
  toast.style.zIndex = "9999";
  toast.style.maxWidth = "300px";
  toast.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.15)";
  toast.style.transition = "all 0.3s ease";
  toast.style.transform = "translateX(400px)";
  toast.style.opacity = "0";
  toast.style.backdropFilter = "blur(10px)";

  if (type === "info") {
    toast.style.backgroundColor = "rgba(59, 130, 246, 0.95)";
    toast.style.color = "white";
    toast.innerHTML = `<i class="fas fa-info-circle mr-2"></i>${message}`;
  }

  document.body.appendChild(toast);

  // Show toast
  setTimeout(() => {
    toast.style.transform = "translateX(0)";
    toast.style.opacity = "1";
  }, 100);

  // Hide and remove toast
  setTimeout(() => {
    toast.style.transform = "translateX(400px)";
    toast.style.opacity = "0";
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 3000);
}

/**
 * Initialize close mobile menu when clicking outside
 */
function initializeMobileMenuClickOutside() {
  document.addEventListener("click", function (e) {
    if (
      mobileMenu && 
      mobileMenuButton &&
      !mobileMenu.contains(e.target) &&
      !mobileMenuButton.contains(e.target)
    ) {
      mobileMenu.classList.add("hidden");
    }
  });
}

// Initialize everything when DOM is loaded
document.addEventListener("DOMContentLoaded", initializeToolsPage);
