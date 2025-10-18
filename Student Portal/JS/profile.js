document.addEventListener('DOMContentLoaded', function() {
    const sidebar = document.getElementById('sidebar');
    const openBtn = document.getElementById('openBtn');
    const closeBtn = document.getElementById('closeBtn');
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    const authBtn = document.getElementById('authBtn');
    const editProfileBtn = document.getElementById('editProfileBtn');
    const profilePicInput = document.getElementById('profile_pic');
    const editButtons = document.querySelectorAll('.btn-edit');
    const changePasswordBtn = document.querySelector('.btn-outline'); // Change password button

    // Initialize profile page
    initializeProfilePage();

    // Sidebar functionality
    if (openBtn) {
        openBtn.addEventListener('click', function() {
            sidebar.classList.add('active');
        });
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            sidebar.classList.remove('active');
        });
    }

    // Mobile menu toggle
    if (mobileMenuToggle && mainNav) {
        mobileMenuToggle.addEventListener('click', function() {
            mainNav.classList.toggle('active');
        });
    }

    // Logout functionality
    if (authBtn) {
        authBtn.addEventListener('click', function() {
            if (confirm('Are you sure you want to logout?')) {
                sessionStorage.clear();
                localStorage.removeItem('profileImage');
                window.location.href = 'Authentication.html';
            }
        });
    }

    // Edit profile button
    if (editProfileBtn) {
        editProfileBtn.addEventListener('click', function() {
            alert('Edit profile functionality would open a modal or redirect to an edit page.');
        });
    }

    // Profile picture upload
    if (profilePicInput) {
        profilePicInput.addEventListener('change', previewImage);
    }

    // Section edit buttons
    editButtons.forEach(button => {
        button.addEventListener('click', function() {
            const section = this.getAttribute('data-section');
            editSection(section);
        });
    });

    // Change password button
    if (changePasswordBtn) {
        changePasswordBtn.addEventListener('click', changePassword);
    }

    // Load saved profile picture
    loadProfilePicture();

    // Update active navigation link
    const currentPage = window.location.pathname.split('/').pop();
    const navLinks = document.querySelectorAll('.sidebar a, .main-nav a');

    navLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        if (linkHref === currentPage) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', function(event) {
        if (window.innerWidth <= 768) {
            const isClickInsideSidebar = sidebar.contains(event.target);
            const isClickOnOpenBtn = openBtn.contains(event.target);

            if (!isClickInsideSidebar && !isClickOnOpenBtn && sidebar.classList.contains('active')) {
                sidebar.classList.remove('active');
            }
        }
    });

    // Handle window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            sidebar.classList.remove('active');
            if (mainNav) {
                mainNav.classList.remove('active');
            }
        }
    });
});

function initializeProfilePage() {
    // Load user data from completeApplication in localStorage
    loadUserData();

    // Load profile statistics
    loadProfileStats();

}

function loadUserData() {
    // Get data from completeApplication in localStorage
    const completeApplication = JSON.parse(localStorage.getItem('completeApplication') || '{}');
    const personalInfo = completeApplication.personalInfo || {};
    const programDetails = completeApplication.programDetails || {};

    console.log('Complete Application Data:', completeApplication);
    console.log('Personal Info:', personalInfo);
    console.log('Program Details:', programDetails);

    // Set profile name and email
    const profileName = document.getElementById('profile-name');
    const profileEmail = document.getElementById('profile-email');
    const profileProgram = document.getElementById('profile-program');

    if (personalInfo.firstName && personalInfo.lastName) {
        profileName.textContent = `${personalInfo.firstName} ${personalInfo.lastName}`;
    } else {
        profileName.textContent = 'Student';
    }

    if (personalInfo.email) {
        profileEmail.textContent = personalInfo.email;
    } else {
        profileEmail.textContent = 'student@university.edu';
    }

    // Set program information
    if (programDetails.major) {
        profileProgram.textContent = `${programDetails.major}${programDetails.second ? ' & ' + programDetails.second : ''}`;
    } else {
        profileProgram.textContent = 'Undeclared';
    }

    // Set detailed information
    setProfileDetails(personalInfo, programDetails);
}

