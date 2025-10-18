// Forum data with localStorage integration
const forumData = {
    categories: [
        {
            id: 1,
            name: "General Discussions",
            slug: "general",
            description: "Talk about anything related to campus life and student experiences",
            threads: 89,
            posts: 1247,
            icon: "fas fa-comments",
            color: "#4361ee"
        },
        {
            id: 2,
            name: "Academic Support",
            slug: "academic",
            description: "Study tips, course discussions, and academic advice",
            threads: 156,
            posts: 2893,
            icon: "fas fa-graduation-cap",
            color: "#840093"
        },
        {
            id: 3,
            name: "Career & Internships",
            slug: "career",
            description: "Job opportunities, internship experiences, and career advice",
            threads: 78,
            posts: 892,
            icon: "fas fa-briefcase",
            color: "#00932f"
        },
        {
            id: 4,
            name: "Clubs & Activities",
            slug: "clubs",
            description: "Discuss campus clubs, events, and extracurricular activities",
            threads: 134,
            posts: 1567,
            icon: "fas fa-users",
            color: "#f72585"
        },
        {
            id: 5,
            name: "Housing & Accommodation",
            slug: "housing",
            description: "Roommate searches, housing tips, and accommodation advice",
            threads: 67,
            posts: 745,
            icon: "fas fa-home",
            color: "#ed9700"
        },
        {
            id: 6,
            name: "Technology & Gaming",
            slug: "technology",
            description: "Tech discussions, gaming sessions, and software help",
            threads: 92,
            posts: 1234,
            icon: "fas fa-laptop-code",
            color: "#6c757d"
        }
    ]
};

// Initialize or load threads from localStorage
function initializeForumData() {
    // Load user threads from localStorage
    const storedThreads = localStorage.getItem('forumUserThreads');
    const storedCategories = localStorage.getItem('forumCategories');

    // Initialize user threads
    if (storedThreads) {
        forumData.userThreads = JSON.parse(storedThreads);
    } else {
        forumData.userThreads = [];
        localStorage.setItem('forumUserThreads', JSON.stringify([]));
    }

    // Initialize categories with stored data if available
    if (storedCategories) {
        const parsedCategories = JSON.parse(storedCategories);
        forumData.categories.forEach((category, index) => {
            const storedCategory = parsedCategories.find(cat => cat.id === category.id);
            if (storedCategory) {
                forumData.categories[index] = { ...category, ...storedCategory };
            }
        });
    }

    // Initialize popular threads
    forumData.popularThreads = [
        {
            id: 1,
            title: "Welcome to Campus Connect Hub! 👋",
            description: "Introduce yourself and meet fellow students",
            category: "general",
            author: "Admin",
            replies: 247,
            views: 1200,
            lastPost: {
                user: "John D.",
                time: "2 hours ago"
            },
            icon: "fas fa-fire",
            timestamp: new Date().getTime() - 7200000 // 2 hours ago
        },
        {
            id: 2,
            title: "Study Tips That Actually Work 📚",
            description: "Share your best study strategies and techniques",
            category: "academic",
            author: "StudyPro",
            replies: 189,
            views: 987,
            lastPost: {
                user: "Sarah M.",
                time: "5 hours ago"
            },
            icon: "fas fa-star",
            timestamp: new Date().getTime() - 18000000 // 5 hours ago
        },
        {
            id: 3,
            title: "Upcoming Campus Events Calendar 🗓️",
            description: "Discuss and plan for upcoming campus events",
            category: "clubs",
            author: "EventTeam",
            replies: 134,
            views: 756,
            lastPost: {
                user: "Mike R.",
                time: "1 day ago"
            },
            icon: "fas fa-rocket",
            timestamp: new Date().getTime() - 86400000 // 1 day ago
        }
    ];

    // Add user threads to popular threads
    forumData.userThreads.forEach(thread => {
        forumData.popularThreads.unshift(thread);
    });
}

// DOM elements
const newThreadBtn = document.getElementById('new-thread-btn');
const createThreadModal = document.getElementById('create-thread-modal');
const closeModal = document.querySelector('.close-modal');
const cancelThreadBtn = document.getElementById('cancel-thread');
const createThreadForm = document.getElementById('create-thread-form');
const currentYearSpan = document.getElementById('current-year');
const threadsList = document.querySelector('.threads-list');

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    initializeForumData();
    initMobileMenu();
    setupEventListeners();
    updateCurrentYear();
    updateForumStats();
    renderPopularThreads();
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
    // New thread button
    if (newThreadBtn) {
        newThreadBtn.addEventListener('click', () => {
            createThreadModal.style.display = 'block';
        });
    }

    // Modal close events
    if (closeModal) {
        closeModal.addEventListener('click', () => {
            createThreadModal.style.display = 'none';
        });
    }

    if (cancelThreadBtn) {
        cancelThreadBtn.addEventListener('click', () => {
            createThreadModal.style.display = 'none';
        });
    }

    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === createThreadModal) {
            createThreadModal.style.display = 'none';
        }
    });

    // Form submission
    if (createThreadForm) {
        createThreadForm.addEventListener('submit', handleCreateThread);
    }
}

