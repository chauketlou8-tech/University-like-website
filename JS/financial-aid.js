document.addEventListener("DOMContentLoaded", () => {
    // Elements
    const navToggle = document.getElementById("navToggle");
    const navLinks = document.getElementById("navLinks");
    const applyNowBtn = document.getElementById("applyNowBtn");
    const exploreScholarshipsBtn = document.getElementById("exploreScholarshipsBtn");
    const startApplicationBtn = document.getElementById("startApplicationBtn");
    const contactAidOfficeBtn = document.getElementById("contactAidOfficeBtn");
    const applicationModal = document.getElementById("applicationModal");
    const modalCloseBtn = document.getElementById("modalCloseBtn");
    const cancelApplicationBtn = document.getElementById("cancelApplicationBtn");
    const continueApplicationBtn = document.getElementById("continueApplicationBtn");
    const eligibilityCalculator = document.getElementById("eligibilityCalculator");
    const calculatorResult = document.getElementById("calculatorResult");
    const applyAidBtn = document.getElementById("applyAidBtn");
    const faqItems = document.querySelectorAll(".faq-item");
    const cardButtons = document.querySelectorAll(".card-btn");
    const applicationOptions = document.querySelectorAll(".application-option");

    // Initialize the page
    function initializePage() {
        setupEventListeners();
        setupNavigation();
        setupFAQ();
        animateStats();
    }

    // Setup event listeners
    function setupEventListeners() {
        // Navigation toggle
        navToggle.addEventListener("click", toggleNavigation);

        // Application buttons
        applyNowBtn.addEventListener("click", openApplicationModal);
        exploreScholarshipsBtn.addEventListener("click", () => {
            window.location.href = "#scholarships-section";
        });
        startApplicationBtn.addEventListener("click", openApplicationModal);
        contactAidOfficeBtn.addEventListener("click", () => {
            window.location.href = "contact.html";
        });

        // Modal controls
        modalCloseBtn.addEventListener("click", closeApplicationModal);
        cancelApplicationBtn.addEventListener("click", closeApplicationModal);
        continueApplicationBtn.addEventListener("click", continueApplication);

        // Calculator form
        eligibilityCalculator.addEventListener("submit", calculateEligibility);
        applyAidBtn.addEventListener("click", openApplicationModal);

        // Card buttons
        cardButtons.forEach(button => {
            button.addEventListener("click", (e) => {
                const type = e.target.getAttribute("data-type");
                scrollToAidType(type);
            });
        });

        // Application options
        applicationOptions.forEach(option => {
            option.addEventListener("click", selectApplicationOption);
        });

        // Close modal when clicking outside
        applicationModal.addEventListener("click", (e) => {
            if (e.target === applicationModal) {
                closeApplicationModal();
            }
        });

        // Close modal with Escape key
        document.addEventListener("keydown", (e) => {
            if (e.key === 'Escape') {
                closeApplicationModal();
            }
        });
    }

    // Setup navigation
    function setupNavigation() {
        // Add smooth scrolling for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener("click", function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute("href"));
                if (target) {
                    target.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });
                }
            });
        });
    }

    // Setup FAQ functionality
    function setupFAQ() {
        faqItems.forEach(item => {
            const question = item.querySelector(".faq-question");
            question.addEventListener("click", () => {
                // Close all other FAQ items
                faqItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove("active");
                    }
                });

                // Toggle current item
                item.classList.toggle("active");
            });
        });
    }

    // Toggle mobile navigation
    function toggleNavigation() {
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
    }

    // Open application modal
    function openApplicationModal() {
        applicationModal.classList.add("active");
        document.body.style.overflow = "hidden";
    }

    // Close application modal
    function closeApplicationModal() {
        applicationModal.classList.remove("active");
        document.body.style.overflow = "auto";

        // Reset selected option
        applicationOptions.forEach(option => {
            option.classList.remove("selected");
        });
        continueApplicationBtn.disabled = true;
    }

    // Select application option
    function selectApplicationOption(e) {
        applicationOptions.forEach(option => {
            option.classList.remove("selected");
        });

        e.currentTarget.classList.add("selected");
        continueApplicationBtn.disabled = false;
    }

    // Continue application process
    function continueApplication() {
        const selectedOption = document.querySelector(".application-option.selected");
        if (selectedOption) {
            const applicationType = selectedOption.getAttribute("data-type");
            closeApplicationModal();

            // Simulate redirect to application form
            setTimeout(() => {
                alert(`Redirecting to ${applicationType} application form...`);
                // In a real application, you would redirect to the actual form
                // window.location.href = `apply-${applicationType}.html`;
            }, 500);
        }
    }

    // Calculate eligibility
    function calculateEligibility(e) {
        e.preventDefault();

        // Get form values
        const income = parseInt(document.getElementById("householdIncome").value) || 0;
        const familySize = parseInt(document.getElementById("familySize").value);
        const academicPerformance = document.getElementById("academicPerformance").value;
        const programType = document.getElementById("programType").value;

        // Calculate aid amounts (simplified calculation)
        const baseAmount = calculateBaseAmount(income, familySize);
        const scholarshipMultiplier = getAcademicMultiplier(academicPerformance);
        const programMultiplier = getProgramMultiplier(programType);

        const scholarshipAmount = Math.round(baseAmount * 0.3 * scholarshipMultiplier);
        const bursaryAmount = Math.round(baseAmount * 0.4);
        const loanAmount = Math.round(baseAmount * 0.5);
        const totalAmount = scholarshipAmount + bursaryAmount + loanAmount;

        // Display results
        displayCalculatorResults(scholarshipAmount, bursaryAmount, loanAmount, totalAmount);
    }

    // Calculate base amount based on income and family size
    function calculateBaseAmount(income, familySize) {
        const povertyThreshold = 150000 + (familySize - 1) * 30000;
        const needRatio = Math.max(0, (income - povertyThreshold) / povertyThreshold);

        // Maximum base amount
        const maxBase = 100000;

        // Reduce base amount as income increases
        return Math.round(maxBase * (1 - needRatio));
    }

    // Get academic performance multiplier
    function getAcademicMultiplier(performance) {
        const multipliers = {
            'excellent': 1.5,
            'very-good': 1.2,
            'good': 1.0,
            'average': 0.8,
            'below-average': 0.5
        };
        return multipliers[performance] || 1.0;
    }

    // Get program type multiplier
    function getProgramMultiplier(programType) {
        const multipliers = {
            'undergraduate': 1.0,
            'postgraduate': 1.2,
            'doctoral': 1.5
        };
        return multipliers[programType] || 1.0;
    }

    // Display calculator results
    function displayCalculatorResults(scholarship, bursary, loan, total) {
        document.getElementById("scholarshipAmount").textContent = formatCurrency(scholarship);
        document.getElementById("bursaryAmount").textContent = formatCurrency(bursary);
        document.getElementById("loanAmount").textContent = formatCurrency(loan);
        document.getElementById("totalAmount").textContent = formatCurrency(total);

        calculatorResult.classList.remove("hidden");
        calculatorResult.scrollIntoView({ behavior: "smooth", block: "center" });
    }

    // Format currency for South Africa
    function formatCurrency(amount) {
        return new Intl.NumberFormat('en-ZA', {
            style: 'currency',
            currency: 'ZAR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    }

    // Scroll to specific aid type
    function scrollToAidType(type) {
        const section = document.querySelector(`.aid-types-section`);
        if (section) {
            section.scrollIntoView({ behavior: "smooth" });

            // Highlight the specific card (visual feedback)
            const cards = document.querySelectorAll(".aid-type-card");
            cards.forEach(card => {
                card.style.borderColor = "transparent";
            });

            // In a real implementation, you might want to highlight the specific card
            // This is a simplified version
        }
    }

    // Animate statistics
    function animateStats() {
        const statNumbers = document.querySelectorAll(".stat-number");

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const statNumber = entry.target;
                    const target = parseInt(statNumber.getAttribute("data-target"));
                    animateNumber(statNumber, 0, target, 2000);
                    observer.unobserve(statNumber);
                }
            });
        }, { threshold: 0.5 });

        statNumbers.forEach(stat => observer.observe(stat));
    }

    // Animate number counting
    function animateNumber(element, start, end, duration) {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const value = Math.floor(progress * (end - start) + start);
            element.textContent = value;

            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }

    // Initialize the page
    initializePage();
});

const yearSpan = document.getElementById("year");
yearSpan.innerText = new Date().getFullYear().toString();