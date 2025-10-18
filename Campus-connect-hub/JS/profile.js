// Profile data with default values
const defaultProfileData = {
    name: "Alex Johnson",
    email: "alex.johnson@campus.edu",
    major: "Computer Science",
    year: "junior",
    pronouns: "He/Him",
    about: "I am a computer science major interested in web development. The coding languages I use are HTML, CSS, JavaScript and Python. In my free time, I like playing music and chilling with friends.",
    interests: ["Web Development", "JavaScript", "Python", "Music", "Photography"],
    phone: "+1 (555) 123-4567",
    location: "Campus University",
    stats: {
        events: 0,
        clubs: 0,
        posts: 0, // Will be calculated from forum threads
        upcomingEvents: 0,
        forumPosts: 0 // Will be calculated from forum threads
    }
};

// DOM elements
const editProfileBtn = document.getElementById('edit-profile-btn');
const editProfileModal = document.getElementById('edit-profile-modal');
const closeModal = document.querySelector('.close-modal');
const cancelEditBtn = document.getElementById('cancel-edit');
const editProfileForm = document.getElementById('edit-profile-form');
const profileUpload = document.getElementById('profile-upload');
const profileImage = document.getElementById('profile-image');
const currentYearSpan = document.getElementById('current-year');

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    initMobileMenu();
    setupEventListeners();
    updateCurrentYear();
    updateContacts(); // Update contacts first
    loadProfileData();
    loadUserActivity();
    loadUserEvents();
    loadUserClubs();
    loadProfileImage();
    updateForumStats(); // Initialize forum stats
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
    // Edit profile button
    if (editProfileBtn) {
        editProfileBtn.addEventListener('click', () => {
            openEditModal();
        });
    }

    // Settings button - REDIRECT TO SETTINGS PAGE
    const settingsBtn = document.getElementById('settings-btn');
    if (settingsBtn) {
        settingsBtn.addEventListener('click', () => {
            window.location.href = '../Campus-connect-hub/resources/settings.html';
        });
    }

    // Modal close events
    if (closeModal) {
        closeModal.addEventListener('click', () => {
            editProfileModal.style.display = 'none';
        });
    }

    if (cancelEditBtn) {
        cancelEditBtn.addEventListener('click', () => {
            editProfileModal.style.display = 'none';
        });
    }

    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === editProfileModal) {
            editProfileModal.style.display = 'none';
        }
    });

    // Form submission
    if (editProfileForm) {
        editProfileForm.addEventListener('submit', handleProfileUpdate);
    }

    // Profile image upload
    if (profileUpload) {
        profileUpload.addEventListener('change', handleImageUpload);
    }

    // Edit buttons for different sections
    document.querySelectorAll('.btn-edit').forEach(button => {
        button.addEventListener('click', function() {
            const section = this.dataset.section;
            openEditSection(section);
        });
    });
}

// Update current year in footer
function updateCurrentYear() {
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear().toString();
    }
}

// Update contacts from application data
function updateContacts(){
    const applicationData = JSON.parse(localStorage.getItem('undergradApplication'));

    if (applicationData) {
        const firstName = applicationData.firstName || '';
        const lastName = applicationData.lastName || '';
        const email = applicationData.email || '';
        const phone = applicationData.phone || '';
        const city = applicationData.city || '';
        const nationality = applicationData.nationality || '';

        // Load current profile data
        const savedProfile = localStorage.getItem('userProfile');
        const currentData = savedProfile ? JSON.parse(savedProfile) : defaultProfileData;

        // Update contact information with application data
        const updatedData = {
            ...currentData,
            name: `${firstName} ${lastName}`.trim() || currentData.name,
            email: email || currentData.email,
            phone: phone || currentData.phone,
            location: `${city}, ${nationality}`.trim().replace(/^, |, $/g, '') || currentData.location
        };

        // Save updated data to localStorage
        localStorage.setItem('userProfile', JSON.stringify(updatedData));

        console.log('Contacts updated from application data');
    } else {
        console.log('No application data found in localStorage');
    }
}

// Get user's forum threads count from localStorage
function getUserForumThreadsCount() {
    try {
        const userThreads = JSON.parse(localStorage.getItem('forumUserThreads')) || [];
        return userThreads.length;
    } catch (error) {
        console.error('Error loading forum threads:', error);
        return 0;
    }
}

