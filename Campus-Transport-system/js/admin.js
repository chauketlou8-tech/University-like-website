// js/admin.js
document.addEventListener('DOMContentLoaded', function() {
    // Global variables
    let adminData = null;
    let currentEditingRoute = null;
    let currentEditingBooking = null;

    // DOM Elements
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const logoutBtn = document.getElementById('logoutBtn');
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    // Statistics elements
    const totalRoutesElement = document.getElementById('totalRoutes');
    const totalBookingsElement = document.getElementById('totalBookings');
    const activeShuttlesElement = document.getElementById('activeShuttles');
    const totalUsersElement = document.getElementById('totalUsers');

    // Routes tab elements
    const routesTableBody = document.getElementById('routesTableBody');
    const addRouteBtn = document.getElementById('addRouteBtn');
    const routeModal = document.getElementById('routeModal');
    const closeRouteModal = document.getElementById('closeRouteModal');
    const cancelRouteBtn = document.getElementById('cancelRouteBtn');
    const routeForm = document.getElementById('routeForm');

    // Bookings tab elements
    const bookingsTableBody = document.getElementById('bookingsTableBody');
    const bookingSearch = document.getElementById('bookingSearch');
    const bookingStatusFilter = document.getElementById('bookingStatusFilter');
    const bookingDateFilter = document.getElementById('bookingDateFilter');

    // Shuttles tab elements
    const shuttlesGrid = document.getElementById('shuttlesGrid');
    const addShuttleBtn = document.getElementById('addShuttleBtn');

    // Analytics tab elements
    const updateAnalyticsBtn = document.getElementById('updateAnalytics');

    // Initialize admin system
    initAdminSystem();

    // Event Listeners
    navToggle.addEventListener('click', toggleMobileMenu);
    logoutBtn.addEventListener('click', handleLogout);
    tabBtns.forEach(btn => btn.addEventListener('click', switchTab));

    // Routes tab events
    addRouteBtn.addEventListener('click', openAddRouteModal);
    closeRouteModal.addEventListener('click', closeRouteModalHandler);
    cancelRouteBtn.addEventListener('click', closeRouteModalHandler);
    routeForm.addEventListener('submit', handleRouteSubmit);

    // Bookings tab events
    bookingSearch.addEventListener('input', filterBookings);
    bookingStatusFilter.addEventListener('change', filterBookings);
    bookingDateFilter.addEventListener('change', filterBookings);

    // Shuttles tab events
    addShuttleBtn.addEventListener('click', addNewShuttle);

    // Analytics tab events
    updateAnalyticsBtn.addEventListener('click', updateAnalytics);

    // Initialize admin system
    async function initAdminSystem() {
        try {
            await loadAdminData();
            updateStatistics();
            renderRoutesTable();
            renderBookingsTable();
            renderShuttlesGrid();
            console.log('Admin system initialized successfully');
        } catch (error) {
            console.error('Error initializing admin system:', error);
            showNotification('Error loading admin data', 'error');
        }
    }

    // Load admin data from JSON file or localStorage
    async function loadAdminData() {
        try {
            // Try to load from localStorage first (persistent data)
            const savedData = localStorage.getItem('adminData');

            if (savedData) {
                adminData = JSON.parse(savedData);
                console.log('Loaded data from localStorage');
            } else {
                // If no localStorage data, load from JSON file
                // Update this path to match your actual file location
                const response = await fetch('data/routes.json');
                if (!response.ok) {
                    throw new Error('Failed to load routes data');
                }
                adminData = await response.json();
                console.log('Loaded data from JSON file');
            }
        } catch (error) {
            console.error('Error loading admin data:', error);
            // Fallback to default data structure
            adminData = {
                routes: [],
                bookings: [],
                shuttles: [],
                statistics: {
                    totalRoutes: 0,
                    todayBookings: 0,
                    activeShuttles: 0,
                    totalUsers: 0
                }
            };
            showNotification('Using default data structure', 'warning');
        }
    }

    // Save admin data to localStorage
    function saveAdminData() {
        try {
            localStorage.setItem('adminData', JSON.stringify(adminData));
            console.log('Data saved to localStorage');
        } catch (error) {
            console.error('Error saving admin data:', error);
            showNotification('Error saving data', 'error');
        }
    }

    // Update statistics
    function updateStatistics() {
        if (!adminData) return;

        // Calculate statistics from actual data
        adminData.statistics.totalRoutes = adminData.routes.length;
        adminData.statistics.activeShuttles = adminData.shuttles.filter(shuttle => shuttle.status === 'active').length;
        adminData.statistics.todayBookings = adminData.bookings.filter(booking =>
            booking.date === new Date().toISOString().split('T')[0]
        ).length;

        totalRoutesElement.textContent = adminData.statistics.totalRoutes;
        totalBookingsElement.textContent = adminData.statistics.todayBookings;
        activeShuttlesElement.textContent = adminData.statistics.activeShuttles;
        totalUsersElement.textContent = adminData.statistics.totalUsers.toLocaleString();
    }

    // Render routes table
    function renderRoutesTable() {
        if (!adminData.routes) return;

        let routesHTML = '';

        adminData.routes.forEach(route => {
            routesHTML += `
                <tr>
                    <td>${route.name}</td>
                    <td>${route.type.charAt(0).toUpperCase() + route.type.slice(1)}</td>
                    <td>${route.schedule}</td>
                    <td>${route.stops} stops</td>
                    <td><span class="status-badge status-${route.status}">${route.status}</span></td>
                    <td class="action-buttons">
                        <button class="btn-action btn-edit" onclick="editRoute('${route.id}')">
                            <i class="fas fa-edit"></i> Edit
                        </button>
                        <button class="btn-action btn-delete" onclick="deleteRoute('${route.id}')">
                            <i class="fas fa-trash"></i> Delete
                        </button>
                    </td>
                </tr>
            `;
        });

        routesTableBody.innerHTML = routesHTML;
    }

    // Render bookings table
    function renderBookingsTable() {
        if (!adminData.bookings) return;

        let bookingsHTML = '';

        adminData.bookings.forEach(booking => {
            bookingsHTML += `
                <tr>
                    <td>${booking.bookingId}</td>
                    <td>${booking.user}</td>
                    <td>${booking.route}</td>
                    <td>${booking.date} at ${booking.time}</td>
                    <td>${booking.seats} seat${booking.seats !== 1 ? 's' : ''}</td>
                    <td><span class="status-badge status-${booking.status}">${booking.status}</span></td>
                    <td class="action-buttons">
                        <button class="btn-action btn-view" onclick="viewBooking('${booking.id}')">
                            <i class="fas fa-eye"></i> View
                        </button>
                        <button class="btn-action btn-edit" onclick="editBooking('${booking.id}')">
                            <i class="fas fa-edit"></i> Edit
                        </button>
                    </td>
                </tr>
            `;
        });

        bookingsTableBody.innerHTML = bookingsHTML;
    }

    // Render shuttles grid
    function renderShuttlesGrid() {
        if (!adminData.shuttles) return;

        let shuttlesHTML = '';

        adminData.shuttles.forEach(shuttle => {
            shuttlesHTML += `
                <div class="shuttle-card">
                    <div class="shuttle-header">
                        <div class="shuttle-id">${shuttle.shuttleId}</div>
                        <span class="status-badge status-${shuttle.status}">${shuttle.status}</span>
                    </div>
                    <div class="shuttle-info">
                        <p><strong>Route:</strong> ${shuttle.route}</p>
                        <p><strong>Driver:</strong> ${shuttle.driver}</p>
                        <p><strong>Capacity:</strong> ${shuttle.capacity} seats</p>
                        <p><strong>Last Maintenance:</strong> ${shuttle.lastMaintenance}</p>
                        <p><strong>Next Maintenance:</strong> ${shuttle.nextMaintenance}</p>
                    </div>
                    <div class="shuttle-actions">
                        <button class="btn-action btn-edit" onclick="editShuttle('${shuttle.id}')">
                            <i class="fas fa-edit"></i> Edit
                        </button>
                        <button class="btn-action btn-delete" onclick="deleteShuttle('${shuttle.id}')">
                            <i class="fas fa-trash"></i> Delete
                        </button>
                    </div>
                </div>
            `;
        });

        shuttlesGrid.innerHTML = shuttlesHTML;
    }

    // Filter bookings
    function filterBookings() {
        const searchTerm = bookingSearch.value.toLowerCase();
        const statusFilter = bookingStatusFilter.value;
        const dateFilter = bookingDateFilter.value;

        let filteredBookings = adminData.bookings;

        // Apply search filter
        if (searchTerm) {
            filteredBookings = filteredBookings.filter(booking =>
                booking.user.toLowerCase().includes(searchTerm) ||
                booking.route.toLowerCase().includes(searchTerm) ||
                booking.bookingId.toLowerCase().includes(searchTerm)
            );
        }

        // Apply status filter
        if (statusFilter !== 'all') {
            filteredBookings = filteredBookings.filter(booking => booking.status === statusFilter);
        }

        // Apply date filter
        if (dateFilter !== 'all') {
            const today = new Date().toISOString().split('T')[0];
            filteredBookings = filteredBookings.filter(booking => {
                if (dateFilter === 'today') return booking.date === today;
                // Add more date filtering logic as needed
                return true;
            });
        }

        // Re-render filtered bookings
        let bookingsHTML = '';
        filteredBookings.forEach(booking => {
            bookingsHTML += `
                <tr>
                    <td>${booking.bookingId}</td>
                    <td>${booking.user}</td>
                    <td>${booking.route}</td>
                    <td>${booking.date} at ${booking.time}</td>
                    <td>${booking.seats} seat${booking.seats !== 1 ? 's' : ''}</td>
                    <td><span class="status-badge status-${booking.status}">${booking.status}</span></td>
                    <td class="action-buttons">
                        <button class="btn-action btn-view" onclick="viewBooking('${booking.id}')">
                            <i class="fas fa-eye"></i> View
                        </button>
                        <button class="btn-action btn-edit" onclick="editBooking('${booking.id}')">
                            <i class="fas fa-edit"></i> Edit
                        </button>
                    </td>
                </tr>
            `;
        });

        bookingsTableBody.innerHTML = bookingsHTML;
    }

    // Tab switching
    function switchTab(e) {
        const tabId = e.target.getAttribute('data-tab');

        // Update tab buttons
        tabBtns.forEach(btn => btn.classList.remove('active'));
        e.target.classList.add('active');

        // Update tab content
        tabContents.forEach(content => content.classList.remove('active'));
        document.getElementById(`${tabId}-tab`).classList.add('active');
    }

    // Route management
    function openAddRouteModal() {
        currentEditingRoute = null;
        document.getElementById('routeModalTitle').textContent = 'Add New Route';
        routeForm.reset();
        routeModal.classList.add('active');
    }

    function closeRouteModalHandler() {
        routeModal.classList.remove('active');
        currentEditingRoute = null;
    }

    function handleRouteSubmit(e) {
        e.preventDefault();

        const formData = new FormData(routeForm);
        const routeData = {
            name: formData.get('routeName'),
            description: formData.get('routeDescription'),
            type: formData.get('routeType'),
            status: formData.get('routeStatus')
        };

        if (currentEditingRoute) {
            // Update existing route
            updateRoute(currentEditingRoute, routeData);
        } else {
            // Add new route
            addNewRoute(routeData);
        }

        closeRouteModalHandler();
    }

    function addNewRoute(routeData) {
        const newRoute = {
            id: `route-${Date.now()}`,
            name: routeData.name,
            description: routeData.description,
            type: routeData.type,
            schedule: "To be configured",
            stops: 0,
            status: routeData.status
        };

        adminData.routes.push(newRoute);
        saveAdminData();
        renderRoutesTable();
        updateStatistics();
        showNotification('Route added successfully', 'success');
    }

    function editRoute(routeId) {
        const route = adminData.routes.find(r => r.id === routeId);
        if (!route) return;

        currentEditingRoute = routeId;
        document.getElementById('routeModalTitle').textContent = 'Edit Route';
        document.getElementById('routeName').value = route.name;
        document.getElementById('routeDescription').value = route.description || '';
        document.getElementById('routeType').value = route.type;
        document.getElementById('routeStatus').value = route.status;

        routeModal.classList.add('active');
    }

    function updateRoute(routeId, routeData) {
        const routeIndex = adminData.routes.findIndex(r => r.id === routeId);
        if (routeIndex === -1) return;

        adminData.routes[routeIndex] = {
            ...adminData.routes[routeIndex],
            name: routeData.name,
            description: routeData.description,
            type: routeData.type,
            status: routeData.status
        };

        saveAdminData();
        renderRoutesTable();
        showNotification('Route updated successfully', 'success');
    }

    function deleteRoute(routeId) {
        if (confirm('Are you sure you want to delete this route? This action cannot be undone.')) {
            adminData.routes = adminData.routes.filter(route => route.id !== routeId);
            saveAdminData();
            renderRoutesTable();
            updateStatistics();
            showNotification('Route deleted successfully', 'success');
        }
    }

    // Booking management
    function viewBooking(bookingId) {
        const booking = adminData.bookings.find(b => b.id === bookingId);
        if (!booking) return;

        // In a real application, this would open a detailed view modal
        showNotification(`Viewing booking: ${booking.bookingId}`, 'info');
    }

    function editBooking(bookingId) {
        const booking = adminData.bookings.find(b => b.id === bookingId);
        if (!booking) return;

        const newStatus = prompt('Enter new status (confirmed/pending/cancelled/completed):', booking.status);
        if (newStatus && ['confirmed', 'pending', 'cancelled', 'completed'].includes(newStatus)) {
            booking.status = newStatus;
            saveAdminData();
            renderBookingsTable();
            showNotification('Booking status updated successfully', 'success');
        }
    }

    // Shuttle management
    function addNewShuttle() {
        // In a real application, this would open a shuttle creation form
        const newShuttle = {
            id: `shuttle-${Date.now()}`,
            shuttleId: `UCT-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
            route: "New Route",
            driver: "New Driver",
            capacity: 24,
            status: "active",
            lastMaintenance: new Date().toISOString().split('T')[0],
            nextMaintenance: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        };

        adminData.shuttles.push(newShuttle);
        saveAdminData();
        renderShuttlesGrid();
        updateStatistics();
        showNotification('New shuttle added successfully', 'success');
    }

    function editShuttle(shuttleId) {
        const shuttle = adminData.shuttles.find(s => s.id === shuttleId);
        if (!shuttle) return;

        const newStatus = prompt('Enter new status (active/maintenance):', shuttle.status);
        if (newStatus && ['active', 'maintenance'].includes(newStatus)) {
            shuttle.status = newStatus;
            saveAdminData();
            renderShuttlesGrid();
            updateStatistics();
            showNotification('Shuttle status updated successfully', 'success');
        }
    }

    function deleteShuttle(shuttleId) {
        if (confirm('Are you sure you want to delete this shuttle? This action cannot be undone.')) {
            adminData.shuttles = adminData.shuttles.filter(shuttle => shuttle.id !== shuttleId);
            saveAdminData();
            renderShuttlesGrid();
            updateStatistics();
            showNotification('Shuttle deleted successfully', 'success');
        }
    }

    // Analytics
    function updateAnalytics() {
        // In a real application, this would fetch updated analytics data
        showNotification('Analytics updated successfully', 'success');
    }

    // Utility functions
    function toggleMobileMenu() {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
    }

    function handleLogout(e) {
        e.preventDefault();
        if (confirm('Are you sure you want to logout?')) {
            showNotification('Logged out successfully', 'success');
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1000);
        }
    }

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

    // Make functions globally available for onclick handlers
    window.editRoute = editRoute;
    window.deleteRoute = deleteRoute;
    window.viewBooking = viewBooking;
    window.editBooking = editBooking;
    window.editShuttle = editShuttle;
    window.deleteShuttle = deleteShuttle;
});