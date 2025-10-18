// js/fares.js
document.addEventListener('DOMContentLoaded', function() {
    // Global variables
    let faresData = null;

    // DOM Elements
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const singleFaresBody = document.getElementById('singleFaresBody');
    const passesGrid = document.getElementById('passesGrid');

    // Initialize fares system
    initFaresSystem();

    // Mobile Navigation Toggle
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

    // Main initialization function
    async function initFaresSystem() {
        try {
            await loadFaresData();
            renderSingleFares();
            renderTransportPasses();
            console.log('Fares system initialized successfully');
        } catch (error) {
            console.error('Error initializing fares system:', error);
            showNotification('Error loading fares data', 'error');
        }
    }

    // Load fares data
    async function loadFaresData() {
        try {
            // In a real application, this would fetch from an API
            faresData = {
                singleFares: [
                    {
                        routeType: "Campus Routes",
                        description: "Upper Campus Loop, Middle Campus Express",
                        standardFare: 15.00,
                        studentFare: 7.50,
                        staffFare: 10.50
                    },
                    {
                        routeType: "Residence Routes",
                        description: "Residence Halls Circuit",
                        standardFare: 12.00,
                        studentFare: 6.00,
                        staffFare: 8.40
                    },
                    {
                        routeType: "Express Routes",
                        description: "Breakfast Express, Direct Services",
                        standardFare: 18.00,
                        studentFare: 9.00,
                        staffFare: 12.60
                    },
                    {
                        routeType: "City Routes",
                        description: "Lower Campus Connector, Hiddingh Campus",
                        standardFare: 25.00,
                        studentFare: 12.50,
                        staffFare: 17.50
                    },
                    {
                        routeType: "Night Service",
                        description: "After-hours campus service (8PM-11PM)",
                        standardFare: 20.00,
                        studentFare: 10.00,
                        staffFare: 14.00
                    }
                ],
                transportPasses: [
                    {
                        id: "weekly-student",
                        name: "Weekly Student Pass",
                        duration: "7 days",
                        price: 75.00,
                        originalPrice: 105.00,
                        features: [
                            "Unlimited campus travel",
                            "All route types included",
                            "Night service access",
                            "Mobile app integration"
                        ],
                        type: "student",
                        popular: false
                    },
                    {
                        id: "weekly-staff",
                        name: "Weekly Staff Pass",
                        duration: "7 days",
                        price: 105.00,
                        originalPrice: 147.00,
                        features: [
                            "Unlimited campus travel",
                            "All route types included",
                            "Priority boarding",
                            "Mobile app integration"
                        ],
                        type: "staff",
                        popular: false
                    },
                    {
                        id: "monthly-student",
                        name: "Monthly Student Pass",
                        duration: "30 days",
                        price: 250.00,
                        originalPrice: 450.00,
                        features: [
                            "Unlimited campus travel",
                            "All route types included",
                            "Night service access",
                            "Mobile app integration",
                            "Free pass protection"
                        ],
                        type: "student",
                        popular: true
                    },
                    {
                        id: "monthly-staff",
                        name: "Monthly Staff Pass",
                        duration: "30 days",
                        price: 350.00,
                        originalPrice: 630.00,
                        features: [
                            "Unlimited campus travel",
                            "All route types included",
                            "Priority boarding",
                            "Mobile app integration",
                            "Free pass protection"
                        ],
                        type: "staff",
                        popular: false
                    },
                    {
                        id: "semester-student",
                        name: "Semester Student Pass",
                        duration: "4 months",
                        price: 800.00,
                        originalPrice: 1800.00,
                        features: [
                            "Unlimited campus travel",
                            "All route types included",
                            "Night service access",
                            "Mobile app integration",
                            "Free pass protection",
                            "Guest pass (2 rides/month)"
                        ],
                        type: "student",
                        popular: false
                    },
                    {
                        id: "annual-staff",
                        name: "Annual Staff Pass",
                        duration: "12 months",
                        price: 3500.00,
                        originalPrice: 7560.00,
                        features: [
                            "Unlimited campus travel",
                            "All route types included",
                            "Priority boarding",
                            "Mobile app integration",
                            "Free pass protection",
                            "Guest passes (4 rides/month)",
                            "Parking discount"
                        ],
                        type: "staff",
                        popular: false
                    }
                ],
                paymentMethods: [
                    {
                        name: "Student Card",
                        description: "Load credit onto your student card at campus kiosks",
                        icon: "id-card"
                    },
                    {
                        name: "Mobile Money",
                        description: "Pay with SnapScan, Zapper, or other mobile payment apps",
                        icon: "mobile-alt"
                    },
                    {
                        name: "Credit/Debit",
                        description: "Secure online payments for passes and top-ups",
                        icon: "credit-card"
                    },
                    {
                        name: "Cash",
                        description: "Exact change required when paying cash on shuttle",
                        icon: "money-bill-wave"
                    }
                ]
            };

            console.log('Fares data loaded successfully');

        } catch (error) {
            console.error('Error loading fares data:', error);
            throw error;
        }
    }

    // Render single fares table
    function renderSingleFares() {
        if (!faresData.singleFares) return;

        let faresHTML = '';

        faresData.singleFares.forEach(fare => {
            faresHTML += `
                <div class="fare-row">
                    <div class="route-col">
                        <div class="route-type">${fare.routeType}</div>
                        <div class="route-description">${fare.description}</div>
                    </div>
                    <div class="fare-col">
                        <div class="fare-amount">R${fare.standardFare.toFixed(2)}</div>
                    </div>
                    <div class="student-col">
                        <div class="student-fare">R${fare.studentFare.toFixed(2)}</div>
                    </div>
                    <div class="staff-col">
                        <div class="staff-fare">R${fare.staffFare.toFixed(2)}</div>
                    </div>
                </div>
            `;
        });

        singleFaresBody.innerHTML = faresHTML;
    }

    // Render transport passes
    function renderTransportPasses() {
        if (!faresData.transportPasses) return;

        let passesHTML = '';

        faresData.transportPasses.forEach(pass => {
            const savings = pass.originalPrice - pass.price;
            const savingsPercentage = Math.round((savings / pass.originalPrice) * 100);

            passesHTML += `
                <div class="pass-card ${pass.popular ? 'popular' : ''}">
                    ${pass.popular ? '<div class="popular-badge">Best Value</div>' : ''}
                    
                    <div class="pass-header">
                        <div class="pass-name">${pass.name}</div>
                        <div class="pass-duration">${pass.duration}</div>
                    </div>
                    
                    <div class="pass-price">
                        <div class="price-amount">R${pass.price.toFixed(2)}</div>
                        <div class="price-period">per pass</div>
                    </div>
                    
                    <div class="pass-features">
                        <ul>
                            ${pass.features.map(feature => `<li>${feature}</li>`).join('')}
                        </ul>
                    </div>
                    
                    <div class="pass-actions">
                        <div class="savings-badge">
                            Save ${savingsPercentage}% (R${savings.toFixed(2)})
                        </div>
                        <button class="btn-primary" style="width: 100%;" onclick="purchasePass('${pass.id}')">
                            <i class="fas fa-shopping-cart"></i> Purchase Pass
                        </button>
                    </div>
                </div>
            `;
        });

        passesGrid.innerHTML = passesHTML;
    }

    // Purchase pass function
    function purchasePass(passId) {
        const pass = faresData.transportPasses.find(p => p.id === passId);
        if (!pass) return;

        // In a real application, this would redirect to a purchase page
        showNotification(`Redirecting to purchase: ${pass.name}`, 'info');

        // Simulate purchase process
        setTimeout(() => {
            showNotification(`Successfully purchased ${pass.name} for R${pass.price.toFixed(2)}`, 'success');
        }, 2000);
    }

    // Show notification
    function showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notification => {
            notification.remove();
        });

        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        `;

        // Add styles if not already added
        if (!document.querySelector('#notification-styles')) {
            const styles = document.createElement('style');
            styles.id = 'notification-styles';
            styles.textContent = `
                .notification {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    padding: 15px 20px;
                    border-radius: 5px;
                    color: white;
                    z-index: 10000;
                    max-width: 400px;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    animation: slideInRight 0.3s ease-out;
                }
                .notification-success { background: #28a745; }
                .notification-error { background: #dc3545; }
                .notification-warning { background: #ffc107; color: #333; }
                .notification-info { background: #17a2b8; }
                .notification-close {
                    background: none;
                    border: none;
                    color: inherit;
                    font-size: 1.2rem;
                    cursor: pointer;
                    margin-left: 15px;
                }
                @keyframes slideInRight {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
            `;
            document.head.appendChild(styles);
        }

        // Add close functionality
        notification.querySelector('.notification-close').addEventListener('click', function() {
            notification.remove();
        });

        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);

        document.body.appendChild(notification);
    }

    // Make functions globally available
    window.purchasePass = purchasePass;
});

const yearSpan = document.getElementById('year');
yearSpan.innerText = new Date().getFullYear().toString();