function setProfileDetails(personalInfo, programDetails) {
    // Personal Information
    document.getElementById('info-student-id').textContent =
        personalInfo.idNumber || 'Not Provided';

    // Format date of birth
    if (personalInfo.dateOfBirth) {
        const dob = new Date(personalInfo.dateOfBirth);
        document.getElementById('info-dob').textContent = dob.toLocaleDateString('en-ZA', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    } else {
        document.getElementById('info-dob').textContent = 'Not Provided';
    }

    document.getElementById('info-phone').textContent =
        personalInfo.phone || 'Not Provided';

    // Format address
    let address = '';
    if (personalInfo.address) address += personalInfo.address;
    if (personalInfo.city) address += (address ? ', ' : '') + personalInfo.city;
    if (personalInfo.province) address += (address ? ', ' : '') + personalInfo.province;
    if (personalInfo.postalCode) address += (address ? ', ' : '') + personalInfo.postalCode;
    if (personalInfo.country) address += (address ? ', ' : '') + personalInfo.country;

    document.getElementById('info-address').textContent =
        address || 'Not Provided';

    // Academic Information
    document.getElementById('info-program').textContent =
        programDetails.faculty || 'Not Specified';

    document.getElementById('info-major').textContent =
        programDetails.major || 'Not Declared';

    // Enrollment date
    if (programDetails.start) {
        const startYear = programDetails.start;
        const startMonth = programDetails.intake === 'January' ? 'January' : 'July';
        document.getElementById('info-enrollment').textContent = `${startMonth} ${startYear}`;
    } else {
        document.getElementById('info-enrollment').textContent = 'Not Specified';
    }

    // Expected graduation (assuming 3-year program)
    if (programDetails.start) {
        const gradYear = parseInt(programDetails.start) + 3;
        document.getElementById('info-graduation').textContent = `May ${gradYear}`;
    } else {
        document.getElementById('info-graduation').textContent = 'Not Specified';
    }

    document.getElementById('info-advisor').textContent =
        'To be assigned'; // This would come from the system

    // Emergency Contact (from application or defaults)
    // Note: You might want to add emergency contact fields to your application form
    document.getElementById('info-emergency-name').textContent =
        'Not Provided';
    document.getElementById('info-emergency-relation').textContent =
        'Not Provided';
    document.getElementById('info-emergency-phone').textContent =
        'Not Provided';
    document.getElementById('info-emergency-email').textContent =
        'Not Provided';
}

function loadProfileStats() {
    // Get selected courses from localStorage
    const courseSelection = JSON.parse(localStorage.getItem('courseSelection') || '{}');
    const selectedCourses = courseSelection.courses || [];

    // Get program info for semester calculation
    const completeApplication = JSON.parse(localStorage.getItem('completeApplication') || '{}');
    const programDetails = completeApplication.programDetails || {};

    // Update stats based on actual data
    document.getElementById('stat-courses').textContent = selectedCourses.length;
    document.getElementById('stat-credits').textContent = calculateTotalCredits(selectedCourses);
    document.getElementById('stat-semester').textContent = calculateCurrentSemester(programDetails);

    // Calculate GPA from grades if available
    const gpa = calculateGPAFromSelectedCourses(selectedCourses);
    document.getElementById('stat-gpa').textContent = gpa.toFixed(1);
}

function calculateTotalCredits(courses) {
    return courses.reduce((total, course) => total + (course.credits || 0), 0);
}

function calculateCurrentSemester(programDetails) {
    if (!programDetails.start) return '1st';

    const startYear = parseInt(programDetails.start);
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth(); // 0-11 (Jan-Dec)

    let semester = (currentYear - startYear) * 2 + 1; // Start with first semester

    // Adjust for second semester (July-December)
    if (currentMonth >= 6) { // July is month 6
        semester += 1;
    }

    // Add ordinal suffix
    const suffixes = ['th', 'st', 'nd', 'rd'];
    const relevantDigits = semester < 30 ? semester : semester % 30;
    const suffix = relevantDigits <= 3 ? suffixes[relevantDigits] : suffixes[0];

    return semester + suffix;
}

function calculateGPAFromSelectedCourses(selectedCourses) {
    if (selectedCourses.length === 0) return 0.0;

    // Generate realistic GPA based on course types
    let totalPoints = 0;
    let totalCredits = 0;

    selectedCourses.forEach(course => {
        const credits = course.credits || 3;
        // Generate grade points based on course code pattern
        const gradePoints = generateGradePoints(course.code);

        totalPoints += gradePoints * credits;
        totalCredits += credits;
    });

    return totalCredits > 0 ? totalPoints / totalCredits : 0.0;
}

function generateGradePoints(courseCode) {
    // Generate realistic grade points based on course patterns
    const gradePatterns = {
        // CS courses - slightly harder
        'CS101': 3.3, 'CS102': 3.0, 'CS103': 3.7, 'CS104': 3.3,
        // MATH courses - good performance
        'MATH101': 4.0, 'MATH102': 3.7, 'MATH103': 3.3, 'MATH104': 4.0,
        // CSMATH combined courses
        'CSMATH101': 3.7, 'CSMATH102': 3.3, 'CSMATH103': 4.0,
        // Business courses
        'BUS101': 4.0, 'BUS102': 3.7, 'BUS103': 3.3, 'BUS104': 4.0,
        // Psychology courses
        'PSY101': 4.0, 'PSY102': 3.7, 'PSY103': 3.3, 'PSY104': 4.0,
        // General education - good performance
        'GEN101': 4.0, 'GEN102': 3.7, 'GEN103': 3.3, 'GEN104': 4.0, 'GEN105': 3.7, 'GEN106': 3.3
    };

    return gradePatterns[courseCode] || 3.5; // Default to B+ average
}

function loadProfilePicture() {
    const savedImage = localStorage.getItem('profileImage');
    const profileImage = document.getElementById('profile-output');
    const profilePicWrapper = document.querySelector('.profile-pic-wrapper');

    if (savedImage) {
        profileImage.src = savedImage;
        profileImage.style.display = 'block';
        profilePicWrapper.classList.add('has-image');
    }
}

function previewImage(event) {
    const input = event.target;
    const file = input.files[0];

    if (!file) return;

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
        showNotification('File size too large. Please choose an image under 5MB.', 'error');
        return;
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
        showNotification('Please select a valid image file.', 'error');
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        const profileImage = document.getElementById('profile-output');
        const profilePicWrapper = document.querySelector('.profile-pic-wrapper');

        profileImage.src = e.target.result;
        profileImage.style.display = 'block';
        profilePicWrapper.classList.add('has-image');

        // Save to localStorage
        localStorage.setItem('profileImage', e.target.result);

        // Show success message
        showNotification('Profile picture updated successfully!', 'success');
    };

    reader.readAsDataURL(file);
}

