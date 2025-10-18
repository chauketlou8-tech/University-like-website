// Clubs data with localStorage persistence
let clubsData = JSON.parse(localStorage.getItem('campusClubs')) || [
    {
        id: 1,
        name: "Computer Science Club",
        category: "technology",
        description: "Join us for coding workshops, hackathons, and tech talks with industry professionals.",
        image: "images/computer-science-club.png",
        members: 156,
        rating: 4.8,
        featured: true,
        meeting: "Every Tuesday, 6:00 PM"
    },
    {
        id: 2,
        name: "Photography Club",
        category: "arts",
        description: "Explore the art of photography through workshops, photo walks, and exhibitions.",
        image: "images/photography-club.png",
        members: 78,
        rating: 4.6,
        featured: false,
        meeting: "Every Thursday, 5:00 PM"
    },
    {
        id: 3,
        name: "Debate Society",
        category: "academic",
        description: "Develop public speaking and critical thinking skills through competitive debating.",
        image: "images/debate-society.png",
        members: 89,
        rating: 4.9,
        featured: true,
        meeting: "Every Monday, 7:00 PM"
    },
    {
        id: 4,
        name: "Art Club",
        category: "arts",
        description: "Express your creativity through various art forms and collaborative projects.",
        image: "images/art-club.png",
        members: 64,
        rating: 4.7,
        featured: false,
        meeting: "Every Wednesday, 4:00 PM"
    },
    {
        id: 5,
        name: "Basketball Club",
        category: "sports",
        description: "Join our team for practice sessions, friendly matches, and tournaments.",
        image: "images/basketball-club.png",
        members: 45,
        rating: 4.5,
        featured: false,
        meeting: "Monday & Thursday, 6:00 PM"
    },
    {
        id: 6,
        name: "Environmental Club",
        category: "community",
        description: "Work together on sustainability projects and environmental awareness campaigns.",
        image: "images/environmental-club.png",
        members: 92,
        rating: 4.8,
        featured: false,
        meeting: "Every Friday, 3:00 PM"
    },
    {
        id: 7,
        name: "Music Society",
        category: "arts",
        description: "For music lovers and performers - join our jam sessions and concerts.",
        image: "images/music-society.png",
        members: 112,
        rating: 4.7,
        featured: false,
        meeting: "Every Tuesday, 7:00 PM"
    },
    {
        id: 8,
        name: "Entrepreneurship Club",
        category: "academic",
        description: "Learn about startups, business, and innovation from successful entrepreneurs.",
        image: "images/entrepreneurship-club.png",
        members: 67,
        rating: 4.6,
        featured: false,
        meeting: "Every Wednesday, 6:30 PM"
    }
];

// DOM elements
const clubsContainer = document.getElementById('clubs-container');
const filterTabs = document.querySelectorAll('.filter-tab');
const searchInput = document.getElementById('search-input');
const searchBtn = document.querySelector('.search-btn');
const noResults = document.getElementById('no-results');
const loadMoreBtn = document.getElementById('load-more');
const createClubBtn = document.getElementById('create-club-btn');
const createClubModal = document.getElementById('create-club-modal');
const closeModal = document.querySelector('.close-modal');
const cancelClubBtn = document.getElementById('cancel-club');
const createClubForm = document.getElementById('create-club-form');
const imageUploadBox = document.getElementById('image-upload-box');
const clubImageInput = document.getElementById('club-image');
const imagePreview = document.getElementById('image-preview');
const previewImg = document.getElementById('preview-img');
const removeImageBtn = document.getElementById('remove-image');

// State
let currentFilter = 'all';
let currentSearch = '';
let displayedClubs = 6;
const clubsPerLoad = 3;
let selectedImageFile = null;

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    saveClubsToStorage(); // Ensure initial data is saved
    initMobileMenu();
    loadClubs();
    setupEventListeners();
    setupModal();
    setupImageUpload();
    updateFooterYear();
});

// Save clubs to localStorage
function saveClubsToStorage() {
    localStorage.setItem('campusClubs', JSON.stringify(clubsData));
}

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
            displayedClubs = 6;

            // Update active tab
            filterTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');

            loadClubs();
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
    loadMoreBtn.addEventListener('click', loadMoreClubs);
}

