// Order management
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let orderData = JSON.parse(localStorage.getItem('orderData')) || {};
let appliedPromo = null;

// Promo codes
const promoCodes = {
    'STUDENT10': { discount: 0.10, type: 'percentage', description: '10% Student Discount' },
    'WELCOME5': { discount: 5, type: 'fixed', description: 'R5 Welcome Discount' },
    'FIRSTORDER': { discount: 0.15, type: 'percentage', description: '15% First Order' }
};

// DOM Elements
const orderItems = document.getElementById('order-items');
const subtotalElement = document.getElementById('subtotal');
const serviceFeeElement = document.getElementById('service-fee');
const discountElement = document.getElementById('discount');
const grandTotalElement = document.getElementById('grand-total');
const cartCount = document.getElementById('cart-count');
const promoInput = document.getElementById('promo-input');
const applyPromoBtn = document.getElementById('apply-promo');
const orderForm = document.getElementById('order-form');
const placeOrderBtn = document.getElementById('place-order-btn');
const backToMenuBtn = document.getElementById('back-to-menu');
const confirmationModal = document.getElementById('order-confirmation');
const viewOrderStatusBtn = document.getElementById('view-order-status');
const newOrderBtn = document.getElementById('new-order');

// Delivery options
const deliveryOptions = document.querySelectorAll('input[name="delivery-option"]');
const deliveryAddressSection = document.querySelector('.delivery-address');
const pickupLocation = document.getElementById('pickup-location');

// Payment methods
const paymentMethods = document.querySelectorAll('input[name="payment-method"]');
const cardDetails = document.getElementById('card-details');
const mobileDetails = document.getElementById('mobile-details');

// Initialize the order page
document.addEventListener('DOMContentLoaded', function() {
    loadOrderSummary();
    updateCartCount();
    setupEventListeners();
    loadSavedFormData();
});

// Load order summary
function loadOrderSummary() {
    if (cart.length === 0) {
        showEmptyCart();
        return;
    }

    orderItems.innerHTML = '';
    let subtotal = 0;

    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;

        const orderItem = document.createElement('div');
        orderItem.className = 'order-item';
        orderItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="order-item-image">
            <div class="order-item-details">
                <div class="order-item-name">${item.name}</div>
                <div class="order-item-price">R${itemTotal.toFixed(2)}</div>
                ${Object.keys(item.customizations).length > 0 ?
            `<div class="order-item-customizations">
                        ${Object.entries(item.customizations).map(([key, value]) =>
                `${key}: ${value}`
            ).join(', ')}
                    </div>` : ''
        }
                <div class="order-item-controls">
                    <button class="quantity-btn minus" data-index="${index}">-</button>
                    <span class="order-item-quantity">${item.quantity}</span>
                    <button class="quantity-btn plus" data-index="${index}">+</button>
                    <button class="remove-item" data-index="${index}">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
        orderItems.appendChild(orderItem);
    });

    calculateTotals(subtotal);

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

// Show empty cart state
function showEmptyCart() {
    orderItems.innerHTML = `
        <div class="empty-cart">
            <i class="fa-solid fa-cart-shopping"></i>
            <h3>Your cart is empty</h3>
            <p>Add some delicious meals from our menu to get started!</p>
            <a href="menu.html" class="btn-primary" style="margin-top: 1rem; display: inline-block;">
                Browse Menu
            </a>
        </div>
    `;

    // Disable form if cart is empty
    placeOrderBtn.disabled = true;
    placeOrderBtn.textContent = 'Cart is Empty';

    // Set all totals to zero
    subtotalElement.textContent = 'R0.00';
    serviceFeeElement.textContent = 'R0.00';
    discountElement.textContent = '-R0.00';
    grandTotalElement.textContent = 'R0.00';
}

