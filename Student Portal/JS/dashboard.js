document.addEventListener('DOMContentLoaded', function() {
    const sidebar = document.getElementById('sidebar');
    const openBtn = document.getElementById('openBtn');
    const closeBtn = document.getElementById('closeBtn');
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    const dashboardUsername = document.getElementById('dashboard-username');

    // Set username from session storage
    if (dashboardUsername) {
        const userProfile = JSON.parse(sessionStorage.getItem('userProfile') || '{}');
        let username = 'Student';

        if (userProfile.personalInfo && userProfile.personalInfo.firstName) {
            username = userProfile.personalInfo.firstName;
        } else if (sessionStorage.getItem('currentUserId')) {
            username = sessionStorage.getItem('currentUserId');
        }

        dashboardUsername.textContent = username;
    }

    // Sidebar toggle functionality
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

    // Load application-based courses
    loadApplicationCourses();

    // Load program-specific events
    loadProgramEvents();

    // Add loading animation to progress bars
    const progressBars = document.querySelectorAll('.progress-fill');
    progressBars.forEach(bar => {
        const width = bar.style.width;
        bar.style.width = '0';
        setTimeout(() => {
            bar.style.width = width;
        }, 300);
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

function loadApplicationCourses() {
    const coursesContent = document.getElementById('courses-content');
    const noCoursesMessage = document.getElementById('no-courses-message');

    // Get selected courses from localStorage
    const courseSelection = JSON.parse(localStorage.getItem('courseSelection') || '{}');
    const selectedCourses = courseSelection.courses || [];

    if (selectedCourses.length === 0) {
        // No courses selected yet
        noCoursesMessage.innerHTML = `
            <p>No courses selected yet. <a href="../course-selection.html" style="color: var(--primary); text-decoration: underline;">Select your courses</a> to see them here.</p>
        `;
        noCoursesMessage.style.display = 'block';
        return;
    }

    // Hide no courses message
    noCoursesMessage.style.display = 'none';

    // Update quick stats
    updateQuickStats(selectedCourses);

    // Populate courses from localStorage
    coursesContent.innerHTML = '';
    selectedCourses.forEach(course => {
        const courseItem = createCourseItem(course);
        coursesContent.appendChild(courseItem);
    });
}

function createCourseItem(course) {
    const courseItem = document.createElement('div');
    courseItem.className = 'course-item';

    // Calculate progress based on course code
    const progress = calculateCourseProgress(course.code);

    courseItem.innerHTML = `
        <div class="course-icon">
            <i class="${course.icon}"></i>
        </div>
        <div class="course-details">
            <h4>${course.name}</h4>
            <p>${course.code} - ${course.instructor}</p>
            <div class="course-progress">
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${progress}%"></div>
                </div>
                <span>${progress}% Complete</span>
            </div>
        </div>
    `;

    return courseItem;
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

function loadProgramEvents() {
    const programEventsContainer = document.getElementById('program-events');
    const noEventsMessage = document.getElementById('no-events-message');

    // Get selected courses from localStorage
    const courseSelection = JSON.parse(localStorage.getItem('courseSelection') || '{}');
    const selectedCourses = courseSelection.courses || [];

    if (selectedCourses.length === 0 || !programEventsContainer) {
        if (noEventsMessage) {
            noEventsMessage.style.display = 'block';
        }
        return;
    }

    const programEvents = getProgramEvents(selectedCourses);

    // Clear existing program events
    programEventsContainer.innerHTML = '';

    if (programEvents.length === 0) {
        if (noEventsMessage) {
            noEventsMessage.style.display = 'block';
        }
        return;
    }

    if (noEventsMessage) {
        noEventsMessage.style.display = 'none';
    }

    programEvents.forEach(event => {
        const eventElement = document.createElement('div');
        eventElement.className = 'event-item';
        eventElement.innerHTML = `
            <div class="event-date">
                <span class="date-day">${event.day}</span>
                <span class="date-month">${event.month}</span>
            </div>
            <div class="event-details">
                <h4>${event.title}</h4>
                <p>${event.course}</p>
                <span class="event-time">${event.time}</span>
            </div>
        `;
        programEventsContainer.appendChild(eventElement);
    });
}

function getProgramEvents(selectedCourses) {
    const events = [];

    // Helper function to get month abbreviation
    const getMonthAbbr = (date) => {
        const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
        return months[date.getMonth()];
    };

    // Helper function to format time in South African format (24-hour)
    const formatSATime = (hours, minutes = 0) => {
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    };

    // Get current date for South Africa timezone
    const now = new Date();
    const southAfricaTime = new Date(now.toLocaleString("en-US", {timeZone: "Africa/Johannesburg"}));

    // Generate events only for selected courses
    selectedCourses.forEach((course, index) => {
        // Tutorial/Lab events (skip if we have too many courses)
        if (index < 3) {
            const tutorialDate = new Date(southAfricaTime);
            tutorialDate.setDate(southAfricaTime.getDate() + 2 + (index * 3));

            events.push({
                day: tutorialDate.getDate().toString(),
                month: getMonthAbbr(tutorialDate),
                title: `${course.code} Tutorial`,
                course: course.name,
                time: `${formatSATime(10 + index)} - ${formatSATime(12 + index)}`
            });
        }

        // Assignment due dates (for first 2 courses)
        if (index < 2) {
            const dueDate = new Date(southAfricaTime);
            dueDate.setDate(southAfricaTime.getDate() + 7 + (index * 2));

            events.push({
                day: dueDate.getDate().toString(),
                month: getMonthAbbr(dueDate),
                title: `${course.code} Assignment Due`,
                course: course.name,
                time: `${formatSATime(23, 59)}`
            });
        }
    });

    // Sort events by date
    events.sort((a, b) => {
        const monthOrder = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
        const aMonth = monthOrder.indexOf(a.month);
        const bMonth = monthOrder.indexOf(b.month);

        if (aMonth !== bMonth) return aMonth - bMonth;
        return parseInt(a.day) - parseInt(b.day);
    });

    // Return only the next 4 events to avoid overcrowding
    return events.slice(0, 4);
}

function updateQuickStats(selectedCourses) {
    if (selectedCourses.length === 0) return;

    // Calculate stats based on selected courses
    const pendingAssignments = selectedCourses.length * 2; // 2 assignments per course
    const studyHours = selectedCourses.length * 4; // 4 hours per course per week
    const attendanceRate = '95%'; // Default good attendance
    const completedCourses = 0; // New semester, no completed courses yet

    // Update the DOM
    const pendingAssignmentsEl = document.getElementById('pending-assignments');
    const studyHoursEl = document.getElementById('study-hours');
    const attendanceRateEl = document.getElementById('attendance-rate');
    const completedCoursesEl = document.getElementById('completed-courses');

    if (pendingAssignmentsEl) pendingAssignmentsEl.textContent = pendingAssignments.toString();
    if (studyHoursEl) studyHoursEl.textContent = studyHours.toString();
    if (attendanceRateEl) attendanceRateEl.textContent = attendanceRate;
    if (completedCoursesEl) completedCoursesEl.textContent = completedCourses.toString();
}