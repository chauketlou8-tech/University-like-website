// Events data
const eventsData = [
    {
        id: 1,
        title: "Guest Lecture: Modern Technologies",
        category: "lecture",
        date: "April 10, 2024",
        time: "10:00 AM - 12:00 PM",
        location: "Main Auditorium",
        description: "Join us for an insightful lecture on the latest trends in technology and innovation with industry experts.",
        image: "images/lecture.jpg",
        attendees: 45,
        featured: false
    },
    {
        id: 2,
        title: "Club Fair",
        category: "social",
        date: "April 15, 2024",
        time: "2:00 PM - 5:00 PM",
        location: "Student Center",
        description: "Discover all the clubs and societies on campus and find your perfect fit. Free snacks and drinks!",
        image: "images/club-fair.png",
        attendees: 120,
        featured: true
    },
    {
        id: 3,
        title: "Workshop: Study Skills",
        category: "workshop",
        date: "April 22, 2024",
        time: "3:00 PM - 5:00 PM",
        location: "Library Room 203",
        description: "Learn effective study techniques and time management strategies to excel in your academics.",
        image: "images/workshop.png",
        attendees: 30,
        featured: false
    },
    {
        id: 4,
        title: "Movie Night: Social Event",
        category: "social",
        date: "April 26, 2024",
        time: "6:00 PM - 9:00 PM",
        location: "Campus Green",
        description: "Join us for an outdoor movie night under the stars. Bring your blankets and friends!",
        image: "images/movie-night.png",
        attendees: 80,
        featured: false
    },
    {
        id: 5,
        title: "Career Development Workshop",
        category: "career",
        date: "May 5, 2024",
        time: "11:00 AM - 1:00 PM",
        location: "Career Center",
        description: "Learn how to build your resume, ace interviews, and navigate the job market.",
        image: "images/career-workshop.png",
        attendees: 25,
        featured: false
    },
    {
        id: 6,
        title: "Basketball Tournament",
        category: "sports",
        date: "May 12, 2024",
        time: "9:00 AM - 6:00 PM",
        location: "Sports Complex",
        description: "Annual campus basketball tournament. Teams and individual players welcome!",
        image: "images/basketball.png",
        attendees: 60,
        featured: true
    }
];

// DOM elements
const eventsContainer = document.getElementById('events-container');
const filterTabs = document.querySelectorAll('.filter-tab');
const searchInput = document.getElementById('search-input');
const searchBtn = document.querySelector('.search-btn');
const noResults = document.getElementById('no-results');
const loadMoreBtn = document.getElementById('load-more');

// State
let currentFilter = 'all';
let currentSearch = '';
let displayedEvents = 6;
const eventsPerLoad = 3;

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    initMobileMenu();
    loadEvents();
    setupEventListeners();
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
    // Filter tabs
    filterTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            currentFilter = this.dataset.filter;
            displayedEvents = 6;

            // Update active tab
            filterTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');

            loadEvents();
        });
    });

    // Search functionality
    searchBtn.addEventListener('click', performSearch);
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            performSearch();
        }
    });

    // Load more
    loadMoreBtn.addEventListener('click', loadMoreEvents);
}

// Perform search
function performSearch() {
    currentSearch = searchInput.value.toLowerCase().trim();
    displayedEvents = 6;
    loadEvents();
}

// Load events
function loadEvents() {
    const filteredEvents = filterEvents();
    const eventsToShow = filteredEvents.slice(0, displayedEvents);

    renderEvents(eventsToShow);
    updateLoadMoreButton(filteredEvents.length);
    showNoResults(eventsToShow.length === 0);
}

// Filter events based on current filter and search
function filterEvents() {
    return eventsData.filter(event => {
        const matchesFilter = currentFilter === 'all' || event.category === currentFilter;
        const matchesSearch = !currentSearch ||
            event.title.toLowerCase().includes(currentSearch) ||
            event.description.toLowerCase().includes(currentSearch) ||
            event.category.toLowerCase().includes(currentSearch);

        return matchesFilter && matchesSearch;
    });
}

// Render events to the DOM
function renderEvents(events) {
    eventsContainer.innerHTML = '';

    if (events.length === 0) {
        return;
    }

    events.forEach(event => {
        const eventCard = document.createElement('div');
        eventCard.className = 'event-card';
        eventCard.innerHTML = `
            <img src="${event.image}" alt="${event.title}" class="event-image">
            ${event.featured ? '<div class="event-badge">Featured</div>' : ''}
            <div class="event-content">
                <span class="event-category">${event.category.charAt(0).toUpperCase() + event.category.slice(1)}</span>
                <h3 class="event-title">${event.title}</h3>
                <p class="event-description">${event.description}</p>
                <div class="event-meta">
                    <div class="event-date">
                        <i class="far fa-calendar"></i>
                        <span>${event.date} • ${event.time}</span>
                    </div>
                    <div class="event-location">
                        <i class="fas fa-map-marker-alt"></i>
                        <span>${event.location}</span>
                    </div>
                    <div class="event-attendees">
                        <i class="fas fa-users"></i>
                        <span>${event.attendees} attending</span>
                    </div>
                </div>
                <div class="event-actions">
                    <button class="btn-primary" onclick="registerForEvent(${event.id})">Register</button>
                    <button class="btn-secondary" onclick="shareEvent(${event.id})">
                        <i class="fas fa-share-alt"></i> Share
                    </button>
                </div>
            </div>
        `;
        eventsContainer.appendChild(eventCard);
    });
}

// Load more events
function loadMoreEvents() {
    displayedEvents += eventsPerLoad;
    loadEvents();

    // Scroll to newly loaded events
    eventsContainer.lastElementChild.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest'
    });
}

// Update load more button visibility
function updateLoadMoreButton(totalEvents) {
    if (displayedEvents >= totalEvents) {
        loadMoreBtn.style.display = 'none';
    } else {
        loadMoreBtn.style.display = 'block';
    }
}

// Show/hide no results message
function showNoResults(show) {
    noResults.style.display = show ? 'block' : 'none';
}

// Register for event
function registerForEvent(eventId) {
    const event = eventsData.find(e => e.id === eventId);
    if (event) {
        showNotification(`Successfully registered for "${event.title}"!`, 'success');
        event.attendees += 1;
        loadEvents(); // Refresh to update attendee count
    }
}

// Share event
function shareEvent(eventId) {
    const event = eventsData.find(e => e.id === eventId);
    if (event) {
        if (navigator.share) {
            navigator.share({
                title: event.title,
                text: event.description,
                url: window.location.href
            });
        } else {
            showNotification('Event link copied to clipboard!', 'info');
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(window.location.href);
        }
    }
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
            .notification.show { transform: translateX(0); }
            .notification-close {
                background: none;
                border: none;
                color: white;
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

const yearSpan = document.getElementById('year');
yearSpan.innerText = new Date().getFullYear().toString();