// Calculate order totals
function calculateTotals(subtotal) {
    const serviceFee = subtotal > 0 ? 5.00 : 0; // R5 service fee
    let discount = 0;

    // Apply student discount (10%)
    const studentDiscount = subtotal * 0.10;

    // Apply promo code if valid
    if (appliedPromo) {
        if (appliedPromo.type === 'percentage') {
            discount += subtotal * appliedPromo.discount;
        } else {
            discount += appliedPromo.discount;
        }
    }

    // Student discount is applied regardless of promo
    discount += studentDiscount;

    const grandTotal = subtotal + serviceFee - discount;

    // Update UI
    subtotalElement.textContent = `R${subtotal.toFixed(2)}`;
    serviceFeeElement.textContent = `R${serviceFee.toFixed(2)}`;
    discountElement.textContent = `-R${discount.toFixed(2)}`;
    grandTotalElement.textContent = `R${grandTotal.toFixed(2)}`;

    // Save totals for order confirmation
    orderData.totals = {
        subtotal,
        serviceFee,
        discount,
        grandTotal
    };
    localStorage.setItem('orderData', JSON.stringify(orderData));
}

// Update cart count
function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
}

// Cart item controls
function decreaseQuantity(event) {
    const index = parseInt(event.target.getAttribute('data-index'));
    if (cart[index].quantity > 1) {
        cart[index].quantity--;
    } else {
        cart.splice(index, 1);
    }
    saveAndReloadCart();
}

function increaseQuantity(event) {
    const index = parseInt(event.target.getAttribute('data-index'));
    cart[index].quantity++;
    saveAndReloadCart();
}

function removeFromCart(event) {
    const index = parseInt(event.target.getAttribute('data-index'));
    cart.splice(index, 1);
    saveAndReloadCart();
}

function saveAndReloadCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
    loadOrderSummary();
    updateCartCount();

    // If cart becomes empty, show empty state
    if (cart.length === 0) {
        showEmptyCart();
    }
}

// Apply promo code
function applyPromoCode() {
    const code = promoInput.value.trim().toUpperCase();

    if (!code) {
        showNotification('Please enter a promo code', 'error');
        return;
    }

    if (promoCodes[code]) {
        appliedPromo = promoCodes[code];
        showNotification(`Promo code applied: ${appliedPromo.description}`, 'success');
        promoInput.value = '';
        loadOrderSummary(); // Recalculate totals
    } else {
        showNotification('Invalid promo code', 'error');
    }
}

// Setup event listeners
function setupEventListeners() {
    // Promo code
    applyPromoBtn.addEventListener('click', applyPromoCode);
    promoInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            applyPromoCode();
        }
    });

    // Delivery options
    deliveryOptions.forEach(option => {
        option.addEventListener('change', function() {
            if (this.value === 'delivery') {
                deliveryAddressSection.style.display = 'block';
                orderData.totals.serviceFee += 15.00; // Add delivery fee
                loadOrderSummary(); // Recalculate totals
            } else {
                deliveryAddressSection.style.display = 'none';
                if (orderData.totals.serviceFee > 5.00) {
                    orderData.totals.serviceFee = 5.00; // Reset to base service fee
                }
                loadOrderSummary(); // Recalculate totals
            }
        });
    });

    // Payment methods
    paymentMethods.forEach(method => {
        method.addEventListener('change', function() {
            if (this.value === 'card') {
                cardDetails.style.display = 'block';
                mobileDetails.style.display = 'none';
            } else if (this.value === 'mobile') {
                cardDetails.style.display = 'none';
                mobileDetails.style.display = 'block';
            } else {
                cardDetails.style.display = 'none';
                mobileDetails.style.display = 'none';
            }
        });
    });

    // Form submission
    orderForm.addEventListener('submit', placeOrder);

    // Back to menu
    backToMenuBtn.addEventListener('click', function() {
        window.location.href = 'menu.html';
    });

    // Confirmation modal actions
    viewOrderStatusBtn.addEventListener('click', function() {
        // In a real app, this would go to order tracking
        window.location.href = 'index.html';
    });

    newOrderBtn.addEventListener('click', function() {
        // Clear cart and start new order
        cart = [];
        localStorage.setItem('cart', JSON.stringify(cart));
        confirmationModal.style.display = 'none';
        window.location.href = 'menu.html';
    });

    // Save form data on input
    const formInputs = orderForm.querySelectorAll('input, select, textarea');
    formInputs.forEach(input => {
        input.addEventListener('input', saveFormData);
        input.addEventListener('change', saveFormData);
    });
}

