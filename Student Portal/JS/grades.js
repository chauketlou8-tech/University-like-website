document.addEventListener('DOMContentLoaded', function() {
    const sidebar = document.getElementById('sidebar');
    const openBtn = document.getElementById('openBtn');
    const closeBtn = document.getElementById('closeBtn');
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    const semesterTabs = document.querySelectorAll('.semester-tab');
    const exportBtn = document.getElementById('export-grades');
    const printBtn = document.getElementById('print-grades');

    // Initialize grades page
    initializeGradesPage();

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

    // Semester tab functionality
    semesterTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Remove active class from all tabs
            semesterTabs.forEach(t => t.classList.remove('active'));
            // Add active class to clicked tab
            this.classList.add('active');

            // Load grades for selected semester
            const semester = this.getAttribute('data-semester');
            loadGradesForSemester(semester);
        });
    });

    // Export grades functionality
    if (exportBtn) {
        exportBtn.addEventListener('click', exportGrades);
    }

    // Print grades functionality
    if (printBtn) {
        printBtn.addEventListener('click', printGrades);
    }

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

function initializeGradesPage() {
    // Load grades based on selected courses
    loadSelectedCoursesGrades();

    // Initialize grade distribution chart
    initializeGradeDistribution();

    // Animate progress bars
    animateProgressBars();
}

function loadSelectedCoursesGrades() {
    const gradesTableBody = document.getElementById('grades-table-body');

    // Get selected courses from localStorage
    const courseSelection = JSON.parse(localStorage.getItem('courseSelection') || '{}');
    const selectedCourses = courseSelection.courses || [];

    if (selectedCourses.length === 0) {
        gradesTableBody.innerHTML = `
            <tr>
                <td colspan="7" style="text-align: center; padding: 2rem; color: #666;">
                    <i class="fas fa-info-circle" style="font-size: 2rem; margin-bottom: 1rem; display: block; color: #ddd;"></i>
                    No courses selected yet. <a href="../course-selection.html" style="color: var(--primary);">Select your courses</a> to see grades here.
                </td>
            </tr>
        `;

        // Update overview statistics for no courses
        updateGradeStatistics([]);
        return;
    }

    // Generate grades for selected courses
    const grades = generateGradesForCourses(selectedCourses);

    // Populate grades table
    gradesTableBody.innerHTML = grades.map(grade => `
        <tr>
            <td>${grade.code}</td>
            <td>${grade.name}</td>
            <td>${grade.instructor}</td>
            <td>${grade.credits}</td>
            <td>
                <span class="grade-badge grade-${grade.grade.toLowerCase()}">
                    ${grade.grade}
                </span>
            </td>
            <td>${grade.points}</td>
            <td>
                <span class="status-badge status-${grade.status}">
                    ${grade.status.charAt(0).toUpperCase() + grade.status.slice(1)}
                </span>
            </td>
        </tr>
    `).join('');

    // Update overview statistics
    updateGradeStatistics(grades);
}

