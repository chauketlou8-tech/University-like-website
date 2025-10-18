document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("reviewPaymentForm");
    const prevTabButton = document.getElementById("prevTab");
    const nextTabButton = document.getElementById("nextTab");
    const submitButton = document.getElementById("submitBtn");
    const saveDraftButton = document.getElementById("saveDraft");
    const successMessage = document.getElementById("successMessage");
    const loadingOverlay = document.getElementById("loadingOverlay");

    // Tab elements
    const tabs = document.querySelectorAll(".form-tab");
    const tabButtons = document.querySelectorAll(".tab-btn");
    const progressFill = document.querySelector(".progress-fill");

    // Payment method elements
    const paymentMethods = document.querySelectorAll('input[name="paymentMethod"]');
    const cardForm = document.getElementById("cardForm");
    const bankTransfer = document.getElementById("bankTransfer");
    const eftForm = document.getElementById("eftForm");

    // Edit buttons
    const editButtons = document.querySelectorAll(".edit-btn");

    // Current tab state
    let currentTab = 0;
    const totalTabs = 3; // review, payment, confirmation

    // Initialize the page
    function initializePage() {
        loadApplicationData();
        setupPaymentMethodListener();
        setupEditButtons();
        setupTabNavigation();
        setupFormListeners();
        updateNavigation();
    }

    // Load application data from localStorage
    function loadApplicationData() {
        // Load personal and academic data
        const undergradData = JSON.parse(localStorage.getItem("undergradApplication") || "{}");
        // Load program data
        const userDetails = JSON.parse(localStorage.getItem("userDetails") || "{}");
        const programDetails = userDetails.programmeDetails || {};

        // Populate summaries
        populatePersonalSummary(undergradData);
        populateAcademicSummary(undergradData);
        populateProgramSummary(programDetails);
        populateDocumentsSummary(undergradData);

        // Generate and display application ID
        generateAndDisplayApplicationId(undergradData);
    }

    // Generate and display application ID
    function generateAndDisplayApplicationId(data) {
        const firstName = data.firstName || '';
        const lastName = data.lastName || '';

        if (firstName && lastName) {
            const appId = generateStudentID(lastName, firstName);

            // Update all application ID elements
            const appIdElements = document.querySelectorAll('[id*="ApplicationId"], [id*="applicationId"]');
            appIdElements.forEach(element => {
                element.textContent = appId;
            });

            // Update bank reference
            const bankReference = document.getElementById("bankReference");
            if (bankReference) {
                bankReference.textContent = appId;
            }

            // Update review payment method
            const reviewPaymentMethod = document.getElementById("reviewPaymentMethod");
            if (reviewPaymentMethod) {
                reviewPaymentMethod.textContent = "Credit Card"; // Default
            }
        }
    }

    // Generate student ID function
    function generateStudentID(surname, firstName) {
        function firstConsonants(str, count) {
            const consonants = str.toUpperCase().replace(/[^BCDFGHJKLMNPQRSTVWXYZ]/gi, '');
            return consonants.slice(0, count).padEnd(count, 'X');
        }

        function firstLetters(str, count) {
            const letters = str.toUpperCase().replace(/[^A-Z]/gi, '');
            return letters.slice(0, count).padEnd(count, 'X');
        }

        const surnamePart = firstConsonants(surname, 3);
        const namePart = firstLetters(firstName, 3);
        const randomNumbers = Math.floor(Math.random() * 900 + 100);

        return `${surnamePart}${namePart}X${randomNumbers}`;
    }

    // Generate random password
    function generatePassword() {
        const length = 12;
        const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
        let password = "";

        const lowercase = "abcdefghijklmnopqrstuvwxyz";
        const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        const numbers = "0123456789";
        const symbols = "!@#$%^&*";

        password += lowercase.charAt(Math.floor(Math.random() * lowercase.length));
        password += uppercase.charAt(Math.floor(Math.random() * uppercase.length));
        password += numbers.charAt(Math.floor(Math.random() * numbers.length));
        password += symbols.charAt(Math.floor(Math.random() * symbols.length));

        for (let i = password.length; i < length; i++) {
            password += charset.charAt(Math.floor(Math.random() * charset.length));
        }

        return password.split('').sort(() => Math.random() - 0.5).join('');
    }

    // Populate personal information summary
    function populatePersonalSummary(data) {
        const personalSummary = document.getElementById("personalSummary");

        let html = `
            <div class="summary-item">
                <span class="label">Full Name:</span>
                <span class="value">${data.firstName || ''} ${data.lastName || ''}</span>
            </div>
            <div class="summary-item">
                <span class="label">Date of Birth:</span>
                <span class="value">${formatDate(data.dateOfBirth) || 'Not provided'}</span>
            </div>
            <div class="summary-item">
                <span class="label">ID/Passport:</span>
                <span class="value">${data.idNumber || data.passportNumber || 'Not provided'}</span>
            </div>
            <div class="summary-item">
                <span class="label">Nationality:</span>
                <span class="value">${data.nationality || 'Not provided'}</span>
            </div>
            <div class="summary-item">
                <span class="label">Email:</span>
                <span class="value">${data.email || 'Not provided'}</span>
            </div>
            <div class="summary-item">
                <span class="label">Phone:</span>
                <span class="value">${data.phone || 'Not provided'}</span>
            </div>
        `;

        personalSummary.innerHTML = html;
    }

    // Populate academic background summary
    function populateAcademicSummary(data) {
        const academicSummary = document.getElementById("academicSummary");

        let html = `
            <div class="summary-item">
                <span class="label">High School:</span>
                <span class="value">${data.schoolName || 'Not provided'}</span>
            </div>
            <div class="summary-item">
                <span class="label">Country:</span>
                <span class="value">${data.schoolCountry || 'Not provided'}</span>
            </div>
            <div class="summary-item">
                <span class="label">Completion Year:</span>
                <span class="value">${data.completionYear || 'Not provided'}</span>
            </div>
            <div class="summary-item">
                <span class="label">Certificate Type:</span>
                <span class="value">${data.certificateType || 'Not provided'}</span>
            </div>
            <div class="summary-item">
                <span class="label">APS Score:</span>
                <span class="value">${data.apsScore || 'Not provided'}</span>
            </div>
        `;

        if (data.subjects && data.subjects.length > 0) {
            html += `<div class="summary-item">
                <span class="label">Subjects:</span>
                <span class="value">${data.subjects.length} subjects entered</span>
            </div>`;
        }

        academicSummary.innerHTML = html;
    }

    // Populate program details summary
    function populateProgramSummary(data) {
        const programSummary = document.getElementById("programSummary");

        let html = `
            <div class="summary-item">
                <span class="label">Program Level:</span>
                <span class="value">${data.programmeLevel || 'Not provided'}</span>
            </div>
        `;

        if (data.postgradType) {
            html += `<div class="summary-item">
                <span class="label">Postgraduate Type:</span>
                <span class="value">${data.postgradType}</span>
            </div>`;
        }

        html += `
            <div class="summary-item">
                <span class="label">Faculty:</span>
                <span class="value">${data.faculty || 'Not provided'}</span>
            </div>
            <div class="summary-item">
                <span class="label">Major:</span>
                <span class="value">${data.major || 'Not provided'}</span>
            </div>
        `;

        if (data.second) {
            html += `<div class="summary-item">
                <span class="label">Second Choice:</span>
                <span class="value">${data.second}</span>
            </div>`;
        }

        html += `
            <div class="summary-item">
                <span class="label">Mode of Study:</span>
                <span class="value">${data.mode || 'Not provided'}</span>
            </div>
            <div class="summary-item">
                <span class="label">Campus:</span>
                <span class="value">${data.campus || 'Not provided'}</span>
            </div>
            <div class="summary-item">
                <span class="label">Start Date:</span>
                <span class="value">${data.intake || ''} ${data.start || ''}</span>
            </div>
        `;

        if (data.researchArea) {
            html += `<div class="summary-item">
                <span class="label">Research Area:</span>
                <span class="value">${data.researchArea}</span>
            </div>`;
        }

        programSummary.innerHTML = html;
    }

    // Populate documents summary
    function populateDocumentsSummary(data) {
        const documentsSummary = document.getElementById("documentsSummary");

        const isSouthAfrican = data.nationality === 'South Africa';
        const idDoc = isSouthAfrican ? 'ID Document' : 'Passport';

        let html = `
            <div class="summary-item">
                <span class="label">${idDoc}:</span>
                <span class="value">${isSouthAfrican ? (data.idNumber ? 'Provided' : 'Missing') : (data.passportNumber ? 'Provided' : 'Missing')}</span>
            </div>
            <div class="summary-item">
                <span class="label">Certificate:</span>
                <span class="value">${data.schoolName ? 'Provided' : 'Missing'}</span>
            </div>
            <div class="summary-item">
                <span class="label">Transcript:</span>
                <span class="value">Required</span>
            </div>
        `;

        documentsSummary.innerHTML = html;
    }

    // Format date for display
    function formatDate(dateString) {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-ZA', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    // Set up payment method listener
    function setupPaymentMethodListener() {
        paymentMethods.forEach(method => {
            method.addEventListener('change', function() {
                // Hide all payment forms
                cardForm.classList.add('hidden');
                bankTransfer.classList.add('hidden');
                eftForm.classList.add('hidden');

                // Show selected payment form
                if (this.value === 'card') {
                    cardForm.classList.remove('hidden');
                } else if (this.value === 'bank') {
                    bankTransfer.classList.remove('hidden');
                } else if (this.value === 'eft') {
                    eftForm.classList.remove('hidden');
                }

                // Update review payment method
                const reviewPaymentMethod = document.getElementById("reviewPaymentMethod");
                if (reviewPaymentMethod) {
                    const methodNames = {
                        'card': 'Credit/Debit Card',
                        'bank': 'Bank Transfer',
                        'eft': 'Electronic Funds Transfer'
                    };
                    reviewPaymentMethod.textContent = methodNames[this.value] || 'Credit Card';
                }
            });
        });
    }

    // Set up edit buttons
    function setupEditButtons() {
        editButtons.forEach(button => {
            button.addEventListener('click', function() {
                const section = this.getAttribute('data-section');

                switch(section) {
                    case 'personal':
                        window.location.href = 'createID.html';
                        break;
                    case 'academic':
                        window.location.href = 'createID.html#academic';
                        break;
                    case 'program':
                        window.location.href = 'selectDegree.html';
                        break;
                    case 'documents':
                        window.location.href = 'createID.html#documents';
                        break;
                }
            });
        });
    }

    // Set up tab navigation
    function setupTabNavigation() {
        // Tab button clicks
        tabButtons.forEach((button, index) => {
            button.addEventListener('click', () => {
                showTab(index);
            });
        });

        // Next button
        nextTabButton.addEventListener('click', () => {
            if (validateCurrentTab()) {
                showTab(currentTab + 1);
            }
        });

        // Previous button
        prevTabButton.addEventListener('click', () => {
            showTab(currentTab - 1);
        });

        // Save draft button
        saveDraftButton.addEventListener('click', saveDraft);
    }

    // Show specific tab
    function showTab(tabIndex) {
        // Validate tab index
        if (tabIndex < 0 || tabIndex >= totalTabs) return;

        // Hide all tabs
        tabs.forEach(tab => tab.classList.remove('active'));
        tabButtons.forEach(button => button.classList.remove('active'));

        // Show selected tab
        tabs[tabIndex].classList.add('active');
        tabButtons[tabIndex].classList.add('active');

        // Update current tab
        currentTab = tabIndex;

        // Update progress bar
        const progressWidth = ((tabIndex + 1) / totalTabs) * 100;
        progressFill.style.width = `${progressWidth}%`;

        // Update navigation buttons
        updateNavigation();
    }

    // Update navigation buttons based on current tab
    function updateNavigation() {
        // Previous button
        prevTabButton.style.display = currentTab === 0 ? 'none' : 'inline-flex';

        // Next button
        nextTabButton.style.display = currentTab < totalTabs - 1 ? 'inline-flex' : 'none';

        // Submit button
        submitButton.style.display = currentTab === totalTabs - 1 ? 'inline-flex' : 'none';

        // Update checklist for payment tab
        if (currentTab === 1) {
            updateChecklist('payment');
        }
    }

    // Update checklist progress
    function updateChecklist(completedStep) {
        const checklistItems = document.querySelectorAll('.checklist-item');

        checklistItems.forEach(item => {
            const text = item.querySelector('span').textContent;
            if (text.includes('Payment Processing') && completedStep === 'payment') {
                item.classList.add('completed');
                item.querySelector('i').className = 'fas fa-check-circle';
            }
        });
    }

    // Validate current tab
    function validateCurrentTab() {
        switch(currentTab) {
            case 0: // Review tab - always valid to proceed
                return true;

            case 1: // Payment tab
                return validatePaymentTab();

            case 2: // Confirmation tab
                return validateConfirmationTab();

            default:
                return true;
        }
    }

    // Validate payment tab
    function validatePaymentTab() {
        const selectedMethod = document.querySelector('input[name="paymentMethod"]:checked');

        if (!selectedMethod) {
            alert('Please select a payment method');
            return false;
        }

        if (selectedMethod.value === 'card') {
            return validateCardDetails();
        }

        return true;
    }

    // Validate confirmation tab
    function validateConfirmationTab() {
        const declaration1 = document.getElementById('declaration1').checked;
        const declaration2 = document.getElementById('declaration2').checked;
        const declaration3 = document.getElementById('declaration3').checked;
        const terms = document.getElementById('terms').checked;

        if (!declaration1 || !declaration2 || !declaration3 || !terms) {
            alert('Please accept all declarations and terms to continue');
            return false;
        }

        return true;
    }

    // Validate card details
    function validateCardDetails() {
        const cardNumber = document.getElementById('cardNumber').value.replace(/\s/g, '');
        const cardholderName = document.getElementById('cardholderName').value.trim();
        const expiryDate = document.getElementById('expiryDate').value;
        const cvv = document.getElementById('cvv').value;

        if (!/^\d{16}$/.test(cardNumber)) {
            alert('Please enter a valid 16-digit card number');
            return false;
        }

        if (!cardholderName) {
            alert('Please enter the cardholder name');
            return false;
        }

        if (!/^\d{2}\/\d{2}$/.test(expiryDate)) {
            alert('Please enter a valid expiry date (MM/YY)');
            return false;
        }

        if (!/^\d{3,4}$/.test(cvv)) {
            alert('Please enter a valid CVV');
            return false;
        }

        return true;
    }

    // Set up form event listeners
    function setupFormListeners() {
        // Card number formatting
        const cardNumberInput = document.getElementById('cardNumber');
        if (cardNumberInput) {
            cardNumberInput.addEventListener('input', function() {
                formatCardNumber(this);
            });
        }

        // Expiry date formatting
        const expiryDateInput = document.getElementById('expiryDate');
        if (expiryDateInput) {
            expiryDateInput.addEventListener('input', function() {
                formatExpiryDate(this);
            });
        }

        // CVV formatting (numbers only)
        const cvvInput = document.getElementById('cvv');
        if (cvvInput) {
            cvvInput.addEventListener('input', function() {
                this.value = this.value.replace(/\D/g, '').substring(0, 4);
            });
        }

        // Copy buttons
        const copyButtons = document.querySelectorAll('.copy-btn');
        copyButtons.forEach(button => {
            button.addEventListener('click', function() {
                const textToCopy = this.getAttribute('data-text') ||
                    document.getElementById(this.getAttribute('data-target'))?.textContent;

                if (textToCopy) {
                    navigator.clipboard.writeText(textToCopy).then(() => {
                        const originalHTML = this.innerHTML;
                        this.innerHTML = '<i class="fas fa-check"></i>';
                        setTimeout(() => {
                            this.innerHTML = originalHTML;
                        }, 2000);
                    });
                }
            });
        });

        // Form submission
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            submitApplication();
        });

        // Success message buttons
        document.addEventListener('click', function(e) {
            if (e.target.id === 'printCredentials' || e.target.closest('#printCredentials')) {
                window.print();
            }

            if (e.target.id === 'goToDashboard' || e.target.closest('#goToDashboard')) {
                window.location.href = 'application-status.html';
            }
        });
    }

    // Format card number with spaces
    function formatCardNumber(input) {
        let value = input.value.replace(/\s/g, '').replace(/\D/g, '');
        let formattedValue = '';

        for (let i = 0; i < value.length; i++) {
            if (i > 0 && i % 4 === 0) {
                formattedValue += ' ';
            }
            formattedValue += value[i];
        }

        input.value = formattedValue.substring(0, 19);
    }

    // Format expiry date
    function formatExpiryDate(input) {
        let value = input.value.replace(/\D/g, '');

        if (value.length >= 2) {
            input.value = value.substring(0, 2) + '/' + value.substring(2, 4);
        } else {
            input.value = value;
        }
    }

    // Save draft
    function saveDraft() {
        // Save current form state to localStorage
        const formData = {
            currentTab: currentTab,
            paymentMethod: document.querySelector('input[name="paymentMethod"]:checked')?.value,
            // Add other form data as needed
        };

        localStorage.setItem('applicationDraft', JSON.stringify(formData));

        // Show feedback
        const originalText = saveDraftButton.innerHTML;
        saveDraftButton.innerHTML = '<i class="fas fa-check"></i> Draft Saved';
        saveDraftButton.disabled = true;

        setTimeout(() => {
            saveDraftButton.innerHTML = originalText;
            saveDraftButton.disabled = false;
        }, 2000);
    }

    // Submit application
    function submitApplication() {
        if (!validateConfirmationTab()) {
            return;
        }

        // Show loading overlay
        loadingOverlay.classList.add('active');

        // Simulate API call to payment processor
        setTimeout(() => {
            const generatedPassword = generatePassword();
            saveCompleteApplication(generatedPassword);

            // Hide loading overlay
            loadingOverlay.classList.remove('active');

            // Show success message
            showSuccessMessage(generatedPassword);

            // Update checklist
            updateChecklist('submission');

        }, 3000);
    }

    // Show success message with credentials
    function showSuccessMessage(password) {
        const successApplicationId = document.getElementById("successApplicationId");
        const successPassword = document.getElementById("successPassword");

        if (successApplicationId && successPassword) {
            successPassword.textContent = password;
        }

        successMessage.classList.remove('hidden');

        // Scroll to success message
        successMessage.scrollIntoView({ behavior: 'smooth' });

        // Hide form navigation
        document.querySelector('.form-navigation').style.display = 'none';
    }

    // Save complete application with password
    function saveCompleteApplication(password) {
        const undergradData = JSON.parse(localStorage.getItem("undergradApplication") || "{}");
        const userDetails = JSON.parse(localStorage.getItem("userDetails") || "{}");

        const applicationId = document.getElementById("reviewApplicationId")?.textContent || generateStudentID(undergradData.lastName, undergradData.firstName);

        const completeApplication = {
            applicationId: applicationId,
            password: password,
            personalInfo: undergradData,
            programDetails: userDetails.programmeDetails,
            submissionDate: new Date().toISOString(),
            status: 'submitted',
            paymentStatus: 'completed'
        };

        // Save to localStorage
        localStorage.setItem("completeApplication", JSON.stringify(completeApplication));

        // Also save to applications list
        let applications = JSON.parse(localStorage.getItem("userApplications") || "[]");
        applications.push(completeApplication);
        localStorage.setItem("userApplications", JSON.stringify(applications));
    }

    // Initialize the page
    initializePage();
});