// Save form data to localStorage
function saveFormData() {
    const formData = new FormData(orderForm);
    const data = {};

    for (let [key, value] of formData.entries()) {
        data[key] = value;
    }

    orderData.formData = data;
    localStorage.setItem('orderData', JSON.stringify(orderData));
}

// Load saved form data
function loadSavedFormData() {
    if (orderData.formData) {
        const formData = orderData.formData;

        for (let key in formData) {
            const element = orderForm.querySelector(`[name="${key}"]`);
            if (element) {
                if (element.type === 'checkbox' || element.type === 'radio') {
                    if (element.value === formData[key]) {
                        element.checked = true;

                        // Trigger change event for dependent elements
                        if (element.name === 'delivery-option') {
                            element.dispatchEvent(new Event('change'));
                        }
                        if (element.name === 'payment-method') {
                            element.dispatchEvent(new Event('change'));
                        }
                    }
                } else {
                    element.value = formData[key];
                }
            }
        }
    }
}

// Place order
function placeOrder(event) {
    event.preventDefault();

    if (cart.length === 0) {
        showNotification('Your cart is empty', 'error');
        return;
    }

    // Validate required fields
    if (!validateForm()) {
        showNotification('Please fill in all required fields', 'error');
        return;
    }

    // Show loading state
    placeOrderBtn.disabled = true;
    placeOrderBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Processing...';

    // Simulate API call
    setTimeout(() => {
        processOrderSuccess();
    }, 2000);
}

// Validate form
function validateForm() {
    const requiredFields = orderForm.querySelectorAll('[required]');
    let isValid = true;

    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            isValid = false;
            field.style.borderColor = 'var(--error)';
        } else {
            field.style.borderColor = '';
        }
    });

    // Additional validation for card details if card payment is selected
    const cardPayment = document.querySelector('input[name="payment-method"]:checked').value === 'card';
    if (cardPayment) {
        const cardNumber = document.getElementById('card-number').value;
        const expiryDate = document.getElementById('expiry-date').value;
        const cvv = document.getElementById('cvv').value;
        const cardName = document.getElementById('card-name').value;

        if (!cardNumber || !expiryDate || !cvv || !cardName) {
            isValid = false;
            showNotification('Please fill in all card details', 'error');
        }
    }

    return isValid;
}

// Process successful order
function processOrderSuccess() {
    // Generate order number
    const orderNumber = 'CDH-' + Math.floor(100000 + Math.random() * 900000);

    // Get pickup location name
    const pickupLocationElement = document.getElementById('pickup-location');
    const pickupLocationText = pickupLocationElement.options[pickupLocationElement.selectedIndex].text;

    // Update confirmation modal
    document.getElementById('confirmed-order-number').textContent = orderNumber;
    document.getElementById('estimated-ready-time').textContent = '20 minutes';
    document.getElementById('confirmed-pickup-location').textContent = pickupLocationText;
    document.getElementById('confirmed-total').textContent = grandTotalElement.textContent;

    // Show confirmation modal
    confirmationModal.style.display = 'block';

    // Clear cart and order data
    cart = [];
    localStorage.removeItem('cart');
    localStorage.removeItem('orderData');
    updateCartCount();

    // Reset button
    placeOrderBtn.disabled = false;
    placeOrderBtn.innerHTML = 'Place Order <i class="fa-solid fa-lock"></i>';
}

