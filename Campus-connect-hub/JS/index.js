// Sample data for events and clubs
const eventsData = [
    {
        id: 1,
        title: "Guest Lecture: Modern Technologies",
        date: "April 10, 2024",
        time: "10:00 AM",
        location: "Main Auditorium",
        description: "Join us for an insightful lecture on the latest trends in technology and innovation.",
        image: "images/lecture.jpg"
    },
    {
        id: 2,
        title: "Club Fair",
        date: "April 15, 2024",
        time: "2:00 PM",
        location: "Student Center",
        description: "Discover all the clubs and societies on campus and find your perfect fit.",
        image: "images/club.jpg"
    },
    {
        id: 3,
        title: "Workshop: Study Skills",
        date: "April 22, 2024",
        time: "3:00 PM",
        location: "Library Room 203",
        description: "Learn effective study techniques and time management strategies.",
        image: "images/workshop.png"
    }
];

const clubsData = [
    {
        id: 1,
        name: "Research Club",
        category: "Academic",
        description: "Explore research opportunities and collaborate on projects.",
        members: 45,
        image: "images/research.jpg"
    },
    {
        id: 2,
        name: "Football Club",
        category: "Sports",
        description: "Join our team for regular practice sessions and competitive matches.",
        members: 32,
        image: "images/football.png"
    },
    {
        id: 3,
        name: "Yoga Club",
        category: "Wellness",
        description: "Relax, stretch, and find your inner peace with our yoga sessions.",
        members: 28,
        image: "images/yoga.png"
    }
];

// Initialize joined clubs and registered events from localStorage
let clubsJoined = JSON.parse(localStorage.getItem('clubsJoined')) || [];
let eventsRegistered = JSON.parse(localStorage.getItem('eventsRegistered')) || [];

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize mobile menu
    initMobileMenu();

    // Load events and clubs
    loadEvents();
    loadClubs();

    // Load joined clubs and registered events
    loadJoinedClubs();
    loadRegisteredEvents();

    // Add newsletter form handler
    initNewsletter();

    // Add button event listeners
    initButtons();
});

// Mobile Menu Toggle
function initMobileMenu() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', function() {
            navLinks.classList.toggle('active');
        });
    }
}

// Load Events
function loadEvents() {
    const eventsContainer = document.getElementById('events-container');

    if (!eventsContainer) return;

    eventsContainer.innerHTML = '';

    eventsData.forEach(event => {
        const isRegistered = eventsRegistered.some(registeredEvent => registeredEvent.id === event.id);
        const eventCard = document.createElement('div');
        eventCard.className = 'event-card';
        eventCard.innerHTML = `
            <img src="${event.image}" alt="${event.title}" class="event-image">
            <div class="event-content">
                <div class="event-date">
                    <i class="far fa-calendar-alt"></i>
                    <span>${event.date} • ${event.time}</span>
                </div>
                <h3 class="event-title">${event.title}</h3>
                <p class="event-description">${event.description}</p>
                <div class="event-meta">
                    <div class="event-location">
                        <i class="fas fa-map-marker-alt"></i>
                        <span>${event.location}</span>
                    </div>
                    <button class="btn-event ${isRegistered ? 'btn-registered' : ''}" data-id="${event.id}">
                        ${isRegistered ? 'Registered ✓' : 'Register'}
                    </button>
                </div>
            </div>
        `;
        eventsContainer.appendChild(eventCard);
    });

    // Add event listeners to register buttons
    document.querySelectorAll('.btn-event').forEach(button => {
        button.addEventListener('click', function() {
            const eventId = this.getAttribute('data-id');
            registerForEvent(eventId);
        });
    });
}

// Load Clubs
function loadClubs() {
    const clubsContainer = document.getElementById('clubs-container');

    if (!clubsContainer) return;

    clubsContainer.innerHTML = '';

    clubsData.forEach(club => {
        const isJoined = clubsJoined.some(joinedClub => joinedClub.id === club.id);
        const clubCard = document.createElement('div');
        clubCard.className = 'club-card';
        clubCard.innerHTML = `
            <img src="${club.image}" alt="${club.name}" class="club-image">
            <div class="club-content">
                <span class="club-category">${club.category}</span>
                <h3 class="club-title">${club.name}</h3>
                <p class="club-description">${club.description}</p>
                <div class="club-meta">
                    <div class="club-members">
                        <i class="fas fa-users"></i>
                        <span>${club.members} Members</span>
                    </div>
                    <button class="btn-club ${isJoined ? 'btn-joined' : ''}" data-id="${club.id}">
                        ${isJoined ? 'Joined ✓' : 'Join'}
                    </button>
                </div>
            </div>
        `;
        clubsContainer.appendChild(clubCard);
    });

    // Add event listeners to join buttons
    document.querySelectorAll('.btn-club').forEach(button => {
        button.addEventListener('click', function() {
            const clubId = this.getAttribute('data-id');
            joinClub(clubId);
        });
    });
}

