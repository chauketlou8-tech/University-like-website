// Resources Pages Common Functionality

// Initialize all resource pages
document.addEventListener('DOMContentLoaded', function() {
    initMobileMenu();
    setupEventListeners();
    updateCurrentYear();
    setupSmoothScrolling();
    setupServiceButtons();
});

// Mobile menu functionality
function initMobileMenu() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', function() {
            navLinks.classList.toggle('active');
        });
    }
}

// Setup event listeners
function setupEventListeners() {
    // Emergency button handlers
    const emergencyButtons = document.querySelectorAll('.btn-emergency');
    emergencyButtons.forEach(button => {
        button.addEventListener('click', function() {
            const phoneNumber = this.textContent.match(/\([0-9]+ [0-9]+-[0-9]+\)/)?.[0] || '(555) 123-HELP';
            showNotification(`Calling ${phoneNumber}...`, 'warning');
            // In a real app, this would initiate a phone call
        });
    });

    // Schedule appointment buttons
    const scheduleButtons = document.querySelectorAll('.btn-primary');
    scheduleButtons.forEach(button => {
        if (button.textContent.includes('Schedule') || button.textContent.includes('Appointment')) {
            button.addEventListener('click', function() {
                showNotification('Redirecting to scheduling system...', 'info');
                // In a real app, this would open a scheduling modal or page
            });
        }
    });

    // Quick action cards
    const actionCards = document.querySelectorAll('.action-card');
    actionCards.forEach(card => {
        card.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}

// Update current year in footer
function updateCurrentYear() {
    const currentYearElements = document.querySelectorAll('#current-year');
    currentYearElements.forEach(element => {
        element.textContent = new Date().getFullYear();
    });
}

// Smooth scrolling for anchor links
function setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Setup service buttons functionality
function setupServiceButtons() {
    // Service booking buttons
    const serviceButtons = document.querySelectorAll('.service-card .btn-primary, .counseling-card .btn-primary');
    serviceButtons.forEach(button => {
        button.addEventListener('click', function() {
            const serviceName = this.closest('.service-card, .counseling-card').querySelector('h3, h4').textContent;
            showNotification(`Scheduling ${serviceName}...`, 'info');

            // Simulate scheduling process
            setTimeout(() => {
                showNotification(`Successfully scheduled ${serviceName}!`, 'success');
            }, 2000);
        });
    });

    // Resource download buttons
    const downloadButtons = document.querySelectorAll('.btn-link');
    downloadButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            if (this.textContent.includes('Download') || this.textContent.includes('View')) {
                e.preventDefault();
                const resourceName = this.closest('.resource-item, .wellness-item').querySelector('h4').textContent;
                showNotification(`Downloading ${resourceName}...`, 'info');

                // Simulate download
                setTimeout(() => {
                    showNotification(`${resourceName} downloaded successfully!`, 'success');
                }, 1500);
            }
        });
    });
}

// Simulate live data updates
function simulateLiveUpdates() {
    // Update workshop/event times occasionally
    setInterval(() => {
        const workshopItems = document.querySelectorAll('.workshop-item, .event-item');
        workshopItems.forEach(item => {
            const timeElement = item.querySelector('p');
            if (timeElement && Math.random() > 0.8) { // 20% chance to update
                const originalTime = timeElement.textContent;
                // Just a visual effect - wouldn't change actual times in real app
                timeElement.style.color = 'var(--primary)';
                setTimeout(() => {
                    timeElement.style.color = '';
                }, 1000);
            }
        });
    }, 10000); // Check every 10 seconds
}

// Initialize live updates
simulateLiveUpdates();

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button class="notification-close">&times;</button>
    `;

    // Add styles if not already added
    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 15px 20px;
                border-radius: 8px;
                color: white;
                display: flex;
                align-items: center;
                justify-content: space-between;
                min-width: 300px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                z-index: 10000;
                transform: translateX(150%);
                transition: transform 0.3s ease;
            }
            .notification-success { background-color: #4bb543; }
            .notification-error { background-color: #dc3545; }
            .notification-info { background-color: #17a2b8; }
            .notification-warning { background-color: #ffc107; color: #000; }
            .notification.show { transform: translateX(0); }
            .notification-close {
                background: none;
                border: none;
                color: inherit;
                font-size: 1.2rem;
                cursor: pointer;
                margin-left: 10px;
            }
        `;
        document.head.appendChild(style);
    }

    document.body.appendChild(notification);

    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);

    // Close button event
    notification.querySelector('.notification-close').addEventListener('click', function() {
        closeNotification(notification);
    });

    // Auto close after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            closeNotification(notification);
        }
    }, 5000);
}

function closeNotification(notification) {
    notification.classList.remove('show');
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 300);
}

// Export functions for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initMobileMenu,
        setupEventListeners,
        updateCurrentYear,
        setupSmoothScrolling,
        showNotification
    };
}