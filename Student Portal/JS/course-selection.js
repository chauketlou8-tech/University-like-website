// Global variables
let courseData = null;
let selectedCourses = [];

document.addEventListener('DOMContentLoaded', function() {
    initializePage();
});

async function initializePage() {
    // Check if application is complete
    if (!hasCompleteApplication()) {
        alert('Please complete your application first.');
        window.location.href = 'application.html';
        return;
    }

    // Load course data first
    await loadCourseData();

    // Then load the program courses
    loadProgramCourses();

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

    // Add event listeners for buttons
    document.getElementById('submit-selection').addEventListener('click', submitCourseSelection);
    document.getElementById('reset-selection').addEventListener('click', resetCourseSelection);
}

function hasCompleteApplication() {
    const completeApplication = localStorage.getItem("completeApplication");
    console.log('completeApplication value:', completeApplication);
    return completeApplication !== null && completeApplication !== "false";
}

async function loadCourseData() {
    try {
        const response = await fetch('data/courses.json');
        if (!response.ok) {
            throw new Error('Failed to load course data');
        }
        courseData = await response.json();
        console.log('Course data loaded:', courseData);
    } catch (error) {
        console.error('Error loading course data:', error);
        // Fallback to empty data structure
        courseData = {
            programs: {},
            "general-education": []
        };
    }
}

function loadProgramCourses() {
    if (!courseData) {
        console.error('Course data not loaded yet');
        return;
    }

    const programDisplay = document.getElementById('program-display');
    const primaryCoursesContainer = document.getElementById('primary-courses');
    const secondaryCoursesContainer = document.getElementById('secondary-courses');
    const generalCoursesContainer = document.getElementById('general-courses');

    // Get program choices from completeApplication
    const completeApplication = JSON.parse(localStorage.getItem("completeApplication") || "{}");
    console.log('Complete application data:', completeApplication);

    const programDetails = completeApplication.programDetails || {};
    const major = programDetails.major || '';
    const secondChoice = programDetails.second || '';

    console.log('Found major:', major, 'secondChoice:', secondChoice);

    // Convert program names to course data keys
    const programKeyMap = {
        'Computer Science': 'computer-science',
        'Mathematics': 'mathematics',
        'Computer Science & Mathematics': 'computer-science-mathematics',
        'Business Administration': 'business-administration',
        'Psychology': 'psychology'
    };

    const majorKey = programKeyMap[major] || '';
    const secondChoiceKey = programKeyMap[secondChoice] || '';

    console.log('Converted major key:', majorKey, 'secondChoice key:', secondChoiceKey);

    // Update program display
    if (programDisplay) {
        let displayText = major || 'Not Selected';
        if (secondChoice) {
            displayText += ` / ${secondChoice}`;
        }
        programDisplay.textContent = displayText;
    }

    // Load courses for primary program
    const primaryCourses = getFirstYearCoursesByProgram(majorKey);
    console.log('Primary courses for', majorKey, ':', primaryCourses);
    if (primaryCourses.length > 0) {
        primaryCoursesContainer.innerHTML = primaryCourses.map(course => createCourseCard(course)).join('');
    } else {
        primaryCoursesContainer.innerHTML = `
            <div class="empty-section">
                <i class="fas fa-exclamation-circle"></i>
                <p>No courses available for ${major}</p>
                <p class="small">Available program keys: ${Object.keys(courseData.programs).join(', ')}</p>
            </div>
        `;
    }

    // Load courses for secondary program
    const secondaryCourses = getFirstYearCoursesByProgram(secondChoiceKey);
    console.log('Secondary courses for', secondChoiceKey, ':', secondaryCourses);
    if (secondChoiceKey && secondaryCourses.length > 0) {
        secondaryCoursesContainer.innerHTML = secondaryCourses.map(course => createCourseCard(course)).join('');
    } else {
        const message = secondChoice ?
            `No courses available for ${secondChoice}` :
            'No secondary program selected';
        secondaryCoursesContainer.innerHTML = `
            <div class="empty-section">
                <i class="fas fa-info-circle"></i>
                <p>${message}</p>
                ${secondChoice ? `<p class="small">Available program keys: ${Object.keys(courseData.programs).join(', ')}</p>` : ''}
            </div>
        `;
    }

    // Load general education courses
    const generalCourses = getGeneralEducationCourses();
    if (generalCourses.length > 0) {
        generalCoursesContainer.innerHTML = generalCourses.map(course => createCourseCard(course)).join('');
    } else {
        generalCoursesContainer.innerHTML = '<p class="empty-message">No general education courses available.</p>';
    }

    // Add event listeners to course cards
    document.querySelectorAll('.course-card').forEach(card => {
        card.addEventListener('click', function() {
            const courseCode = this.getAttribute('data-code');
            toggleCourseSelection(courseCode);
        });
    });
}

function createCourseCard(course) {
    return `
        <div class="course-card" data-code="${course.code}">
            <div class="course-header">
                <div class="course-icon">
                    <i class="${course.icon}"></i>
                </div>
                <div class="course-info">
                    <h3>${course.name}</h3>
                    <p class="course-code">${course.code}</p>
                    <p class="course-instructor">${course.instructor}</p>
                </div>
                <div class="course-credits">${course.credits} Credits</div>
            </div>
            <div class="course-description">
                <p>${course.description}</p>
            </div>
            <div class="course-schedule">
                <span>${course.schedule}</span>
                <span>${course.prerequisites}</span>
            </div>
            <div class="course-actions">
                <button class="select-btn">Select Course</button>
            </div>
        </div>
    `;
}

