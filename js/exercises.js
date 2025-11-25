/**
 * Exercises Module
 * Handles exercise solution toggling and collapsible sections
 */

const Exercises = {
    /**
     * Initialize exercises functionality
     */
    init() {
        this.setupCollapsibles();
        this.setupSolutionToggles();
    },

    /**
     * Set up collapsible section handlers
     */
    setupCollapsibles() {
        document.querySelectorAll('.collapsible-header').forEach(header => {
            header.addEventListener('click', function() {
                const collapsible = this.parentElement;
                collapsible.classList.toggle('open');

                // Re-render math when opening
                if (collapsible.classList.contains('open')) {
                    setTimeout(() => {
                        Exercises.renderMath(collapsible);
                    }, 100);
                }
            });
        });
    },

    /**
     * Set up solution toggle buttons
     */
    setupSolutionToggles() {
        document.querySelectorAll('.toggle-solution-btn').forEach(button => {
            button.addEventListener('click', function() {
                Exercises.toggleSolution(this);
            });
        });
    },

    /**
     * Toggle exercise solution visibility
     * @param {HTMLElement} button - The button that was clicked
     */
    toggleSolution(button) {
        const solution = button.nextElementSibling;

        if (!solution || !solution.classList.contains('solution')) {
            console.error('Solution element not found');
            return;
        }

        solution.classList.toggle('show');

        // Update button text
        if (solution.classList.contains('show')) {
            button.textContent = 'Hide Solution';
            button.classList.add('active');

            // Re-render math in the solution
            setTimeout(() => {
                this.renderMath(solution);
            }, 50);
        } else {
            button.textContent = 'Show Solution';
            button.classList.remove('active');
        }
    },

    /**
     * Render LaTeX math in an element
     * @param {HTMLElement} element - The element to render math in
     */
    renderMath(element) {
        if (typeof renderMathInElement !== 'undefined') {
            renderMathInElement(element, {
                delimiters: [
                    { left: '$$', right: '$$', display: true },
                    { left: '\\[', right: '\\]', display: true },
                    { left: '$', right: '$', display: false },
                    { left: '\\(', right: '\\)', display: false }
                ],
                throwOnError: false
            });
        }
    },

    /**
     * Open all collapsibles (useful for printing)
     */
    expandAll() {
        document.querySelectorAll('.collapsible').forEach(collapsible => {
            collapsible.classList.add('open');
        });
    },

    /**
     * Close all collapsibles
     */
    collapseAll() {
        document.querySelectorAll('.collapsible').forEach(collapsible => {
            collapsible.classList.remove('open');
        });
    },

    /**
     * Show all solutions
     */
    showAllSolutions() {
        document.querySelectorAll('.toggle-solution-btn').forEach(button => {
            const solution = button.nextElementSibling;
            if (solution && !solution.classList.contains('show')) {
                this.toggleSolution(button);
            }
        });
    },

    /**
     * Hide all solutions
     */
    hideAllSolutions() {
        document.querySelectorAll('.toggle-solution-btn').forEach(button => {
            const solution = button.nextElementSibling;
            if (solution && solution.classList.contains('show')) {
                this.toggleSolution(button);
            }
        });
    }
};

// Make toggle function available globally for inline onclick handlers
window.toggleSolution = function(button) {
    Exercises.toggleSolution(button);
};
