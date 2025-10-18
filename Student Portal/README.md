Student Portal - Complete Web Application
Overview
A comprehensive student portal web application that allows students to manage their academic journey from application through course selection to tracking grades and progress.

Features
🎓 Application System
Complete Application Form: Personal information, academic history, and program selection

Program Choices: Computer Science, Mathematics, Business Administration, Psychology, and combined programs

Automatic Validation: Form validation with user-friendly error messages

Application Tracking: Save and review application status

📚 Course Management
Smart Course Selection: Courses automatically populated based on selected program

First-Year Focus: Only shows appropriate first-year courses

Multi-Program Support: Handles primary and secondary program choices

Course Requirements: Minimum 4 courses, maximum 6 courses selection

Credit Tracking: Real-time credit calculation during selection

📊 Dashboard
Personalized Welcome: Displays student name from application

Course Overview: Current courses with progress tracking

Upcoming Events: Program-specific events and deadlines

Quick Statistics: GPA, attendance, assignments, and study hours

Responsive Design: Works on desktop, tablet, and mobile devices

📈 Grades & Academic Progress
Grade Tracking: Current semester grades with GPA calculation

Academic Progress: Visual progress bars for credits and requirements

Grade Distribution: Visual charts showing performance patterns

Semester History: Support for multiple semesters (future implementation)

Export/Print: Grade export and printing capabilities

👤 Student Profile
Complete Profile: Personal, academic, and contact information

Profile Picture: Upload and manage profile photos

Academic Statistics: Courses, GPA, credits, and semester information

Password Management: Secure password change functionality

Emergency Contacts: Emergency contact information storage

Technical Architecture
File Structure
text
student-portal/
├── index.html              # Home page
├── Authentication.html     # Login page
├── application.html        # Application form
├── course-selection.html   # Course selection interface
├── dashboard.html          # Student dashboard
├── courses.html            # Course overview
├── grades.html             # Grades and academic progress
├── profile.html            # Student profile
├── styles/
│   ├── styles.css          # Main stylesheet
│   ├── dashboard.css       # Dashboard-specific styles
│   ├── courses.css         # Courses page styles
│   ├── grades.css          # Grades page styles
│   └── profile.css         # Profile page styles
├── JS/
│   ├── dashboard.js        # Dashboard functionality
│   ├── courses.js          # Courses management
│   ├── grades.js           # Grades calculation and display
│   ├── profile.js          # Profile management
│   └── course-selection.js # Course selection logic
└── data/
└── courses.json        # Course catalog data
Data Flow
Application Data: Stored in localStorage as completeApplication

Course Selection: Stored in localStorage as courseSelection

Session Management: Uses sessionStorage for login state

Profile Data: Combines application data with academic progress

Key Technologies
Frontend: HTML5, CSS3, JavaScript (ES6+)

Styling: CSS Grid, Flexbox, CSS Custom Properties

Icons: Font Awesome 6.4.0

Storage: localStorage and sessionStorage APIs

Responsive Design: Mobile-first approach

Installation & Setup
Prerequisites
Modern web browser (Chrome, Firefox, Safari, Edge)

Local web server (for file:// protocol limitations)

Quick Start
Clone or download the project files

Serve the files using a local web server:

bash
# Using Python 3
python -m http.server 8000

# Using Node.js http-server
npx http-server

# Using PHP
php -S localhost:8000
Open http://localhost:8000 in your browser

File Protocol Note
Due to browser security restrictions, some features (like loading JSON files) may not work when opening HTML files directly via file:// protocol. Always use a local web server.

Usage Guide
1. Application Process
   Start at the home page and navigate to the application

Fill out personal information and academic history

Select your preferred program and secondary choice

Submit the application for processing

2. Course Selection
   After application completion, access the course selection page

Browse courses filtered by your program choices

Select 4-6 courses (minimum 4, maximum 6)

Review selected courses and total credits

Submit your course selection

3. Dashboard & Academic Tracking
   View your personalized dashboard with current courses

Check upcoming events and deadlines

Monitor academic statistics and progress

Access detailed grades and performance metrics

4. Profile Management
   Update personal information and contact details

Upload profile picture

Change account password

View academic standing and program information

Data Storage
localStorage Items
completeApplication: Full application data including personal info and program choices

courseSelection: Selected courses with timestamps

profileImage: Base64 encoded profile picture

userPreferences: UI preferences and settings

sessionStorage Items
isLoggedIn: Authentication status

userProfile: Current user session data

currentUserId: Active user identifier

Customization
Adding New Programs
Update data/courses.json with new program structure

Add program to program mapping in course selection JavaScript

Update application form options

Modifying Course Catalog
Edit data/courses.json to add/remove courses or modify course details:

json
{
"programs": {
"new-program": [
{
"name": "Course Name",
"code": "CODE101",
"instructor": "Instructor Name",
"credits": 3,
"icon": "fas fa-icon",
"description": "Course description",
"schedule": "Mon/Wed 10:00-11:30",
"prerequisites": "None",
"level": "first-year"
}
]
}
}
Styling Customization
Modify CSS custom properties in styles/ files:

css
:root {
--primary: #3498db;     /* Primary brand color */
--secondary: #2ecc71;   /* Success and progress color */
--accent: #9b59b6;      /* Accent and highlight color */
--dark: #2c3e50;        /* Text and dark elements */
--light: #ecf0f1;       /* Background and light elements */
}
Browser Support
Chrome 60+

Firefox 55+

Safari 12+

Edge 79+

Future Enhancements
Backend integration with database

User authentication system

Email notifications

Calendar integration

File upload for assignments

Discussion forums

Mobile app version

Contributing
Fork the repository

Create a feature branch

Make your changes

Test across different browsers

Submit a pull request

License
This project is for educational purposes. Feel free to modify and use for learning web development.

Support
For issues or questions:

Check browser console for errors

Verify local server is running

Ensure all files are in correct directory structure

Clear browser storage if experiencing data issues