// Setup modal
function setupModal() {
    createClubBtn.addEventListener('click', () => {
        createClubModal.style.display = 'block';
    });

    closeModal.addEventListener('click', () => {
        createClubModal.style.display = 'none';
        resetForm();
    });

    cancelClubBtn.addEventListener('click', () => {
        createClubModal.style.display = 'none';
        resetForm();
    });

    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === createClubModal) {
            createClubModal.style.display = 'none';
            resetForm();
        }
    });

    // Form submission
    createClubForm.addEventListener('submit', handleCreateClub);
}

// Setup image upload functionality
function setupImageUpload() {
    // Click on upload box triggers file input
    imageUploadBox.addEventListener('click', () => {
        clubImageInput.click();
    });

    // Handle file selection
    clubImageInput.addEventListener('change', handleImageSelect);

    // Handle remove image
    removeImageBtn.addEventListener('click', removeSelectedImage);

    // Drag and drop functionality
    imageUploadBox.addEventListener('dragover', (e) => {
        e.preventDefault();
        imageUploadBox.classList.add('drag-over');
    });

    imageUploadBox.addEventListener('dragleave', () => {
        imageUploadBox.classList.remove('drag-over');
    });

    imageUploadBox.addEventListener('drop', (e) => {
        e.preventDefault();
        imageUploadBox.classList.remove('drag-over');

        if (e.dataTransfer.files.length) {
            clubImageInput.files = e.dataTransfer.files;
            handleImageSelect();
        }
    });
}

// Handle image selection
function handleImageSelect() {
    const file = clubImageInput.files[0];

    if (file) {
        // Validate file type
        if (!file.type.match('image.*')) {
            showNotification('Please select a valid image file (JPG, PNG, etc.)', 'error');
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            showNotification('Image size should be less than 5MB', 'error');
            return;
        }

        selectedImageFile = file;

        // Create preview
        const reader = new FileReader();
        reader.onload = (e) => {
            previewImg.src = e.target.result;
            imagePreview.style.display = 'block';
            imageUploadBox.classList.add('has-image');
            imageUploadBox.querySelector('.image-upload-text').textContent = 'Change Image';
        };
        reader.readAsDataURL(file);
    }
}

// Remove selected image
function removeSelectedImage() {
    selectedImageFile = null;
    clubImageInput.value = '';
    imagePreview.style.display = 'none';
    imageUploadBox.classList.remove('has-image');
    imageUploadBox.querySelector('.image-upload-text').textContent = 'Click to upload club image';
}

// Reset form
function resetForm() {
    createClubForm.reset();
    removeSelectedImage();
}

// Perform search
function performSearch() {
    currentSearch = searchInput.value.toLowerCase().trim();
    displayedClubs = 6;
    loadClubs();
}

// Load clubs
function loadClubs() {
    const filteredClubs = filterClubs();
    const clubsToShow = filteredClubs.slice(0, displayedClubs);

    renderClubs(clubsToShow);
    updateLoadMoreButton(filteredClubs.length);
    showNoResults(clubsToShow.length === 0);
}

// Filter clubs based on current filter and search
function filterClubs() {
    return clubsData.filter(club => {
        const matchesFilter = currentFilter === 'all' || club.category === currentFilter;
        const matchesSearch = !currentSearch ||
            club.name.toLowerCase().includes(currentSearch) ||
            club.description.toLowerCase().includes(currentSearch) ||
            club.category.toLowerCase().includes(currentSearch);

        return matchesFilter && matchesSearch;
    });
}

