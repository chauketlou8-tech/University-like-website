// JavaScript for Enhanced Program Selection
document.addEventListener("DOMContentLoaded", () => {
    // DOM Elements
    const form = document.getElementById("programSelectionForm");
    const tabs = document.querySelectorAll(".form-tab");
    const tabButtons = document.querySelectorAll(".tab-btn");
    const prevBtn = document.getElementById("prevTab");
    const nextBtn = document.getElementById("nextTab");
    const submitBtn = document.getElementById("submitBtn");
    const cancelBtn = document.getElementById("cancelBtn");
    const progressFill = document.querySelector(".progress-fill");
    const programModal = document.getElementById("programModal");
    const modalClose = document.getElementById("modalClose");
    const modalCancel = document.getElementById("modalCancel");
    const modalSelect = document.getElementById("modalSelect");

    // Form state
    let currentTab = 0;
    const totalTabs = tabs.length;
    let selectedLevel = null;
    let selectedProgram = null;
    let selectedSecondProgram = null;
    let selectedPostgradType = null;
    let currentModalContext = 'firstChoice'; // 'firstChoice' or 'secondChoice'

    // Program data structure
    const programData = {
        undergraduate: {
            "Faculty of Science": [
                {
                    id: "CS001",
                    name: "Computer Science",
                    code: "BSC-CS",
                    duration: "3 years",
                    credits: 360,
                    nqfLevel: 7,
                    modes: ["Full-time", "Part-time", "Online"],
                    description: "Comprehensive program covering algorithms, programming, data structures, and software engineering principles.",
                    requirements: [
                        "Mathematics Level 5 (60%+)",
                        "Physical Sciences Level 5 (60%+)",
                        "APS Score: 38+",
                        "English Home Language Level 5"
                    ],
                    campuses: ["Main Campus", "City Campus"]
                },
                {
                    id: "MA002",
                    name: "Mathematics",
                    code: "BSC-MATH",
                    duration: "3 years",
                    credits: 360,
                    nqfLevel: 7,
                    modes: ["Full-time", "Part-time"],
                    description: "Advanced mathematical theory and applications across pure and applied mathematics.",
                    requirements: [
                        "Mathematics Level 6 (70%+)",
                        "APS Score: 36+",
                        "English Home Language Level 5"
                    ],
                    campuses: ["Main Campus"]
                }
            ],
            "Faculty of Engineering": [
                {
                    id: "ME001",
                    name: "Mechanical Engineering",
                    code: "BENG-ME",
                    duration: "4 years",
                    credits: 480,
                    nqfLevel: 8,
                    modes: ["Full-time"],
                    description: "Comprehensive engineering program focusing on mechanical systems design and analysis.",
                    requirements: [
                        "Mathematics Level 6 (70%+)",
                        "Physical Sciences Level 6 (70%+)",
                        "APS Score: 40+",
                        "English Home Language Level 5"
                    ],
                    campuses: ["Main Campus", "West Campus"]
                }
            ]
        },
        postgraduate: {
            honours: {
                "Faculty of Science": [
                    {
                        id: "HCS001",
                        name: "Honours in Computer Science",
                        code: "HONS-CS",
                        duration: "1 year",
                        credits: 120,
                        nqfLevel: 8,
                        modes: ["Full-time", "Part-time"],
                        description: "Advanced coursework in specialized computer science topics and research methodology.",
                        requirements: [
                            "BSc in Computer Science or equivalent",
                            "65% average in final year",
                            "Research proposal",
                            "Academic references"
                        ],
                        campuses: ["Main Campus"]
                    }
                ]
            },
            masters: {
                "Faculty of Science": [
                    {
                        id: "MCS001",
                        name: "MSc in Computer Science",
                        code: "MSC-CS",
                        duration: "2 years",
                        credits: 180,
                        nqfLevel: 9,
                        modes: ["Full-time", "Part-time"],
                        description: "Research-focused masters program with coursework and thesis components.",
                        requirements: [
                            "Honours degree in relevant field",
                            "65% average in honours",
                            "Research proposal",
                            "Academic supervisor agreement"
                        ],
                        campuses: ["Main Campus"]
                    }
                ]
            },
            phd: {
                "Faculty of Science": [
                    {
                        id: "PCS001",
                        name: "PhD in Computer Science",
                        code: "PHD-CS",
                        duration: "3-4 years",
                        credits: 360,
                        nqfLevel: 10,
                        modes: ["Full-time", "Part-time"],
                        description: "Doctoral research program contributing original knowledge to the field.",
                        requirements: [
                            "Masters degree in relevant field",
                            "Research proposal",
                            "Academic supervisor agreement",
                            "Publication record preferred"
                        ],
                        campuses: ["Main Campus"]
                    }
                ]
            }
        }
    };

    // Initialize the application
    function initializeApp() {
        populateStartYears();
        setupEventListeners();
        updateProgressBar();
        showTab(currentTab);
        loadSavedData();
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

        // Level selection
        document.querySelectorAll('.level-card').forEach(card => {
            card.addEventListener('click', handleLevelSelection);
        });

        // Faculty selection
        document.getElementById('faculty').addEventListener('change', handleFacultyChange);

        // Postgraduate type selection
        document.querySelectorAll('input[name="postgradType"]').forEach(radio => {
            radio.addEventListener('change', handlePostgradTypeChange);
        });

        // Program search
        document.getElementById('programSearch').addEventListener('input', (e) => handleProgramSearch(e, 'firstChoice'));
        document.getElementById('secondChoice').addEventListener('input', (e) => handleProgramSearch(e, 'secondChoice'));

        // Study details
        document.getElementById('mode').addEventListener('change', updateSummary);
        document.getElementById('campus').addEventListener('change', updateSummary);
        document.getElementById('startYear').addEventListener('change', updateSummary);
        document.getElementById('intake').addEventListener('change', updateSummary);

        // Modal
        modalClose.addEventListener('click', closeModal);
        modalCancel.addEventListener('click', closeModal);
        modalSelect.addEventListener('click', selectProgramFromModal);
        document.getElementById('editSummary').addEventListener('click', () => showTab(1));
        document.getElementById('changeProgram').addEventListener('click', () => showProgramSearch('firstChoice'));
        document.getElementById('changeSecondChoice').addEventListener('click', () => showProgramSearch('secondChoice'));
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
        switch (currentTab) {
            case 0: // Program level
                if (!selectedLevel) {
                    alert("Please select a program level");
                    return false;
                }
                break;

            case 1: // Faculty & program
                if (!document.getElementById('faculty').value) {
                    alert("Please select a faculty");
                    return false;
                }
                if (selectedLevel === 'postgraduate' && !selectedPostgradType) {
                    alert("Please select a postgraduate program type");
                    return false;
                }
                // Require BOTH first and second choice programs
                if (!selectedProgram) {
                    alert("Please select your first choice program");
                    return false;
                }
                if (!selectedSecondProgram) {
                    alert("Please select your second choice program");
                    return false;
                }
                break;

            case 2: // Study details
                const mode = document.getElementById('mode').value;
                const campus = document.getElementById('campus').value;
                const startYear = document.getElementById('startYear').value;
                const intake = document.getElementById('intake').value;

                if (!mode || !campus || !startYear || !intake) {
                    alert("Please complete all study details");
                    return false;
                }

                // Validate campus availability for selected programs
                if (selectedProgram && !selectedProgram.campuses.includes(campus)) {
                    alert(`Your first choice program is not available at ${campus}`);
                    return false;
                }
                if (selectedSecondProgram && !selectedSecondProgram.campuses.includes(campus)) {
                    alert(`Your second choice program is not available at ${campus}`);
                    return false;
                }
                break;
        }

        return true;
    }

    // Show tab errors
    function showTabErrors() {
        const currentTabElement = tabs[currentTab];
        const firstError = currentTabElement.querySelector('[required]:invalid');

        if (firstError) {
            firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            firstError.focus();
        }
    }

    // Handle level selection
    function handleLevelSelection(e) {
        const card = e.currentTarget;
        const level = card.getAttribute('data-level');

        // Update UI
        document.querySelectorAll('.level-card').forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');

        selectedLevel = level;

        // Enable next step
        setTimeout(() => {
            showNextTab();
        }, 500);
    }

    // Handle faculty change
    function handleFacultyChange() {
        const faculty = this.value;

        if (faculty) {
            // Show appropriate sections based on level
            if (selectedLevel === 'postgraduate') {
                document.getElementById('postgradTypeSection').classList.remove('hidden');
            } else {
                document.getElementById('programSelectionSection').classList.remove('hidden');
                document.getElementById('secondChoiceSection').classList.remove('hidden');
            }
        }
    }

    // Handle postgraduate type change
    function handlePostgradTypeChange() {
        selectedPostgradType = this.value;

        // Update UI
        document.querySelectorAll('.option-card').forEach(card => card.classList.remove('selected'));
        this.closest('.option-card').classList.add('selected');

        // Show research section for Masters/PhD
        if (selectedPostgradType === 'masters' || selectedPostgradType === 'phd') {
            document.getElementById('researchSection').classList.remove('hidden');
        } else {
            document.getElementById('researchSection').classList.add('hidden');
        }

        // Show program selection
        document.getElementById('programSelectionSection').classList.remove('hidden');
        document.getElementById('secondChoiceSection').classList.remove('hidden');
    }

    // Handle program search
    function handleProgramSearch(e, context) {
        const query = e.target.value.toLowerCase();
        const faculty = document.getElementById('faculty').value;
        const suggestionsId = context === 'firstChoice' ? 'programSuggestions' : 'secondChoiceSuggestions';
        const suggestions = document.getElementById(suggestionsId);

        // Clear previous suggestions
        suggestions.innerHTML = '';
        suggestions.classList.remove('show');

        if (query.length < 2) return;

        // Get programs based on level and faculty
        let programs = [];
        if (selectedLevel === 'undergraduate') {
            programs = programData.undergraduate[faculty] || [];
        } else {
            programs = programData.postgraduate[selectedPostgradType][faculty] || [];
        }

        // Filter programs and exclude already selected programs
        let filtered = programs.filter(program =>
            program.name.toLowerCase().includes(query) ||
            program.code.toLowerCase().includes(query)
        );

        // For second choice, exclude the first choice program
        if (context === 'secondChoice' && selectedProgram) {
            filtered = filtered.filter(program => program.id !== selectedProgram.id);
        }

        filtered = filtered.slice(0, 5);

        if (filtered.length > 0) {
            filtered.forEach(program => {
                const item = document.createElement('div');
                item.className = 'suggestion-item';
                item.innerHTML = `
                    <span class="suggestion-name">${program.name}</span>
                    <span class="suggestion-code">${program.code}</span>
                `;
                item.addEventListener('click', () => showProgramDetails(program, context));
                suggestions.appendChild(item);
            });
            suggestions.classList.add('show');
        }
    }

    // Show program details in modal
    function showProgramDetails(program, context) {
        document.getElementById('modalProgramName').textContent = program.name;
        document.getElementById('modalCode').textContent = program.code;
        document.getElementById('modalDuration').textContent = program.duration;
        document.getElementById('modalCredits').textContent = program.credits;
        document.getElementById('modalNqf').textContent = `NQF Level ${program.nqfLevel}`;
        document.getElementById('modalDescription').textContent = program.description;

        // Populate requirements
        const requirementsList = document.getElementById('modalRequirements');
        requirementsList.innerHTML = '';
        program.requirements.forEach(req => {
            const li = document.createElement('li');
            li.textContent = req.toString();
            requirementsList.appendChild(li);
        });

        // Store program and context for selection
        if (context === 'firstChoice') {
            selectedProgram = program;
        } else {
            selectedSecondProgram = program;
        }
        currentModalContext = context;

        // Show modal
        programModal.classList.add('active');
    }

    // Select program from modal
    function selectProgramFromModal() {
        if (currentModalContext === 'firstChoice' && selectedProgram) {
            updateFirstChoiceDisplay();
        } else if (currentModalContext === 'secondChoice' && selectedSecondProgram) {
            updateSecondChoiceDisplay();
        }

        // Close modal
        closeModal();

        // Update summary
        updateSummary();

        // Auto-advance to next tab only when BOTH choices are selected
        if (currentTab === 1 && selectedProgram && selectedSecondProgram) {
            setTimeout(() => {
                showNextTab();
            }, 1000);
        }
    }

    // Update first choice display
    function updateFirstChoiceDisplay() {
        const card = document.getElementById('selectedProgramCard');
        document.getElementById('selectedProgramName').textContent = selectedProgram.name;
        document.getElementById('programLevelBadge').textContent = selectedLevel === 'undergraduate' ? 'Undergraduate' : selectedPostgradType;
        document.getElementById('programDuration').textContent = selectedProgram.duration;
        document.getElementById('programType').textContent = selectedLevel === 'undergraduate' ? 'Bachelor' : selectedPostgradType;
        document.getElementById('programCode').textContent = selectedProgram.code;

        card.classList.remove('hidden');
        document.getElementById('programSearch').value = selectedProgram.name;
    }

    // Update second choice display
    function updateSecondChoiceDisplay() {
        const card = document.getElementById('secondChoiceCard');
        document.getElementById('secondChoiceProgramName').textContent = selectedSecondProgram.name;
        document.getElementById('secondChoiceLevelBadge').textContent = selectedLevel === 'undergraduate' ? 'Undergraduate' : selectedPostgradType;
        document.getElementById('secondChoiceDuration').textContent = selectedSecondProgram.duration;
        document.getElementById('secondChoiceType').textContent = selectedLevel === 'undergraduate' ? 'Bachelor' : selectedPostgradType;
        document.getElementById('secondChoiceCode').textContent = selectedSecondProgram.code;

        card.classList.remove('hidden');
        document.getElementById('secondChoice').value = selectedSecondProgram.name;
    }

    // Close modal
    function closeModal() {
        programModal.classList.remove('active');
        currentModalContext = 'firstChoice';
    }

    // Show program search
    function showProgramSearch(context) {
        if (context === 'firstChoice') {
            document.getElementById('selectedProgramCard').classList.add('hidden');
            document.getElementById('programSearch').value = '';
            document.getElementById('programSearch').focus();
            selectedProgram = null;
        } else {
            document.getElementById('secondChoiceCard').classList.add('hidden');
            document.getElementById('secondChoice').value = '';
            document.getElementById('secondChoice').focus();
            selectedSecondProgram = null;
        }
    }

    // Update program summary
    function updateSummary() {
        document.getElementById('summaryLevel').textContent = selectedLevel === 'undergraduate' ? 'Undergraduate' : 'Postgraduate';
        document.getElementById('summaryFaculty').textContent = document.getElementById('faculty').value || 'Not selected';
        document.getElementById('summaryProgram').textContent = selectedProgram ? selectedProgram.name : 'Not selected';
        document.getElementById('summarySecondChoice').textContent = selectedSecondProgram ? selectedSecondProgram.name : 'Not selected';
        document.getElementById('summaryMode').textContent = document.getElementById('mode').value || 'Not selected';
        document.getElementById('summaryCampus').textContent = document.getElementById('campus').value || 'Not selected';

        const startYear = document.getElementById('startYear').value;
        const intake = document.getElementById('intake').value;
        document.getElementById('summaryStart').textContent = startYear && intake ? `${intake} ${startYear}` : 'Not selected';
    }

    // Populate start years
    function populateStartYears() {
        const select = document.getElementById('startYear');
        const currentYear = new Date().getFullYear();

        for (let year = currentYear; year <= currentYear + 2; year++) {
            const option = document.createElement('option');
            option.value = year.toString();
            option.textContent = year.toString();
            select.appendChild(option);
        }
    }

    // Load saved data
    function loadSavedData() {
        const savedData = localStorage.getItem('programSelection');
        if (savedData) {
            const data = JSON.parse(savedData);

            // Restore form state
            if (data.selectedLevel) {
                selectedLevel = data.selectedLevel;
                document.querySelector(`[data-level="${selectedLevel}"]`).classList.add('selected');
            }

            if (data.selectedProgram) {
                selectedProgram = data.selectedProgram;
                updateFirstChoiceDisplay();
            }

            if (data.selectedSecondProgram) {
                selectedSecondProgram = data.selectedSecondProgram;
                updateSecondChoiceDisplay();
            }

            if (data.selectedPostgradType) {
                selectedPostgradType = data.selectedPostgradType;
                document.querySelector(`input[name="postgradType"][value="${selectedPostgradType}"]`).checked = true;
                handlePostgradTypeChange();
            }

            // Restore other form values
            if (data.faculty) {
                document.getElementById('faculty').value = data.faculty;
            }
        }
    }

    // Handle form submission
    function handleFormSubmit(e) {
        e.preventDefault();

        if (validateCurrentTab()) {
            // Save form data
            const formData = {
                selectedLevel,
                selectedPostgradType,
                selectedProgram,
                selectedSecondProgram,
                faculty: document.getElementById('faculty').value,
                mode: document.getElementById('mode').value,
                campus: document.getElementById('campus').value,
                startYear: document.getElementById('startYear').value,
                intake: document.getElementById('intake').value,
                researchArea: document.getElementById('researchArea')?.value || '',
                supervisor: document.getElementById('supervisor')?.value || '',
                researchType: document.getElementById('researchType')?.value || ''
            };

            localStorage.setItem('programSelection', JSON.stringify(formData));

            // Update complete application in localStorage
            updateCompleteApplication(formData);

            // Redirect to next step
            window.location.href = 'reviewPayment.html';
        }
    }

    // Update complete application in localStorage
    function updateCompleteApplication(programData) {
        let completeApplication = JSON.parse(localStorage.getItem('completeApplication') || '{}');

        completeApplication.programSelection = programData;
        completeApplication.currentStep = 'program-selection-completed';

        localStorage.setItem('completeApplication', JSON.stringify(completeApplication));
    }

    // Handle cancel
    function handleCancel() {
        if (confirm("Are you sure you want to cancel? All unsaved program selection data will be lost.")) {
            window.location.href = 'index.html';
        }
    }

    // Initialize the application
    initializeApp();
});