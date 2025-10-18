document.addEventListener("DOMContentLoaded", () => {
    // Elements
    const contactForm = document.getElementById("contactForm");
    const nameInput = document.getElementById("nameInput");
    const emailInput = document.getElementById("emailInput");
    const subjectInput = document.getElementById("subjectInput");
    const messageInput = document.getElementById("messageInput");
    const sendBtn = document.getElementById("sendBtn");
    const navToggle = document.getElementById("navToggle");
    const navLinks = document.getElementById("navLinks");
    const successModal = document.getElementById("successModal");
    const modalCloseBtn = document.getElementById("modalCloseBtn");
    const directionsBtn = document.getElementById("directionsBtn");

    // Initialize the page
    function initializePage() {
        setupEventListeners();
        setupFormValidation();
        setupNavToggle();
    }

    // Setup event listeners
    function setupEventListeners() {
        // Form submission
        contactForm.addEventListener("submit", handleFormSubmit);

        // Modal close
        modalCloseBtn.addEventListener("click", closeModal);

        // Directions button
        directionsBtn.addEventListener("click", getDirections);

        // Close modal when clicking outside
        successModal.addEventListener("click", (e) => {
            if (e.target === successModal) {
                closeModal();
            }
        });

        // Close modal with Escape key
        document.addEventListener("keydown", (e) => {
            if (e.key === 'Escape') {
                closeModal();
            }
        });

        // Real-time form validation
        setupRealTimeValidation();
    }

    // Setup mobile navigation toggle
    function setupNavToggle() {
        navToggle.addEventListener("click", () => {
            navLinks.classList.toggle("active");
            navToggle.classList.toggle("active");

            // Animate hamburger to X
            const spans = navToggle.querySelectorAll("span");
            if (navLinks.classList.contains("active")) {
                spans[0].style.transform = "rotate(45deg) translate(5px, 5px)";
                spans[1].style.opacity = "0";
                spans[2].style.transform = "rotate(-45deg) translate(7px, -6px)";
            } else {
                spans[0].style.transform = "none";
                spans[1].style.opacity = "1";
                spans[2].style.transform = "none";
            }
        });

        // Close mobile menu when clicking on links
        const navLinksList = navLinks.querySelectorAll("a");
        navLinksList.forEach(link => {
            link.addEventListener("click", () => {
                navLinks.classList.remove("active");
                navToggle.classList.remove("active");

                const spans = navToggle.querySelectorAll("span");
                spans[0].style.transform = "none";
                spans[1].style.opacity = "1";
                spans[2].style.transform = "none";
            });
        });
    }

    // Setup real-time form validation
    function setupRealTimeValidation() {
        nameInput.addEventListener("blur", () => validateField(nameInput, "nameError", validateName));
        emailInput.addEventListener("blur", () => validateField(emailInput, "emailError", validateEmail));
        messageInput.addEventListener("blur", () => validateField(messageInput, "messageError", validateMessage));

        // Clear errors on input
        nameInput.addEventListener("input", () => clearError("nameError"));
        emailInput.addEventListener("input", () => clearError("emailError"));
        messageInput.addEventListener("input", () => clearError("messageError"));
    }

    // Handle form submission
    function handleFormSubmit(e) {
        e.preventDefault();

        if (validateForm()) {
            submitForm();
        }
    }

    // Validate entire form
    function validateForm() {
        let isValid = true;

        // Validate each field
        if (!validateField(nameInput, "nameError", validateName)) isValid = false;
        if (!validateField(emailInput, "emailError", validateEmail)) isValid = false;
        if (!validateField(messageInput, "messageError", validateMessage)) isValid = false;

        return isValid;
    }

    // Validate individual field
    function validateField(field, errorId, validationFn) {
        const errorElement = document.getElementById(errorId);
        const value = field.value.trim();

        clearError(errorId);

        if (!value) {
            showError(errorElement, "This field is required");
            return false;
        }

        if (!validationFn(value)) {
            showError(errorElement, getErrorMessage(field.id));
            return false;
        }

        return true;
    }

    // Field validation functions
    function validateName(name) {
        return name.length >= 2 && /^[a-zA-Z\s]+$/.test(name);
    }

    function validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function validateMessage(message) {
        return message.length >= 10;
    }

    // Get error message for field
    function getErrorMessage(fieldId) {
        const messages = {
            nameInput: "Please enter a valid name (letters and spaces only)",
            emailInput: "Please enter a valid email address",
            messageInput: "Message must be at least 10 characters long"
        };
        return messages[fieldId] || "Please check this field";
    }

    // Show error message
    function showError(errorElement, message) {
        errorElement.textContent = message;
        errorElement.style.display = "block";
    }

    // Clear error message
    function clearError(errorId) {
        const errorElement = document.getElementById(errorId);
        if (errorElement) {
            errorElement.textContent = "";
            errorElement.style.display = "none";
        }
    }

    // Submit form data
    function submitForm() {
        // Show loading state
        sendBtn.classList.add("loading");
        sendBtn.disabled = true;

        // Simulate API call
        setTimeout(() => {
            // Get form data
            const formData = {
                name: nameInput.value.trim(),
                email: emailInput.value.trim(),
                subject: subjectInput.value,
                message: messageInput.value.trim(),
                timestamp: new Date().toISOString()
            };

            // Save to localStorage (simulating database storage)
            saveContactMessage(formData);

            // Show success modal
            showSuccessModal();

            // Reset form
            contactForm.reset();

            // Reset button state
            sendBtn.classList.remove("loading");
            sendBtn.disabled = false;

        }, 2000);
    }

    // Save contact message to localStorage
    function saveContactMessage(formData) {
        let contactMessages = JSON.parse(localStorage.getItem("contactMessages") || "[]");
        contactMessages.push(formData);
        localStorage.setItem("contactMessages", JSON.stringify(contactMessages));

        console.log("Contact message saved:", formData);
    }

    // Show success modal
    function showSuccessModal() {
        successModal.classList.add("active");
        document.body.style.overflow = "hidden";
    }

    // Close modal
    function closeModal() {
        successModal.classList.remove("active");
        document.body.style.overflow = "auto";
    }

    // Get directions function
    function getDirections() {
        const address = "123 University Avenue, Anytown, ST 12345";
        const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`;
        window.open(googleMapsUrl, "_blank");
    }

    // Setup form validation patterns
    function setupFormValidation() {
        // Name input - only letters and spaces
        nameInput.addEventListener("input", (e) => {
            e.target.value = e.target.value.replace(/[^a-zA-Z\s]/g, '');
        });

        // Email input - basic email format
        emailInput.addEventListener("blur", (e) => {
            if (e.target.value && !validateEmail(e.target.value)) {
                showError(document.getElementById("emailError"), "Please enter a valid email address");
            }
        });
    }

    // Initialize the page
    initializePage();
});

const yearSpan = document.getElementById("year");
yearSpan.innerText = new Date().getFullYear().toString();