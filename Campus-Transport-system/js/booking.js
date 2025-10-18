document.addEventListener('DOMContentLoaded', function() {
    // Global variables
    let bookingData = null;
    let availableRoutes = [];
    let currentStep = 1;
    let selectedRoute = null;
    let selectedDateTime = null;
    let selectedSeats = 1;
    let currentBooking = null;

    // DOM Elements
    let routeSelection, datetimeSelection, seatSelection, confirmation;
    let prevBtn, nextBtn, submitBtn, bookingForm;
    let routesGrid, availableTimes, seatCounter, minusBtn, plusBtn;
    let bookingSummary, bookingDetails, currentStepElement;

    // Initialize booking system
    initBookingSystem();

    // Main initialization function
    async function initBookingSystem() {
        try {
            // First, initialize DOM elements
            initializeDOMElements();

            // Then load booking data
            await loadBookingData();

            // Initialize the booking interface
            initializeBookingInterface();

            console.log('Booking system initialized successfully');
        } catch (error) {
            console.error('Error initializing booking system:', error);
            showNotification('Error loading booking system. Please refresh the page.', 'error');
        }
    }

    // Initialize DOM elements with null checks
    function initializeDOMElements() {
        routeSelection = document.getElementById('routeSelection');
        datetimeSelection = document.getElementById('datetimeSelection');
        seatSelection = document.getElementById('seatSelection');
        confirmation = document.getElementById('confirmation');
        prevBtn = document.getElementById('prevBtn');
        nextBtn = document.getElementById('nextBtn');
        submitBtn = document.getElementById('submitBtn');
        bookingForm = document.getElementById('bookingForm');
        routesGrid = document.getElementById('routesGrid');
        availableTimes = document.getElementById('availableTimes');
        seatCounter = document.getElementById('seatCounter');
        minusBtn = document.getElementById('minusBtn');
        plusBtn = document.getElementById('plusBtn');
        bookingSummary = document.getElementById('bookingSummary');
        bookingDetails = document.getElementById('bookingDetails');
        currentStepElement = document.getElementById('currentStep');

        // Initialize event listeners only if elements exist
        initializeEventListeners();
    }

    // Initialize event listeners with null checks
    function initializeEventListeners() {
        // Mobile Navigation Toggle
        const navToggle = document.getElementById('navToggle');
        const navMenu = document.getElementById('navMenu');

        if (navToggle && navMenu) {
            navToggle.addEventListener('click', function() {
                navMenu.classList.toggle('active');
                this.classList.toggle('active');
            });
        }

        // Close mobile menu when clicking on a link
        const navLinks = document.querySelectorAll('.nav-menu a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (navMenu) navMenu.classList.remove('active');
                if (navToggle) navToggle.classList.remove('active');
            });
        });

        // Booking system event listeners
        if (prevBtn) prevBtn.addEventListener('click', goToPreviousStep);
        if (nextBtn) nextBtn.addEventListener('click', goToNextStep);
        if (submitBtn) submitBtn.addEventListener('click', submitBooking);
        if (minusBtn) minusBtn.addEventListener('click', decreaseSeats);
        if (plusBtn) plusBtn.addEventListener('click', increaseSeats);
        if (bookingForm) bookingForm.addEventListener('submit', handleFormSubmit);
    }

    // Load booking data from JSON file
    async function loadBookingData() {
        try {
            // Try multiple possible paths for the JSON file
            const possiblePaths = [
                'data/bookings.json',
                './data/bookings.json',
                '../data/bookings.json',
                'bookings.json',
                './bookings.json'
            ];

            let response;
            for (const path of possiblePaths) {
                try {
                    console.log(`Trying to load booking data from: ${path}`);
                    response = await fetch(path);
                    if (response.ok) {
                        console.log(`Successfully loaded booking data from: ${path}`);
                        break;
                    }
                } catch (e) {
                    console.log(`Failed to load from ${path}:`, e);
                }
            }

            if (response && response.ok) {
                bookingData = await response.json();
                console.log('Booking data loaded successfully from JSON file');

                // Initialize available routes from the data
                initializeAvailableRoutes();
            } else {
                throw new Error('Could not load booking data from any known path');
            }

        } catch (error) {
            console.error('Error loading booking data:', error);

            // Fallback to default data structure
            bookingData = getFallbackData();
            initializeAvailableRoutes();
            showNotification('Using default booking data', 'warning');
        }
    }

    // Initialize available routes from booking data
    function initializeAvailableRoutes() {
        // Use route information from the JSON data structure
        availableRoutes = [
            {
                id: "upper-campus",
                name: "Upper Campus Loop",
                description: "Main campus route covering upper campus buildings including library, student union, and academic buildings",
                duration: "25 min",
                frequency: "Every 30 min",
                fare: bookingData?.fareStructure?.standardFare || 6.00,
                image: "Assets/images/route-upper.jpg",
                features: ["WiFi", "Air Conditioning", "Accessible", "Multiple Stops"]
            },
            {
                id: "middle-campus",
                name: "Middle Campus Express",
                description: "Express service between key campus locations with limited stops for faster travel",
                duration: "20 min",
                frequency: "Every 45 min",
                fare: (bookingData?.fareStructure?.standardFare || 6.00) + (bookingData?.fareStructure?.expressSurcharge || 2.00),
                image: "Assets/images/route-middle.jpg",
                features: ["Express", "WiFi", "Air Conditioning", "Fast Service"]
            },
            {
                id: "residence-circuit",
                name: "Residence Halls Circuit",
                description: "Comprehensive service connecting all student residence areas and dining halls",
                duration: "35 min",
                frequency: "Every 30 min",
                fare: bookingData?.fareStructure?.standardFare || 6.00,
                image: "Assets/images/route-residence.jpg",
                features: ["Multiple Stops", "WiFi", "Accessible", "Late Service"]
            },
            {
                id: "lower-campus",
                name: "Lower Campus Connector",
                description: "Scenic route connecting lower campus facilities with main academic buildings",
                duration: "30 min",
                frequency: "Every 60 min",
                fare: bookingData?.fareStructure?.standardFare || 6.00,
                image: "Assets/images/route-lower.jpg",
                features: ["Scenic Route", "WiFi", "Comfortable"]
            },
            {
                id: "breakfast-express",
                name: "Breakfast Express",
                description: "Early morning express service specifically for students with morning classes",
                duration: "15 min",
                frequency: "Every 20 min (6-9 AM only)",
                fare: 5.00, // Special discounted rate
                image: "Assets/images/route-breakfast.jpg",
                features: ["Early Service", "Express", "WiFi", "Quick"]
            }
        ];
    }

    // Fallback data in case JSON file is not available
    function getFallbackData() {
        return {
            "systemInfo": {
                "bookingSystem": "University Transit Booking System",
                "version": "1.0",
                "lastUpdated": "2023-10-15"
            },
            "bookings": [],
            "statistics": {
                "totalBookings": 0,
                "todayBookings": 0,
                "pendingBookings": 0,
                "confirmedBookings": 0,
                "completedBookings": 0,
                "cancelledBookings": 0,
                "totalRevenue": 0
            },
            "fareStructure": {
                "standardFare": 6.00,
                "expressSurcharge": 2.00,
                "groupDiscount": 0.10,
                "peakHourSurcharge": 1.50
            }
        };
    }

    // Initialize booking interface
    function initializeBookingInterface() {
        if (!routesGrid) {
            console.warn('Routes grid element not found');
            return;
        }

        renderRoutes();
        updateStepDisplay();
        setupDateSelection();
        updateSeatCounter();
    }

    // Render available routes
    function renderRoutes() {
        if (!routesGrid) {
            console.error('Routes grid element is null');
            return;
        }

        if (!availableRoutes || availableRoutes.length === 0) {
            routesGrid.innerHTML = `
                <div class="no-routes">
                    <i class="fas fa-route"></i>
                    <h3>No Routes Available</h3>
                    <p>We're currently updating our route schedule. Please check back later.</p>
                </div>
            `;
            return;
        }

        let routesHTML = '';

        availableRoutes.forEach(route => {
            const featuresHTML = route.features.map(feature =>
                `<span class="route-feature">${feature}</span>`
            ).join('');

            routesHTML += `
                <div class="route-card" data-route-id="${route.id}">
                    <div class="route-image">
                        <i class="fas fa-bus"></i>
                        <div class="route-overlay">
                            <button class="btn-select-route" data-route-id="${route.id}">
                                <i class="fas fa-check"></i> Select Route
                            </button>
                        </div>
                    </div>
                    <div class="route-info">
                        <h3>${route.name}</h3>
                        <p class="route-description">${route.description}</p>
                        <div class="route-details">
                            <div class="detail-item">
                                <i class="fas fa-clock"></i>
                                <span>${route.duration}</span>
                            </div>
                            <div class="detail-item">
                                <i class="fas fa-sync-alt"></i>
                                <span>${route.frequency}</span>
                            </div>
                            <div class="detail-item">
                                <i class="fas fa-tag"></i>
                                <span>R ${route.fare.toFixed(2)}</span>
                            </div>
                        </div>
                        <div class="route-features">
                            ${featuresHTML}
                        </div>
                    </div>
                </div>
            `;
        });

        routesGrid.innerHTML = routesHTML;

        // Add event listeners to route selection buttons
        document.querySelectorAll('.btn-select-route').forEach(button => {
            button.addEventListener('click', function(e) {
                e.stopPropagation();
                const routeId = this.getAttribute('data-route-id');
                selectRoute(routeId);
            });
        });

        // Also allow clicking anywhere on the card
        document.querySelectorAll('.route-card').forEach(card => {
            card.addEventListener('click', function(e) {
                if (!e.target.closest('.btn-select-route')) {
                    const routeId = this.getAttribute('data-route-id');
                    selectRoute(routeId);
                }
            });
        });
    }

    // Select a route
    function selectRoute(routeId) {
        selectedRoute = availableRoutes.find(route => route.id === routeId);

        if (selectedRoute) {
            // Update UI to show selected route
            document.querySelectorAll('.route-card').forEach(card => {
                card.classList.remove('selected');
            });

            const selectedCard = document.querySelector(`.route-card[data-route-id="${routeId}"]`);
            if (selectedCard) {
                selectedCard.classList.add('selected');
            }

            // Generate available times for the selected route
            generateAvailableTimes();

            // Enable next button if it exists
            if (nextBtn) {
                nextBtn.disabled = false;
            }

            showNotification(`Selected route: ${selectedRoute.name}`, 'success');
        }
    }

    // Generate available times for selected route
    function generateAvailableTimes() {
        if (!selectedRoute || !availableTimes) return;

        let timesHTML = '';
        const now = new Date();
        const currentHour = now.getHours();
        const currentMinute = now.getMinutes();

        // Generate times based on route type and current time
        const startHour = currentHour < 6 ? 6 : currentHour;
        const endHour = 22;
        const intervals = selectedRoute.id.includes('express') ? 15 : 30;

        let hasAvailableSlots = false;

        for (let hour = startHour; hour <= endHour; hour++) {
            for (let minute = 0; minute < 60; minute += intervals) {
                // Skip past times
                if (hour === currentHour && minute <= currentMinute) continue;

                const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
                const isAvailable = Math.random() > 0.3; // 70% chance of availability

                if (isAvailable) hasAvailableSlots = true;

                timesHTML += `
                    <div class="time-slot ${isAvailable ? 'available' : 'unavailable'}" 
                         data-time="${timeString}">
                        <span class="time">${timeString}</span>
                        <span class="availability">${isAvailable ? 'Available' : 'Full'}</span>
                    </div>
                `;
            }
        }

        if (!hasAvailableSlots) {
            timesHTML = `
                <div class="no-routes" style="grid-column: 1 / -1;">
                    <i class="fas fa-clock"></i>
                    <h3>No Available Times</h3>
                    <p>All time slots are currently booked. Please try a different date or route.</p>
                </div>
            `;
        }

        availableTimes.innerHTML = timesHTML;

        // Add event listeners to time slots
        document.querySelectorAll('.time-slot.available').forEach(slot => {
            slot.addEventListener('click', function() {
                selectTime(this.getAttribute('data-time'));
            });
        });
    }

    // Select a time
    function selectTime(time) {
        selectedDateTime = time;

        // Update UI to show selected time
        document.querySelectorAll('.time-slot').forEach(slot => {
            slot.classList.remove('selected');
        });

        const selectedSlot = document.querySelector(`.time-slot[data-time="${time}"]`);
        if (selectedSlot) {
            selectedSlot.classList.add('selected');
        }

        showNotification(`Selected time: ${time}`, 'success');
    }

    // Setup date selection
    function setupDateSelection() {
        const dateSelect = document.getElementById('bookingDate');
        if (!dateSelect) return;

        const today = new Date();
        const maxDate = new Date();
        maxDate.setDate(today.getDate() + 30); // Allow booking up to 30 days in advance

        // Clear existing options
        dateSelect.innerHTML = '';

        for (let i = 0; i <= 30; i++) {
            const date = new Date();
            date.setDate(today.getDate() + i);

            const option = document.createElement('option');
            option.value = date.toISOString().split('T')[0];

            let displayText = date.toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric'
            });

            if (i === 0) {
                displayText += ' (Today)';
            } else if (i === 1) {
                displayText += ' (Tomorrow)';
            } else if (i === 7) {
                displayText += ' (Next Week)';
            }

            option.textContent = displayText;
            dateSelect.appendChild(option);
        }
    }

    // Seat selection functions
    function decreaseSeats() {
        if (selectedSeats > 1) {
            selectedSeats--;
            updateSeatCounter();
        }
    }

    function increaseSeats() {
        if (selectedSeats < 8) {
            selectedSeats++;
            updateSeatCounter();
        }
    }

    function updateSeatCounter() {
        if (seatCounter) {
            seatCounter.textContent = selectedSeats;
        }

        // Update button states
        if (minusBtn) {
            minusBtn.disabled = selectedSeats <= 1;
        }
        if (plusBtn) {
            plusBtn.disabled = selectedSeats >= 8;
        }

        updateBookingSummary();
    }

    // Update booking summary
    function updateBookingSummary() {
        if (!selectedRoute || !bookingSummary) return;

        let baseFare = selectedRoute.fare * selectedSeats;
        let discount = 0;
        let discountText = '';

        // Apply group discount for 3+ seats
        if (selectedSeats >= 3 && bookingData?.fareStructure?.groupDiscount) {
            discount = baseFare * bookingData.fareStructure.groupDiscount;
            baseFare = baseFare - discount;
            discountText = `
                <div class="summary-item discount">
                    <span>Group discount (10%):</span>
                    <span>-R ${discount.toFixed(2)}</span>
                </div>
            `;
        }

        const totalFare = baseFare;

        bookingSummary.innerHTML = `
            <div class="summary-item">
                <span>Route:</span>
                <span>${selectedRoute.name}</span>
            </div>
            <div class="summary-item">
                <span>Date & Time:</span>
                <span>${selectedDateTime || 'Not selected'}</span>
            </div>
            <div class="summary-item">
                <span>Seats:</span>
                <span>${selectedSeats}</span>
            </div>
            <div class="summary-item">
                <span>Fare per seat:</span>
                <span>R ${selectedRoute.fare.toFixed(2)}</span>
            </div>
            ${discountText}
            <div class="summary-item total">
                <span>Total Amount:</span>
                <span>R ${totalFare.toFixed(2)}</span>
            </div>
        `;
    }

    // Navigation functions
    function goToPreviousStep() {
        if (currentStep > 1) {
            currentStep--;
            updateStepDisplay();
        }
    }

    function goToNextStep() {
        if (validateCurrentStep()) {
            currentStep++;
            updateStepDisplay();
        }
    }

    function validateCurrentStep() {
        switch (currentStep) {
            case 1:
                if (!selectedRoute) {
                    showNotification('Please select a route to continue', 'error');
                    return false;
                }
                return true;
            case 2:
                if (!selectedDateTime) {
                    showNotification('Please select a time slot to continue', 'error');
                    return false;
                }
                return true;
            case 3:
                return true; // Seat selection always valid
            default:
                return true;
        }
    }

    function updateStepDisplay() {
        // Hide all steps if they exist
        if (routeSelection) routeSelection.classList.remove('active');
        if (datetimeSelection) datetimeSelection.classList.remove('active');
        if (seatSelection) seatSelection.classList.remove('active');
        if (confirmation) confirmation.classList.remove('active');

        // Show current step
        switch (currentStep) {
            case 1:
                if (routeSelection) routeSelection.classList.add('active');
                if (prevBtn) prevBtn.style.display = 'none';
                if (nextBtn) nextBtn.style.display = 'inline-flex';
                if (submitBtn) submitBtn.style.display = 'none';
                break;
            case 2:
                if (datetimeSelection) datetimeSelection.classList.add('active');
                if (prevBtn) prevBtn.style.display = 'inline-flex';
                if (nextBtn) nextBtn.style.display = 'inline-flex';
                if (submitBtn) submitBtn.style.display = 'none';
                break;
            case 3:
                if (seatSelection) seatSelection.classList.add('active');
                if (prevBtn) prevBtn.style.display = 'inline-flex';
                if (nextBtn) nextBtn.style.display = 'none';
                if (submitBtn) submitBtn.style.display = 'inline-flex';
                updateBookingSummary();
                break;
            case 4:
                if (confirmation) confirmation.classList.add('active');
                if (prevBtn) prevBtn.style.display = 'none';
                if (nextBtn) nextBtn.style.display = 'none';
                if (submitBtn) submitBtn.style.display = 'none';
                break;
        }

        // Update progress bar and steps
        updateProgressBar();
        updateStepIndicator();
    }

    function updateProgressBar() {
        const progressFill = document.querySelector('.progress-fill');
        const steps = document.querySelectorAll('.step');

        if (progressFill) {
            const progress = ((currentStep - 1) / 3) * 100;
            progressFill.style.width = `${progress}%`;
        }

        // Update step indicators
        steps.forEach((step, index) => {
            const stepNumber = parseInt(step.getAttribute('data-step'));
            if (stepNumber < currentStep) {
                step.classList.add('completed');
                step.classList.remove('active');
            } else if (stepNumber === currentStep) {
                step.classList.add('active');
                step.classList.remove('completed');
            } else {
                step.classList.remove('active', 'completed');
            }
        });
    }

    function updateStepIndicator() {
        if (currentStepElement) {
            currentStepElement.textContent = currentStep;
        }
    }

    // Form submission
    function handleFormSubmit(e) {
        e.preventDefault();
        submitBooking();
    }

    function submitBooking() {
        if (!validateBooking()) {
            return;
        }

        // Show loading state
        if (submitBtn) {
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
            submitBtn.disabled = true;
        }

        // Simulate API call
        setTimeout(() => {
            const bookingRef = generateBookingReference();

            // Calculate final amount with potential discounts
            let finalAmount = selectedRoute.fare * selectedSeats;
            if (selectedSeats >= 3 && bookingData?.fareStructure?.groupDiscount) {
                finalAmount = finalAmount * (1 - bookingData.fareStructure.groupDiscount);
            }

            // Create booking object
            currentBooking = {
                id: `BKG-${Date.now()}`,
                bookingId: bookingRef,
                user: document.getElementById('userName')?.value || '',
                userEmail: document.getElementById('userEmail')?.value || '',
                userPhone: document.getElementById('userPhone')?.value || '',
                route: selectedRoute.name,
                routeId: selectedRoute.id,
                date: document.getElementById('bookingDate')?.value || '',
                time: selectedDateTime,
                seats: selectedSeats,
                status: "confirmed",
                bookingDate: new Date().toISOString().split('T')[0],
                totalAmount: finalAmount.toFixed(2),
                paymentStatus: "paid",
                specialRequests: document.getElementById('specialRequests')?.value || "",
                timestamp: new Date().toISOString()
            };

            console.log('New booking created:', currentBooking);

            // Show confirmation with QR code
            showConfirmation(currentBooking);

        }, 2000);
    }

    function validateBooking() {
        const userName = document.getElementById('userName')?.value;
        const userEmail = document.getElementById('userEmail')?.value;
        const userPhone = document.getElementById('userPhone')?.value;

        if (!userName || !userName.trim()) {
            showNotification('Please enter your full name', 'error');
            return false;
        }

        if (!userEmail || !userEmail.trim() || !isValidEmail(userEmail)) {
            showNotification('Please enter a valid email address', 'error');
            return false;
        }

        if (!userPhone || !userPhone.trim()) {
            showNotification('Please enter your phone number', 'error');
            return false;
        }

        return true;
    }

    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function generateBookingReference() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let result = 'UT-';
        for (let i = 0; i < 6; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        result += '-';
        for (let i = 0; i < 3; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }

    // Generate QR code using QRCode.js library
    function generateQRCode(bookingData) {
        const qrContainer = document.getElementById('qrcode');
        if (!qrContainer) {
            console.error('QR code container not found');
            return null;
        }

        // Clear any existing QR code
        qrContainer.innerHTML = '';

        // Generate QR code using QRCode.js
        new QRCode(qrContainer, {
            text: JSON.stringify(bookingData), // encode full booking info
            width: 180,
            height: 180,
            colorDark: "#000000",
            colorLight: "#ffffff",
            correctLevel: QRCode.CorrectLevel.H
        });

        console.log('QR code generated successfully');
    }

    function showConfirmation(booking) {
        currentStep = 4;
        updateStepDisplay();

        if (bookingDetails) {
            bookingDetails.innerHTML = `
                <div class="confirmation-details">
                    <div class="confirmation-header">
                        <i class="fas fa-check-circle"></i>
                        <h3>Booking Confirmed!</h3>
                        <p>Your shuttle booking has been successfully confirmed</p>
                    </div>
                    <div class="confirmation-main">
                        <div class="booking-info">
                            <div class="confirmation-info">
                                <div class="info-item">
                                    <strong>Booking Reference:</strong>
                                    <span>${booking.bookingId}</span>
                                </div>
                                <div class="info-item">
                                    <strong>Passenger:</strong>
                                    <span>${booking.user}</span>
                                </div>
                                <div class="info-item">
                                    <strong>Route:</strong>
                                    <span>${booking.route}</span>
                                </div>
                                <div class="info-item">
                                    <strong>Date & Time:</strong>
                                    <span>${booking.date} at ${booking.time}</span>
                                </div>
                                <div class="info-item">
                                    <strong>Seats:</strong>
                                    <span>${booking.seats}</span>
                                </div>
                                <div class="info-item">
                                    <strong>Total Amount:</strong>
                                    <span>R ${booking.totalAmount}</span>
                                </div>
                            </div>
                            <div class="boarding-instructions">
                                <h5><i class="fas fa-info-circle"></i> Boarding Instructions</h5>
                                <p><i class="fas fa-qrcode"></i> Show QR code to driver when boarding</p>
                                <p><i class="fas fa-clock"></i> Arrive at stop 5 minutes before departure</p>
                                <p><i class="fas fa-id-card"></i> Have student ID ready for verification</p>
                                <p><i class="fas fa-map-marker-alt"></i> Board at designated shuttle stops only</p>
                            </div>
                        </div>
                        <div class="qr-section">
                            <h4>Digital Boarding Pass</h4>
                            <div class="qr-code-container">
                                <div id="qrcode"></div>
                            </div>
                            <div class="qr-text">
                                <p><strong>Scan this QR code</strong></p>
                                <p>Present to driver for boarding verification</p>
                            </div>
                        </div>
                    </div>
                    <div class="confirmation-footer">
                        <div class="confirmation-actions">
                            <button class="btn-primary" onclick="window.print()">
                                <i class="fas fa-print"></i> Print Ticket
                            </button>
                            <button class="btn-secondary" onclick="downloadTicket()">
                                <i class="fas fa-download"></i> Save Ticket
                            </button>
                            <button class="btn-success" onclick="makeNewBooking()">
                                <i class="fas fa-plus"></i> New Booking
                            </button>
                        </div>
                    </div>
                </div>
            `;

            // Generate QR code immediately
            generateQRCode(booking);
        }

        showNotification('Booking confirmed successfully! QR code generated.', 'success');
    }

    // Reset booking form
    function resetBookingForm() {
        if (bookingForm) bookingForm.reset();
        selectedRoute = null;
        selectedDateTime = null;
        selectedSeats = 1;
        currentBooking = null;

        document.querySelectorAll('.route-card').forEach(card => {
            card.classList.remove('selected');
        });

        document.querySelectorAll('.time-slot').forEach(slot => {
            slot.classList.remove('selected');
        });

        updateSeatCounter();

        // Reset to first step
        currentStep = 1;
        updateStepDisplay();
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

    // Global functions for confirmation page buttons
    window.downloadTicket = function() {
        showNotification('Ticket download feature would save your boarding pass as PDF', 'info');
    };

    window.makeNewBooking = function() {
        resetBookingForm();
        showNotification('Ready to make a new booking', 'success');
    };
});

// Update year in footer
const yearSpan = document.getElementById('year');
if (yearSpan) {
    yearSpan.innerText = new Date().getFullYear().toString();
}