// Update current year in footer
function updateCurrentYear() {
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }
}

// Update forum statistics
function updateForumStats() {
    const totalThreads = forumData.categories.reduce((sum, category) => sum + category.threads, 0) + forumData.userThreads.length;
    const totalPosts = forumData.categories.reduce((sum, category) => sum + category.posts, 0) + forumData.userThreads.length;

    const totalThreadsElement = document.getElementById('total-threads');
    const totalPostsElement = document.getElementById('total-posts');

    if (totalThreadsElement) {
        totalThreadsElement.textContent = totalThreads.toLocaleString();
    }
    if (totalPostsElement) {
        totalPostsElement.textContent = totalPosts.toLocaleString();
    }

    // Simulate online users (random between 200-300)
    const onlineUsers = Math.floor(Math.random() * 100) + 200;
    const onlineUsersElement = document.getElementById('online-users');
    if (onlineUsersElement) {
        onlineUsersElement.textContent = onlineUsers.toLocaleString();
    }
}

// Render popular threads including user threads
function renderPopularThreads() {
    if (!threadsList) return;

    threadsList.innerHTML = '';

    // Sort threads by timestamp (newest first)
    const sortedThreads = [...forumData.popularThreads].sort((a, b) => b.timestamp - a.timestamp);

    sortedThreads.forEach(thread => {
        const threadItem = document.createElement('div');
        threadItem.className = 'thread-item';

        // Add user thread class for styling
        if (thread.author === "You") {
            threadItem.classList.add('user-thread');
        }

        threadItem.innerHTML = `
            <div class="thread-icon">
                <i class="${thread.icon}"></i>
            </div>
            <div class="thread-content">
                <h4>${thread.title}</h4>
                <p>${thread.description}</p>
                <div class="thread-meta">
                    <span class="author">By ${thread.author}</span>
                    <span class="replies">${thread.replies} replies</span>
                    <span class="views">${thread.views} views</span>
                    ${thread.author === "You" ? '<span class="your-post">Your Post</span>' : ''}
                </div>
            </div>
            <div class="thread-activity">
                <div class="last-post">
                    <span class="time">${thread.lastPost.time}</span>
                    <span class="user">${thread.lastPost.user}</span>
                </div>
                <button class="btn-thread" onclick="viewThread(${thread.id})">View Thread</button>
            </div>
        `;

        threadsList.appendChild(threadItem);
    });
}

// View category
function viewCategory(categorySlug) {
    const category = forumData.categories.find(cat => cat.slug === categorySlug);
    if (category) {
        showNotification(`Loading ${category.name}...`, 'info');
        // In a real app, this would navigate to the category page
        setTimeout(() => {
            showNotification(`Now viewing: ${category.name}`, 'success');
        }, 1000);
    }
}

// View thread
function viewThread(threadId) {
    const thread = forumData.popularThreads.find(t => t.id === threadId);
    if (thread) {
        // Increment views
        thread.views += 1;

        showNotification(`Opening thread: ${thread.title}`, 'info');
        // In a real app, this would navigate to the thread page
        setTimeout(() => {
            showNotification(`Now viewing: ${thread.title}`, 'success');
        }, 1000);
    }
}

// Handle create thread form submission
function handleCreateThread(e) {
    e.preventDefault();

    const category = document.getElementById('thread-category').value;
    const title = document.getElementById('thread-title').value;
    const content = document.getElementById('thread-content').value;

    if (!category || !title || !content) {
        showNotification('Please fill in all fields.', 'error');
        return;
    }

    // Find category name and update counts
    const categoryObj = forumData.categories.find(cat => cat.slug === category);
    const categoryName = categoryObj ? categoryObj.name : category;

    // Create new thread
    const newThread = {
        id: Date.now(), // Use timestamp for unique ID
        title: title,
        description: content.substring(0, 100) + (content.length > 100 ? '...' : ''),
        category: category,
        author: "You",
        replies: 0,
        views: 1,
        lastPost: {
            user: "You",
            time: "Just now"
        },
        icon: "fas fa-paper-plane",
        timestamp: new Date().getTime(),
        content: content // Store full content
    };

    // Add to user threads and save to localStorage
    forumData.userThreads.unshift(newThread);
    localStorage.setItem('forumUserThreads', JSON.stringify(forumData.userThreads));

    // Update category counts
    if (categoryObj) {
        categoryObj.threads += 1;
        categoryObj.posts += 1;

        // Save updated categories to localStorage
        localStorage.setItem('forumCategories', JSON.stringify(forumData.categories));
    }

    // Add to popular threads for display
    forumData.popularThreads.unshift(newThread);

    // Close modal and reset form
    createThreadModal.style.display = 'none';
    createThreadForm.reset();

    // Update UI
    updateForumStats();
    renderPopularThreads();

    showNotification(`Thread "${title}" created successfully!`, 'success');
}