function getFirstYearCoursesByProgram(programKey) {
    if (!programKey || !courseData || !courseData.programs[programKey]) {
        return [];
    }

    // Filter for first-year courses only
    return courseData.programs[programKey].filter(course => course.level === 'first-year');
}

function getGeneralEducationCourses() {
    if (!courseData || !courseData['general-education']) {
        return [];
    }

    // Filter for first-year courses only
    return courseData['general-education'].filter(course => course.level === 'first-year');
}

function toggleCourseSelection(courseCode) {
    const courseCard = document.querySelector(`.course-card[data-code="${courseCode}"]`);
    const selectBtn = courseCard.querySelector('.select-btn');
    const allCourses = getAllCourses();
    const course = allCourses.find(c => c.code === courseCode);

    if (!course) return;

    const isSelected = selectedCourses.some(c => c.code === courseCode);

    if (isSelected) {
        // Remove from selection
        selectedCourses = selectedCourses.filter(c => c.code !== courseCode);
        courseCard.classList.remove('selected');
        selectBtn.textContent = 'Select Course';
        selectBtn.classList.remove('selected');
    } else {
        // Check if we've reached the maximum
        if (selectedCourses.length >= 6) {
            alert('You can select a maximum of 6 courses.');
            return;
        }

        // Add to selection
        selectedCourses.push(course);
        courseCard.classList.add('selected');
        selectBtn.textContent = 'Selected';
        selectBtn.classList.add('selected');
    }

    updateSelectionUI();
}

function getAllCourses() {
    if (!courseData) return [];

    const completeApplication = JSON.parse(localStorage.getItem('completeApplication') || '{}');
    const programDetails = completeApplication.programDetails || {};
    const major = programDetails.major || '';
    const secondChoice = programDetails.second || '';

    // Convert program names to course data keys
    const programKeyMap = {
        'Computer Science': 'computer-science',
        'Mathematics': 'mathematics',
        'Computer Science & Mathematics': 'computer-science-mathematics',
        'Business Administration': 'business-administration',
        'Psychology': 'psychology'
    };

    const majorKey = programKeyMap[major] || '';
    const secondChoiceKey = programKeyMap[secondChoice] || '';

    const primaryCourses = getFirstYearCoursesByProgram(majorKey);
    const secondaryCourses = getFirstYearCoursesByProgram(secondChoiceKey);
    const generalCourses = getGeneralEducationCourses();

    return [...primaryCourses, ...secondaryCourses, ...generalCourses];
}

function updateSelectionUI() {
    const selectedCount = selectedCourses.length;
    const totalCredits = selectedCourses.reduce((sum, course) => sum + course.credits, 0);

    // Update counters
    document.getElementById('selected-count').textContent = selectedCount;
    document.getElementById('credit-count').textContent = totalCredits;

    // Update submit button
    const submitBtn = document.getElementById('submit-selection');
    if (selectedCount >= 4) {
        submitBtn.disabled = false;
        submitBtn.textContent = `Submit Course Selection (${selectedCount}/6)`;
    } else {
        submitBtn.disabled = true;
        submitBtn.textContent = `Submit Course Selection (${selectedCount}/4)`;
    }

    // Update selected courses list
    const selectedList = document.getElementById('selected-courses-list');
    if (selectedCount > 0) {
        selectedList.innerHTML = selectedCourses.map(course => `
            <div class="selected-course-item">
                <div class="selected-course-info">
                    <h4>${course.name}</h4>
                    <p>${course.code} | ${course.credits} Credits | ${course.schedule}</p>
                </div>
                <button class="remove-course" data-code="${course.code}">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `).join('');

        // Add event listeners to remove buttons
        document.querySelectorAll('.remove-course').forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                const code = this.getAttribute('data-code');
                toggleCourseSelection(code);
            });
        });
    } else {
        selectedList.innerHTML = '<p class="empty-message">No courses selected yet. Please select at least 4 courses.</p>';
    }
}

function submitCourseSelection() {
    if (selectedCourses.length < 4) {
        alert('Please select at least 4 courses.');
        return;
    }

    // Save selection to localStorage
    localStorage.setItem('courseSelection', JSON.stringify({
        courses: selectedCourses,
        timestamp: new Date().toISOString()
    }));

    // Show success message
    alert(`Successfully submitted ${selectedCourses.length} courses! Total credits: ${selectedCourses.reduce((sum, course) => sum + course.credits, 0)}`);

    // Redirect to courses page
    window.location.href = 'courses.html';
}

function resetCourseSelection() {
    if (confirm('Are you sure you want to reset your course selection?')) {
        selectedCourses = [];

        // Reset all course cards
        document.querySelectorAll('.course-card').forEach(card => {
            card.classList.remove('selected');
            const selectBtn = card.querySelector('.select-btn');
            selectBtn.textContent = 'Select Course';
            selectBtn.classList.remove('selected');
        });

        updateSelectionUI();
    }
}