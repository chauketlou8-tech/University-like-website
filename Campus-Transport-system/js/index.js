// JS/script.js
document.addEventListener('DOMContentLoaded', function() {
    // Mobile Navigation Toggle
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');

    if (navToggle) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            this.classList.toggle('active');
        });
    }

    // Close mobile menu when clicking on a link
    const navLinks = document.querySelectorAll('.nav-menu a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        });
    });

    // View Map Button Functionality
    const viewMapBtn = document.getElementById('viewMapBtn');
    if (viewMapBtn) {
        viewMapBtn.addEventListener('click', function() {
            alert('This would open the full interactive campus map in a real implementation.');
            window.location.href="Routes.html";
        });
    }

    // Simulate Live Shuttle Updates
    function updateShuttleStatus() {
        const shuttleStatuses = document.querySelectorAll('.shuttle-status');

        shuttleStatuses.forEach(status => {
            if (Math.random() > 0.7) {
                if (status.classList.contains('on-time')) {
                    status.classList.remove('on-time');
                    status.classList.add('delayed');
                    status.textContent = 'Delayed ' + (Math.floor(Math.random() * 10) + 1) + ' min';
                } else {
                    status.classList.remove('delayed');
                    status.classList.add('on-time');
                    status.textContent = 'On Time';
                }
            }
        });
    }

    // Update shuttle status every 30 seconds
    setInterval(updateShuttleStatus, 30000);

    // Add animation to feature cards on scroll
    const featureCards = document.querySelectorAll('.feature-card');

    function checkScroll() {
        featureCards.forEach(card => {
            const cardTop = card.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;

            if (cardTop < windowHeight - 100) {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }
        });
    }

    // Initialize feature cards with hidden state
    featureCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    });

    // Check scroll position on load and scroll
    window.addEventListener('load', checkScroll);
    window.addEventListener('scroll', checkScroll);

    // Add active state to current page in navigation
    const currentPage = window.location.pathname.split('/').pop();
    const navLinksArray = Array.from(navLinks);

    navLinksArray.forEach(link => {
        const linkHref = link.getAttribute('href');
        if (linkHref === currentPage || (currentPage === '' && linkHref === 'index.html')) {
            link.classList.add('active');
        }
    });
});

const yearSpan = document.getElementById('year');
yearSpan.innerText = new Date().getFullYear().toString();