// Show notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;

    const backgroundColor = type === 'error' ? 'var(--error)' :
        type === 'success' ? 'var(--success)' : 'var(--primary)';

    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${backgroundColor};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 5px;
        box-shadow: var(--shadow-lg);
        z-index: 5000;
        animation: slideIn 0.3s ease;
        max-width: 300px;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 4000);
}

// Add CSS for notifications and animations
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
    
    .fa-spin {
        animation: fa-spin 1s infinite linear;
    }
    
    @keyframes fa-spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
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

// Cart functionality for order page
function initializeCart() {
    const cartBtn = document.getElementById('cart-btn');
    const closeCartBtn = document.getElementById('close-cart');
    const checkoutBtn = document.getElementById('checkout-btn');
    const clearCartBtn = document.getElementById('clear-cart');
    const cartSidebar = document.getElementById('cart-sidebar');

    if (cartBtn) {
        cartBtn.addEventListener('click', openCart);
    }

    if (closeCartBtn) {
        closeCartBtn.addEventListener('click', closeCart);
    }

    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function() {
            // Already on checkout page, just close cart
            closeCart();
        });
    }

    if (clearCartBtn) {
        clearCartBtn.addEventListener('click', clearCartFromSidebar);
    }

    // Close cart when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === cartSidebar) {
            closeCart();
        }
    });
}

function openCart() {
    const cartSidebar = document.getElementById('cart-sidebar');
    if (cartSidebar) {
        updateCartSidebar();
        cartSidebar.classList.add('open');
    }
}

function closeCart() {
    const cartSidebar = document.getElementById('cart-sidebar');
    if (cartSidebar) {
        cartSidebar.classList.remove('open');
    }
}

function updateCartSidebar() {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalElement = document.getElementById('cart-total');

    if (!cartItemsContainer || !cartTotalElement) return;

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="cart-empty">
                <i class="fa-solid fa-cart-shopping"></i>
                <p>Your cart is empty</p>
            </div>
        `;
        cartTotalElement.textContent = 'R0.00';
        return;
    }

    let total = 0;
    cartItemsContainer.innerHTML = '';

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
                ${Object.keys(item.customizations || {}).length > 0 ?
            `<div class="cart-item-customizations" style="font-size: 0.8rem; color: var(--gray); margin-top: 0.25rem;">
                        ${Object.entries(item.customizations).map(([key, value]) =>
                `${key}: ${value}`
            ).join(', ')}
                    </div>` : ''
        }
                <div class="cart-item-controls">
                    <button class="quantity-btn minus" onclick="decreaseCartQuantityFromSidebar(${index})">-</button>
                    <span class="cart-item-quantity">${item.quantity}</span>
                    <button class="quantity-btn plus" onclick="increaseCartQuantityFromSidebar(${index})">+</button>
                    <button class="remove-item" onclick="removeFromCartFromSidebar(${index})">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
        cartItemsContainer.appendChild(cartItem);
    });

    cartTotalElement.textContent = `R${total.toFixed(2)}`;
}

function decreaseCartQuantityFromSidebar(index) {
    if (cart[index].quantity > 1) {
        cart[index].quantity--;
    } else {
        cart.splice(index, 1);
    }
    saveAndUpdateCartSidebar();
}

function increaseCartQuantityFromSidebar(index) {
    cart[index].quantity++;
    saveAndUpdateCartSidebar();
}

function removeFromCartFromSidebar(index) {
    cart.splice(index, 1);
    saveAndUpdateCartSidebar();
}

function clearCartFromSidebar() {
    cart = [];
    saveAndUpdateCartSidebar();
    showNotification('Cart cleared', 'success');
}

function saveAndUpdateCartSidebar() {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    updateCartSidebar();
    loadOrderSummary(); // Also update the main order summary
}

// Update the DOMContentLoaded event in order.js
document.addEventListener('DOMContentLoaded', function() {
    loadOrderSummary();
    updateCartCount();
    setupEventListeners();
    loadSavedFormData();
    initializeCart(); // Add this line
});