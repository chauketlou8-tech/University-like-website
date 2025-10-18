University Campus Transport System 🚌
A comprehensive web-based transportation management system for universities, specifically designed for the University of Cape Town (UCT). This system provides efficient shuttle bus management, booking, scheduling, and fare management for students, faculty, and staff.

🌟 Features
Core Functionality
Real-time Booking System - Easy seat reservation with QR code generation

Interactive Routes & Maps - Live shuttle tracking with Leaflet.js integration

Dynamic Scheduling - Real-time schedule updates and filtering

Fare Management - Transparent pricing with student and staff discounts

Admin Dashboard - Comprehensive management interface for system administrators

User Experience
Responsive Design - Works seamlessly on desktop, tablet, and mobile devices

Modern UI/UX - Clean, professional interface with smooth animations

Accessibility - WCAG compliant with proper contrast and keyboard navigation

Real-time Updates - Live shuttle locations and schedule changes

Technical Features
JSON Data Integration - Centralized data management

Local Storage - User session management

QR Code Generation - Digital boarding passes

Geolocation Services - User location detection and route optimization

🏗️ Project Structure
text
campus-transport-system/
│
├── index.html              # Homepage with system overview
├── Booking.html            # Seat booking and reservation system
├── Schedule.html           # Timetable and schedule management
├── Routes.html             # Interactive routes and maps
├── Fares.html              # Pricing and pass information
├── Admin.html              # Administrative dashboard
│
├── CSS/
│   ├── style.css           # Main stylesheet (homepage)
│   ├── booking.css         # Booking page styles
│   ├── schedule.css        # Schedule page styles
│   ├── routes.css          # Routes page styles
│   ├── fares.css           # Fares page styles
│   └── admin.css           # Admin panel styles
│
├── js/
│   ├── script.js           # Main application logic
│   ├── booking.js          # Booking system functionality
│   ├── schedule.js         # Schedule management
│   ├── routes.js           # Maps and routes functionality
│   ├── fares.js            # Fares and pricing logic
│   └── admin.js            # Admin panel functionality
│
├── Assets/
│   ├── images/
│   │   ├── logo.png        # University logo
│   │   └── background.jpg  # Background images
│   └── icons/
│       ├── Bus3.png        # Bus icons
│       ├── Bus4.png        # Additional bus icons
│       └── Bus5.png        # More bus icons
│
└── data/
└── booking.json        # Sample data structure (conceptual)
🚀 Quick Start
Prerequisites
Modern web browser (Chrome, Firefox, Safari, Edge)

Local server for development (optional but recommended)

Installation
Clone or download the project files

Open index.html in a web browser

For full functionality, serve via local server:

bash
# Using Python
python -m http.server 8000

# Using Node.js
npx http-server

# Using PHP
php -S localhost:8000
📱 Pages Overview
🏠 Homepage (index.html)
System introduction and features

Live shuttle tracker preview

Quick access to booking and schedules

Service announcements

🎫 Booking System (Booking.html)
Route selection and seat picking

Date and time scheduling

Real-time seat availability

QR code boarding passes

Booking confirmation and download

🕒 Schedule (Schedule.html)
Complete timetable view

Route-based filtering

Real-time departure information

Service updates and announcements

🗺️ Routes & Maps (Routes.html)
Interactive campus map

Live shuttle locations

Route visualization

Stop information and details

Search and filter functionality

💰 Fares & Passes (Fares.html)
Transparent pricing structure

Student and staff discounts

Transport pass options

Payment methods

FAQ section

⚙️ Admin Panel (Admin.html)
Route management

Booking oversight

Shuttle fleet management

System analytics

User management

🎨 Design System
Color Palette
Primary Blue: #0f28a5 - Trust and reliability

Dark Blue: #0a1a7a - Professionalism

Accent Yellow: #ffc107 - Attention and alerts

Success Green: #28a745 - Confirmation and success

Warning Orange: #ffc107 - Caution and pending

Danger Red: #dc3545 - Errors and warnings

Typography
Primary Font: Roboto - Clean and readable

Font Weights: 300 (Light), 400 (Regular), 500 (Medium), 700 (Bold)

Responsive scaling for optimal reading experience

Icons
Font Awesome 6.4.0 for consistent iconography

Custom bus icons for transportation theme

🔧 Technical Implementation
Frontend Technologies
HTML5 - Semantic markup

CSS3 - Modern styling with CSS Grid and Flexbox

JavaScript ES6+ - Vanilla JavaScript for performance

Leaflet.js - Interactive maps

QRCode.js - QR code generation

Data Management
JSON-based data structure

Local storage for user sessions

Modular JavaScript for maintainability

Responsive Breakpoints
Mobile: < 576px

Tablet: 576px - 768px

Desktop: 768px - 992px

Large Desktop: > 992px

📊 Data Structure
The system uses a comprehensive JSON structure for all data:

json
{
"systemInfo": { ... },
"routes": [ ... ],
"fares": { ... },
"bookings": [ ... ],
"shuttles": [ ... ],
"users": [ ... ],
"announcements": [ ... ],
"settings": { ... }
}
🌍 University of Cape Town Context
Campus Routes
Upper Campus Loop - Academic buildings and libraries

Middle Campus Express - Law, social sciences, and sports facilities

Residence Halls Circuit - Student accommodation areas

Lower Campus Connector - City center and medical campus

Hiddingh Campus Shuttle - Fine arts campus in city center

Breakfast Express - Early morning direct service

Local Integration
South African Rand (ZAR) pricing

Local payment methods (mobile money, student cards)

UCT-specific locations and terminology

South African cultural context

🚀 Deployment
Development
Clone repository

Serve files using local server

Access via http://localhost:8000

Production
Upload files to web server

Configure server for SPA routing

Set up SSL certificate

Configure domain and DNS

Browser Support
Chrome 90+

Firefox 88+

Safari 14+

Edge 90+

🔒 Security Features
Input validation and sanitization

XSS protection

CSRF token implementation (in production)

Secure session management

Data encryption for sensitive information

📈 Performance
Optimized images and assets

Minimal JavaScript footprint

Efficient CSS with minimal redundancy

Lazy loading for maps and images

Caching strategies implementation

🤝 Contributing
Fork the repository

Create feature branch (git checkout -b feature/AmazingFeature)

Commit changes (git commit -m 'Add some AmazingFeature')

Push to branch (git push origin feature/AmazingFeature)

Open Pull Request

📝 License
This project is licensed under the MIT License - see the LICENSE.md file for details.

🆘 Support
For support and questions:

📧 Email: transport@uct.ac.za

📞 Phone: (021) 650-9111

🏢 Office: Transportation Office, Upper Campus

🙏 Acknowledgments
University of Cape Town for the institutional context

OpenStreetMap for map data

Font Awesome for icons

Leaflet.js for mapping functionality

QRCode.js for QR generation

Built with ❤️ for the University of Cape Town community

Making campus transportation efficient, reliable, and accessible for all students, faculty, and staff.

