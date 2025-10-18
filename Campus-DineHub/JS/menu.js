// Comprehensive meal data
const meals = [
    {
        id: 1,
        name: "Grilled Chicken Salad",
        description: "Fresh mixed greens with perfectly grilled chicken breast, cherry tomatoes, cucumber, red onion, and our signature balsamic vinaigrette.",
        price: 7.99,
        image: "Assets/images/grilled-chicken.png",
        category: "salad",
        calories: 320,
        prepTime: 10,
        tags: ["healthy", "high-protein", "gluten-free"],
        popular: true,
        ingredients: ["Mixed greens", "Grilled chicken", "Cherry tomatoes", "Cucumber", "Red onion", "Balsamic vinaigrette"],
        customization: {
            dressing: ["Balsamic", "Ranch", "Caesar", "No dressing"],
            extras: ["Avocado (+R1.50)", "Feta cheese (+R1.00)", "Bacon bits (+R1.50)"]
        }
    },
    {
        id: 2,
        name: "Margherita Pizza",
        description: "Classic Italian pizza with fresh tomato sauce, mozzarella cheese, and fresh basil leaves on our thin crust.",
        price: 7.99,
        image: "Assets/images/pizza.jpg",
        category: "main",
        calories: 280,
        prepTime: 15,
        tags: ["vegetarian", "italian"],
        popular: true,
        ingredients: ["Pizza dough", "Tomato sauce", "Mozzarella", "Fresh basil", "Olive oil"],
        customization: {
            size: ["Small", "Medium", "Large"],
            toppings: ["Mushrooms (+R1.00)", "Olives (+R0.50)", "Extra cheese (+R1.50)"]
        }
    },
    {
        id: 3,
        name: "Pasta Primavera",
        description: "Fresh pasta with spring vegetables in a light cream sauce, topped with parmesan cheese.",
        price: 7.99,
        image: "Assets/images/pasta.jpg",
        category: "main",
        calories: 450,
        prepTime: 12,
        tags: ["vegetarian"],
        popular: false,
        ingredients: ["Penne pasta", "Bell peppers", "Zucchini", "Carrots", "Cream sauce", "Parmesan"],
        customization: {
            protein: ["Chicken (+R2.00)", "Shrimp (+R3.00)", "Tofu (+R1.50)"],
            sauce: ["Cream", "Tomato", "Pesto"]
        }
    },
    {
        id: 4,
        name: "Veggie Burger",
        description: "Plant-based patty with lettuce, tomato, onion, and special sauce on a whole wheat bun.",
        price: 7.99,
        image: "Assets/images/burger.jpg",
        category: "main",
        calories: 380,
        prepTime: 8,
        tags: ["vegetarian", "vegan-option"],
        popular: true,
        ingredients: ["Veggie patty", "Whole wheat bun", "Lettuce", "Tomato", "Onion", "Special sauce"],
        customization: {
            bun: ["Whole wheat", "Gluten-free (+R1.00)", "Lettuce wrap"],
            extras: ["Avocado (+R1.50)", "Vegan cheese (+R1.00)", "Bacon (+R1.50)"]
        }
    },
    {
        id: 5,
        name: "Caesar Salad",
        description: "Crisp romaine lettuce with parmesan cheese, croutons, and our homemade Caesar dressing.",
        price: 6.99,
        image: "Assets/images/caesar-salad.png",
        category: "salad",
        calories: 290,
        prepTime: 5,
        tags: ["vegetarian"],
        popular: false,
        ingredients: ["Romaine lettuce", "Parmesan", "Croutons", "Caesar dressing"],
        customization: {
            protein: ["Grilled chicken (+R2.00)", "Shrimp (+R3.00)", "None"],
            dressing: ["Regular", "Light", "No dressing"]
        }
    },
    {
        id: 6,
        name: "Chicken Wrap",
        description: "Grilled chicken, lettuce, tomato, and mayo wrapped in a soft flour tortilla.",
        price: 5.99,
        image: "Assets/images/chicken-wrap.png",
        category: "snack",
        calories: 320,
        prepTime: 5,
        tags: ["quick", "portable"],
        popular: true,
        ingredients: ["Flour tortilla", "Grilled chicken", "Lettuce", "Tomato", "Mayo"],
        customization: {
            sauce: ["Mayo", "Ranch", "Buffalo", "No sauce"],
            extras: ["Cheese (+R0.50)", "Bacon (+R1.50)"]
        }
    },
    {
        id: 7,
        name: "Avocado Toast",
        description: "Smashed avocado on artisan bread with cherry tomatoes and microgreens.",
        price: 4.99,
        image: "Assets/images/avocado-toast.png",
        category: "breakfast",
        calories: 280,
        prepTime: 7,
        tags: ["vegetarian", "healthy", "breakfast"],
        popular: false,
        ingredients: ["Artisan bread", "Avocado", "Cherry tomatoes", "Microgreens", "Lemon juice"],
        customization: {
            bread: ["Sourdough", "Whole wheat", "Gluten-free (+R1.00)"],
            extras: ["Poached egg (+R1.50)", "Feta cheese (+R1.00)"]
        }
    },
    {
        id: 8,
        name: "Fruit Smoothie",
        description: "Blended mixed fruits with yogurt and honey - the perfect refreshment.",
        price: 3.99,
        image: "Assets/images/smoothie.png",
        category: "beverages",
        calories: 180,
        prepTime: 3,
        tags: ["vegetarian", "healthy", "refreshing"],
        popular: true,
        ingredients: ["Mixed berries", "Banana", "Yogurt", "Honey", "Ice"],
        customization: {
            size: ["Regular", "Large (+R1.00)"],
            base: ["Yogurt", "Almond milk", "Orange juice"]
        }
    },
    {
        id: 9,
        name: "Breakfast Burrito",
        description: "Scrambled eggs, cheese, and your choice of bacon or sausage in a flour tortilla.",
        price: 6.49,
        image: "Assets/images/breakfast-burrito.png",
        category: "breakfast",
        calories: 420,
        prepTime: 8,
        tags: ["breakfast", "high-protein"],
        popular: false,
        ingredients: ["Flour tortilla", "Eggs", "Cheese", "Bacon", "Potatoes"],
        customization: {
            protein: ["Bacon", "Sausage", "Vegetarian"],
            extras: ["Avocado (+R1.50)", "Sour cream (+R0.50)"]
        }
    },
    {
        id: 10,
        name: "Greek Yogurt Parfait",
        description: "Layers of Greek yogurt, granola, and fresh berries - a healthy start to your day.",
        price: 4.49,
        image: "Assets/images/yogurt-parfait.png",
        category: "breakfast",
        calories: 240,
        prepTime: 2,
        tags: ["vegetarian", "healthy", "breakfast"],
        popular: true,
        ingredients: ["Greek yogurt", "Granola", "Mixed berries", "Honey"],
        customization: {
            yogurt: ["Regular", "Low-fat", "Plant-based (+R1.00)"],
            fruit: ["Mixed berries", "Strawberries", "Peaches"]
        }
    }
];

