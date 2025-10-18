// js/routes.js
document.addEventListener('DOMContentLoaded', function() {
    // Global variables
    let routesData = null;
    let campusMap = null;
    let currentRouteLayer = null;
    let routeMarkers = [];
    const routeColors = ['#0f28a5', '#28a745', '#ffc107', '#dc3545', '#6f42c1', '#fd7e14'];

    // DOM Elements
    const routeSearch = document.getElementById('routeSearch');
    const routeTypeFilter = document.getElementById('routeTypeFilter');
    const showAllRoutesBtn = document.getElementById('showAllRoutes');
    const routesList = document.getElementById('routesList');
    const routeDetails = document.getElementById('routeDetails');
    const campusMapElement = document.getElementById('campusMap');
    const zoomInBtn = document.getElementById('zoomIn');
    const zoomOutBtn = document.getElementById('zoomOut');
    const locateMeBtn = document.getElementById('locateMe');
    const resetViewBtn = document.getElementById('resetView');
    const totalRoutesElement = document.getElementById('totalRoutes');
    const totalStopsElement = document.getElementById('totalStops');
    const activeShuttlesElement = document.getElementById('activeShuttles');
    const avgFrequencyElement = document.getElementById('avgFrequency');
    const quickLinks = document.getElementById('quickLinks');

    // Initialize the routes system
    initRoutesSystem();

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
    routeSearch.addEventListener('input', filterRoutes);
    routeTypeFilter.addEventListener('change', filterRoutes);
    showAllRoutesBtn.addEventListener('click', showAllRoutes);
    zoomInBtn.addEventListener('click', zoomIn);
    zoomOutBtn.addEventListener('click', zoomOut);
    locateMeBtn.addEventListener('click', locateMe);
    resetViewBtn.addEventListener('click', resetView);

    // Main initialization function
    async function initRoutesSystem() {
        try {
            // Load routes data
            await loadRoutesData();

            // Initialize map
            initCampusMap();

            // Render routes list
            renderRoutesList();

            // Render quick links
            renderQuickLinks();

            // Update statistics
            updateStatistics();

            console.log('Routes system initialized successfully');
        } catch (error) {
            console.error('Error initializing routes system:', error);
            showNotification('Error loading routes data. Please refresh the page.', 'error');
        }
    }

    // Load routes data for University of Cape Town
    async function loadRoutesData() {
        try {
            routesData = {
                "systemInfo": {
                    "universityName": "University of Cape Town Transit System",
                    "version": "1.0",
                    "lastUpdated": "2023-10-15"
                },
                "routes": [
                    {
                        "id": "upper-campus",
                        "name": "Upper Campus Loop",
                        "description": "Main academic buildings on Upper Campus",
                        "type": "campus",
                        "color": "#0f28a5",
                        "status": "active",
                        "frequency": "Every 15 min",
                        "duration": "20 min",
                        "stops": [
                            {
                                "name": "Jameson Hall",
                                "type": "major",
                                "coordinates": [-33.9574, 18.4612],
                                "description": "Main university hall and administration"
                            },
                            {
                                "name": "Library",
                                "type": "major",
                                "coordinates": [-33.9580, 18.4618],
                                "description": "Main campus library"
                            },
                            {
                                "name": "Science Building",
                                "type": "regular",
                                "coordinates": [-33.9570, 18.4625],
                                "description": "Science faculty and laboratories"
                            },
                            {
                                "name": "Engineering Mall",
                                "type": "regular",
                                "coordinates": [-33.9565, 18.4630],
                                "description": "Engineering and built environment"
                            },
                            {
                                "name": "Bremner Building",
                                "type": "major",
                                "coordinates": [-33.9585, 18.4605],
                                "description": "Student services and administration"
                            }
                        ],
                        "path": [
                            [-33.9574, 18.4612],
                            [-33.9576, 18.4614],
                            [-33.9580, 18.4618],
                            [-33.9578, 18.4622],
                            [-33.9570, 18.4625],
                            [-33.9568, 18.4628],
                            [-33.9565, 18.4630],
                            [-33.9572, 18.4618],
                            [-33.9585, 18.4605]
                        ]
                    },
                    {
                        "id": "middle-campus",
                        "name": "Middle Campus Express",
                        "description": "Quick service between Middle Campus facilities",
                        "type": "express",
                        "color": "#28a745",
                        "status": "active",
                        "frequency": "Every 10 min",
                        "duration": "12 min",
                        "stops": [
                            {
                                "name": "Kramer Law Building",
                                "type": "major",
                                "coordinates": [-33.9588, 18.4630],
                                "description": "Law faculty and library"
                            },
                            {
                                "name": "Leslie Social Science",
                                "type": "regular",
                                "coordinates": [-33.9592, 18.4635],
                                "description": "Social sciences building"
                            },
                            {
                                "name": "Sports Centre",
                                "type": "major",
                                "coordinates": [-33.9598, 18.4640],
                                "description": "University sports facilities"
                            },
                            {
                                "name": "Medical School",
                                "type": "major",
                                "coordinates": [-33.9580, 18.4645],
                                "description": "Health sciences faculty"
                            }
                        ],
                        "path": [
                            [-33.9588, 18.4630],
                            [-33.9590, 18.4632],
                            [-33.9592, 18.4635],
                            [-33.9595, 18.4638],
                            [-33.9598, 18.4640],
                            [-33.9590, 18.4643],
                            [-33.9580, 18.4645]
                        ]
                    },
                    {
                        "id": "residence-circuit",
                        "name": "Residence Halls Circuit",
                        "description": "Service connecting all student residence areas",
                        "type": "residence",
                        "color": "#ffc107",
                        "status": "active",
                        "frequency": "Every 20 min",
                        "duration": "25 min",
                        "stops": [
                            {
                                "name": "Kopano Residence",
                                "type": "major",
                                "coordinates": [-33.9550, 18.4650],
                                "description": "Main student residence"
                            },
                            {
                                "name": "Tugwell Hall",
                                "type": "regular",
                                "coordinates": [-33.9545, 18.4655],
                                "description": "Graduate student housing"
                            },
                            {
                                "name": "College House",
                                "type": "major",
                                "coordinates": [-33.9540, 18.4660],
                                "description": "Undergraduate residence"
                            },
                            {
                                "name": "Forest Hill",
                                "type": "regular",
                                "coordinates": [-33.9535, 18.4665],
                                "description": "Apartment-style residence"
                            },
                            {
                                "name": "Rochester",
                                "type": "major",
                                "coordinates": [-33.9530, 18.4670],
                                "description": "International student housing"
                            }
                        ],
                        "path": [
                            [-33.9550, 18.4650],
                            [-33.9548, 18.4652],
                            [-33.9545, 18.4655],
                            [-33.9543, 18.4658],
                            [-33.9540, 18.4660],
                            [-33.9538, 18.4662],
                            [-33.9535, 18.4665],
                            [-33.9533, 18.4668],
                            [-33.9530, 18.4670]
                        ]
                    },
                    {
                        "id": "lower-campus",
                        "name": "Lower Campus Connector",
                        "description": "Service between Lower Campus and city",
                        "type": "city",
                        "color": "#dc3545",
                        "status": "active",
                        "frequency": "Every 30 min",
                        "duration": "18 min",
                        "stops": [
                            {
                                "name": "Baxter Theatre",
                                "type": "major",
                                "coordinates": [-33.9580, 18.4670],
                                "description": "University theatre and arts center"
                            },
                            {
                                "name": "Lower Campus Square",
                                "type": "regular",
                                "coordinates": [-33.9575, 18.4675],
                                "description": "Student services hub"
                            },
                            {
                                "name": "Medical Campus",
                                "type": "major",
                                "coordinates": [-33.9570, 18.4680],
                                "description": "Health sciences campus"
                            },
                            {
                                "name": "Observatory Station",
                                "type": "major",
                                "coordinates": [-33.9565, 18.4685],
                                "description": "Public transport connection"
                            }
                        ],
                        "path": [
                            [-33.9580, 18.4670],
                            [-33.9578, 18.4672],
                            [-33.9575, 18.4675],
                            [-33.9573, 18.4678],
                            [-33.9570, 18.4680],
                            [-33.9568, 18.4682],
                            [-33.9565, 18.4685]
                        ]
                    },
                    {
                        "id": "hiddingh-campus",
                        "name": "Hiddingh Campus Shuttle",
                        "description": "Service to Hiddingh Campus in city center",
                        "type": "city",
                        "color": "#6f42c1",
                        "status": "active",
                        "frequency": "Every 45 min",
                        "duration": "25 min",
                        "stops": [
                            {
                                "name": "Upper Campus",
                                "type": "major",
                                "coordinates": [-33.9574, 18.4612],
                                "description": "Main campus departure"
                            },
                            {
                                "name": "City Bowl",
                                "type": "regular",
                                "coordinates": [-33.9250, 18.4230],
                                "description": "City center transfer point"
                            },
                            {
                                "name": "Hiddingh Campus",
                                "type": "major",
                                "coordinates": [-33.9265, 18.4170],
                                "description": "Fine arts and drama campus"
                            }
                        ],
                        "path": [
                            [-33.9574, 18.4612],
                            [-33.9500, 18.4500],
                            [-33.9400, 18.4400],
                            [-33.9300, 18.4300],
                            [-33.9250, 18.4230],
                            [-33.9260, 18.4200],
                            [-33.9265, 18.4170]
                        ]
                    },
                    {
                        "id": "breakfast-express",
                        "name": "Breakfast Express",
                        "description": "Early morning express service",
                        "type": "express",
                        "color": "#fd7e14",
                        "status": "active",
                        "frequency": "Every 20 min (6-9 AM)",
                        "duration": "15 min",
                        "stops": [
                            {
                                "name": "Residence Hub",
                                "type": "major",
                                "coordinates": [-33.9545, 18.4655],
                                "description": "Main residence pickup"
                            },
                            {
                                "name": "Upper Campus",
                                "type": "major",
                                "coordinates": [-33.9574, 18.4612],
                                "description": "Direct to academic buildings"
                            }
                        ],
                        "path": [
                            [-33.9545, 18.4655],
                            [-33.9550, 18.4640],
                            [-33.9560, 18.4625],
                            [-33.9574, 18.4612]
                        ]
                    }
                ],
                "shuttles": [
                    {
                        "shuttleId": "UCT-A01",
                        "routeId": "upper-campus",
                        "driver": "Sipho Mbeki",
                        "capacity": 24,
                        "accessibility": true,
                        "currentLocation": {
                            "lat": -33.9574,
                            "lng": 18.4612,
                            "lastUpdate": "2023-10-15T14:25:00Z"
                        },
                        "status": "active"
                    },
                    {
                        "shuttleId": "UCT-B02",
                        "routeId": "middle-campus",
                        "driver": "Nomvula Dlamini",
                        "capacity": 24,
                        "accessibility": true,
                        "currentLocation": {
                            "lat": -33.9592,
                            "lng": 18.4635,
                            "lastUpdate": "2023-10-15T14:27:00Z"
                        },
                        "status": "active"
                    },
                    {
                        "shuttleId": "UCT-C03",
                        "routeId": "residence-circuit",
                        "driver": "Thabo van der Merwe",
                        "capacity": 24,
                        "accessibility": false,
                        "currentLocation": {
                            "lat": -33.9540,
                            "lng": 18.4660,
                            "lastUpdate": "2023-10-15T14:20:00Z"
                        },
                        "status": "active"
                    },
                    {
                        "shuttleId": "UCT-D04",
                        "routeId": "hiddingh-campus",
                        "driver": "Anathi Jacobs",
                        "capacity": 32,
                        "accessibility": true,
                        "currentLocation": {
                            "lat": -33.9400,
                            "lng": 18.4400,
                            "lastUpdate": "2023-10-15T14:22:00Z"
                        },
                        "status": "active"
                    }
                ]
            };

            console.log('UCT Routes data loaded successfully');

        } catch (error) {
            console.error('Error loading routes data:', error);
            throw error;
        }
    }

    // Initialize campus map for UCT
    function initCampusMap() {
        // Set up the map centered on UCT Upper Campus
        campusMap = L.map('campusMap').setView([-33.9574, 18.4612], 15);

        // Add OpenStreetMap tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 18
        }).addTo(campusMap);

        // Add UCT campus boundary overlay
        L.rectangle([
            [-33.9530, 18.4600],
            [-33.9600, 18.4680]
        ], {
            color: "#0f28a5",
            weight: 2,
            fillOpacity: 0.1,
            opacity: 0.5
        }).addTo(campusMap).bindPopup("University of Cape Town Main Campus");

        // Add Table Mountain background context
        L.rectangle([
            [-33.9500, 18.4000],
            [-33.9700, 18.4700]
        ], {
            color: "#2d5016",
            weight: 1,
            fillOpacity: 0.05,
            opacity: 0.3
        }).addTo(campusMap).bindPopup("Table Mountain National Park");

        console.log('UCT Campus map initialized');
    }

    // Render routes list
    function renderRoutesList(filteredRoutes = null) {
        const routesToRender = filteredRoutes || routesData.routes;

        if (routesToRender.length === 0) {
            routesList.innerHTML = '<div class="loading-message"><p>No routes found</p></div>';
            return;
        }

        let routesHTML = '';

        routesToRender.forEach((route, index) => {
            const badgeClass = getBadgeClass(route.status);
            const routeColor = route.color || routeColors[index % routeColors.length];

            routesHTML += `
                <div class="route-item" data-route-id="${route.id}">
                    <div class="route-icon" style="background-color: ${routeColor}">
                        ${index + 1}
                    </div>
                    <div class="route-info">
                        <div class="route-name">${route.name}</div>
                        <div class="route-description">${route.description}</div>
                    </div>
                    <div class="route-badge ${badgeClass}">
                        ${route.status.charAt(0).toUpperCase() + route.status.slice(1)}
                    </div>
                </div>
            `;
        });

        routesList.innerHTML = routesHTML;

        // Add click event listeners
        document.querySelectorAll('.route-item').forEach(item => {
            item.addEventListener('click', function() {
                const routeId = this.getAttribute('data-route-id');
                selectRoute(routeId);
            });
        });
    }

    // Get badge class based on route status
    function getBadgeClass(status) {
        switch (status) {
            case 'active': return 'badge-active';
            case 'maintenance': return 'badge-maintenance';
            case 'inactive': return 'badge-inactive';
            default: return 'badge-active';
        }
    }

    // Select and display route details
    function selectRoute(routeId) {
        const route = routesData.routes.find(r => r.id === routeId);
        if (!route) return;

        // Update active state in list
        document.querySelectorAll('.route-item').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector(`.route-item[data-route-id="${routeId}"]`).classList.add('active');

        // Display route details
        displayRouteDetails(route);

        // Display route on map
        displayRouteOnMap(route);

        // Zoom to route bounds
        zoomToRoute(route);
    }

    // Display route details
    function displayRouteDetails(route) {
        let stopsHTML = '';

        route.stops.forEach((stop, index) => {
            stopsHTML += `
                <div class="stop-item">
                    <div class="stop-marker ${stop.type === 'major' ? 'major' : ''}"></div>
                    <div class="stop-info">
                        <div class="stop-name">${index + 1}. ${stop.name}</div>
                        <div class="stop-details">${stop.description}</div>
                    </div>
                </div>
            `;
        });

        const detailsHTML = `
            <h3>${route.name}</h3>
            <p>${route.description}</p>
            
            <div class="route-meta">
                <div class="meta-item">
                    <strong>Status:</strong> 
                    <span class="${getBadgeClass(route.status)}">${route.status.charAt(0).toUpperCase() + route.status.slice(1)}</span>
                </div>
                <div class="meta-item">
                    <strong>Frequency:</strong> ${route.frequency}
                </div>
                <div class="meta-item">
                    <strong>Duration:</strong> ${route.duration}
                </div>
                <div class="meta-item">
                    <strong>Type:</strong> ${route.type.charAt(0).toUpperCase() + route.type.slice(1)}
                </div>
            </div>

            <div class="route-stops">
                <h4>Route Stops (${route.stops.length})</h4>
                ${stopsHTML}
            </div>

            <button class="btn-primary" style="width: 100%; margin-top: 1rem;" onclick="window.location.href='Booking.html?route=${route.id}'">
                <i class="fas fa-ticket-alt"></i> Book This Route
            </button>
        `;

        routeDetails.innerHTML = detailsHTML;
    }

    // Display route on map
    function displayRouteOnMap(route) {
        // Clear previous route
        if (currentRouteLayer) {
            campusMap.removeLayer(currentRouteLayer);
        }
        routeMarkers.forEach(marker => campusMap.removeLayer(marker));
        routeMarkers = [];

        // Add route path
        if (route.path && route.path.length > 0) {
            currentRouteLayer = L.polyline(route.path, {
                color: route.color,
                weight: 6,
                opacity: 0.7,
                smoothFactor: 1
            }).addTo(campusMap);
        }

        // Add stop markers
        route.stops.forEach((stop, index) => {
            const stopIcon = L.divIcon({
                className: `stop-marker-${stop.type}`,
                html: `<div style="background-color: ${stop.type === 'major' ? '#ffc107' : '#28a745'}; 
                                 width: 12px; height: 12px; border-radius: 50%; border: 2px solid white;
                                 box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
                iconSize: [16, 16],
                iconAnchor: [8, 8]
            });

            const marker = L.marker(stop.coordinates, { icon: stopIcon })
                .addTo(campusMap)
                .bindPopup(`
                    <strong>${stop.name}</strong><br>
                    ${stop.description}<br>
                    <small>Stop ${index + 1} on ${route.name}</small>
                `);

            routeMarkers.push(marker);
        });

        // Add active shuttles for this route
        const routeShuttles = routesData.shuttles.filter(s => s.routeId === route.id && s.status === 'active');
        routeShuttles.forEach(shuttle => {
            const shuttleIcon = L.divIcon({
                className: 'shuttle-marker',
                html: `<div style="background-color: ${route.color}; 
                                 width: 16px; height: 16px; border-radius: 50%; border: 2px solid white;
                                 box-shadow: 0 2px 6px rgba(0,0,0,0.4);">
                         <div style="color: white; font-size: 8px; text-align: center; line-height: 16px;">🚌</div>
                       </div>`,
                iconSize: [20, 20],
                iconAnchor: [10, 10]
            });

            const marker = L.marker([shuttle.currentLocation.lat, shuttle.currentLocation.lng], { icon: shuttleIcon })
                .addTo(campusMap)
                .bindPopup(`
                    <strong>Shuttle ${shuttle.shuttleId}</strong><br>
                    Driver: ${shuttle.driver}<br>
                    Route: ${route.name}<br>
                    Capacity: ${shuttle.capacity} seats<br>
                    <small>Last updated: ${new Date(shuttle.currentLocation.lastUpdate).toLocaleTimeString()}</small>
                `);

            routeMarkers.push(marker);
        });
    }

    // Zoom to route bounds
    function zoomToRoute(route) {
        if (route.path && route.path.length > 0) {
            const bounds = L.latLngBounds(route.path);
            campusMap.fitBounds(bounds, { padding: [20, 20] });
        }
    }

    // Filter routes based on search and filters
    function filterRoutes() {
        const searchTerm = routeSearch.value.toLowerCase();
        const typeFilter = routeTypeFilter.value;

        let filteredRoutes = routesData.routes;

        // Apply search filter
        if (searchTerm) {
            filteredRoutes = filteredRoutes.filter(route =>
                route.name.toLowerCase().includes(searchTerm) ||
                route.description.toLowerCase().includes(searchTerm) ||
                route.stops.some(stop => stop.name.toLowerCase().includes(searchTerm))
            );
        }

        // Apply type filter
        if (typeFilter !== 'all') {
            filteredRoutes = filteredRoutes.filter(route => route.type === typeFilter);
        }

        renderRoutesList(filteredRoutes);
    }

    // Show all routes
    function showAllRoutes() {
        routeSearch.value = '';
        routeTypeFilter.value = 'all';
        renderRoutesList();

        // Clear map and show all routes
        if (currentRouteLayer) {
            campusMap.removeLayer(currentRouteLayer);
            currentRouteLayer = null;
        }
        routeMarkers.forEach(marker => campusMap.removeLayer(marker));
        routeMarkers = [];

        routeDetails.innerHTML = `
            <div class="details-placeholder">
                <i class="fas fa-route"></i>
                <p>Select a route to view details</p>
            </div>
        `;

        // Reset map view to UCT
        campusMap.setView([-33.9574, 18.4612], 15);
    }

    // Render quick links
    function renderQuickLinks() {
        const popularRoutes = routesData.routes.slice(0, 4); // Get first 4 routes as popular

        let linksHTML = '';

        popularRoutes.forEach((route, index) => {
            linksHTML += `
                <a href="#" class="quick-link-item" data-route-id="${route.id}">
                    <div class="quick-link-icon">
                        ${index + 1}
                    </div>
                    <div class="quick-link-info">
                        <h4>${route.name}</h4>
                        <p>${route.description}</p>
                    </div>
                </a>
            `;
        });

        quickLinks.innerHTML = linksHTML;

        // Add click event listeners to quick links
        document.querySelectorAll('.quick-link-item').forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const routeId = this.getAttribute('data-route-id');
                selectRoute(routeId);
            });
        });
    }

    // Update statistics
    function updateStatistics() {
        if (!routesData) return;

        const totalRoutes = routesData.routes.length;
        const totalStops = routesData.routes.reduce((sum, route) => sum + route.stops.length, 0);
        const activeShuttles = routesData.shuttles.filter(s => s.status === 'active').length;

        // Calculate average frequency (simplified)
        const frequencies = routesData.routes.map(route => {
            const freqMatch = route.frequency.match(/\d+/);
            return freqMatch ? parseInt(freqMatch[0]) : 30;
        });
        const avgFrequency = Math.round(frequencies.reduce((a, b) => a + b, 0) / frequencies.length);

        totalRoutesElement.textContent = totalRoutes;
        totalStopsElement.textContent = totalStops;
        activeShuttlesElement.textContent = activeShuttles;
        avgFrequencyElement.textContent = `${avgFrequency} min`;
    }

    // Map control functions
    function zoomIn() {
        campusMap.zoomIn();
    }

    function zoomOut() {
        campusMap.zoomOut();
    }

    function locateMe() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                position => {
                    const { latitude, longitude } = position.coords;
                    campusMap.setView([latitude, longitude], 16);

                    L.marker([latitude, longitude])
                        .addTo(campusMap)
                        .bindPopup('Your current location')
                        .openPopup();
                },
                error => {
                    showNotification('Unable to get your location. Please ensure location services are enabled.', 'error');
                }
            );
        } else {
            showNotification('Geolocation is not supported by your browser.', 'error');
        }
    }

    function resetView() {
        campusMap.setView([-33.9574, 18.4612], 15);
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

    // Export functions for global access
    window.routesSystem = {
        getRoutesData: () => routesData,
        selectRoute: selectRoute,
        showAllRoutes: showAllRoutes
    };
});

const yearSpan = document.getElementById('year');
yearSpan.innerText = new Date().getFullYear().toString();