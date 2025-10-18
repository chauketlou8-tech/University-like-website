Campus DineHub 🍽️
A comprehensive campus food ordering platform designed specifically for students, providing delicious, affordable, and convenient meal solutions right on campus.

https://img.shields.io/badge/Campus-DineHub-blue https://img.shields.io/badge/version-1.0.0-green https://img.shields.io/badge/license-MIT-lightgrey

🌟 Features
🏠 Home Page
Hero Section: Engaging banner with call-to-action buttons

Featured Meals: Showcase of popular menu items

Service Features: Highlight key benefits (Fast Delivery, Affordable Prices, Healthy Options)

Testimonials: Student reviews and chef quotes

📋 Menu Page
Advanced Filtering: Filter by categories (All, Main Courses, Salads, Snacks, Breakfast, Vegetarian, Beverages)

Search Functionality: Real-time search across meal names and descriptions

Interactive Meal Cards: Detailed meal information with images, prices, and descriptions

Shopping Cart: Add items to cart with customization options

Responsive Grid: Adapts to all screen sizes

🛒 Order & Checkout
Multi-step Checkout Process: Visual progress indicator

Order Summary: Real-time cart updates with item management

Delivery Options: Campus pickup or delivery

Multiple Payment Methods: Card, mobile payments, or cash on pickup

Form Validation: Comprehensive form validation with auto-save

Order Confirmation: Success modal with order details

💬 Feedback System
Rating System: 5-star ratings with category-specific ratings

Review Management: Filterable reviews with helpful voting

Feedback Form: Comprehensive form with order details tracking

Statistics Display: Average ratings and distribution charts

FAQ Section: Expandable/collapsible questions

👥 About Page
Company Story: Interactive timeline with company history

Team Profiles: Team member introductions with social links

Mission & Values: Company mission, vision, and core values

Sustainability Commitment: Environmental initiatives and statistics

Career Opportunities: Job listings with benefits showcase

Contact Information: Multiple contact methods and operating hours

🛍️ Shopping Cart Features
Persistent Cart: Cart data saved across all pages

Sidebar Cart: Slide-out cart accessible from any page

Item Management: Add, remove, and modify quantities

Real-time Updates: Instant price calculations and count updates

Cross-page Consistency: Seamless cart experience across the entire site

🚀 Quick Start
Prerequisites
Modern web browser (Chrome, Firefox, Safari, Edge)

Local server for development (optional but recommended)

Installation
Clone the repository

bash
git clone https://github.com/your-username/campus-dinehub.git
cd campus-dinehub
Project Structure

text
campus-dinehub/
├── index.html          # Home page
├── menu.html           # Menu page
├── order.html          # Order/Checkout page
├── feedback.html       # Feedback page
├── about.html          # About page
├── css/
│   ├── style.css       # Main styles
│   ├── menu.css        # Menu page styles
│   ├── order.css       # Order page styles
│   ├── feedback.css    # Feedback page styles
│   └── about.css       # About page styles
├── js/
│   ├── script.js       # Main JavaScript
│   ├── menu.js         # Menu functionality
│   ├── order.js        # Order functionality
│   ├── feedback.js     # Feedback functionality
│   └── about.js        # About page functionality
└── Assets/
└── images/         # All website images
Run the Website

Option 1: Open index.html directly in your browser

Option 2: Use a local server for better functionality

bash
# Using Python
python -m http.server 8000

# Using Node.js
npx http-server

# Using PHP
php -S localhost:8000
🎨 Customization
Adding New Menu Items
Edit the meals array in js/menu.js:

javascript
const meals = [
{
id: 7,
name: "New Meal Item",
description: "Delicious description of the new meal",
price: 8.99,
image: "Assets/images/new-meal.jpg",
category: "main",
calories: 350,
prepTime: 10,
tags: ["vegetarian", "healthy"],
popular: false,
ingredients: ["Ingredient 1", "Ingredient 2"],
customization: {
options: ["Option 1", "Option 2", "Option 3"]
}
}
// Add more items as needed
];
Modifying Colors and Styling
Update CSS variables in each CSS file:

css
:root {
--primary: #FF6B35;     /* Main brand color */
--secondary: #2EC4B6;   /* Secondary color */
--accent: #FF9F1C;      /* Accent color */
--dark: #1A1A2E;        /* Dark text color */
--light: #F8F9FA;       /* Light background */
/* Add more variables as needed */
}
Adding New Pages
Create new HTML file (e.g., contact.html)

Create corresponding CSS file (e.g., css/contact.css)

Create corresponding JS file (e.g., js/contact.js)

Update navigation in all existing pages

📱 Responsive Design
The website is fully responsive and optimized for:

Desktop (1200px+)

Tablet (768px - 1199px)

Mobile (320px - 767px)

🛠️ Technologies Used
HTML5: Semantic markup and structure

CSS3: Modern styling with CSS Grid and Flexbox

JavaScript: ES6+ for interactive functionality

Font Awesome: Icon library

Google Fonts: Typography (implicit)

LocalStorage: Client-side data persistence

🔧 Browser Support
Chrome 60+

Firefox 55+

Safari 12+

Edge 79+

📦 Data Storage
The application uses localStorage for:

🛒 Shopping cart items and quantities

⭐ User reviews and ratings

📝 Order form data (auto-save)

📧 Newsletter subscriptions

🎯 Key JavaScript Features
Cart Management
javascript
// Add item to cart
function addToCart(mealId, quantity, customizations)

// Update cart display
function updateCartSidebar()

// Persist cart data
localStorage.setItem('cart', JSON.stringify(cart))
Order Processing
javascript
// Multi-step form validation
function validateForm()

// Order confirmation
function processOrderSuccess()

// Payment method handling
function handlePaymentMethods()
Feedback System
javascript
// Star rating system
function setCategoryRating(container, rating)

// Review filtering
function filterReviews(filter)

// Helpful votes
function markHelpful(reviewId)
🌟 Performance Features
Lazy Loading: Images load as needed

Efficient DOM Updates: Minimal re-renders

Optimized Event Handling: Event delegation where possible

CSS Animations: Hardware-accelerated transitions

Local Storage: Reduced server requests

🐛 Troubleshooting
Common Issues
Cart not updating

Clear browser localStorage and refresh

Check JavaScript console for errors

Images not loading

Verify image paths in Assets/images/

Check file permissions

Form validation issues

Ensure all required fields are filled

Check browser console for validation errors

Debug Mode
Add ?debug=true to any URL to enable console logging:

javascript
// Debug utility in all JS files
const DEBUG = new URLSearchParams(window.location.search).has('debug');
function debugLog(...args) {
if (DEBUG) console.log(...args);
}
📈 Future Enhancements
User authentication and profiles

Real-time order tracking

Push notifications

Admin dashboard

Integration with payment gateways

Mobile app development

Loyalty program integration

Advanced analytics

🤝 Contributing
Fork the repository

Create a feature branch (git checkout -b feature/amazing-feature)

Commit your changes (git commit -m 'Add amazing feature')

Push to the branch (git push origin feature/amazing-feature)

Open a Pull Request

📄 License
This project is licensed under the MIT License - see the LICENSE file for details.

🏆 Acknowledgments
Icons by Font Awesome

Inspiration from modern food delivery platforms

Student feedback and testing contributions

📞 Support
For support and questions:

📧 Email: support@campusdinehub.com

🌐 Website: Campus DineHub

🐛 Issues: GitHub Issues

Campus DineHub - Nourishing Campus Communities, One Meal at a Time 🎓🍕

