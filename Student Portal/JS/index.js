document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const nav = document.querySelector('.main-nav');
    const usernameSpan = document.getElementById('username-span');
    const floatingIcons = document.querySelectorAll('.floating-icons i');
    const imageContainer = document.querySelector('.image-container');

    if (mobileMenuToggle && nav) {
        mobileMenuToggle.addEventListener('click', function() {
            nav.classList.toggle('active');
        });
    }

    if (usernameSpan) {
        const userProfile = JSON.parse(sessionStorage.getItem('userProfile') || '{}');
        let username = 'Student';

        if (userProfile.personalInfo) {
            const personalInfo = userProfile.personalInfo;
            if (personalInfo.firstName) {
                username = personalInfo.firstName;
            }
        } else if (sessionStorage.getItem('currentUserId')) {
            username = sessionStorage.getItem('currentUserId');
        }

        usernameSpan.textContent = username;
    }

    const currentPage = window.location.pathname.split('/').pop();
    const navLinks = document.querySelectorAll('.main-nav a');

    navLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        if (linkHref === currentPage) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    const ctaButton = document.querySelector('.cta-button');
    if (ctaButton) {
        ctaButton.addEventListener('click', function() {
            window.location.href = 'dashboard.html';
        });
    }

    if (imageContainer && floatingIcons.length > 0) {
        imageContainer.addEventListener('mouseenter', function() {
            floatingIcons.forEach(icon => {
                icon.classList.add('shake');
            });
        });

        imageContainer.addEventListener('mouseleave', function() {
            floatingIcons.forEach(icon => {
                icon.classList.remove('shake');
            });
        });
    }

    window.addEventListener('resize', function() {
        if (window.innerWidth > 768 && nav.classList.contains('active')) {
            nav.classList.remove('active');
        }
    });
});