// Cart functionality
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let currentFilter = 'all';
let currentSort = 'name';
let currentSearch = '';
let displayedMeals = 6;

// DOM Elements
const menuContainer = document.getElementById('menu-container');
const filterButtons = document.querySelectorAll('.filter-btn');
const sortSelect = document.getElementById('sort-select');
const searchInput = document.getElementById('search-input');
const cartBtn = document.getElementById('cart-btn');
const cartSidebar = document.getElementById('cart-sidebar');
const closeCart = document.getElementById('close-cart');
const cartItems = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');
const cartCount = document.getElementById('cart-count');
const checkoutBtn = document.getElementById('checkout-btn');
const clearCartBtn = document.getElementById('clear-cart');
const itemsCount = document.getElementById('items-count');
const loadMoreBtn = document.getElementById('load-more-btn');
const mealModal = document.getElementById('meal-modal');
const closeModal = document.querySelector('.close-modal');
const mealModalContent = document.getElementById('meal-modal-content');

// Initialize the menu page
document.addEventListener('DOMContentLoaded', function() {
    displayMeals();
    updateCartCount();
    setupEventListeners();
});

// Display meals based on current filters and search
function displayMeals() {
    let filteredMeals = filterMeals();
    filteredMeals = sortMeals(filteredMeals);

    const mealsToShow = filteredMeals.slice(0, displayedMeals);

    menuContainer.innerHTML = '';

    if (mealsToShow.length === 0) {
        menuContainer.innerHTML = `
            <div class="no-results" style="grid-column: 1 / -1; text-align: center; padding: 3rem;">
                <i class="fa-solid fa-utensils" style="font-size: 3rem; color: var(--light-gray); margin-bottom: 1rem;"></i>
                <h3>No meals found</h3>
                <p>Try adjusting your search or filters</p>
            </div>
        `;
        loadMoreBtn.style.display = 'none';
        return;
    }

    mealsToShow.forEach(meal => {
        const mealCard = createMealCard(meal);
        menuContainer.appendChild(mealCard);
    });

    // Update items count
    itemsCount.textContent = filteredMeals.length;

    // Show/hide load more button
    loadMoreBtn.style.display = filteredMeals.length > displayedMeals ? 'block' : 'none';
}

