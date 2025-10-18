// DOM elements
const navLinks = document.querySelectorAll('.nav-link');
const settingsSections = document.querySelectorAll('.settings-section');
const currentYearSpan = document.getElementById('current-year');

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    initMobileMenu();
    setupEventListeners();
    updateCurrentYear();
    loadSettings();
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
    // Navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();

            // Remove active class from all links
            navLinks.forEach(l => l.classList.remove('active'));

            // Add active class to clicked link
            this.classList.add('active');

            // Show corresponding section
            const sectionId = this.getAttribute('data-section');
            showSection(sectionId);
        });
    });

    // Toggle switches
    document.querySelectorAll('.toggle-switch input').forEach(toggle => {
        toggle.addEventListener('change', function() {
            const settingName = this.closest('.setting-item').querySelector('h4').textContent;
            saveSetting(this.id, this.checked);
            showNotification(`${settingName} ${this.checked ? 'enabled' : 'disabled'}`, 'success');
        });
    });

    // Select controls
    document.querySelectorAll('.setting-control').forEach(select => {
        select.addEventListener('change', function() {
            const settingName = this.closest('.setting-item').querySelector('h4').textContent;
            saveSetting(this.id, this.value);
            showNotification(`${settingName} updated`, 'info');
        });
    });

    // Checkboxes
    document.querySelectorAll('.checkbox-item input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            saveSetting(this.id, this.checked);
        });
    });

    // Change Password button
    const changePasswordBtn = document.querySelector('.btn-change-password');
    if (changePasswordBtn) {
        changePasswordBtn.addEventListener('click', function() {
            openChangePasswordModal();
        });
    }

    // Clear Cache button
    const clearCacheBtn = document.querySelector('.btn-clear-cache');
    if (clearCacheBtn) {
        clearCacheBtn.addEventListener('click', function() {
            clearCache();
        });
    }

    // Reset Preferences button
    const resetPrefsBtn = document.querySelector('.btn-reset-preferences');
    if (resetPrefsBtn) {
        resetPrefsBtn.addEventListener('click', function() {
            resetPreferences();
        });
    }

    // Export Data button
    const exportDataBtn = document.querySelector('.btn-export-data');
    if (exportDataBtn) {
        exportDataBtn.addEventListener('click', function() {
            exportData();
        });
    }

    // Delete Account button
    const deleteAccountBtn = document.querySelector('.btn-delete-account');
    if (deleteAccountBtn) {
        deleteAccountBtn.addEventListener('click', function() {
            confirmDeleteAccount();
        });
    }
}

// Show specific section
function showSection(sectionId) {
    // Hide all sections
    settingsSections.forEach(section => {
        section.classList.remove('active');
    });

    // Show selected section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
    }
}

// Update current year in footer
function updateCurrentYear() {
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear().toString();
    }
}

// Load settings from localStorage
function loadSettings() {
    const settings = JSON.parse(localStorage.getItem('userSettings')) || {};

    // Load toggle switches
    document.querySelectorAll('.toggle-switch input').forEach(toggle => {
        if (settings[toggle.id] !== undefined) {
            toggle.checked = settings[toggle.id];
        }
    });

    // Load select controls
    document.querySelectorAll('.setting-control').forEach(select => {
        if (settings[select.id] !== undefined) {
            select.value = settings[select.id];
        }
    });

    // Load checkboxes
    document.querySelectorAll('.checkbox-item input[type="checkbox"]').forEach(checkbox => {
        if (settings[checkbox.id] !== undefined) {
            checkbox.checked = settings[checkbox.id];
        }
    });
}

// Save setting to localStorage
function saveSetting(key, value) {
    const settings = JSON.parse(localStorage.getItem('userSettings')) || {};
    settings[key] = value;
    localStorage.setItem('userSettings', JSON.stringify(settings));
}

// Open Change Password Modal
function openChangePasswordModal() {
    // Create modal HTML
    const modalHTML = `
        <div id="change-password-modal" class="modal" style="display: block;">
            <div class="modal-content">
                <span class="close-modal-password">&times;</span>
                <h2>Change Password</h2>
                <form id="change-password-form">
                    <div class="form-group">
                        <label for="current-password">Current Password</label>
                        <input type="password" id="current-password" required>
                    </div>
                    <div class="form-group">
                        <label for="new-password">New Password</label>
                        <input type="password" id="new-password" required minlength="6">
                        <small class="form-hint">Password must be at least 6 characters long</small>
                    </div>
                    <div class="form-group">
                        <label for="confirm-password">Confirm New Password</label>
                        <input type="password" id="confirm-password" required>
                    </div>
                    <div class="form-actions">
                        <button type="button" class="btn-secondary" id="cancel-password">Cancel</button>
                        <button type="submit" class="btn-primary">
                            <i class="fas fa-key"></i> Update Password
                        </button>
                    </div>
                </form>
            </div>
        </div>
    `;

    // Add modal to page
    document.body.insertAdjacentHTML('beforeend', modalHTML);

    // Setup modal event listeners
    setupPasswordModalEvents();
}

// Setup password modal event listeners
function setupPasswordModalEvents() {
    const modal = document.getElementById('change-password-modal');
    const closeBtn = document.querySelector('.close-modal-password');
    const cancelBtn = document.getElementById('cancel-password');
    const form = document.getElementById('change-password-form');

    // Close modal events
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            modal.remove();
        });
    }

    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
            modal.remove();
        });
    }

    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });

    // Form submission
    if (form) {
        form.addEventListener('submit', handlePasswordChange);
    }

    // Real-time password validation
    const newPassword = document.getElementById('new-password');
    const confirmPassword = document.getElementById('confirm-password');

    if (newPassword && confirmPassword) {
        confirmPassword.addEventListener('input', function() {
            validatePasswordMatch();
        });
    }
}

