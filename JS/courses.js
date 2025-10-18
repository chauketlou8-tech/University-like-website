// Courses Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Set current year in footer
    document.getElementById('year').textContent = new Date().getFullYear().toString();

    // Get DOM elements
    const departmentFilter = document.getElementById('department-filter');
    const levelFilter = document.getElementById('level-filter');
    const durationFilter = document.getElementById('duration-filter');
    const courseSearch = document.getElementById('course-search');
    const coursesGrid = document.getElementById('courses-grid');
    const courseCards = document.querySelectorAll('.course-card');
    const noResults = document.getElementById('no-results');
    const resetFiltersBtn = document.getElementById('reset-filters');

    // Filter courses function
    function filterCourses() {
        const departmentValue = departmentFilter.value;
        const levelValue = levelFilter.value;
        const durationValue = durationFilter.value;
        const searchValue = courseSearch.value.toLowerCase();

        let visibleCount = 0;

        courseCards.forEach(card => {
            const department = card.getAttribute('data-department');
            const level = card.getAttribute('data-level');
            const duration = card.getAttribute('data-duration');
            const title = card.querySelector('.course-title').textContent.toLowerCase();
            const description = card.querySelector('.course-description').textContent.toLowerCase();

            // Check if course matches all filters
            const departmentMatch = departmentValue === 'all' || department === departmentValue;
            const levelMatch = levelValue === 'all' || level === levelValue;
            const durationMatch = durationValue === 'all' || duration === durationValue;
            const searchMatch = searchValue === '' ||
                title.includes(searchValue) ||
                description.includes(searchValue);

            // Show or hide card based on filters
            if (departmentMatch && levelMatch && durationMatch && searchMatch) {
                card.style.display = 'block';
                visibleCount++;
            } else {
                card.style.display = 'none';
            }
        });

        // Show no results message if no courses match
        if (visibleCount === 0) {
            noResults.style.display = 'block';
            coursesGrid.style.display = 'none';
        } else {
            noResults.style.display = 'none';
            coursesGrid.style.display = 'grid';
        }
    }

    // Add event listeners to filters
    departmentFilter.addEventListener('change', filterCourses);
    levelFilter.addEventListener('change', filterCourses);
    durationFilter.addEventListener('change', filterCourses);
    courseSearch.addEventListener('input', filterCourses);

    // Reset filters functionality
    resetFiltersBtn.addEventListener('click', function() {
        departmentFilter.value = 'all';
        levelFilter.value = 'all';
        durationFilter.value = 'all';
        courseSearch.value = '';
        filterCourses();
    });

    // Mobile navigation toggle (if not already in main JS)
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');

    if (navToggle && navLinks) {
        navToggle.addEventListener('click', function() {
            const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
            navToggle.setAttribute('aria-expanded', !isExpanded);
            navLinks.classList.toggle('active');
        });
    }

    // Initialize filter on page load
    filterCourses();
});