// Create meal card HTML
function createMealCard(meal) {
    const mealCard = document.createElement('div');
    mealCard.className = 'meal-card';
    mealCard.innerHTML = `
        ${meal.popular ? '<span class="meal-badge popular">Popular</span>' : ''}
        ${meal.tags.includes('vegetarian') ? '<span class="meal-badge vegetarian">Vegetarian</span>' : ''}
        ${meal.tags.includes('new') ? '<span class="meal-badge new">New</span>' : ''}
        
        <img src="${meal.image}" alt="${meal.name}" class="meal-image">
        
        <div class="meal-info">
            <div class="meal-header">
                <h3>${meal.name}</h3>
                <div class="meal-price">R${meal.price.toFixed(2)}</div>
            </div>
            
            <p class="meal-description">${meal.description}</p>
            
            <div class="meal-meta">
                <span class="meal-calories">
                    <i class="fa-solid fa-fire"></i>
                    ${meal.calories} cal
                </span>
                <span class="meal-prep-time">
                    <i class="fa-solid fa-clock"></i>
                    ${meal.prepTime} min
                </span>
            </div>
            
            <div class="meal-actions">
                <button class="btn-view" data-id="${meal.id}">
                    <i class="fa-solid fa-eye"></i> View
                </button>
                <button class="btn-add" data-id="${meal.id}">
                    <i class="fa-solid fa-plus"></i> Add
                </button>
            </div>
        </div>
    `;

    return mealCard;
}

// Filter meals based on current category and search
function filterMeals() {
    let filtered = meals;

    // Filter by category
    if (currentFilter !== 'all') {
        filtered = filtered.filter(meal => meal.category === currentFilter);
    }

    // Filter by search
    if (currentSearch) {
        const searchTerm = currentSearch.toLowerCase();
        filtered = filtered.filter(meal =>
            meal.name.toLowerCase().includes(searchTerm) ||
            meal.description.toLowerCase().includes(searchTerm) ||
            meal.tags.some(tag => tag.toLowerCase().includes(searchTerm))
        );
    }

    return filtered;
}

// Sort meals based on current sort option
function sortMeals(mealsToSort) {
    switch (currentSort) {
        case 'name':
            return mealsToSort.sort((a, b) => a.name.localeCompare(b.name));
        case 'price-low':
            return mealsToSort.sort((a, b) => a.price - b.price);
        case 'price-high':
            return mealsToSort.sort((a, b) => b.price - a.price);
        case 'popular':
            return mealsToSort.sort((a, b) => (b.popular ? 1 : 0) - (a.popular ? 1 : 0));
        default:
            return mealsToSort;
    }
}

// Add item to cart
function addToCart(mealId, quantity = 1, customizations = {}) {
    const meal = meals.find(m => m.id === mealId);

    if (!meal) return;

    const existingItem = cart.find(item =>
        item.id === mealId &&
        JSON.stringify(item.customizations) === JSON.stringify(customizations)
    );

    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            ...meal,
            quantity: quantity,
            customizations: customizations
        });
    }

    // Save to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));

    // Update UI
    updateCartCount();
    showNotification(`${meal.name} added to cart!`);

    // If cart is open, update it
    if (cartSidebar.classList.contains('open')) {
        updateCartSidebar();
    }
}