function changePassword() {
    const currentPassword = prompt('Enter your current password:');
    if (!currentPassword) return;

    // Verify current password (in a real app, this would check against the server)
    const completeApplication = JSON.parse(localStorage.getItem('completeApplication') || '{}');
    const storedPassword = completeApplication.password;

    if (currentPassword !== storedPassword) {
        showNotification('Current password is incorrect.', 'error');
        return;
    }

    const newPassword = prompt('Enter your new password:');
    if (!newPassword) return;

    const confirmPassword = prompt('Confirm your new password:');
    if (!confirmPassword) return;

    if (newPassword !== confirmPassword) {
        showNotification('New passwords do not match.', 'error');
        return;
    }

    if (newPassword.length < 8) {
        showNotification('Password must be at least 8 characters long.', 'error');
        return;
    }

    // Update password in localStorage
    completeApplication.password = newPassword;
    localStorage.setItem('completeApplication', JSON.stringify(completeApplication));

    showNotification('Password changed successfully!', 'success');
}

function editSection(section) {
    const sectionTitles = {
        'personal': 'Personal Information',
        'academic': 'Academic Information',
        'emergency': 'Emergency Contact'
    };

    // For demo purposes, show what would be editable
    const editableFields = {
        'personal': ['Phone Number', 'Address'],
        'academic': ['Major', 'Expected Graduation'],
        'emergency': ['Emergency Contact Details']
    };

    alert(`Edit ${sectionTitles[section]} - You can update: ${editableFields[section].join(', ')}`);
}

function showNotification(message, type) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button onclick="this.parentElement.remove()">&times;</button>
    `;

    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#2ecc71' : '#e74c3c'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        z-index: 1000;
        display: flex;
        align-items: center;
        gap: 1rem;
        animation: slideIn 0.3s ease;
    `;

    document.body.appendChild(notification);

    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// Add CSS for notification animation
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);