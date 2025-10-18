// JavaScript for Enhanced Application Portal
document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const createBtn = document.getElementById("createBtn");
    const confirmBtn = document.getElementById("confirmBtn");
    const idInput = document.getElementById("id");
    const passwordInput = document.getElementById("password");
    const loginBtn = document.getElementById("login");
    const togglePassword = document.getElementById("togglePassword");
    const newApplicantBtn = document.getElementById("newApplicantBtn");
    const loginSection = document.getElementById("loginSection");
    const newApplicantSection = document.getElementById("newApplicantSection");
    const loadingOverlay = document.getElementById("loadingOverlay");
    const forgotIdLink = document.getElementById("forgotId");
    const forgotPasswordLink = document.getElementById("forgotPassword");

    // Toggle Password Visibility
    togglePassword.addEventListener('click', function() {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        this.classList.toggle('fa-eye');
        this.classList.toggle('fa-eye-slash');
    });

    // Show New Applicant Section
    newApplicantBtn.addEventListener('click', function(e) {
        e.preventDefault();
        loginSection.style.display = 'none';
        newApplicantSection.style.display = 'block';

        // Update progress indicator
        document.querySelectorAll('.step').forEach(step => step.classList.remove('active'));
        document.querySelectorAll('.step')[1].classList.add('active');
    });

    // Create Temporary ID
    createBtn.addEventListener("click", (e) => {
        e.preventDefault();
        showLoading();

        setTimeout(() => {
            hideLoading();
            window.location.href = "createID.html";
        }, 1500);
    });

    // Confirm Temporary Password
    confirmBtn.addEventListener("click", (e) => {
        e.preventDefault();
        showLoading();

        setTimeout(() => {
            hideLoading();
            window.location.href = "ConfirmPassword.html";
        }, 1500);
    });

    // Login Functionality
    loginBtn.addEventListener("click", (e) => {
        e.preventDefault();

        // Get the current values of the inputs
        const id = idInput.value.trim();
        const password = passwordInput.value;

        // Validation
        if (!validateInputs(id, password)) {
            return;
        }

        // Show loading state
        showLoading();
        const btnText = loginBtn.querySelector('.btn-text');
        const btnLoading = loginBtn.querySelector('.btn-loading');
        btnText.style.display = 'none';
        btnLoading.style.display = 'inline-flex';

        // Simulate API call
        setTimeout(() => {
            hideLoading();
            btnText.style.display = 'inline-flex';
            btnLoading.style.display = 'none';

            // Retrieve the completeApplication from localStorage
            const completeApplication = JSON.parse(localStorage.getItem("completeApplication"));

            // Check if completeApplication exists and credentials match
            if (completeApplication && completeApplication.applicationId === id && completeApplication.password === password) {
                // Successful login
                showSuccess("Login successful! Redirecting...");
                setTimeout(() => {
                    window.location.href = "SelectDegree.html";
                }, 1000);
            } else {
                // Failed login
                showError("Invalid Temporary ID or Password");
                shakeElement(loginBtn);
            }
        }, 2000);
    });

    // Forgot ID/Password Links
    forgotIdLink.addEventListener('click', function(e) {
        e.preventDefault();
        alert("Please contact the admissions office at (555) 123-APPLY to retrieve your Temporary ID.");
    });

    forgotPasswordLink.addEventListener('click', function(e) {
        e.preventDefault();
        alert("A password reset link will be sent to the email associated with your account.");
    });

    // Utility Functions
    function validateInputs(id, password) {
        if (!id) {
            showError("Please enter a Temporary ID");
            highlightError(idInput);
            return false;
        }

        if (!password) {
            showError("Please enter your password");
            highlightError(passwordInput);
            return false;
        }

        if (id.length < 6) {
            showError("Temporary ID must be at least 6 characters long");
            highlightError(idInput);
            return false;
        }

        return true;
    }

    function showError(message) {
        // Create or update error message
        let errorDiv = document.querySelector('.error-message');
        if (!errorDiv) {
            errorDiv = document.createElement('div');
            errorDiv.className = 'error-message';
            loginBtn.parentNode.insertBefore(errorDiv, loginBtn);
        }
        errorDiv.textContent = message;
        errorDiv.style.color = 'var(--error-color)';
        errorDiv.style.fontSize = '0.9rem';
        errorDiv.style.marginTop = '0.5rem';
        errorDiv.style.textAlign = 'center';
    }

    function showSuccess(message) {
        // Create success message
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.textContent = message;
        successDiv.style.color = 'var(--success-color)';
        successDiv.style.fontSize = '0.9rem';
        successDiv.style.marginTop = '0.5rem';
        successDiv.style.textAlign = 'center';
        loginBtn.parentNode.insertBefore(successDiv, loginBtn);

        setTimeout(() => {
            successDiv.remove();
        }, 3000);
    }

    function highlightError(element) {
        element.style.borderColor = 'var(--error-color)';
        element.style.boxShadow = '0 0 0 3px rgba(220, 53, 69, 0.1)';

        setTimeout(() => {
            element.style.borderColor = '';
            element.style.boxShadow = '';
        }, 3000);
    }

    function shakeElement(element) {
        element.style.animation = 'shake 0.5s ease-in-out';
        setTimeout(() => {
            element.style.animation = '';
        }, 500);
    }

    function showLoading() {
        loadingOverlay.style.display = 'flex';
    }

    function hideLoading() {
        loadingOverlay.style.display = 'none';
    }

    // Add shake animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-5px); }
            75% { transform: translateX(5px); }
        }
        
        .error-message {
            background: #ffe6e6;
            padding: 0.75rem;
            border-radius: var(--border-radius);
            border: 1px solid var(--error-color);
            margin: 1rem 0;
        }
        
        .success-message {
            background: #e6ffe6;
            padding: 0.75rem;
            border-radius: var(--border-radius);
            border: 1px solid var(--success-color);
            margin: 1rem 0;
        }
    `;
    document.head.appendChild(style);

    // Auto-focus first input
    idInput.focus();

    // Enter key support
    [idInput, passwordInput].forEach(input => {
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                loginBtn.click();
            }
        });
    });
});