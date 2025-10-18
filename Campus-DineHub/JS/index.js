// Sample meal data
const meals = [
    {
        id: 1,
        name: "Grilled Chicken Salad",
        description: "Fresh greens with grilled chicken, cherry tomatoes, and balsamic dressing",
        price: 7.99,
        image: "Assets/images/grilled-chicken.png",
        category: "salad"
    },
    {
        id: 2,
        name: "Margherita Pizza",
        description: "Classic pizza with tomato sauce, mozzarella, and fresh basil",
        price: 7.99,
        image: "Assets/images/pizza.jpg",
        category: "main"
    },
    {
        id: 3,
        name: "Pasta Primavera",
        description: "Pasta with fresh spring vegetables in a light cream sauce",
        price: 7.99,
        image: "Assets/images/pasta.jpg",
        category: "main"
    },
    {
        id: 4,
        name: "Veggie Burger",
        description: "Plant-based patty with lettuce, tomato, and special sauce",
        price: 7.99,
        image: "Assets/images/burger.jpg",
        category: "main"
    },
    {
        id: 5,
        name: "Caesar Salad",
        description: "Romaine lettuce with parmesan, croutons, and Caesar dressing",
        price: 6.99,
        image: "Assets/images/caesar-salad.png",
        category: "salad"
    },
    {
        id: 6,
        name: "Chicken Wrap",
        description: "Grilled chicken, lettuce, and mayo in a soft tortilla",
        price: 5.99,
        image: "Assets/images/chicken-wrap.png",
        category: "snack"
    }
];

// Cart functionality
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// DOM Elements
const mealsContainer = document.getElementById('meals-container');
const filterButtons = document.querySelectorAll('.filter-btn');
const orderModal = document.getElementById('order-modal');
const orderForm = document.getElementById('order-form');
const closeModal = document.querySelector('.close');
const orderNowBtn = document.getElementById('order-now');
const orderBtn = document.getElementById('order-btn');
const menuBtn = document.getElementById('menu-btn');
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links ul');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    displayMeals(meals);
    setupEventListeners();
    updateNavOnScroll();
});

// Display meals in the grid
function displayMeals(mealsToShow) {
    mealsContainer.innerHTML = '';

    mealsToShow.forEach(meal => {
        const mealCard = document.createElement('div');
        mealCard.className = 'meal-card';
        mealCard.innerHTML = `
            <img src="${meal.image}" alt="${meal.name}" class="meal-image">
            <div class="meal-info">
                <h3>${meal.name}</h3>
                <p class="meal-description">${meal.description}</p>
                <p class="meal-price">R${meal.price.toFixed(2)}</p>
                <button class="add-to-cart" data-id="${meal.id}">Add to Cart</button>
            </div>
        `;
        mealsContainer.appendChild(mealCard);
    });

    // Add event listeners to the add to cart buttons
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', addToCart);
    });
}

// Filter meals by category
function filterMeals(category) {
    if (category === 'all') {
        displayMeals(meals);
    } else {
        const filteredMeals = meals.filter(meal => meal.category === category);
        displayMeals(filteredMeals);
    }
}

// Add item to cart
function addToCart(event) {
    const mealId = parseInt(event.target.getAttribute('data-id'));
    const meal = meals.find(m => m.id === mealId);

    const existingItem = cart.find(item => item.id === mealId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...meal,
            quantity: 1
        });
    }

    // Save to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));

    // Show confirmation
    showNotification(`${meal.name} added to cart!`);

    // Update cart count in UI if we have one
    updateCartCount();
}