// Delete a user thread
function deleteUserThread(threadId) {
    if (confirm('Are you sure you want to delete this thread?')) {
        // Remove from user threads
        forumData.userThreads = forumData.userThreads.filter(thread => thread.id !== threadId);

        // Remove from popular threads
        forumData.popularThreads = forumData.popularThreads.filter(thread => thread.id !== threadId);

        // Update localStorage
        localStorage.setItem('forumUserThreads', JSON.stringify(forumData.userThreads));

        // Update UI
        updateForumStats();
        renderPopularThreads();

        showNotification('Thread deleted successfully!', 'success');
    }
}

// Edit a user thread
function editUserThread(threadId) {
    const thread = forumData.userThreads.find(t => t.id === threadId);
    if (thread) {
        // Populate form with thread data
        document.getElementById('thread-category').value = thread.category;
        document.getElementById('thread-title').value = thread.title;
        document.getElementById('thread-content').value = thread.content;

        // Show modal
        createThreadModal.style.display = 'block';

        // Change form submission to update instead of create
        createThreadForm.onsubmit = function(e) {
            e.preventDefault();
            updateThread(threadId);
        };
    }
}

// Update existing thread
function updateThread(threadId) {
    const category = document.getElementById('thread-category').value;
    const title = document.getElementById('thread-title').value;
    const content = document.getElementById('thread-content').value;

    if (!category || !title || !content) {
        showNotification('Please fill in all fields.', 'error');
        return;
    }

    // Find and update thread
    const threadIndex = forumData.userThreads.findIndex(t => t.id === threadId);
    if (threadIndex !== -1) {
        forumData.userThreads[threadIndex] = {
            ...forumData.userThreads[threadIndex],
            title: title,
            description: content.substring(0, 100) + (content.length > 100 ? '...' : ''),
            category: category,
            content: content,
            lastPost: {
                user: "You",
                time: "Updated just now"
            },
            timestamp: new Date().getTime()
        };

        // Update in popular threads
        const popularThreadIndex = forumData.popularThreads.findIndex(t => t.id === threadId);
        if (popularThreadIndex !== -1) {
            forumData.popularThreads[popularThreadIndex] = forumData.userThreads[threadIndex];
        }

        // Save to localStorage
        localStorage.setItem('forumUserThreads', JSON.stringify(forumData.userThreads));

        // Update UI
        createThreadModal.style.display = 'none';
        createThreadForm.reset();
        renderPopularThreads();

        showNotification('Thread updated successfully!', 'success');

        // Reset form handler
        createThreadForm.onsubmit = handleCreateThread;
    }
}

// Clear all user threads (for testing/reset)
function clearAllUserThreads() {
    if (confirm('Are you sure you want to delete all your threads? This cannot be undone.')) {
        forumData.userThreads = [];
        forumData.popularThreads = forumData.popularThreads.filter(thread => thread.author !== "You");

        localStorage.setItem('forumUserThreads', JSON.stringify([]));

        updateForumStats();
        renderPopularThreads();

        showNotification('All your threads have been deleted.', 'info');
    }
}

// Export threads (for backup)
function exportUserThreads() {
    const dataStr = JSON.stringify(forumData.userThreads, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });

    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'my-forum-threads.json';
    link.click();

    URL.revokeObjectURL(url);
    showNotification('Your threads have been exported!', 'success');
}

// Import threads (from backup)
function importUserThreads(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const importedThreads = JSON.parse(e.target.result);

            if (Array.isArray(importedThreads)) {
                // Add imported threads
                importedThreads.forEach(thread => {
                    // Ensure unique ID and update timestamp
                    const newThread = {
                        ...thread,
                        id: Date.now() + Math.random(),
                        timestamp: new Date().getTime(),
                        lastPost: {
                            user: "You",
                            time: "Imported recently"
                        }
                    };

                    forumData.userThreads.unshift(newThread);
                    forumData.popularThreads.unshift(newThread);
                });

                // Save to localStorage
                localStorage.setItem('forumUserThreads', JSON.stringify(forumData.userThreads));

                // Update UI
                updateForumStats();
                renderPopularThreads();

                showNotification(`Successfully imported ${importedThreads.length} threads!`, 'success');
            }
        } catch (error) {
            showNotification('Error importing threads. Please check the file format.', 'error');
        }
    };
    reader.readAsText(file);
}

// Simulate online users count update
setInterval(() => {
    const onlineUsersElement = document.getElementById('online-users');
    if (onlineUsersElement) {
        const currentUsers = parseInt(onlineUsersElement.textContent.replace(',', ''));
        const change = Math.floor(Math.random() * 21) - 10; // -10 to +10
        const newUsers = Math.max(150, currentUsers + change); // Minimum 150 users
        onlineUsersElement.textContent = newUsers.toLocaleString();
    }
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
            .user-thread {
                border-left: 4px solid #4bb543;
            }
            .your-post {
                background: #4bb543;
                color: white;
                padding: 2px 8px;
                border-radius: 12px;
                font-size: 0.8em;
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