function generateGradesForCourses(selectedCourses) {
    // Grade patterns that will calculate to approximately 3.6 GPA
    const gradePatterns = {
        // CS courses
        'CS101': { grade: 'A-', points: 3.7 },
        'CS102': { grade: 'B+', points: 3.3 },
        'CS103': { grade: 'A', points: 4.0 },
        'CS104': { grade: 'B+', points: 3.3 },

        // MATH courses
        'MATH101': { grade: 'A', points: 4.0 },
        'MATH102': { grade: 'B+', points: 3.3 },
        'MATH103': { grade: 'A-', points: 3.7 },
        'MATH104': { grade: 'A', points: 4.0 },

        // CSMATH combined courses
        'CSMATH101': { grade: 'A-', points: 3.7 },
        'CSMATH102': { grade: 'B+', points: 3.3 },
        'CSMATH103': { grade: 'A', points: 4.0 },

        // Business courses
        'BUS101': { grade: 'A-', points: 3.7 },
        'BUS102': { grade: 'B+', points: 3.3 },
        'BUS103': { grade: 'A', points: 4.0 },
        'BUS104': { grade: 'A-', points: 3.7 },

        // Psychology courses
        'PSY101': { grade: 'A', points: 4.0 },
        'PSY102': { grade: 'A-', points: 3.7 },
        'PSY103': { grade: 'B+', points: 3.3 },
        'PSY104': { grade: 'A', points: 4.0 },

        // General education
        'GEN101': { grade: 'A', points: 4.0 },
        'GEN102': { grade: 'B+', points: 3.3 },
        'GEN103': { grade: 'A-', points: 3.7 },
        'GEN104': { grade: 'A', points: 4.0 },
        'GEN105': { grade: 'B+', points: 3.3 },
        'GEN106': { grade: 'A-', points: 3.7 }
    };

    return selectedCourses.map(course => {
        const gradeInfo = gradePatterns[course.code] || { grade: 'B+', points: 3.3 };

        return {
            code: course.code,
            name: course.name,
            instructor: course.instructor,
            credits: course.credits,
            grade: gradeInfo.grade,
            points: gradeInfo.points,
            status: 'in-progress'
        };
    });
}

function updateGradeStatistics(grades) {
    if (grades.length === 0) {
        // No courses selected
        document.getElementById('completed-courses').textContent = '0';
        document.getElementById('average-grade').textContent = '0%';
        document.getElementById('honor-roll').textContent = 'No';
        document.getElementById('current-gpa').textContent = '0.00';
        return;
    }

    const completedCourses = 0; // All current courses are in progress
    const averageGrade = calculateAverageGrade(grades);
    const gpa = calculateGPA(grades);
    const honorRoll = gpa >= 3.5;

    // Update DOM elements
    document.getElementById('completed-courses').textContent = completedCourses.toString();
    document.getElementById('average-grade').textContent = averageGrade + '%';
    document.getElementById('honor-roll').textContent = honorRoll ? 'Yes' : 'No';
    document.getElementById('current-gpa').textContent = gpa.toFixed(2);

    // Update academic progress based on selected courses
    updateAcademicProgress(grades);
}

function calculateAverageGrade(grades) {
    if (grades.length === 0) return 0;

    const gradePoints = {
        'A': 95, 'A-': 90, 'B+': 87, 'B': 83, 'B-': 80,
        'C+': 77, 'C': 73, 'C-': 70, 'D+': 67, 'D': 63, 'F': 0
    };

    const total = grades.reduce((sum, grade) => sum + (gradePoints[grade.grade] || 0), 0);
    return Math.round(total / grades.length);
}

function calculateGPA(grades) {
    if (grades.length === 0) return 0;

    const totalPoints = grades.reduce((sum, grade) => sum + (grade.points * grade.credits), 0);
    const totalCredits = grades.reduce((sum, grade) => sum + grade.credits, 0);

    const calculatedGPA = totalPoints / totalCredits;

    // Round to 2 decimal places for consistency
    return Math.round(calculatedGPA * 100) / 100;
}

function updateAcademicProgress(grades) {
    if (grades.length === 0) {
        // Reset progress bars for no courses
        document.querySelectorAll('.progress-fill').forEach(bar => {
            bar.style.width = '0%';
        });
        document.querySelectorAll('.progress-value').forEach(value => {
            value.textContent = '0/0';
        });
        return;
    }

    const totalCredits = grades.reduce((sum, course) => sum + course.credits, 0);

    // For first semester students, progress should be minimal
    const progressItems = [
        { target: 64, current: totalCredits, label: 'Total Credits Completed' },
        { target: 40, current: Math.min(totalCredits, 40), label: 'Core Requirements' },
        { target: 20, current: Math.max(0, totalCredits - 40), label: 'Electives' }
    ];

    document.querySelectorAll('.progress-item').forEach((item, index) => {
        if (progressItems[index]) {
            const progress = progressItems[index];
            const percentage = (progress.current / progress.target) * 100;

            const fill = item.querySelector('.progress-fill');
            const value = item.querySelector('.progress-value');

            if (fill) fill.style.width = Math.min(percentage, 100) + '%';
            if (value) value.textContent = `${progress.current}/${progress.target}`;
        }
    });
}