// Show notification
function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: var(--primary);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 5px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        z-index: 3000;
        animation: slideIn 0.3s ease;
    `;

    document.body.appendChild(notification);

    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Update cart count in navigation
function updateCartCount() {
    let cartCount = document.getElementById('cart-count');

    if (!cartCount) {
        cartCount = document.createElement('span');
        cartCount.id = 'cart-count';
        cartCount.style.cssText = `
            background: var(--primary);
            color: white;
            border-radius: 50%;
            width: 20px;
            height: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 0.8rem;
            position: absolute;
            top: -5px;
            right: -5px;
        `;

        const orderBtn = document.getElementById('order-btn');
        orderBtn.style.position = 'relative';
        orderBtn.appendChild(cartCount);
    }

    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
}

// Setup all event listeners
function setupEventListeners() {
    // Filter buttons
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            // Filter meals
            filterMeals(this.getAttribute('data-category'));
        });
    });

    // Order buttons
    orderNowBtn.addEventListener('click', openOrderModal);
    orderBtn.addEventListener('click', openOrderModal);

    // Menu button scroll to menu
    menuBtn.addEventListener('click', function() {
        document.getElementById('menu').scrollIntoView({ behavior: 'smooth' });
    });

    // Modal close
    closeModal.addEventListener('click', closeOrderModal);

    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === orderModal) {
            closeOrderModal();
        }
    });

    // Hamburger menu for mobile
    hamburger.addEventListener('click', toggleMobileMenu);

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });

                // Close mobile menu if open
                if (navLinks.style.display === 'flex') {
                    toggleMobileMenu();
                }
            }
        });
    });
}

// Open order modal
function openOrderModal() {
    // Populate order form with cart items
    if (cart.length === 0) {
        orderForm.innerHTML = `
            <p>Your cart is empty. Add some items from the menu first!</p>
            <button class="btn-primary" onclick="closeOrderModal()">Continue Shopping</button>
        `;
    } else {
        let total = 0;
        orderForm.innerHTML = `
            <h3>Your Order</h3>
            <div class="order-items">
                ${cart.map(item => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
            return `
                        <div class="order-item">
                            <span>${item.name} x${item.quantity}</span>
                            <span>R${itemTotal.toFixed(2)}</span>
                        </div>
                    `;
        }).join('')}
            </div>
            <div class="order-total">
                <strong>Total: R${total.toFixed(2)}</strong>
            </div>
            <form id="checkout-form">
                <div class="form-group">
                    <label for="name">Full Name</label>
                    <input type="text" id="name" required>
                </div>
                <div class="form-group">
                    <label for="student-id">Student ID</label>
                    <input type="text" id="student-id" required>
                </div>
                <div class="form-group">
                    <label for="location">Pickup Location</label>
                    <select id="location" required>
                        <option value="">Select a location</option>
                        <option value="library">Library</option>
                        <option value="student-center">Student Center</option>
                        <option value="science-building">Science Building</option>
                        <option value="arts-building">Arts Building</option>
                    </select>
                </div>
                <button type="submit" class="btn-primary">Place Order</button>
            </form>
        `;

        // Add form submission handler
        document.getElementById('checkout-form').addEventListener('submit', placeOrder);
    }

    orderModal.style.display = 'block';
    document.body.style.overflow = 'hidden'; // Prevent scrolling
}

// Close order modal
function closeOrderModal() {
    orderModal.style.display = 'none';
    document.body.style.overflow = 'auto'; // Re-enable scrolling
}

// Place order
function placeOrder(event) {
    event.preventDefault();

    // In a real application, you would send this data to a server
    const name = document.getElementById('name').value;
    const studentId = document.getElementById('student-id').value;
    const location = document.getElementById('location').value;

    // Show success message
    orderForm.innerHTML = `
        <div class="order-success">
            <i class="fa-solid fa-check-circle" style="font-size: 3rem; color: var(--secondary); margin-bottom: 1rem;"></i>
            <h3>Order Placed Successfully!</h3>
            <p>Your order will be ready for pickup at the ${location} in approximately 20 minutes.</p>
            <p>Order confirmation has been sent to your student email.</p>
            <button class="btn-primary" onclick="closeOrderModal(); clearCart();">Done</button>
        </div>
    `;

    // In a real app, you would send the order to your backend here
    console.log('Order placed:', { name, studentId, location, cart });
}

// Clear cart after successful order
function clearCart() {
    cart = [];
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
}

// Toggle mobile menu
function toggleMobileMenu() {
    if (navLinks.style.display === 'flex') {
        navLinks.style.display = 'none';
        hamburger.classList.remove('active');
    } else {
        navLinks.style.display = 'flex';
        navLinks.style.flexDirection = 'column';
        navLinks.style.position = 'absolute';
        navLinks.style.top = '100%';
        navLinks.style.left = '0';
        navLinks.style.width = '100%';
        navLinks.style.background = 'var(--dark)';
        navLinks.style.padding = '2rem';
        navLinks.style.gap = '1.5rem';
        hamburger.classList.add('active');
    }
}

// Update navigation on scroll
function updateNavOnScroll() {
    window.addEventListener('scroll', function() {
        const nav = document.querySelector('nav');
        if (window.scrollY > 100) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });
}

// Add CSS for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    
    .hamburger.active span:nth-child(1) {
        transform: rotate(45deg) translate(5px, 5px);
    }
    
    .hamburger.active span:nth-child(2) {
        opacity: 0;
    }
    
    .hamburger.active span:nth-child(3) {
        transform: rotate(-45deg) translate(7px, -6px);
    }
    
    .order-items {
        margin-bottom: 1.5rem;
    }
    
    .order-item {
        display: flex;
        justify-content: space-between;
        padding: 0.5rem 0;
        border-bottom: 1px solid var(--light-gray);
    }
    
    .order-total {
        text-align: right;
        font-size: 1.2rem;
        margin-bottom: 1.5rem;
        padding-top: 0.5rem;
        border-top: 2px solid var(--light-gray);
    }
    
    .form-group {
        margin-bottom: 1rem;
    }
    
    .form-group label {
        display: block;
        margin-bottom: 0.5rem;
        font-weight: 600;
    }
    
    .form-group input,
    .form-group select {
        width: 100%;
        padding: 0.75rem;
        border: 1px solid var(--light-gray);
        border-radius: 5px;
        font-size: 1rem;
    }
    
    .order-success {
        text-align: center;
        padding: 1rem 0;
    }
`;
document.head.appendChild(style);

// Initialize cart count on page load
updateCartCount();

const yearSpan = document.getElementById('year');
yearSpan.textContent = new Date().getFullYear().toString();