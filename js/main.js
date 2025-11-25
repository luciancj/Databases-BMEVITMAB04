/**
 * Main Application Entry Point
 * Initializes all modules when DOM is ready
 */

(function() {
    'use strict';

    /**
     * Initialize the application
     */
    function initializeApp() {
        console.log('Initializing Database Cheatsheet Application...');

        // Initialize Navigation
        if (typeof Navigation !== 'undefined') {
            Navigation.init();
            Navigation.loadFromHash();
        }

        // Initialize Exercises
        if (typeof Exercises !== 'undefined') {
            Exercises.init();
        }

        // Initialize Audio Player
        if (typeof AudioPlayer !== 'undefined') {
            AudioPlayer.init();
        }

        // Initialize Math Rendering
        if (typeof Utils !== 'undefined') {
            Utils.initMathRendering();
        }

        console.log('Application initialized successfully!');
    }

    // Wait for DOM to be fully loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeApp);
    } else {
        // DOM is already loaded
        initializeApp();
    }

    // Re-render math when window is resized (debounced)
    if (typeof Utils !== 'undefined' && typeof Utils.debounce === 'function') {
        window.addEventListener('resize', Utils.debounce(() => {
            Utils.initMathRendering();
        }, 250));
    }

    // Print helper - expand all sections before printing
    window.addEventListener('beforeprint', () => {
        if (typeof Exercises !== 'undefined') {
            Exercises.expandAll();
        }
    });

})();
