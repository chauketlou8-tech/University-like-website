// JavaScript for Enhanced Create ID Page
document.addEventListener("DOMContentLoaded", () => {
    // DOM Elements
    const form = document.getElementById("createIDForm");
    const tabs = document.querySelectorAll(".form-tab");
    const tabButtons = document.querySelectorAll(".tab-btn");
    const prevBtn = document.getElementById("prevTab");
    const nextBtn = document.getElementById("nextTab");
    const submitBtn = document.getElementById("submitBtn");
    const cancelBtn = document.getElementById("cancelBtn");
    const successModal = document.getElementById("successModal");
    const continueToProgram = document.getElementById("continueToProgram");
    const addSubjectBtn = document.getElementById("addSubject");
    const subjectTableBody = document.getElementById("subjectTableBody");
    const progressFill = document.querySelector(".progress-fill");

    // Form state
    let currentTab = 0;
    const totalTabs = tabs.length;

    // Available subjects
    const availableSubjects = [
        "Mathematics", "Mathematical Literacy", "Physical Sciences",
        "Life Sciences", "English Home Language", "English First Additional",
        "Afrikaans", "Geography", "History", "Accounting",
        "Business Studies", "Economics", "Tourism", "Life Orientation",
        "Sepedi", "Xitsonga", "Setswana", "Sesotho", "Venda", "Isizulu"
    ];

    // Country list
    const countries = [
        "South Africa", "Afghanistan", "Albania", "Algeria", "Andorra", "Angola",
        "Antigua and Barbuda", "Argentina", "Armenia", "Australia", "Austria",
        "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus",
        "Belgium", "Belize", "Benin", "Bhutan", "Bolivia", "Bosnia and Herzegovina",
        "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi",
        "Cabo Verde", "Cambodia", "Cameroon", "Canada", "Central African Republic",
        "Chad", "Chile", "China", "Colombia", "Comoros", "Congo (Congo-Brazzaville)",
        "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czechia (Czech Republic)",
        "Democratic Republic of the Congo", "Denmark", "Djibouti", "Dominica",
        "Dominican Republic", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea",
        "Eritrea", "Estonia", "Eswatini", "Ethiopia", "Fiji", "Finland", "France",
        "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada",
        "Guatemala", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Honduras",
        "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland",
        "Israel", "Italy", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya",
        "Kiribati", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho",
        "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Madagascar",
        "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands",
        "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco",
        "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar", "Namibia",
        "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger",
        "Nigeria", "North Korea", "North Macedonia", "Norway", "Oman", "Pakistan",
        "Palau", "Palestine State", "Panama", "Papua New Guinea", "Paraguay",
        "Peru", "Philippines", "Poland", "Portugal", "Qatar", "Romania", "Russia",
        "Rwanda", "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines",
        "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal",
        "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia",
        "Solomon Islands", "Somalia", "South Korea", "South Sudan", "Spain", "Sri Lanka",
        "Sudan", "Suriname", "Sweden", "Switzerland", "Syria", "Tajikistan", "Tanzania",
        "Thailand", "Timor-Leste", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia",
        "Turkey", "Turkmenistan", "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates",
        "United Kingdom", "United States of America", "Uruguay", "Uzbekistan", "Vanuatu",
        "Vatican City", "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe"
    ];

    // Initialize the application
    function initializeApp() {
        populateCountrySelects();
        populateCompletionYears();
        addFirstSubjectRow();
        setupEventListeners();
        setupFileUploads();
        updateProgressBar();
        showTab(currentTab);
    }

    // Populate country dropdowns
    function populateCountrySelects() {
        const countrySelects = [
            document.getElementById('nationality'),
            document.getElementById('passportCountry'),
            document.getElementById('internationalCountry'),
            document.getElementById('schoolCountry')
        ];

        countrySelects.forEach(select => {
            if (select) {
                countries.forEach(country => {
                    const option = document.createElement('option');
                    option.value = country;
                    option.textContent = country;
                    select.appendChild(option);
                });
            }
        });
    }

    // Populate completion years
    function populateCompletionYears() {
        const completionYearSelect = document.getElementById("completionYear");
        const currentYear = new Date().getFullYear();

        for (let year = currentYear - 10; year <= currentYear + 1; year++) {
            const option = document.createElement("option");
            option.value = year;
            option.textContent = year;
            completionYearSelect.appendChild(option);
        }
    }

    // Set up event listeners
    function setupEventListeners() {
        // Tab navigation
        tabButtons.forEach((button, index) => {
            button.addEventListener('click', () => showTab(index));
        });

        prevBtn.addEventListener('click', showPrevTab);
        nextBtn.addEventListener('click', showNextTab);
        submitBtn.addEventListener('click', handleFormSubmit);
        cancelBtn.addEventListener('click', handleCancel);

        // Nationality change
        document.getElementById('nationality').addEventListener('change', handleNationalityChange);
        document.getElementById('schoolCountry').addEventListener('change', handleSchoolCountryChange);

        // Subject management
        addSubjectBtn.addEventListener('click', addSubjectRow);

        // Modal
        continueToProgram.addEventListener('click', () => {
            window.location.href = 'SelectDegree.html';
        });
    }

    // Show specific tab
    function showTab(tabIndex) {
        // Hide all tabs
        tabs.forEach(tab => tab.classList.remove('active'));
        tabButtons.forEach(btn => btn.classList.remove('active'));

        // Show selected tab
        tabs[tabIndex].classList.add('active');
        tabButtons[tabIndex].classList.add('active');

        // Update navigation buttons
        prevBtn.style.display = tabIndex === 0 ? 'none' : 'flex';
        nextBtn.style.display = tabIndex === totalTabs - 1 ? 'none' : 'flex';
        submitBtn.style.display = tabIndex === totalTabs - 1 ? 'flex' : 'none';

        // Update progress bar
        currentTab = tabIndex;
        updateProgressBar();
    }

    // Show previous tab
    function showPrevTab() {
        if (currentTab > 0) {
            showTab(currentTab - 1);
        }
    }

    // Show next tab
    function showNextTab() {
        if (validateCurrentTab()) {
            if (currentTab < totalTabs - 1) {
                showTab(currentTab + 1);
            }
        } else {
            showTabErrors();
        }
    }

    // Update progress bar
    function updateProgressBar() {
        const progress = ((currentTab + 1) / totalTabs) * 100;
        progressFill.style.width = `${progress}%`;
    }

    // Validate current tab
    function validateCurrentTab() {
        const currentTabElement = tabs[currentTab];
        const requiredFields = currentTabElement.querySelectorAll('[required]');
        let isValid = true;

        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                isValid = false;
                highlightError(field);
            } else {
                clearError(field);
            }
        });

        // Special validation for subjects tab
        if (currentTab === 1) {
            const subjectRows = subjectTableBody.querySelectorAll('tr');
            let hasValidSubject = false;

            subjectRows.forEach(row => {
                const subject = row.querySelector('[name="subject"]').value;
                const grade = row.querySelector('[name="grade"]').value;

                if (subject && grade) {
                    hasValidSubject = true;
                }
            });

            if (!hasValidSubject) {
                isValid = false;
                alert("Please add at least one subject with both subject name and grade.");
            }
        }

        return isValid;
    }

    // Show tab errors
    function showTabErrors() {
        const currentTabElement = tabs[currentTab];
        const firstError = currentTabElement.querySelector('[required]:invalid');

        if (firstError) {
            firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            firstError.focus();
        }

        alert("Please complete all required fields before continuing.");
    }

    // Handle nationality change
    function handleNationalityChange() {
        const nationality = document.getElementById('nationality').value;
        const isSouthAfrican = nationality === 'South Africa';

        // Toggle ID vs Passport sections
        document.getElementById('saIdSection').classList.toggle('hidden', !isSouthAfrican);
        document.getElementById('passportSection').classList.toggle('hidden', isSouthAfrican);
        document.getElementById('internationalAddressSection').classList.toggle('hidden', isSouthAfrican);

        // Toggle document requirements
        document.getElementById('idDocumentCard').classList.toggle('hidden', !isSouthAfrican);
        document.getElementById('passportDocumentCard').classList.toggle('hidden', isSouthAfrican);

        // Update required fields
        document.getElementById('idNumber').required = isSouthAfrican;
        document.getElementById('passportNumber').required = !isSouthAfrican;
        document.getElementById('passportCountry').required = !isSouthAfrican;
        document.getElementById('passportExpiry').required = !isSouthAfrican;
    }

    // Handle school country change
    function handleSchoolCountryChange() {
        const schoolCountry = document.getElementById('schoolCountry').value;
        const isSouthAfricanSchool = schoolCountry === 'South Africa';

        document.getElementById('schoolProvinceSection').classList.toggle('hidden', !isSouthAfricanSchool);
        document.getElementById('schoolRegionSection').classList.toggle('hidden', isSouthAfricanSchool);

        document.getElementById('schoolProvince').required = isSouthAfricanSchool;
        document.getElementById('schoolRegion').required = !isSouthAfricanSchool;
    }

    // Subject management
    function addFirstSubjectRow() {
        addSubjectRow();
    }

    function addSubjectRow() {
        const row = document.createElement("tr");
        const rowId = Date.now();

        row.innerHTML = `
            <td>
                <select name="subject" class="form-select" required>
                    <option value="">Select Subject</option>
                    ${availableSubjects.map(subject =>
            `<option value="${subject}">${subject}</option>`
        ).join('')}
                </select>
            </td>
            <td>
                <select name="level" class="form-select">
                    <option value="">Select Level</option>
                    <option value="Home Language">Home Language</option>
                    <option value="First Additional">First Additional</option>
                    <option value="HL">Higher Level</option>
                    <option value="SL">Standard Level</option>
                </select>
            </td>
            <td>
                <input type="text" name="grade" class="form-input" placeholder="e.g., 85%" required>
            </td>
            <td>
                <button type="button" class="remove-subject" data-row="${rowId}">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;

        subjectTableBody.appendChild(row);

        const removeBtn = row.querySelector('.remove-subject');
        removeBtn.addEventListener('click', function() {
            if (subjectTableBody.children.length > 1) {
                row.remove();
            } else {
                alert("You need at least one subject entry.");
            }
        });
    }

    // File upload handling
    function setupFileUploads() {
        const fileInputs = document.querySelectorAll('.file-input');

        fileInputs.forEach(input => {
            input.addEventListener('change', function(e) {
                handleFileUpload(this);
            });
        });
    }

    function handleFileUpload(input) {
        const files = input.files;
        const previewId = input.id + 'Preview';
        const preview = document.getElementById(previewId);

        if (!files || files.length === 0) {
            preview.classList.remove('show');
            return;
        }

        // Clear previous preview
        preview.innerHTML = '';
        preview.classList.add('show');

        // Handle multiple files
        Array.from(files).forEach(file => {
            if (validateFile(file)) {
                createFilePreview(file, preview, input);
            }
        });
    }

    function validateFile(file) {
        const maxSize = 2 * 1024 * 1024; // 2MB
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];

        if (file.size > maxSize) {
            alert(`File "${file.name}" exceeds 2MB size limit.`);
            return false;
        }

        if (!allowedTypes.includes(file.type)) {
            alert(`File type not allowed for "${file.name}". Please use PDF, JPG, or PNG.`);
            return false;
        }

        return true;
    }

    function createFilePreview(file, preview, input) {
        const previewItem = document.createElement('div');
        previewItem.className = 'preview-item';

        const fileSize = (file.size / 1024 / 1024).toFixed(2);

        previewItem.innerHTML = `
            <i class="fas fa-file"></i>
            <div class="preview-info">
                <div class="preview-name">${file.name}</div>
                <div class="preview-size">${fileSize} MB</div>
            </div>
            <button type="button" class="remove-file">
                <i class="fas fa-times"></i>
            </button>
        `;

        const removeBtn = previewItem.querySelector('.remove-file');
        removeBtn.addEventListener('click', () => {
            previewItem.remove();
            if (preview.children.length === 0) {
                preview.classList.remove('show');
            }
            // Clear the file input
            input.value = '';
        });

        preview.appendChild(previewItem);
    }

    // Form submission
    function handleFormSubmit(e) {
        e.preventDefault();

        if (validateCurrentTab()) {
            saveFormData();
            generateApplicationId();
            showSuccessModal();
        } else {
            showTabErrors();
        }
    }

    function saveFormData() {
        const formData = new FormData(form);
        const data = {};

        // Convert FormData to object
        for (let [key, value] of formData.entries()) {
            data[key] = value;
        }

        // Add subject data
        const subjects = [];
        const subjectRows = subjectTableBody.querySelectorAll('tr');

        subjectRows.forEach(row => {
            const subject = row.querySelector('[name="subject"]').value;
            const level = row.querySelector('[name="level"]').value;
            const grade = row.querySelector('[name="grade"]').value;

            if (subject && grade) {
                subjects.push({ subject, level, grade });
            }
        });

        data.subjects = subjects;

        // Generate application ID and password
        const applicationId = generateApplicationId();
        const password = generatePassword();

        data.applicationId = applicationId;
        data.password = password;
        data.createdAt = new Date().toISOString();
        data.status = 'pending';

        // Save to localStorage
        localStorage.setItem("completeApplication", JSON.stringify(data));

        return { applicationId, password };
    }

    function generateApplicationId() {
        const timestamp = new Date().getTime().toString().slice(-6);
        const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        return `APP${timestamp}${random}`;
    }

    function generatePassword() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%';
        let password = '';
        for (let i = 0; i < 12; i++) {
            password += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return password;
    }

    function showSuccessModal() {
        const data = JSON.parse(localStorage.getItem("completeApplication"));

        document.getElementById('generatedId').textContent = data.applicationId;
        document.getElementById('displayId').textContent = data.applicationId;
        document.getElementById('displayPassword').textContent = data.password;

        successModal.classList.add('active');
    }

    function handleCancel() {
        if (confirm("Are you sure you want to cancel? All unsaved data will be lost.")) {
            window.location.href = 'index.html';
        }
    }

    // Utility functions
    function highlightError(element) {
        element.style.borderColor = 'var(--error-color)';
        element.style.boxShadow = '0 0 0 3px rgba(220, 53, 69, 0.1)';
    }

    function clearError(element) {
        element.style.borderColor = '';
        element.style.boxShadow = '';
    }

    // Initialize the application
    initializeApp();
});