// Load Joined Clubs
function loadJoinedClubs() {
    const joinedClubsContainer = document.getElementById('joined-clubs-container');

    if (!joinedClubsContainer) return;

    joinedClubsContainer.innerHTML = '';

    if (clubsJoined.length === 0) {
        joinedClubsContainer.innerHTML = `
            <div class="no-clubs-message">
                <i class="fas fa-users-slash"></i>
                <h3>No Clubs Joined Yet</h3>
                <p>Join some clubs to see them here!</p>
            </div>
        `;
        return;
    }

    clubsJoined.forEach(club => {
        const joinedClubCard = document.createElement('div');
        joinedClubCard.className = 'joined-club-card';
        joinedClubCard.innerHTML = `
            <img src="${club.image}" alt="${club.name}" class="club-image">
            <div class="club-content">
                <h3 class="club-title">${club.name}</h3>
                <p class="club-description">${club.description}</p>
                <div class="club-actions">
                    <button class="btn-secondary btn-leave-club" data-id="${club.id}">
                        Leave Club
                    </button>
                </div>
            </div>
        `;
        joinedClubsContainer.appendChild(joinedClubCard);
    });

    // Add event listeners to leave buttons
    document.querySelectorAll('.btn-leave-club').forEach(button => {
        button.addEventListener('click', function() {
            const clubId = parseInt(this.getAttribute('data-id'));
            leaveClub(clubId);
        });
    });
}

// Load Registered Events
function loadRegisteredEvents() {
    const registeredEventsContainer = document.getElementById('registered-events-container');

    if (!registeredEventsContainer) return;

    registeredEventsContainer.innerHTML = '';

    if (eventsRegistered.length === 0) {
        registeredEventsContainer.innerHTML = `
            <div class="no-events-message">
                <i class="fas fa-calendar-times"></i>
                <h3>No Events Registered Yet</h3>
                <p>Register for some events to see them here!</p>
            </div>
        `;
        return;
    }

    eventsRegistered.forEach(event => {
        const registeredEventCard = document.createElement('div');
        registeredEventCard.className = 'registered-event-card';
        registeredEventCard.innerHTML = `
            <img src="${event.image}" alt="${event.title}" class="event-image">
            <div class="event-content">
                <div class="event-date">
                    <i class="far fa-calendar-alt"></i>
                    <span>${event.date} • ${event.time}</span>
                </div>
                <h3 class="event-title">${event.title}</h3>
                <p class="event-description">${event.description}</p>
                <div class="event-meta">
                    <div class="event-location">
                        <i class="fas fa-map-marker-alt"></i>
                        <span>${event.location}</span>
                    </div>
                    <button class="btn-secondary btn-unregister-event" data-id="${event.id}">
                        Unregister
                    </button>
                </div>
            </div>
        `;
        registeredEventsContainer.appendChild(registeredEventCard);
    });

    // Add event listeners to unregister buttons
    document.querySelectorAll('.btn-unregister-event').forEach(button => {
        button.addEventListener('click', function() {
            const eventId = parseInt(this.getAttribute('data-id'));
            unregisterFromEvent(eventId);
        });
    });
}

// Event Registration
function registerForEvent(eventId) {
    const event = eventsData.find(e => e.id == eventId);

    if (event) {
        // Check if already registered
        if (eventsRegistered.some(registeredEvent => registeredEvent.id == eventId)) {
            showNotification(`You've already registered for "${event.title}"!`, 'info');
            return;
        }

        // Add to registered events
        eventsRegistered.push(event);

        // Save to localStorage
        localStorage.setItem('eventsRegistered', JSON.stringify(eventsRegistered));

        // Update UI
        updateRegisterButton(eventId, true);
        loadRegisteredEvents();

        showNotification(`Successfully registered for "${event.title}"!`, 'success');
    }
}

// Unregister from Event
function unregisterFromEvent(eventId) {
    const eventIndex = eventsRegistered.findIndex(e => e.id == eventId);

    if (eventIndex !== -1) {
        const eventTitle = eventsRegistered[eventIndex].title;

        // Remove from registered events
        eventsRegistered.splice(eventIndex, 1);

        // Save to localStorage
        localStorage.setItem('eventsRegistered', JSON.stringify(eventsRegistered));

        // Update UI
        updateRegisterButton(eventId, false);
        loadRegisteredEvents();

        showNotification(`You've unregistered from "${eventTitle}"`, 'info');
    }
}

// Update Register Button State
function updateRegisterButton(eventId, isRegistered) {
    const registerButton = document.querySelector(`.btn-event[data-id="${eventId}"]`);
    if (registerButton) {
        if (isRegistered) {
            registerButton.textContent = 'Registered ✓';
            registerButton.classList.add('btn-registered');
        } else {
            registerButton.textContent = 'Register';
            registerButton.classList.remove('btn-registered');
        }
    }
}