// Get user's forum posts count (threads + replies)
function getUserForumPostsCount() {
    try {
        const userThreads = JSON.parse(localStorage.getItem('forumUserThreads')) || [];
        let totalPosts = userThreads.length; // Each thread counts as 1 post

        // If you track replies separately, add them here
        // For now, we'll just count threads as posts
        return totalPosts;
    } catch (error) {
        console.error('Error calculating forum posts:', error);
        return 0;
    }
}

// Load profile data
function loadProfileData() {
    // Load from localStorage or use default data
    const savedProfile = localStorage.getItem('userProfile');
    const userData = savedProfile ? JSON.parse(savedProfile) : defaultProfileData;

    // Update profile header
    const profileName = document.getElementById('profile-name');
    const profileTitle = document.getElementById('profile-title');
    if (profileName) profileName.textContent = userData.name;
    if (profileTitle) profileTitle.textContent = `${userData.major} • ${formatYear(userData.year)}`;

    // Update contact information
    const contactEmail = document.getElementById('contact-email');
    const contactPhone = document.getElementById('contact-phone');
    const contactLocation = document.getElementById('contact-location');
    if (contactEmail) contactEmail.textContent = userData.email;
    if (contactPhone) contactPhone.textContent = userData.phone;
    if (contactLocation) contactLocation.textContent = userData.location;

    // Update about section
    const aboutText = document.getElementById('about-text');
    if (aboutText) aboutText.textContent = userData.about;

    // Update interests - with null check to fix the error
    const interestsContainer = document.getElementById('interests-tags');
    if (interestsContainer && userData.interests) {
        interestsContainer.innerHTML = userData.interests.map(interest =>
            `<span class="tag">${interest}</span>`
        ).join('');
    }

    // Update stats - these will be updated dynamically based on actual data
    updateProfileStats();
}

// Update profile statistics based on actual data
function updateProfileStats() {
    // Get registered events and joined clubs from localStorage
    const registeredEvents = JSON.parse(localStorage.getItem('eventsRegistered')) || [];
    const joinedClubs = JSON.parse(localStorage.getItem('clubsJoined')) || [];

    // Get forum threads count
    const userThreadsCount = getUserForumThreadsCount();
    const userPostsCount = getUserForumPostsCount();

    // Update stats in profile header
    const eventsCount = document.getElementById('events-count');
    const clubsCount = document.getElementById('clubs-count');
    const postsCount = document.getElementById('posts-count');

    if (eventsCount) eventsCount.textContent = registeredEvents.length.toString();
    if (clubsCount) clubsCount.textContent = joinedClubs.length.toString();
    if (postsCount) postsCount.textContent = userThreadsCount.toString();

    // Update activity stats
    const upcomingEvents = document.getElementById('upcoming-events');
    const myClubs = document.getElementById('my-clubs');
    const forumPosts = document.getElementById('forum-posts');

    if (upcomingEvents) upcomingEvents.textContent = registeredEvents.length.toString();
    if (myClubs) myClubs.textContent = joinedClubs.length.toString();
    if (forumPosts) forumPosts.textContent = userPostsCount.toString();

    // Update profile data with current stats
    updateProfileDataWithStats(userThreadsCount, userPostsCount);
}

// Update profile data with current statistics
function updateProfileDataWithStats(threadsCount, postsCount) {
    const savedProfile = localStorage.getItem('userProfile');
    const currentData = savedProfile ? JSON.parse(savedProfile) : defaultProfileData;

    const updatedData = {
        ...currentData,
        stats: {
            events: JSON.parse(localStorage.getItem('eventsRegistered'))?.length || 0,
            clubs: JSON.parse(localStorage.getItem('clubsJoined'))?.length || 0,
            posts: threadsCount,
            upcomingEvents: JSON.parse(localStorage.getItem('eventsRegistered'))?.length || 0,
            forumPosts: postsCount
        }
    };

    localStorage.setItem('userProfile', JSON.stringify(updatedData));
}

// Format academic year
function formatYear(year) {
    const yearMap = {
        'freshman': 'First Year',
        'sophomore': 'Second Year',
        'junior': 'Third Year',
        'senior': 'Fourth Year',
        'graduate': 'Graduate Student'
    };
    return yearMap[year] || year;
}

