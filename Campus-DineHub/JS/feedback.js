// Feedback data and management
let reviews = JSON.parse(localStorage.getItem('reviews')) || [];
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let categoryRatings = {
    'food-quality': 0,
    'delivery-speed': 0,
    'customer-service': 0,
    'value-money': 0
};

// Sample reviews data
const sampleReviews = [
    {
        id: 1,
        name: "Sarah M.",
        course: "Computer Science",
        rating: 5,
        title: "Amazing food and fast delivery!",
        comment: "The grilled chicken salad is always fresh and delicious. Delivery is consistently under 15 minutes. Highly recommend!",
        date: "2023-11-15",
        helpful: 12,
        orderItems: "Grilled Chicken Salad, Smoothie"
    },
    {
        id: 2,
        name: "James K.",
        course: "Engineering",
        rating: 4,
        title: "Great value for money",
        comment: "The portions are generous and prices are very student-friendly. The pizza could be a bit crispier, but overall great experience.",
        date: "2023-11-14",
        helpful: 8,
        orderItems: "Margherita Pizza, Caesar Salad"
    },
    {
        id: 3,
        name: "Lisa T.",
        course: "Business",
        rating: 5,
        title: "Perfect for busy students",
        comment: "As a final year student, this service has been a lifesaver. The food is always ready when they say it will be.",
        date: "2023-11-13",
        helpful: 15,
        orderItems: "Veggie Burger, Fries"
    },
    {
        id: 4,
        name: "Mike R.",
        course: "Medicine",
        rating: 4,
        title: "Consistently good",
        comment: "I order from here 3-4 times a week. The quality is always consistent and the staff is friendly.",
        date: "2023-11-12",
        helpful: 6,
        orderItems: "Pasta Primavera, Garlic Bread"
    },
    {
        id: 5,
        name: "Emma L.",
        course: "Arts",
        rating: 3,
        title: "Good but could be better",
        comment: "Food is tasty but sometimes the delivery takes longer than expected during peak hours.",
        date: "2023-11-10",
        helpful: 3,
        orderItems: "Chicken Wrap, Smoothie"
    },
    {
        id: 6,
        name: "David P.",
        course: "Law",
        rating: 5,
        title: "Best campus food service!",
        comment: "The variety is great and everything I've tried has been delicious. The mobile app makes ordering super easy.",
        date: "2023-11-09",
        helpful: 10,
        orderItems: "Breakfast Burrito, Coffee"
    }
];

// Initialize with sample data if no reviews exist
if (reviews.length === 0) {
    reviews = sampleReviews;
    localStorage.setItem('reviews', JSON.stringify(reviews));
}

// DOM Elements
const feedbackForm = document.getElementById('feedback-form');
const ratingInputs = document.querySelectorAll('input[name="rating"]');
const ratingText = document.getElementById('rating-text');
const categoryStars = document.querySelectorAll('.category-stars');
const charCounter = document.getElementById('char-counter');
const feedbackComment = document.getElementById('feedback-comment');
const reviewsContainer = document.getElementById('reviews-container');
const filterButtons = document.querySelectorAll('.filter-btn');
const loadMoreBtn = document.getElementById('load-more-reviews');
const submitFeedbackBtn = document.getElementById('submit-feedback');
const clearFormBtn = document.getElementById('clear-form');
const successModal = document.getElementById('feedback-success');
const submitAnotherBtn = document.getElementById('submit-another');
const backToHomeBtn = document.getElementById('back-to-home');
const faqItems = document.querySelectorAll('.faq-item');
const distributionBars = document.querySelectorAll('.bar-fill');

// Cart DOM Elements
const cartSidebar = document.getElementById('cart-sidebar');
const closeCartBtn = document.getElementById('close-cart');
const cartItemsContainer = document.getElementById('cart-items');
const cartTotalElement = document.getElementById('cart-total');
const checkoutBtn = document.getElementById('checkout-btn');
const clearCartBtn = document.getElementById('clear-cart');
const cartBtn = document.getElementById('cart-btn');
const orderBtn = document.getElementById('order-btn');
const cartCount = document.getElementById('cart-count');

// Rating labels
const ratingLabels = {
    1: "Poor - Very disappointed",
    2: "Fair - Could be better",
    3: "Good - Met expectations",
    4: "Very Good - Happy with the experience",
    5: "Excellent - Above and beyond!"
};

// Initialize the feedback page
document.addEventListener('DOMContentLoaded', function() {
    initializePage();
    setupEventListeners();
    loadReviews();
    animateDistributionBars();
    initializeCart();
});

