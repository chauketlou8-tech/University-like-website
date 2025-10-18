// News Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Set current year in footer
    document.getElementById('year').textContent = new Date().getFullYear();

    // Get DOM elements
    const categoryFilter = document.getElementById('category-filter');
    const dateFilter = document.getElementById('date-filter');
    const newsSearch = document.getElementById('news-search');
    const newsGrid = document.getElementById('news-grid');
    const newsCards = document.querySelectorAll('.news-card');
    const noResults = document.getElementById('no-results');
    const resetFiltersBtn = document.getElementById('reset-filters');
    const newsletterForm = document.getElementById('newsletter-form');

    // Filter news function
    function filterNews() {
        const categoryValue = categoryFilter.value;
        const dateValue = dateFilter.value;
        const searchValue = newsSearch.value.toLowerCase();

        let visibleCount = 0;

        newsCards.forEach(card => {
            const category = card.getAttribute('data-category');
            const date = new Date(card.getAttribute('data-date'));
            const now = new Date();
            const title = card.querySelector('.news-title').textContent.toLowerCase();
            const excerpt = card.querySelector('.news-excerpt').textContent.toLowerCase();

            // Check date filter
            let dateMatch = true;
            if (dateValue !== 'all') {
                const timeDiff = now.getTime() - date.getTime();
                const daysDiff = timeDiff / (1000 * 3600 * 24);

                switch(dateValue) {
                    case 'week':
                        dateMatch = daysDiff <= 7;
                        break;
                    case 'month':
                        dateMatch = daysDiff <= 30;
                        break;
                    case 'year':
                        dateMatch = daysDiff <= 365;
                        break;
                }
            }

            // Check if news matches all filters
            const categoryMatch = categoryValue === 'all' || category === categoryValue;
            const searchMatch = searchValue === '' ||
                title.includes(searchValue) ||
                excerpt.includes(searchValue);

            // Show or hide card based on filters
            if (categoryMatch && dateMatch && searchMatch) {
                card.style.display = 'block';
                visibleCount++;
            } else {
                card.style.display = 'none';
            }
        });

        // Show no results message if no news match
        if (visibleCount === 0) {
            noResults.style.display = 'block';
            newsGrid.style.display = 'none';
        } else {
            noResults.style.display = 'none';
            newsGrid.style.display = 'grid';
        }
    }

    // Add event listeners to filters
    categoryFilter.addEventListener('change', filterNews);
    dateFilter.addEventListener('change', filterNews);
    newsSearch.addEventListener('input', filterNews);

    // Reset filters functionality
    resetFiltersBtn.addEventListener('click', function() {
        categoryFilter.value = 'all';
        dateFilter.value = 'all';
        newsSearch.value = '';
        filterNews();
    });

    // Newsletter form submission
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = document.getElementById('newsletter-email').value;

            // Simple validation
            if (email && email.includes('@')) {
                // In a real application, you would send this to a server
                alert('Thank you for subscribing to our newsletter!');
                newsletterForm.reset();
            } else {
                alert('Please enter a valid email address.');
            }
        });
    }

    // Pagination functionality
    const paginationBtns = document.querySelectorAll('.pagination-btn');
    paginationBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            if (!this.classList.contains('active')) {
                // Remove active class from all buttons
                paginationBtns.forEach(b => b.classList.remove('active'));
                // Add active class to clicked button
                this.classList.add('active');

                // In a real application, you would load the corresponding page
                // For now, we'll just show an alert
                if (this.textContent.includes('Next')) {
                    alert('Loading next page...');
                } else if (!this.textContent.includes('...')) {
                    alert(`Loading page ${this.textContent}...`);
                }
            }
        });
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
    filterNews();
});