// Load user activity
function loadUserActivity() {
    // This would typically load from an API
    // For now, we're using the data from localStorage
}

// Load user events from localStorage
function loadUserEvents() {
    const eventsList = document.getElementById('upcoming-events-list');
    if (!eventsList) return;

    // Get registered events from localStorage
    const registeredEvents = JSON.parse(localStorage.getItem('eventsRegistered')) || [];

    eventsList.innerHTML = '';

    if (registeredEvents.length === 0) {
        eventsList.innerHTML = '<p class="no-events">No upcoming events</p>';
        return;
    }

    registeredEvents.forEach(event => {
        const eventItem = document.createElement('div');
        eventItem.className = 'event-item';
        eventItem.innerHTML = `
            <div class="event-icon">
                <i class="fas fa-calendar-alt"></i>
            </div>
            <div class="event-info">
                <div class="event-name">${event.title}</div>
                <div class="event-date">${event.date} • ${event.time}</div>
                <div class="event-location">${event.location}</div>
            </div>
        `;
        eventsList.appendChild(eventItem);
    });
}

// Load user clubs from localStorage
function loadUserClubs() {
    const clubsList = document.getElementById('my-clubs-list');
    if (!clubsList) return;

    // Get joined clubs from localStorage
    const joinedClubs = JSON.parse(localStorage.getItem('clubsJoined')) || [];

    clubsList.innerHTML = '';

    if (joinedClubs.length === 0) {
        clubsList.innerHTML = '<p class="no-clubs">Not a member of any clubs</p>';
        return;
    }

    joinedClubs.forEach(club => {
        const clubItem = document.createElement('div');
        clubItem.className = 'club-item';
        clubItem.innerHTML = `
            <div class="club-icon">
                <i class="fas fa-users"></i>
            </div>
            <div class="club-info">
                <div class="club-name">${club.name}</div>
                <div class="club-members">${club.members} members</div>
                <div class="club-category">${club.category}</div>
            </div>
        `;
        clubsList.appendChild(clubItem);
    });
}

// Load user forum threads for display (if you want to show them)
function loadUserForumThreads() {
    const userThreads = JSON.parse(localStorage.getItem('forumUserThreads')) || [];

    //Section to display user's forum threads
    const threadsList = document.getElementById('user-threads-list');
    if (!threadsList) return;

    threadsList.innerHTML = '';

    if (userThreads.length === 0) {
        threadsList.innerHTML = '<p class="no-threads">No forum threads yet</p>';
        return;
    }

    userThreads.forEach(thread => {
        const threadItem = document.createElement('div');
        threadItem.className = 'thread-item';
        threadItem.innerHTML = `
            <div class="thread-icon">
                <i class="${thread.icon || 'fas fa-file-alt'}"></i>
            </div>
            <div class="thread-info">
                <div class="thread-title">${thread.title}</div>
                <div class="thread-description">${thread.description}</div>
                <div class="thread-meta">
                    <span class="thread-category">${thread.category}</span>
                    <span class="thread-replies">${thread.replies || 0} replies</span>
                    <span class="thread-views">${thread.views || 0} views</span>
                </div>
            </div>
            <div class="thread-actions">
                <button class="btn-view-thread" onclick="viewThread(${thread.id})">View</button>
            </div>
        `;
        threadsList.appendChild(threadItem);
    });

}

// Update forum statistics
function updateForumStats() {
    const userThreadsCount = getUserForumThreadsCount();
    const userPostsCount = getUserForumPostsCount();

    console.log(`User has ${userThreadsCount} threads and ${userPostsCount} posts`);

    // Update the display
    updateProfileStats();
}

// Load profile image
function loadProfileImage() {
    const savedImage = localStorage.getItem('profileImage');
    if (savedImage && profileImage) {
        profileImage.src = savedImage;
    } else if (profileImage) {
        // Set default avatar or placeholder
        profileImage.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="%236c757d"><circle cx="50" cy="40" r="20"/><circle cx="50" cy="100" r="40"/></svg>';
    }
}

// Handle image upload
function handleImageUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        const imageData = e.target.result;
        if (profileImage) {
            profileImage.src = imageData;
        }
        localStorage.setItem('profileImage', imageData);
        showNotification('Profile picture updated successfully!', 'success');
    };
    reader.readAsDataURL(file);
}

