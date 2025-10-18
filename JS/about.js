// JavaScript for About Page Interactivity
document.addEventListener('DOMContentLoaded', function() {
    // Leader Modal Functionality
    const leaderButtons = document.querySelectorAll('.leader-btn');
    const leaderModal = document.getElementById('leaderModal');
    const modalClose = document.getElementById('modalClose');
    const modalBody = document.getElementById('modalBody');

    // Leader data
    const leaders = {
        john: {
            name: "John Smith",
            role: "President",
            bio: "With over 20 years of experience in academic leadership, Dr. John Smith has been instrumental in shaping the university's strategic direction. Under his leadership, the university has seen unprecedented growth in research funding and student enrollment.",
            education: "Ph.D. in Educational Leadership, Harvard University",
            tenure: "President since 2018",
            email: "john.smith@university.edu"
        },
        jane: {
            name: "Jane Doe",
            role: "Provost",
            bio: "Dr. Jane Doe brings extensive experience in curriculum development and academic innovation. She has successfully implemented numerous initiatives that enhance student learning outcomes and faculty development.",
            education: "Ed.D. in Higher Education Administration, Stanford University",
            tenure: "Provost since 2019",
            email: "jane.doe@university.edu"
        },
        michael: {
            name: "Michael Johnson",
            role: "Dean of Faculty",
            bio: "As Dean of Faculty, Dr. Michael Johnson oversees all academic departments and promotes excellence in teaching and research. He has been recognized nationally for his contributions to faculty development.",
            education: "Ph.D. in Sociology, University of Chicago",
            tenure: "Dean since 2015",
            email: "michael.johnson@university.edu"
        },
        emily: {
            name: "Emily Davis",
            role: "Treasurer",
            bio: "Emily Davis brings over 15 years of financial management experience to her role as University Treasurer. She has successfully managed the university's endowment growth and infrastructure investments.",
            education: "MBA in Finance, Wharton School of Business",
            tenure: "Treasurer since 2020",
            email: "emily.davis@university.edu"
        }
    };

    // Open modal when leader button is clicked
    leaderButtons.forEach(button => {
        button.addEventListener('click', function() {
            const leaderId = this.getAttribute('data-leader');
            const leader = leaders[leaderId];

            if (leader) {
                modalBody.innerHTML = `
                    <div class="modal-leader">
                        <h3>${leader.name}</h3>
                        <p class="modal-role">${leader.role}</p>
                        <div class="modal-bio">
                            <p>${leader.bio}</p>
                        </div>
                        <div class="modal-details">
                            <div class="detail-item">
                                <strong>Education:</strong>
                                <span>${leader.education}</span>
                            </div>
                            <div class="detail-item">
                                <strong>Tenure:</strong>
                                <span>${leader.tenure}</span>
                            </div>
                            <div class="detail-item">
                                <strong>Email:</strong>
                                <a href="mailto:${leader.email}">${leader.email}</a>
                            </div>
                        </div>
                    </div>
                `;

                leaderModal.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    });

    // Close modal functionality
    function closeModal() {
        leaderModal.classList.remove('active');
        document.body.style.overflow = '';
    }

    modalClose.addEventListener('click', closeModal);

    // Close modal when clicking outside
    leaderModal.addEventListener('click', function(e) {
        if (e.target === leaderModal) {
            closeModal();
        }
    });

    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && leaderModal.classList.contains('active')) {
            closeModal();
        }
    });

    // Animated counter for statistics
    const statNumbers = document.querySelectorAll('.stat-number');

    function animateCounter(element, target) {
        let current = 0;
        const increment = target / 100;
        const duration = 2000; // 2 seconds
        const stepTime = duration / 100;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                element.textContent = target;
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current);
            }
        }, stepTime);
    }

    // Intersection Observer for counter animation
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.getAttribute('data-target'));
                animateCounter(entry.target, target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    statNumbers.forEach(stat => {
        observer.observe(stat);
    });

    // Add CSS for modal details
    const style = document.createElement('style');
    style.textContent = `
        .modal-leader h3 {
            font-size: 2rem;
            margin-bottom: 0.5rem;
            color: var(--text-color);
        }
        
        .modal-role {
            color: var(--primary-color);
            font-size: 1.2rem;
            font-weight: 500;
            margin-bottom: 1.5rem;
        }
        
        .modal-bio {
            margin-bottom: 2rem;
        }
        
        .modal-bio p {
            line-height: 1.7;
            color: var(--text-light);
        }
        
        .modal-details {
            border-top: 1px solid #eee;
            padding-top: 1.5rem;
        }
        
        .detail-item {
            margin-bottom: 1rem;
            display: flex;
            flex-wrap: wrap;
        }
        
        .detail-item strong {
            min-width: 100px;
            color: var(--text-color);
        }
        
        .detail-item span,
        .detail-item a {
            color: var(--text-light);
            text-decoration: none;
        }
        
        .detail-item a:hover {
            color: var(--primary-color);
        }
        
        @media (max-width: 768px) {
            .modal-leader h3 {
                font-size: 1.5rem;
            }
            
            .detail-item {
                flex-direction: column;
            }
            
            .detail-item strong {
                margin-bottom: 0.25rem;
            }
        }
    `;
    document.head.appendChild(style);
});