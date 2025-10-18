// js/schedule.js
document.addEventListener('DOMContentLoaded', function() {
    // Global variables
    let scheduleData = null;
    let currentTimeInterval = null;

    // DOM Elements
    const routeFilter = document.getElementById('routeFilter');
    const dayFilter = document.getElementById('dayFilter');
    const refreshBtn = document.getElementById('refreshSchedule');
    const currentTimeElement = document.getElementById('currentTime');
    const scheduleTable = document.getElementById('scheduleTable');
    const upcomingDepartures = document.getElementById('upcomingDepartures');

    // Initialize the schedule system
    initScheduleSystem();

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

    // Event Listeners
    routeFilter.addEventListener('change', renderSchedule);
    dayFilter.addEventListener('change', renderSchedule);
    refreshBtn.addEventListener('click', refreshScheduleData);

    // Main initialization function
    async function initScheduleSystem() {
        try {
            // Load schedule data from JSON file
            await loadScheduleData();

            // Initialize real-time clock
            initRealTimeClock();

            // Populate route filter
            populateRouteFilter();

            // Render initial schedule
            renderSchedule();

            // Render upcoming departures
            renderUpcomingDepartures();

            console.log('Schedule system initialized successfully');
        } catch (error) {
            console.error('Error initializing schedule system:', error);
            showNotification('Error loading schedule data. Please refresh the page.', 'error');
        }
    }

    // Load schedule data from JSON file
    async function loadScheduleData() {
        try {
            // Try multiple possible paths for the JSON file
            const possiblePaths = [
                'data/schedule.json',
                './data/schedule.json',
                '../data/schedule.json',
                'schedule.json',
                './schedule.json'
            ];

            let response;
            for (const path of possiblePaths) {
                try {
                    console.log(`Trying to load from: ${path}`);
                    response = await fetch(path);
                    if (response.ok) {
                        console.log(`Successfully loaded from: ${path}`);
                        break;
                    }
                } catch (e) {
                    console.log(`Failed to load from ${path}:`, e);
                    continue;
                }
            }

            if (response && response.ok) {
                scheduleData = await response.json();
                console.log('Schedule data loaded successfully from JSON file');
            } else {
                throw new Error('Could not load schedule data from any known path');
            }

        } catch (error) {
            console.error('Error loading schedule data:', error);

            // Fallback to default data structure
            scheduleData = getFallbackData();
            showNotification('Using default schedule data', 'warning');
        }
    }

    // Fallback data in case JSON file is not available
    function getFallbackData() {
        return {
            "systemInfo": {
                "universityName": "University Transit System",
                "version": "1.0",
                "lastUpdated": "2023-10-15"
            },
            "routes": [
                {
                    "id": "north-campus",
                    "name": "North Campus Loop",
                    "description": "Connects main academic buildings on north campus",
                    "stops": ["Main Library", "Student Union", "North Campus Hub", "Science Building", "Engineering Complex"],
                    "schedule": {
                        "weekday": [
                            {"time": "07:00", "duration": "25 min", "frequency": "Every 30 min"}
                        ],
                        "weekend": [
                            {"time": "08:00", "duration": "25 min", "frequency": "Every 45 min"}
                        ]
                    },
                    "status": "active",
                    "delay": 0
                }
            ],
            "announcements": []
        };
    }

    // Initialize real-time clock
    function initRealTimeClock() {
        updateCurrentTime();

        // Update time every second
        currentTimeInterval = setInterval(updateCurrentTime, 1000);
    }

    // Update current time display
    function updateCurrentTime() {
        const now = new Date();
        const timeString = now.toLocaleTimeString('en-US', {
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
        const dateString = now.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        currentTimeElement.textContent = `${dateString} | ${timeString}`;
    }

    // Populate route filter dropdown
    function populateRouteFilter() {
        routeFilter.innerHTML = '<option value="all">All Routes</option>';

        if (scheduleData && scheduleData.routes) {
            scheduleData.routes.forEach(route => {
                const option = document.createElement('option');
                option.value = route.id;
                option.textContent = route.name;
                routeFilter.appendChild(option);
            });
        }
    }

    // Render schedule based on filters
    function renderSchedule() {
        const selectedRoute = routeFilter.value;
        const selectedDay = dayFilter.value;

        if (!scheduleData) {
            scheduleTable.innerHTML = '<div class="loading-message"><p>No schedule data available</p></div>';
            return;
        }

        // Filter routes based on selection
        let filteredRoutes = scheduleData.routes;
        if (selectedRoute !== 'all') {
            filteredRoutes = filteredRoutes.filter(route => route.id === selectedRoute);
        }

        // Determine which schedule to show (weekday/weekend)
        const now = new Date();
        const isWeekend = now.getDay() === 0 || now.getDay() === 6;
        const defaultDayType = isWeekend ? 'weekend' : 'weekday';
        const dayType = selectedDay === 'all' ? defaultDayType : selectedDay;

        let scheduleHTML = `
            <table class="schedule-table">
                <thead>
                    <tr>
                        <th>Route</th>
                        <th>First Departure</th>
                        <th>Last Departure</th>
                        <th>Frequency</th>
                        <th>Duration</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
        `;

        filteredRoutes.forEach(route => {
            const schedule = route.schedule[dayType];
            if (!schedule || schedule.length === 0) {
                return;
            }

            const firstDeparture = schedule[0].time;
            const lastDeparture = schedule[schedule.length - 1].time;
            const frequency = schedule[0].frequency;
            const duration = schedule[0].duration;

            // Determine status and delay information
            let statusHTML = '';
            if (route.status === 'maintenance') {
                statusHTML = '<span class="delayed">Maintenance</span>';
            } else if (route.delay > 0) {
                statusHTML = `<span class="delayed">Delayed ${route.delay} min</span>`;
            } else {
                statusHTML = '<span class="on-time">On Time</span>';
            }

            scheduleHTML += `
                <tr>
                    <td class="route-name">${route.name}</td>
                    <td>${firstDeparture}</td>
                    <td>${lastDeparture}</td>
                    <td>${frequency}</td>
                    <td>${duration}</td>
                    <td>${statusHTML}</td>
                </tr>
            `;
        });

        scheduleHTML += `
                </tbody>
            </table>
        `;

        scheduleTable.innerHTML = scheduleHTML;
    }

    // Render upcoming departures
    function renderUpcomingDepartures() {
        if (!scheduleData) {
            upcomingDepartures.innerHTML = '<p>No departure data available</p>';
            return;
        }

        const now = new Date();
        const currentTime = now.getHours() * 60 + now.getMinutes(); // Convert to minutes
        const twoHoursLater = currentTime + 120;

        let upcomingTrips = [];

        // Get current day type
        const isWeekend = now.getDay() === 0 || now.getDay() === 6;
        const dayType = isWeekend ? 'weekend' : 'weekday';

        // Collect upcoming trips from all routes
        scheduleData.routes.forEach(route => {
            if (route.status === 'maintenance') return;

            const schedule = route.schedule[dayType];
            if (!schedule) return;

            schedule.forEach(trip => {
                const [hours, minutes] = trip.time.split(':').map(Number);
                const tripTime = hours * 60 + minutes;

                // Add delay to trip time
                const actualTripTime = tripTime + route.delay;

                if (actualTripTime >= currentTime && actualTripTime <= twoHoursLater) {
                    upcomingTrips.push({
                        route: route.name,
                        time: trip.time,
                        actualTime: actualTripTime,
                        delay: route.delay,
                        destination: route.stops[route.stops.length - 1],
                        duration: trip.duration
                    });
                }
            });
        });

        // Sort by time
        upcomingTrips.sort((a, b) => a.actualTime - b.actualTime);

        let departuresHTML = '';

        if (upcomingTrips.length === 0) {
            departuresHTML = '<p>No departures in the next 2 hours</p>';
        } else {
            upcomingTrips.forEach(trip => {
                const statusClass = trip.delay > 0 ? 'status-delayed' : 'status-on-time';
                const statusText = trip.delay > 0 ? `Delayed ${trip.delay} min` : 'On Time';

                departuresHTML += `
                    <div class="departure-item">
                        <div class="departure-time">${trip.time}</div>
                        <div class="departure-info">
                            <div class="departure-route">${trip.route}</div>
                            <div class="departure-destination">to ${trip.destination}</div>
                        </div>
                        <div class="departure-status ${statusClass}">${statusText}</div>
                    </div>
                `;
            });
        }

        upcomingDepartures.innerHTML = departuresHTML;
    }

    // Refresh schedule data
    function refreshScheduleData() {
        refreshBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Refreshing...';
        refreshBtn.disabled = true;

        // Simulate API call delay
        setTimeout(() => {
            // In a real application, this would fetch fresh data
            // For now, we'll just re-render with current data

            // Simulate random delays for demonstration
            if (scheduleData && scheduleData.routes) {
                scheduleData.routes.forEach(route => {
                    if (route.status !== 'maintenance') {
                        // Random delay between 0-10 minutes
                        route.delay = Math.random() > 0.7 ? Math.floor(Math.random() * 10) + 1 : 0;
                    }
                });
            }

            renderSchedule();
            renderUpcomingDepartures();

            refreshBtn.innerHTML = '<i class="fas fa-sync-alt"></i> Refresh';
            refreshBtn.disabled = false;

            showNotification('Schedule data refreshed successfully', 'success');
        }, 1500);
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

    // Clean up interval on page unload
    window.addEventListener('beforeunload', function() {
        if (currentTimeInterval) {
            clearInterval(currentTimeInterval);
        }
    });

    // Export functions for global access
    window.scheduleSystem = {
        getScheduleData: () => scheduleData,
        refreshSchedule: refreshScheduleData,
        getUpcomingDepartures: () => {
            renderUpcomingDepartures();
            return upcomingDepartures.innerHTML;
        }
    };
});

// Update year in footer
const yearSpan = document.getElementById('year');
if (yearSpan) {
    yearSpan.innerText = new Date().getFullYear().toString();
}