// Open edit modal
function openEditModal() {
    // Load current profile data
    const savedProfile = localStorage.getItem('userProfile');
    const userData = savedProfile ? JSON.parse(savedProfile) : defaultProfileData;

    // Populate form with current data
    const editName = document.getElementById('edit-name');
    const editMajor = document.getElementById('edit-major');
    const editYear = document.getElementById('edit-year');
    const editPronouns = document.getElementById('edit-pronouns');
    const editAbout = document.getElementById('edit-about');
    const editInterests = document.getElementById('edit-interests');

    if (editName) editName.value = userData.name;
    if (editMajor) editMajor.value = userData.major;
    if (editYear) editYear.value = userData.year;
    if (editPronouns) editPronouns.value = userData.pronouns;
    if (editAbout) editAbout.value = userData.about;
    if (editInterests) editInterests.value = userData.interests ? userData.interests.join(', ') : '';

    if (editProfileModal) {
        editProfileModal.style.display = 'block';
    }
}

// Open specific section for editing
function openEditSection(section) {
    showNotification(`Editing ${section} section...`, 'info');
    // In a real app, this would open a specific editor for that section
    setTimeout(() => {
        openEditModal();
    }, 500);
}

// Handle profile update
function handleProfileUpdate(e) {
    e.preventDefault();

    // Get current profile data
    const savedProfile = localStorage.getItem('userProfile');
    const currentData = savedProfile ? JSON.parse(savedProfile) : defaultProfileData;

    // Get form data
    const editName = document.getElementById('edit-name');
    const editMajor = document.getElementById('edit-major');
    const editYear = document.getElementById('edit-year');
    const editPronouns = document.getElementById('edit-pronouns');
    const editAbout = document.getElementById('edit-about');
    const editInterests = document.getElementById('edit-interests');

    // Process interests - split by comma and trim each item
    let interestsArray = [];
    if (editInterests && editInterests.value.trim()) {
        interestsArray = editInterests.value.split(',').map(item => item.trim()).filter(item => item !== '');
    }

    // Get current forum stats
    const userThreadsCount = getUserForumThreadsCount();
    const userPostsCount = getUserForumPostsCount();

    const updatedData = {
        name: editName ? editName.value : currentData.name,
        major: editMajor ? editMajor.value : currentData.major,
        year: editYear ? editYear.value : currentData.year,
        pronouns: editPronouns ? editPronouns.value : currentData.pronouns,
        about: editAbout ? editAbout.value : currentData.about,
        interests: interestsArray.length > 0 ? interestsArray : currentData.interests,
        email: currentData.email,
        phone: currentData.phone,
        location: currentData.location,
        stats: {
            events: JSON.parse(localStorage.getItem('eventsRegistered'))?.length || 0,
            clubs: JSON.parse(localStorage.getItem('clubsJoined'))?.length || 0,
            posts: userThreadsCount,
            upcomingEvents: JSON.parse(localStorage.getItem('eventsRegistered'))?.length || 0,
            forumPosts: userPostsCount
        }
    };

    // Save to localStorage
    localStorage.setItem('userProfile', JSON.stringify(updatedData));

    // Update UI
    loadProfileData();

    // Close modal
    if (editProfileModal) {
        editProfileModal.style.display = 'none';
    }

    showNotification('Profile updated successfully!', 'success');
}

// Refresh profile data when page becomes visible (in case data changed in other tabs)
document.addEventListener('visibilitychange', function() {
    if (!document.hidden) {
        updateContacts(); // Update contacts on page visibility change
        loadProfileData();
        loadUserEvents();
        loadUserClubs();
        updateForumStats(); // Update forum stats
    }
});

// Listen for storage changes (updates from other tabs)
window.addEventListener('storage', function(e) {
    if (e.key === 'eventsRegistered' || e.key === 'clubsJoined' || e.key === 'undergradApplication' || e.key === 'forumUserThreads') {
        updateContacts(); // Update contacts when application data changes
        loadProfileData();
        loadUserEvents();
        loadUserClubs();
        updateForumStats(); // Update forum stats when threads change
    }
});

// Listen for custom events from forum (if threads are created/updated)
window.addEventListener('forumThreadsUpdated', function() {
    updateForumStats();
});

// Simulate user activity updates
setInterval(() => {
    // Update stats based on actual data
    updateProfileStats();
}, 30000); // Update every 30 seconds

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