// Update cart count in navigation
function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
}

// Update cart sidebar
function updateCartSidebar() {
    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="cart-empty">
                <i class="fa-solid fa-cart-shopping"></i>
                <p>Your cart is empty</p>
            </div>
        `;
        cartTotal.textContent = 'R0.00';
        checkoutBtn.disabled = true;
        return;
    }

    let total = 0;
    cartItems.innerHTML = '';

    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;

        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="cart-item-image">
            <div class="cart-item-details">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">R${itemTotal.toFixed(2)}</div>
                ${Object.keys(item.customizations).length > 0 ?
            `<div class="cart-item-customizations" style="font-size: 0.8rem; color: var(--gray); margin-top: 0.25rem;">
                        ${Object.entries(item.customizations).map(([key, value]) =>
                `${key}: ${value}`
            ).join(', ')}
                    </div>` : ''
        }
                <div class="cart-item-controls">
                    <button class="quantity-btn minus" data-index="${index}">-</button>
                    <span class="cart-item-quantity">${item.quantity}</span>
                    <button class="quantity-btn plus" data-index="${index}">+</button>
                    <button class="remove-item" data-index="${index}">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
        cartItems.appendChild(cartItem);
    });

    cartTotal.textContent = `R${total.toFixed(2)}`;
    checkoutBtn.disabled = false;

    // Add event listeners to cart item controls
    document.querySelectorAll('.quantity-btn.minus').forEach(btn => {
        btn.addEventListener('click', decreaseQuantity);
    });

    document.querySelectorAll('.quantity-btn.plus').forEach(btn => {
        btn.addEventListener('click', increaseQuantity);
    });

    document.querySelectorAll('.remove-item').forEach(btn => {
        btn.addEventListener('click', removeFromCart);
    });
}

// Show meal details modal
function showMealModal(mealId) {
    const meal = meals.find(m => m.id === mealId);
    if (!meal) return;

    mealModalContent.innerHTML = `
        <img src="${meal.image}" alt="${meal.name}" class="meal-modal-image">
        <div class="meal-modal-info">
            <div class="meal-modal-header">
                <div>
                    <h2 class="meal-modal-title">${meal.name}</h2>
                    <p class="meal-modal-description">${meal.description}</p>
                </div>
                <div class="meal-modal-price">R${meal.price.toFixed(2)}</div>
            </div>
            
            <div class="meal-modal-details">
                <div class="detail-item">
                    <i class="fa-solid fa-fire"></i>
                    <span class="detail-label">Calories</span>
                    <span class="detail-value">${meal.calories}</span>
                </div>
                <div class="detail-item">
                    <i class="fa-solid fa-clock"></i>
                    <span class="detail-label">Prep Time</span>
                    <span class="detail-value">${meal.prepTime} min</span>
                </div>
                <div class="detail-item">
                    <i class="fa-solid fa-tags"></i>
                    <span class="detail-label">Category</span>
                    <span class="detail-value">${meal.category}</span>
                </div>
            </div>
            
            <div class="meal-modal-customization">
                ${meal.customization ? Object.entries(meal.customization).map(([key, options]) => `
                    <div class="customization-section">
                        <h4>${key.charAt(0).toUpperCase() + key.slice(1)}</h4>
                        <div class="customization-options" data-option="${key}">
                            ${options.map(option => `
                                <div class="customization-option" data-value="${option}">${option}</div>
                            `).join('')}
                        </div>
                    </div>
                `).join('') : ''}
            </div>
            
            <div class="quantity-selector">
                <label>Quantity:</label>
                <div class="quantity-controls">
                    <button id="decrease-qty">-</button>
                    <span id="modal-quantity">1</span>
                    <button id="increase-qty">+</button>
                </div>
            </div>
            
            <div class="meal-modal-actions">
                <button id="add-to-cart-modal" class="btn-primary" style="flex: 1;">
                    Add to Cart - R${meal.price.toFixed(2)}
                </button>
            </div>
        </div>
    `;

    // Add event listeners for customization options
    document.querySelectorAll('.customization-option').forEach(option => {
        option.addEventListener('click', function() {
            const optionsContainer = this.parentElement;
            optionsContainer.querySelectorAll('.customization-option').forEach(opt => {
                opt.classList.remove('selected');
            });
            this.classList.add('selected');
        });
    });

    // Quantity controls
    document.getElementById('decrease-qty').addEventListener('click', function() {
        const quantityElement = document.getElementById('modal-quantity');
        let quantity = parseInt(quantityElement.textContent);
        if (quantity > 1) {
            quantityElement.textContent = quantity - 1;
        }
    });

    document.getElementById('increase-qty').addEventListener('click', function() {
        const quantityElement = document.getElementById('modal-quantity');
        let quantity = parseInt(quantityElement.textContent);
        quantityElement.textContent = quantity + 1;
    });

    // Add to cart from modal
    document.getElementById('add-to-cart-modal').addEventListener('click', function() {
        const quantity = parseInt(document.getElementById('modal-quantity').textContent);
        const customizations = {};

        // Get selected customizations
        document.querySelectorAll('.customization-options').forEach(container => {
            const selectedOption = container.querySelector('.customization-option.selected');
            if (selectedOption) {
                const optionType = container.getAttribute('data-option');
                customizations[optionType] = selectedOption.getAttribute('data-value');
            }
        });

        addToCart(mealId, quantity, customizations);
        closeMealModal();
    });

    mealModal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// Close meal modal
function closeMealModal() {
    mealModal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Show notification
function showNotification(message) {
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
        box-shadow: var(--shadow-lg);
        z-index: 4000;
        animation: slideIn 0.3s ease;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Cart item controls
function decreaseQuantity(event) {
    const index = parseInt(event.target.getAttribute('data-index'));
    if (cart[index].quantity > 1) {
        cart[index].quantity--;
    } else {
        cart.splice(index, 1);
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartSidebar();
    updateCartCount();
}

function increaseQuantity(event) {
    const index = parseInt(event.target.getAttribute('data-index'));
    cart[index].quantity++;
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartSidebar();
    updateCartCount();
}

function removeFromCart(event) {
    const index = parseInt(event.target.getAttribute('data-index'));
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartSidebar();
    updateCartCount();
}

// Setup event listeners
function setupEventListeners() {
    // Filter buttons
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            currentFilter = this.getAttribute('data-category');
            displayedMeals = 6;
            displayMeals();
        });
    });

    // Sort select
    sortSelect.addEventListener('change', function() {
        currentSort = this.value;
        displayMeals();
    });

    // Search input
    searchInput.addEventListener('input', function() {
        currentSearch = this.value;
        displayedMeals = 6;
        displayMeals();
    });

    // Cart button
    cartBtn.addEventListener('click', function() {
        cartSidebar.classList.add('open');
        updateCartSidebar();
    });

    // Close cart
    closeCart.addEventListener('click', function() {
        cartSidebar.classList.remove('open');
    });

    // Checkout button
    checkoutBtn.addEventListener('click', function() {
        if (cart.length > 0) {
            window.location.href = 'order.html';
        }
    });

    // Clear cart
    clearCartBtn.addEventListener('click', function() {
        cart = [];
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartSidebar();
        updateCartCount();
        showNotification('Cart cleared');
    });

    // Load more button
    loadMoreBtn.addEventListener('click', function() {
        displayedMeals += 6;
        displayMeals();
    });

    // Close modal
    closeModal.addEventListener('click', closeMealModal);

    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === mealModal) {
            closeMealModal();
        }
    });

    // Delegated event listeners for dynamic content
    menuContainer.addEventListener('click', function(event) {
        // View meal details
        if (event.target.classList.contains('btn-view') ||
            event.target.closest('.btn-view')) {
            const mealId = parseInt(event.target.closest('.btn-view').getAttribute('data-id'));
            showMealModal(mealId);
        }

        // Add to cart
        if (event.target.classList.contains('btn-add') ||
            event.target.closest('.btn-add')) {
            const mealId = parseInt(event.target.closest('.btn-add').getAttribute('data-id'));
            addToCart(mealId);
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
`;
document.head.appendChild(style);

const yearSpan = document.getElementById('year');
yearSpan.innerText = new Date().getFullYear().toString();