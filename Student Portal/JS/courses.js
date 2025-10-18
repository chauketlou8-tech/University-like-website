sessionStorage.setItem("isLoggedIn", "true")

document.addEventListener('DOMContentLoaded', function() {
    // Check if courses have been selected - redirect if not
    if (!hasCourseSelection()) {
        window.location.href = 'course-selection.html';
        return;
    }

    // Load the selected courses
    loadSelectedCourses();

    // Add sidebar functionality
    const sidebar = document.getElementById('sidebar');
    const openBtn = document.getElementById('openBtn');
    const closeBtn = document.getElementById('closeBtn');

    if (openBtn) openBtn.addEventListener('click', () => sidebar.classList.add('active'));
    if (closeBtn) closeBtn.addEventListener('click', () => sidebar.classList.remove('active'));

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

    // Add event listener for select courses button
    const selectCoursesBtn = document.getElementById('select-courses-btn');
    if (selectCoursesBtn) {
        selectCoursesBtn.addEventListener('click', function() {
            window.location.href = 'course-selection.html';
        });
    }
});

function hasCourseSelection() {
    const courseSelection = JSON.parse(localStorage.getItem('courseSelection') || '{}');
    return courseSelection.courses && courseSelection.courses.length > 0;
}

function loadSelectedCourses() {
    const coursesContainer = document.getElementById('courses-container');
    const programDisplay = document.getElementById('program-display');

    // Get selected courses from localStorage
    const courseSelection = JSON.parse(localStorage.getItem('courseSelection') || '{}');
    const selectedCourses = courseSelection.courses || [];

    // Get program info from completeApplication
    const completeApplication = JSON.parse(localStorage.getItem('completeApplication') || '{}');
    const programDetails = completeApplication.programDetails || {};
    const major = programDetails.major || '';
    const secondChoice = programDetails.second || '';

    // Update program display with both primary and secondary choices
    if (programDisplay) {
        let displayText = major || 'Not Selected';
        if (secondChoice) {
            displayText += ` / ${secondChoice}`;
        }
        programDisplay.textContent = displayText;
    }

    // Display selected courses with progress
    if (selectedCourses.length === 0) {
        coursesContainer.innerHTML = `
            <div class="no-courses">
                <i class="fas fa-book-open"></i>
                <h3>No Courses Selected</h3>
                <p>You haven't selected any courses for this semester yet.</p>
                <a href="course-selection.html" class="cta-button">Select Courses Now</a>
            </div>
        `;
        return;
    }

    coursesContainer.innerHTML = selectedCourses.map(course => {
        const progress = calculateCourseProgress(course.code);

        return `
        <div class="course-card">
            <div class="course-header">
                <div class="course-icon">
                    <i class="${course.icon}"></i>
                </div>
                <div class="course-info">
                    <h3>${course.name}</h3>
                    <p class="course-code">${course.code}</p>
                    <p class="course-instructor">${course.instructor}</p>
                </div>
                <div class="course-progress-circle">
                    <div class="circle-progress" data-progress="${progress}">
                        <span>${progress}%</span>
                    </div>
                </div>
            </div>
            <div class="course-description">
                <p>${course.description}</p>
            </div>
            <div class="course-meta">
                <span class="course-credits"><i class="fas fa-credit-card"></i> ${course.credits} Credits</span>
                <span class="course-schedule"><i class="fas fa-clock"></i> ${course.schedule}</span>
            </div>
            <div class="course-actions">
                <button class="btn-outline"><i class="fas fa-book"></i> Materials</button>
                <button class="btn-outline"><i class="fas fa-tasks"></i> Assignments</button>
                <button class="btn-primary"><i class="fas fa-play"></i> Continue</button>
            </div>
        </div>
        `;
    }).join('');

    // Animate progress circles
    animateProgressCircles();
}

function calculateCourseProgress(courseCode) {
    // Simple progress calculation based on course code
    const progressMap = {
        'CS101': 65, 'CS102': 40, 'CS103': 20, 'CS104': 10,
        'MATH101': 80, 'MATH102': 55, 'MATH103': 30, 'MATH104': 15,
        'CSMATH101': 70, 'CSMATH102': 45, 'CSMATH103': 35,
        'BUS101': 60, 'BUS102': 35, 'BUS103': 25, 'BUS104': 15,
        'PSY101': 75, 'PSY102': 50, 'PSY103': 30, 'PSY104': 20,
        'GEN101': 40, 'GEN102': 55, 'GEN103': 65, 'GEN104': 30, 'GEN105': 45, 'GEN106': 25
    };

    return progressMap[courseCode] || Math.floor(Math.random() * 30) + 10;
}

function animateProgressCircles() {
    const circles = document.querySelectorAll('.circle-progress');
    circles.forEach(circle => {
        const progress = circle.getAttribute('data-progress');
        // Animate the conic gradient
        setTimeout(() => {
            circle.style.background = `conic-gradient(var(--secondary) ${progress}%, #ecf0f1 ${progress}% 100%)`;
        }, 100);
    });
}