// Initialize page elements
function initializePage() {
    updateReviewStats();
    updateCartCount();
}

// Setup event listeners
function setupEventListeners() {
    // Overall rating stars
    if (ratingInputs) {
        ratingInputs.forEach(input => {
            input.addEventListener('change', function() {
                updateRatingText(this.value);
            });
        });
    }

    // Category rating stars
    if (categoryStars) {
        categoryStars.forEach(container => {
            const stars = container.querySelectorAll('i');
            stars.forEach(star => {
                star.addEventListener('click', function() {
                    const rating = parseInt(this.getAttribute('data-rating'));
                    const category = container.getAttribute('data-category');
                    setCategoryRating(container, rating);
                    categoryRatings[category] = rating;
                });

                star.addEventListener('mouseover', function() {
                    const rating = parseInt(this.getAttribute('data-rating'));
                    highlightStars(container, rating);
                });
            });

            container.addEventListener('mouseleave', function() {
                const currentRating = categoryRatings[this.getAttribute('data-category')];
                highlightStars(this, currentRating);
            });
        });
    }

    // Character counter
    if (feedbackComment && charCounter) {
        feedbackComment.addEventListener('input', function() {
            const count = this.value.length;
            charCounter.textContent = count;

            if (count > 450) {
                charCounter.className = 'char-count warning';
            } else if (count > 500) {
                charCounter.className = 'char-count error';
            } else {
                charCounter.className = 'char-count';
            }
        });
    }

    // Form submission
    if (feedbackForm) {
        feedbackForm.addEventListener('submit', submitFeedback);
    }

    // Clear form
    if (clearFormBtn) {
        clearFormBtn.addEventListener('click', clearForm);
    }

    // Review filters
    if (filterButtons) {
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                filterButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                const filter = this.getAttribute('data-filter');
                filterReviews(filter);
            });
        });
    }

    // Load more reviews
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', loadMoreReviews);
    }

    // FAQ toggle
    if (faqItems) {
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            if (question) {
                question.addEventListener('click', () => {
                    item.classList.toggle('active');
                });
            }
        });
    }

    // Success modal actions
    if (submitAnotherBtn) {
        submitAnotherBtn.addEventListener('click', function() {
            if (successModal) successModal.style.display = 'none';
            clearForm();
            const formSection = document.querySelector('.feedback-form-section');
            if (formSection) {
                formSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    if (backToHomeBtn) {
        backToHomeBtn.addEventListener('click', function() {
            window.location.href = 'index.html';
        });
    }
}

// Initialize cart functionality
function initializeCart() {
    // Cart event listeners
    if (cartBtn) {
        cartBtn.addEventListener('click', openCart);
    }

    if (closeCartBtn) {
        closeCartBtn.addEventListener('click', closeCart);
    }

    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', goToCheckout);
    }

    if (clearCartBtn) {
        clearCartBtn.addEventListener('click', clearCart);
    }

    if (orderBtn) {
        orderBtn.addEventListener('click', goToOrder);
    }

    // Close cart when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === cartSidebar) {
            closeCart();
        }
    });
}

// Cart functions
function openCart() {
    if (cartSidebar) {
        updateCartSidebar();
        cartSidebar.classList.add('open');
    }
}

function closeCart() {
    if (cartSidebar) {
        cartSidebar.classList.remove('open');
    }
}

