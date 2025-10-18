// Resources data
const resourcesData = [
    {
        id: 1,
        title: "Academic Support",
        category: "academic",
        description: "Tutoring services, academic advising, study resources, and learning assistance",
        icon: "fas fa-graduation-cap",
        color: "#840093",
        links: [
            { text: "Tutoring Schedule", icon: "fas fa-calendar", url: "#" },
            { text: "Study Materials", icon: "fas fa-book", url: "#" },
            { text: "Academic Advising", icon: "fas fa-user-graduate", url: "#" }
        ]
    },
    {
        id: 2,
        title: "Health & Wellbeing",
        category: "health",
        description: "Counseling services, mental health resources, wellness programs, and medical care",
        icon: "fas fa-heartbeat",
        color: "#1f2b38",
        links: [
            { text: "Health Center", icon: "fas fa-stethoscope", url: "#" },
            { text: "Counseling", icon: "fas fa-head-side-virus", url: "#" },
            { text: "Wellness Programs", icon: "fas fa-apple-alt", url: "#" }
        ]
    },
    {
        id: 3,
        title: "Career Services",
        category: "career",
        description: "Resume workshops, job search assistance, career counseling, and internship opportunities",
        icon: "fas fa-briefcase",
        color: "#00932f",
        links: [
            { text: "Resume Help", icon: "fas fa-file-alt", url: "#" },
            { text: "Career Counseling", icon: "fas fa-handshake", url: "#" },
            { text: "Internships", icon: "fas fa-building", url: "#" }
        ]
    },
    {
        id: 4,
        title: "Housing & Accommodation",
        category: "housing",
        description: "On-campus and off-campus housing options, rental advice, and accommodation services",
        icon: "fas fa-home",
        color: "#ed9700",
        links: [
            { text: "Campus Housing", icon: "fas fa-building", url: "#" },
            { text: "Off-Campus Guide", icon: "fas fa-map-marker-alt", url: "#" },
            { text: "Rental Resources", icon: "fas fa-key", url: "#" }
        ]
    },
    {
        id: 5,
        title: "Financial Aid & Scholarships",
        category: "financial",
        description: "Financial assistance, scholarship opportunities, budgeting help, and student employment",
        icon: "fas fa-dollar-sign",
        color: "#4361ee",
        links: [
            { text: "Scholarships", icon: "fas fa-graduation-cap", url: "#" },
            { text: "Financial Aid", icon: "fas fa-hand-holding-usd", url: "#" },
            { text: "Student Jobs", icon: "fas fa-money-bill-wave", url: "#" }
        ]
    },
    {
        id: 6,
        title: "Technology Support",
        category: "technology",
        description: "IT services, software resources, technical support, and digital learning tools",
        icon: "fas fa-laptop-code",
        color: "#6c757d",
        links: [
            { text: "Campus WiFi", icon: "fas fa-wifi", url: "#" },
            { text: "Software Downloads", icon: "fas fa-download", url: "#" },
            { text: "Tech Support", icon: "fas fa-tools", url: "#" }
        ]
    }
];

// DOM elements
const searchInput = document.getElementById('search-input');
const searchBtn = document.querySelector('.search-btn');
const resourcesContainer = document.getElementById('resources-container');
const currentYearSpan = document.getElementById('current-year');

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    initMobileMenu();
    setupEventListeners();
    updateCurrentYear();
    loadResources();
    setupEmergencyContacts();
    setupExploreButtons();
});

// Mobile menu
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
    // Search functionality
    if (searchBtn && searchInput) {
        searchBtn.addEventListener('click', performSearch);
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
    }

    // Quick link smooth scrolling
    document.querySelectorAll('.quick-link').forEach(link => {
        link.addEventListener('click', function(e) {
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
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }
}

// Perform search
function performSearch() {
    const query = searchInput.value.toLowerCase().trim();

    if (query === '') {
        loadResources();
        return;
    }

    const filteredResources = resourcesData.filter(resource =>
        resource.title.toLowerCase().includes(query) ||
        resource.description.toLowerCase().includes(query) ||
        resource.category.toLowerCase().includes(query)
    );

    renderResources(filteredResources);

    if (filteredResources.length === 0) {
        showNotification('No resources found matching your search.', 'info');
    }
}

// Load all resources
function loadResources() {
    renderResources(resourcesData);
}

// Render resources to the DOM
function renderResources(resources) {
    if (!resourcesContainer) return;

    resourcesContainer.innerHTML = '';

    if (resources.length === 0) {
        resourcesContainer.innerHTML = `
            <div class="no-results">
                <i class="fas fa-search"></i>
                <h3>No resources found</h3>
                <p>Try adjusting your search terms</p>
            </div>
        `;
        return;
    }

    resources.forEach(resource => {
        const resourceCard = document.createElement('div');
        resourceCard.className = `resource-card ${resource.category}`;
        resourceCard.dataset.category = resource.category;

        resourceCard.innerHTML = `
            <div class="resource-icon" style="background-color: ${resource.color}">
                <i class="${resource.icon}"></i>
            </div>
            <h3>${resource.title}</h3>
            <p>${resource.description}</p>
            <div class="resource-links">
                ${resource.links.map(link => `
                    <a href="${link.url}" class="resource-link">
                        <i class="${link.icon}"></i>
                        ${link.text}
                    </a>
                `).join('')}
            </div>
            <button class="btn-resource">Explore Resources</button>
        `;

        resourcesContainer.appendChild(resourceCard);
    });

    // Re-setup explore buttons after rendering
    setupExploreButtons();
}

// Setup emergency contact click handlers
function setupEmergencyContacts() {
    const emergencyCards = document.querySelectorAll('.emergency-card');

    emergencyCards.forEach(card => {
        card.addEventListener('click', function() {
            const contactNumber = this.querySelector('.contact-number')?.textContent;
            if (contactNumber) {
                showNotification(`Calling ${contactNumber}...`, 'info');

                // In a real app, this would initiate a phone call
                if (this.classList.contains('urgent')) {
                    showNotification('Dialing emergency services...', 'warning');
                }
            }
        });
    });
}

// Setup explore resource button click handlers
function setupExploreButtons() {
    const exploreButtons = document.querySelectorAll('.btn-resource');

    exploreButtons.forEach(button => {
        // Remove existing event listeners to prevent duplicates
        button.replaceWith(button.cloneNode(true));
    });

    // Re-select the buttons and add fresh event listeners
    document.querySelectorAll('.btn-resource').forEach(button => {
        button.addEventListener('click', function() {
            const card = this.closest('.resource-card');
            const category = card.dataset.category;

            switch(category) {
                case 'academic':
                    window.location.href = 'resources/academic-support.html';
                    break;
                case 'health':
                    window.location.href = 'resources/health-wellbeing.html';
                    break;
                case 'housing':
                    window.location.href = 'resources/housing-accommodation.html';
                    break;
                case 'financial':
                    window.location.href = 'resources/financial-aid.html';
                    break;
                case 'technology':
                    window.location.href = 'resources/technology-support.html';
                    break;
                case 'career':
                    window.location.href = 'resources/career-services.html';
                    break;
                default:
                    showNotification('Resource page coming soon!', 'info');
            }
        });
    });
}

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