// Render clubs to the DOM
function renderClubs(clubs) {
    clubsContainer.innerHTML = '';

    if (clubs.length === 0) {
        return;
    }

    clubs.forEach(club => {
        const clubCard = document.createElement('div');
        clubCard.className = 'club-card';
        clubCard.innerHTML = `
            <img src="${club.image}" alt="${club.name}" class="club-image">
            ${club.featured ? '<div class="club-badge">Featured</div>' : ''}
            <div class="club-content">
                <span class="club-category">${getCategoryLabel(club.category)}</span>
                <h3 class="club-title">${club.name}</h3>
                <p class="club-description">${club.description}</p>
                <div class="club-meta">
                    <div class="club-members">
                        <i class="fas fa-users"></i>
                        <span>${club.members} members</span>
                    </div>
                    <div class="club-rating">
                        <i class="fas fa-star"></i>
                        <span>${club.rating}/5</span>
                    </div>
                </div>
                <div class="club-meeting">
                    <i class="fas fa-calendar-alt"></i>
                    <span>${club.meeting}</span>
                </div>
                <div class="club-actions">
                    <button class="btn-primary" onclick="joinClub(${club.id})">Join Club</button>
                    <button class="btn-secondary" onclick="viewClubDetails(${club.id})">
                        <i class="fas fa-info-circle"></i> Details
                    </button>
                </div>
            </div>
        `;
        clubsContainer.appendChild(clubCard);
    });
}

// Get category label
function getCategoryLabel(category) {
    const labels = {
        'academic': 'Academic',
        'sports': 'Sports',
        'arts': 'Arts & Culture',
        'technology': 'Technology',
        'community': 'Community Service',
        'other': 'Other'
    };
    return labels[category] || category;
}

// Load more clubs
function loadMoreClubs() {
    displayedClubs += clubsPerLoad;
    loadClubs();

    // Scroll to newly loaded clubs
    if (clubsContainer.lastElementChild) {
        clubsContainer.lastElementChild.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest'
        });
    }
}

// Update load more button visibility
function updateLoadMoreButton(totalClubs) {
    if (displayedClubs >= totalClubs) {
        loadMoreBtn.style.display = 'none';
    } else {
        loadMoreBtn.style.display = 'block';
    }
}

// Show/hide no results message
function showNoResults(show) {
    noResults.style.display = show ? 'block' : 'none';
}

// Join club
function joinClub(clubId) {
    const club = clubsData.find(c => c.id === clubId);
    if (club) {
        showNotification(`Successfully joined "${club.name}"!`, 'success');
        club.members += 1;
        saveClubsToStorage(); // Save to localStorage
        loadClubs(); // Refresh to update member count
    }
}

// View club details
function viewClubDetails(clubId) {
    const club = clubsData.find(c => c.id === clubId);
    if (club) {
        showNotification(`Loading details for "${club.name}"...`, 'info');
        // In a real app, this would navigate to a club details page
    }
}

// Handle create club form submission
function handleCreateClub(e) {
    e.preventDefault();

    const clubName = document.getElementById('club-name').value;
    const clubCategory = document.getElementById('club-category').value;
    const clubDescription = document.getElementById('club-description').value;

    // Generate unique ID
    const newId = clubsData.length > 0 ? Math.max(...clubsData.map(c => c.id)) + 1 : 1;

    // Handle image - either use uploaded image or default
    let clubImage = 'images/default-club.jpg';
    if (selectedImageFile) {
        // In a real app, you would upload this to a server
        // For demo purposes, we'll create a data URL
        const reader = new FileReader();
        reader.onload = (e) => {
            clubImage = e.target.result;
            completeClubCreation(newId, clubName, clubCategory, clubDescription, clubImage);
        };
        reader.readAsDataURL(selectedImageFile);
    } else {
        completeClubCreation(newId, clubName, clubCategory, clubDescription, clubImage);
    }
}

// Complete club creation after image processing
function completeClubCreation(id, name, category, description, image) {
    // Create new club object
    const newClub = {
        id: id,
        name: name,
        category: category,
        description: description,
        image: image,
        members: 1, // The creator is the first member
        rating: 0,
        featured: false,
        meeting: 'To be scheduled'
    };

    clubsData.unshift(newClub); // Add to beginning of array
    saveClubsToStorage(); // Save to localStorage

    createClubModal.style.display = 'none';
    resetForm();

    showNotification(`"${name}" has been created successfully!`, 'success');
    loadClubs(); // Refresh the clubs list
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

// Update footer year
function updateFooterYear() {
    const yearSpan = document.getElementById('year');
    if (yearSpan) {
        yearSpan.innerText = new Date().getFullYear().toString();
    }
}