function updateCartSidebar() {
    if (!cartItemsContainer || !cartTotalElement) return;

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="cart-empty">
                <i class="fa-solid fa-cart-shopping"></i>
                <p>Your cart is empty</p>
            </div>
        `;
        cartTotalElement.textContent = 'R0.00';
        if (checkoutBtn) checkoutBtn.disabled = true;
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
                    <button class="quantity-btn minus" onclick="decreaseCartQuantity(${index})">-</button>
                    <span class="cart-item-quantity">${item.quantity}</span>
                    <button class="quantity-btn plus" onclick="increaseCartQuantity(${index})">+</button>
                    <button class="remove-item" onclick="removeFromCart(${index})">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
        cartItemsContainer.appendChild(cartItem);
    });

    cartTotalElement.textContent = `R${total.toFixed(2)}`;
    if (checkoutBtn) checkoutBtn.disabled = false;
}

function decreaseCartQuantity(index) {
    if (cart[index].quantity > 1) {
        cart[index].quantity--;
    } else {
        cart.splice(index, 1);
    }
    saveAndUpdateCart();
}

function increaseCartQuantity(index) {
    cart[index].quantity++;
    saveAndUpdateCart();
}

function removeFromCart(index) {
    cart.splice(index, 1);
    saveAndUpdateCart();
}

function clearCart() {
    cart = [];
    saveAndUpdateCart();
    showNotification('Cart cleared', 'success');
}

function saveAndUpdateCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    updateCartSidebar();
}

function goToCheckout() {
    if (cart.length > 0) {
        window.location.href = 'order.html';
    } else {
        showNotification('Your cart is empty', 'error');
    }
}

function goToOrder() {
    window.location.href = 'order.html';
}

function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 0), 0);
    if (cartCount) {
        cartCount.textContent = totalItems;
    }
}

// Feedback functions
function updateRatingText(rating) {
    if (ratingText) {
        ratingText.textContent = ratingLabels[rating] || "Select your rating";
    }
}

function setCategoryRating(container, rating) {
    const stars = container.querySelectorAll('i');
    stars.forEach(star => {
        const starRating = parseInt(star.getAttribute('data-rating'));
        if (starRating <= rating) {
            star.classList.add('active');
            star.classList.remove('fa-regular');
            star.classList.add('fa-solid');
        } else {
            star.classList.remove('active');
            star.classList.add('fa-regular');
            star.classList.remove('fa-solid');
        }
    });
}

function highlightStars(container, rating) {
    const stars = container.querySelectorAll('i');
    stars.forEach(star => {
        const starRating = parseInt(star.getAttribute('data-rating'));
        if (starRating <= rating) {
            star.style.color = 'var(--warning)';
        } else {
            star.style.color = 'var(--light-gray)';
        }
    });
}

function updateReviewStats() {
    const totalReviews = reviews.length;
    const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews;

    const totalReviewsElement = document.getElementById('total-reviews');
    if (totalReviewsElement) {
        totalReviewsElement.textContent = totalReviews;
    }

    const averageRatingElement = document.getElementById('average-rating');
    if (averageRatingElement) {
        averageRatingElement.textContent = averageRating.toFixed(1);
    }

    updateDistributionBars();
}

function updateDistributionBars() {
    const distribution = {5: 0, 4: 0, 3: 0, 2: 0, 1: 0};

    reviews.forEach(review => {
        distribution[review.rating]++;
    });

    Object.keys(distribution).forEach(rating => {
        const percentage = Math.round((distribution[rating] / reviews.length) * 100);
        distribution[rating] = percentage;
    });

    if (distributionBars) {
        distributionBars.forEach(bar => {
            const ratingText = bar.parentElement.previousElementSibling.textContent;
            const rating = parseInt(ratingText.split(' ')[0]);
            const percentage = distribution[rating] || 0;
            bar.style.width = `${percentage}%`;

            const percentageElement = bar.nextElementSibling;
            if (percentageElement) {
                percentageElement.textContent = `${percentage}%`;
            }
        });
    }
}

function animateDistributionBars() {
    setTimeout(() => {
        if (distributionBars) {
            distributionBars.forEach(bar => {
                const percentage = bar.getAttribute('data-percentage');
                if (percentage) {
                    bar.style.width = `${percentage}%`;
                }
            });
        }
    }, 500);
}

// Load reviews
let displayedReviews = 4;
function loadReviews(filter = 'all') {
    if (!reviewsContainer) return;

    let filteredReviews = reviews;

    if (filter !== 'all') {
        filteredReviews = reviews.filter(review => review.rating >= parseInt(filter));
    }

    const reviewsToShow = filteredReviews.slice(0, displayedReviews);

    reviewsContainer.innerHTML = '';

    if (reviewsToShow.length === 0) {
        reviewsContainer.innerHTML = `
            <div class="no-reviews" style="grid-column: 1 / -1; text-align: center; padding: 3rem;">
                <i class="fa-solid fa-comment-slash" style="font-size: 3rem; color: var(--light-gray); margin-bottom: 1rem;"></i>
                <h3>No reviews found</h3>
                <p>Try selecting a different filter or be the first to leave a review!</p>
            </div>
        `;
        if (loadMoreBtn) loadMoreBtn.style.display = 'none';
        return;
    }

    reviewsToShow.forEach(review => {
        const reviewCard = createReviewCard(review);
        reviewsContainer.appendChild(reviewCard);
    });

    if (loadMoreBtn) {
        loadMoreBtn.style.display = filteredReviews.length > displayedReviews ? 'block' : 'none';
    }
}

function createReviewCard(review) {
    const reviewCard = document.createElement('div');
    reviewCard.className = 'review-card';

    const starsHtml = Array.from({length: 5}, (_, i) =>
        `<i class="fa-solid fa-star${i < review.rating ? '' : ' transparent'}"></i>`
    ).join('');

    const reviewDate = new Date(review.date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    const initials = review.name.split(' ').map(n => n[0]).join('').toUpperCase();

    reviewCard.innerHTML = `
        <div class="review-header">
            <div class="reviewer-info">
                <div class="reviewer-avatar">${initials}</div>
                <div class="reviewer-details">
                    <h4>${review.name}</h4>
                    <div class="reviewer-course">${review.course}</div>
                </div>
            </div>
            <div class="review-rating">
                <span class="rating-value">${review.rating}.0</span>
                <div class="rating-stars-small">
                    ${starsHtml}
                </div>
            </div>
        </div>
        
        <div class="review-title">${review.title}</div>
        <div class="review-content">${review.comment}</div>
        
        ${review.orderItems ? `
            <div class="review-order">
                <strong>Ordered:</strong> ${review.orderItems}
            </div>
        ` : ''}
        
        <div class="review-meta">
            <div class="review-date">
                <i class="fa-solid fa-calendar"></i>
                ${reviewDate}
            </div>
            <div class="review-helpful">
                <button class="helpful-btn" data-id="${review.id}">
                    <i class="fa-solid fa-thumbs-up"></i>
                    Helpful (${review.helpful || 0})
                </button>
            </div>
        </div>
    `;

    const helpfulBtn = reviewCard.querySelector('.helpful-btn');
    if (helpfulBtn) {
        helpfulBtn.addEventListener('click', function() {
            markHelpful(review.id);
        });
    }

    return reviewCard;
}

function filterReviews(filter) {
    displayedReviews = 4;
    loadReviews(filter);
}

function loadMoreReviews() {
    displayedReviews += 4;
    const activeFilter = document.querySelector('.filter-btn.active');
    const currentFilter = activeFilter ? activeFilter.getAttribute('data-filter') : 'all';
    loadReviews(currentFilter);
}

function markHelpful(reviewId) {
    const review = reviews.find(r => r.id === reviewId);
    if (review) {
        review.helpful = (review.helpful || 0) + 1;
        localStorage.setItem('reviews', JSON.stringify(reviews));

        const helpfulBtn = document.querySelector(`.helpful-btn[data-id="${reviewId}"]`);
        if (helpfulBtn) {
            helpfulBtn.innerHTML = `<i class="fa-solid fa-thumbs-up"></i> Helpful (${review.helpful})`;
            helpfulBtn.classList.add('active');
        }

        showNotification('Thanks for your feedback!', 'success');
    }
}

function submitFeedback(event) {
    event.preventDefault();

    if (!feedbackForm) return;

    const formData = new FormData(feedbackForm);
    const overallRating = formData.get('rating');

    if (!overallRating) {
        showNotification('Please select an overall rating', 'error');
        return;
    }

    const newReview = {
        id: Date.now(),
        name: formData.get('user-name') || 'Anonymous',
        course: formData.get('user-course') || 'Student',
        rating: parseInt(overallRating),
        title: formData.get('title'),
        comment: formData.get('comment'),
        date: new Date().toISOString().split('T')[0],
        helpful: 0,
        orderItems: formData.get('order-items'),
        recommend: formData.get('recommend'),
        categoryRatings: {...categoryRatings}
    };

    reviews.unshift(newReview);
    localStorage.setItem('reviews', JSON.stringify(reviews));

    if (successModal) {
        successModal.style.display = 'block';
    }

    updateReviewStats();

    const activeFilter = document.querySelector('.filter-btn.active');
    const currentFilter = activeFilter ? activeFilter.getAttribute('data-filter') : 'all';
    loadReviews(currentFilter);

    showNotification('Thank you for your feedback!', 'success');
}

function clearForm() {
    if (feedbackForm) {
        feedbackForm.reset();
    }

    if (ratingText) {
        ratingText.textContent = "Select your rating";
    }

    if (charCounter) {
        charCounter.textContent = "0";
        charCounter.className = 'char-count';
    }

    categoryRatings = {
        'food-quality': 0,
        'delivery-speed': 0,
        'customer-service': 0,
        'value-money': 0
    };

    if (categoryStars) {
        categoryStars.forEach(container => {
            const stars = container.querySelectorAll('i');
            stars.forEach(star => {
                star.classList.remove('active');
                star.classList.add('fa-regular');
                star.classList.remove('fa-solid');
                star.style.color = '';
            });
        });
    }
}

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

// Add CSS for animations
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
    
    .rating-stars-small .transparent {
        opacity: 0.3;
    }
    
    .review-order {
        background: var(--light-gray);
        padding: 0.5rem;
        border-radius: 5px;
        margin-bottom: 1rem;
        font-size: 0.9rem;
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