// Validate password match
function validatePasswordMatch() {
    const newPassword = document.getElementById('new-password');
    const confirmPassword = document.getElementById('confirm-password');

    if (newPassword && confirmPassword) {
        if (confirmPassword.value && newPassword.value !== confirmPassword.value) {
            confirmPassword.classList.add('password-error');
            confirmPassword.classList.remove('password-success');
        } else if (confirmPassword.value && newPassword.value === confirmPassword.value) {
            confirmPassword.classList.remove('password-error');
            confirmPassword.classList.add('password-success');
        } else {
            confirmPassword.classList.remove('password-error', 'password-success');
        }
    }
}

// Handle password change
function handlePasswordChange(e) {
    e.preventDefault();

    const currentPassword = document.getElementById('current-password').value;
    const newPassword = document.getElementById('new-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    // Get application data from localStorage
    const applicationData = JSON.parse(localStorage.getItem('completeApplication'));

    if (!applicationData) {
        showNotification('Application data not found. Please try again.', 'error');
        return;
    }

    // Validate current password
    if (applicationData.password !== currentPassword) {
        showNotification('Current password is incorrect.', 'error');
        return;
    }

    // Validate new password
    if (newPassword.length < 6) {
        showNotification('New password must be at least 6 characters long.', 'error');
        return;
    }

    // Validate password match
    if (newPassword !== confirmPassword) {
        showNotification('New passwords do not match.', 'error');
        return;
    }

    // Update password in application data
    applicationData.password = newPassword;

    // Save updated data to localStorage
    localStorage.setItem('completeApplication', JSON.stringify(applicationData));

    // Close modal
    const modal = document.getElementById('change-password-modal');
    if (modal) {
        modal.remove();
    }

    // Show success notification
    showNotification('Password updated successfully!', 'success');

    // Clear form (for security)
    setTimeout(() => {
        const form = document.getElementById('change-password-form');
        if (form) {
            form.reset();
        }
    }, 100);
}

// Clear cache
function clearCache() {
    // Clear various localStorage items (except important data)
    const importantKeys = ['userProfile', 'completeApplication', 'userSettings', 'eventsRegistered', 'clubsJoined'];
    const keysToRemove = [];

    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (!importantKeys.includes(key)) {
            keysToRemove.push(key);
        }
    }

    keysToRemove.forEach(key => localStorage.removeItem(key));

    showNotification('Cache cleared successfully!', 'success');
}

// Reset preferences
function resetPreferences() {
    if (confirm('Are you sure you want to reset all preferences to default values?')) {
        localStorage.removeItem('userSettings');
        location.reload();
    }
}

// Export data
function exportData() {
    const exportData = {
        profile: JSON.parse(localStorage.getItem('userProfile') || '{}'),
        events: JSON.parse(localStorage.getItem('eventsRegistered') || '[]'),
        clubs: JSON.parse(localStorage.getItem('clubsJoined') || '[]'),
        settings: JSON.parse(localStorage.getItem('userSettings') || '{}'),
        exportDate: new Date().toISOString()
    };

    const format = document.getElementById('export-format').value;
    let dataBlob, filename;

    if (format === 'json') {
        dataBlob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        filename = 'campus-connect-data.json';
    } else if (format === 'csv') {
        // Simple CSV conversion for demonstration
        const csvData = convertToCSV(exportData);
        dataBlob = new Blob([csvData], { type: 'text/csv' });
        filename = 'campus-connect-data.csv';
    } else {
        // For PDF, we'll just export as JSON for now
        dataBlob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        filename = 'campus-connect-data.json';
    }

    const url = URL.createObjectURL(dataBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showNotification('Data exported successfully!', 'success');
}

// Simple CSV conversion (for demonstration)
function convertToCSV(data) {
    let csv = 'Data Type,Details\n';

    if (data.profile && data.profile.name) {
        csv += `Profile,${data.profile.name}\n`;
    }

    if (data.events && data.events.length > 0) {
        csv += `Events Registered,${data.events.length} events\n`;
    }

    if (data.clubs && data.clubs.length > 0) {
        csv += `Clubs Joined,${data.clubs.length} clubs\n`;
    }

    csv += `Export Date,${new Date(data.exportDate).toLocaleDateString()}\n`;

    return csv;
}

// Confirm account deletion
function confirmDeleteAccount() {
    if (confirm('Are you absolutely sure you want to delete your account? This action cannot be undone and all your data will be permanently lost.')) {
        if (confirm('This is your final warning. All your data will be deleted immediately. Type "DELETE" to confirm.')) {
            const userInput = prompt('Please type "DELETE" to confirm account deletion:');
            if (userInput === 'DELETE') {
                deleteAccount();
            } else {
                showNotification('Account deletion cancelled.', 'info');
            }
        }
    }
}

// Delete account
function deleteAccount() {
    // Clear all user-related data from localStorage
    const keysToRemove = ['userProfile', 'userSettings', 'eventsRegistered', 'clubsJoined', 'profileImage'];

    keysToRemove.forEach(key => localStorage.removeItem(key));

    showNotification('Account deleted successfully. Redirecting...', 'success');

    setTimeout(() => {
        window.location.href = 'index.html';
    }, 2000);
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