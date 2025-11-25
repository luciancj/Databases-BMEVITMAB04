/**
 * Navigation Module
 * Handles section navigation and mobile menu toggling
 */

const Navigation = {
    /**
     * Initialize navigation functionality
     */
    init() {
        this.setupEventListeners();
        this.setupScrollBehavior();
        this.mobileMenuOpen = false;
    },

    /**
     * Set up event listeners for navigation
     */
    setupEventListeners() {
        // Navigation buttons
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.handleNavClick(e));
        });

        // Close mobile menu on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.mobileMenuOpen) {
                this.closeMobileMenu();
            }
        });
    },

    /**
     * Toggle mobile menu (full-screen on mobile)
     */
    toggleMobileMenu() {
        this.mobileMenuOpen = !this.mobileMenuOpen;
        document.body.classList.toggle('mobile-menu-open', this.mobileMenuOpen);

        // Prevent body scroll when menu is open
        if (this.mobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    },

    /**
     * Close mobile menu
     */
    closeMobileMenu() {
        this.mobileMenuOpen = false;
        document.body.classList.remove('mobile-menu-open');
        document.body.style.overflow = '';
    },

    /**
     * Open mobile menu
     */
    openMobileMenu() {
        this.mobileMenuOpen = true;
        document.body.classList.add('mobile-menu-open');
        document.body.style.overflow = 'hidden';
    },

    /**
     * Handle navigation button clicks
     * @param {Event} event - The click event
     */
    handleNavClick(event) {
        const button = event.currentTarget;
        const sectionId = button.getAttribute('data-section');

        if (sectionId) {
            this.showSection(sectionId);
        }
    },

    /**
     * Show a specific section and hide others
     * @param {string} sectionId - The ID of the section to show
     */
    showSection(sectionId) {
        // Hide all sections
        document.querySelectorAll('.section').forEach(section => {
            section.classList.remove('active');
        });

        // Remove active class from all nav buttons
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
        });

        // Show selected section
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.classList.add('active');
        }

        // Add active class to clicked button
        document.querySelectorAll('.nav-btn').forEach(btn => {
            if (btn.getAttribute('data-section') === sectionId) {
                btn.classList.add('active');
            }
        });

        // Close mobile menu on mobile when section is selected
        if (window.innerWidth <= 768) {
            this.closeMobileMenu();
        }

        // Scroll to top smoothly
        window.scrollTo({ top: 0, behavior: 'smooth' });

        // Update URL hash without scrolling
        history.pushState(null, null, `#${sectionId}`);
    },

    /**
     * Set up scroll behavior - simplified since nav is now a sidebar
     * Header stays visible at all times now
     */
    setupScrollBehavior() {
        // No scroll-based hiding anymore - header and nav are always accessible
        // Header is fixed at top, nav is togglable sidebar
    },

    /**
     * Load section from URL hash on page load
     */
    loadFromHash() {
        const hash = window.location.hash.substring(1);
        if (hash) {
            this.showSection(hash);
        }
    }
};

// Make showSection available globally for inline onclick handlers
window.showSection = function(sectionId) {
    Navigation.showSection(sectionId);
};
