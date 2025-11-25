/**
 * Utilities Module
 * Common utility functions and initialization
 */

const Utils = {
    /**
     * Initialize math rendering across the page
     */
    initMathRendering() {
        if (typeof renderMathInElement === 'undefined') {
            console.warn('KaTeX not loaded');
            return;
        }

        // Render math after a short delay to ensure DOM is ready
        setTimeout(() => {
            renderMathInElement(document.body, {
                delimiters: [
                    { left: '$$', right: '$$', display: true },
                    { left: '\\[', right: '\\]', display: true },
                    { left: '$', right: '$', display: false },
                    { left: '\\(', right: '\\)', display: false }
                ],
                throwOnError: false,
                strict: false
            });
        }, 100);
    },

    /**
     * Smooth scroll to an element
     * @param {string} elementId - The ID of the element to scroll to
     * @param {number} offset - Offset from the top in pixels
     */
    scrollToElement(elementId, offset = 120) {
        const element = document.getElementById(elementId);
        if (element) {
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    },

    /**
     * Debounce function for performance optimization
     * @param {Function} func - Function to debounce
     * @param {number} wait - Wait time in milliseconds
     * @returns {Function} Debounced function
     */
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    /**
     * Copy text to clipboard
     * @param {string} text - Text to copy
     * @returns {Promise<boolean>} Success status
     */
    async copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            return true;
        } catch (err) {
            console.error('Failed to copy:', err);
            return false;
        }
    },

    /**
     * Format date to readable string
     * @param {Date} date - Date to format
     * @returns {string} Formatted date string
     */
    formatDate(date) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    },

    /**
     * Create a table of contents from headings
     * @param {string} containerSelector - Selector for container element
     * @param {string} headingSelector - Selector for headings to include
     * @returns {HTMLElement} TOC element
     */
    generateTOC(containerSelector, headingSelector = 'h2, h3') {
        const container = document.querySelector(containerSelector);
        if (!container) return null;

        const headings = container.querySelectorAll(headingSelector);
        const toc = document.createElement('div');
        toc.className = 'table-of-contents';

        const list = document.createElement('ul');

        headings.forEach((heading, index) => {
            // Add ID to heading if it doesn't have one
            if (!heading.id) {
                heading.id = `heading-${index}`;
            }

            const li = document.createElement('li');
            const link = document.createElement('a');
            link.href = `#${heading.id}`;
            link.textContent = heading.textContent;
            link.onclick = (e) => {
                e.preventDefault();
                this.scrollToElement(heading.id);
            };

            // Add indentation for h3
            if (heading.tagName === 'H3') {
                li.style.marginLeft = '1.5rem';
            }

            li.appendChild(link);
            list.appendChild(li);
        });

        toc.appendChild(list);
        return toc;
    },

    /**
     * Check if user prefers dark mode
     * @returns {boolean} True if dark mode is preferred
     */
    prefersDarkMode() {
        return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    },

    /**
     * Get readable file size
     * @param {number} bytes - Size in bytes
     * @returns {string} Formatted file size
     */
    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    },

    /**
     * Show a temporary notification
     * @param {string} message - Message to display
     * @param {string} type - Type of notification (success, error, info)
     * @param {number} duration - Duration in milliseconds
     */
    showNotification(message, type = 'info', duration = 3000) {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            padding: 1rem 1.5rem;
            background: var(--bg-card);
            border: 2px solid var(--${type === 'error' ? 'danger' : type === 'success' ? 'success' : 'primary'});
            border-radius: 8px;
            box-shadow: 0 4px 12px var(--shadow);
            z-index: 1000;
            animation: slideIn 0.3s ease-out;
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, duration);
    }
};

// Add CSS for notifications animation
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