// Join Club
function joinClub(clubId) {
    const club = clubsData.find(c => c.id == clubId);

    if (club) {
        // Check if already joined
        if (clubsJoined.some(joinedClub => joinedClub.id == clubId)) {
            showNotification(`You've already joined "${club.name}"!`, 'info');
            return;
        }

        // Add to joined clubs
        clubsJoined.push(club);

        // Save to localStorage
        localStorage.setItem('clubsJoined', JSON.stringify(clubsJoined));

        // Update UI
        updateJoinButton(clubId, true);
        loadJoinedClubs();

        showNotification(`Successfully joined "${club.name}"!`, 'success');

        // Update member count in clubsData
        const clubIndex = clubsData.findIndex(c => c.id == clubId);
        if (clubIndex !== -1) {
            clubsData[clubIndex].members += 1;
        }
    }
}

// Leave Club
function leaveClub(clubId) {
    const clubIndex = clubsJoined.findIndex(c => c.id == clubId);

    if (clubIndex !== -1) {
        const clubName = clubsJoined[clubIndex].name;

        // Remove from joined clubs
        clubsJoined.splice(clubIndex, 1);

        // Save to localStorage
        localStorage.setItem('clubsJoined', JSON.stringify(clubsJoined));

        // Update UI
        updateJoinButton(clubId, false);
        loadJoinedClubs();

        showNotification(`You've left "${clubName}"`, 'info');

        // Update member count in clubsData
        const clubDataIndex = clubsData.findIndex(c => c.id == clubId);
        if (clubDataIndex !== -1 && clubsData[clubDataIndex].members > 0) {
            clubsData[clubDataIndex].members -= 1;
        }
    }
}

// Update Join Button State
function updateJoinButton(clubId, isJoined) {
    const joinButton = document.querySelector(`.btn-club[data-id="${clubId}"]`);
    if (joinButton) {
        if (isJoined) {
            joinButton.textContent = 'Joined ✓';
            joinButton.classList.add('btn-joined');
        } else {
            joinButton.textContent = 'Join';
            joinButton.classList.remove('btn-joined');
        }
    }
}

// Newsletter Subscription
function initNewsletter() {
    const newsletterForm = document.querySelector('.newsletter-form');

    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const emailInput = this.querySelector('input[type="email"]');
            const email = emailInput.value.trim();

            if (validateEmail(email)) {
                showNotification('Successfully subscribed to our newsletter!', 'success');
                emailInput.value = '';
            } else {
                showNotification('Please enter a valid email address.', 'error');
            }
        });
    }
}

// Initialize buttons
function initButtons() {
    // Hero section buttons
    const exploreBtn = document.querySelector('.hero-buttons .btn-primary');
    const joinBtn = document.querySelector('.hero-buttons .btn-secondary');

    if (exploreBtn) {
        exploreBtn.addEventListener('click', function() {
            showNotification('Redirecting to events page...', 'info');
        });
    }

    if (joinBtn) {
        joinBtn.addEventListener('click', function() {
            showNotification('Join feature coming soon!', 'info');
        });
    }
}

// Email Validation
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Notification System
function showNotification(message, type = 'info') {
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
                border-radius: 5px;
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
            
            /* Joined/Registered button styles */
            .btn-joined, .btn-registered {
                background-color: #4bb543 !important;
                border-color: #4bb543 !important;
            }
            
            .btn-joined:hover, .btn-registered:hover {
                background-color: #3d9c36 !important;
                border-color: #3d9c36 !important;
            }
            
            /* Joined clubs section styles */
            .no-clubs-message, .no-events-message {
                text-align: center;
                padding: 3rem;
                color: #666;
            }
            
            .no-clubs-message i, .no-events-message i {
                font-size: 3rem;
                margin-bottom: 1rem;
                color: #ccc;
            }
            
            .joined-club-card, .registered-event-card {
                background: white;
                border-radius: 8px;
                padding: 1.5rem;
                margin-bottom: 1rem;
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                display: flex;
                gap: 1rem;
                align-items: center;
            }
            
            .joined-club-card .club-image, .registered-event-card .event-image {
                width: 80px;
                height: 80px;
                object-fit: cover;
                border-radius: 8px;
            }
            
            .joined-club-card .club-content, .registered-event-card .event-content {
                flex: 1;
            }
            
            .joined-club-card .club-title, .registered-event-card .event-title {
                margin: 0 0 0.5rem 0;
                font-size: 1.2rem;
            }
            
            .joined-club-card .club-description, .registered-event-card .event-description {
                margin: 0 0 1rem 0;
                color: #666;
                font-size: 0.9rem;
            }
            
            .registered-event-card .event-date {
                margin-bottom: 0.5rem;
                color: #666;
                font-size: 0.9rem;
            }
            
            .registered-event-card .event-date i {
                margin-right: 0.5rem;
            }
            
            .registered-event-card .event-location {
                color: #666;
                font-size: 0.9rem;
                margin-bottom: 1rem;
            }
            
            .registered-event-card .event-location i {
                margin-right: 0.5rem;
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