function initializeGradeDistribution() {
    const distributionChart = document.getElementById('distribution-chart');

    // Get selected courses
    const courseSelection = JSON.parse(localStorage.getItem('courseSelection') || '{}');
    const selectedCourses = courseSelection.courses || [];

    if (selectedCourses.length === 0) {
        distributionChart.innerHTML = `
            <div style="text-align: center; padding: 2rem; color: #666;">
                <i class="fas fa-chart-bar" style="font-size: 2rem; margin-bottom: 1rem; display: block; color: #ddd;"></i>
                No grade distribution available. Select courses to see statistics.
            </div>
        `;
        return;
    }

    // Distribution that matches 3.6 GPA pattern
    const grades = ['A', 'B', 'C', 'D', 'F'];
    const distribution = [35, 45, 15, 4, 1]; // Matches 3.6 GPA

    distributionChart.innerHTML = grades.map((grade, index) => `
        <div class="distribution-bar">
            <div class="bar-container">
                <div class="bar-fill grade-${grade.toLowerCase()}" 
                     style="height: ${distribution[index]}%"></div>
            </div>
            <span class="bar-label">${grade}</span>
            <span class="bar-count">${distribution[index]}%</span>
        </div>
    `).join('');
}

function loadGradesForSemester(semester) {
    const gradesTableBody = document.getElementById('grades-table-body');

    gradesTableBody.innerHTML = `
        <tr>
            <td colspan="7" style="text-align: center; padding: 2rem; color: #666;">
                <i class="fas fa-spinner fa-spin" style="font-size: 1.5rem; margin-bottom: 1rem; display: block;"></i>
                Loading ${semester.replace('-', ' ')} grades...
            </td>
        </tr>
    `;

    // Simulate API call delay
    setTimeout(() => {
        if (semester === 'current') {
            loadSelectedCoursesGrades();
        } else {
            // For first semester students, no past grades exist
            displayNoPastGrades(semester);
        }
    }, 1000);
}

function displayNoPastGrades(semester) {
    const gradesTableBody = document.getElementById('grades-table-body');

    gradesTableBody.innerHTML = `
        <tr>
            <td colspan="7" style="text-align: center; padding: 2rem; color: #666;">
                <i class="fas fa-calendar-times" style="font-size: 2rem; margin-bottom: 1rem; display: block; color: #ddd;"></i>
                No grades available for ${semester.replace('-', ' ')}. 
                <br><small>This is your first semester.</small>
            </td>
        </tr>
    `;

    // Reset statistics for past semesters
    document.getElementById('completed-courses').textContent = '0';
    document.getElementById('average-grade').textContent = '0%';
    document.getElementById('honor-roll').textContent = 'No';
    document.getElementById('current-gpa').textContent = '0.00';

    // Reset progress bars
    document.querySelectorAll('.progress-fill').forEach(bar => {
        bar.style.width = '0%';
    });
    document.querySelectorAll('.progress-value').forEach(value => {
        value.textContent = '0/0';
    });
}

function exportGrades() {
    alert('Grade export functionality would generate a CSV/PDF file with your academic transcript.');
}

function printGrades() {
    window.print();
}

function animateProgressBars() {
    const progressBars = document.querySelectorAll('.progress-fill');
    progressBars.forEach(bar => {
        const width = bar.style.width;
        bar.style.width = '0';
        setTimeout(() => {
            bar.style.width = width;
        }, 500);
    });
}