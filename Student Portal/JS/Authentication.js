const dateSpan = document.getElementById("date");
const signInBtn = document.getElementById("signInBtn");
const idInput = document.getElementById("id");
const PasswordInput = document.getElementById("password");

// Sets the date of the footer to the current year
dateSpan.innerText = new Date().getFullYear().toString();

// Login logic
signInBtn.addEventListener("click", () => {
    let id = idInput.value.trim();
    let password = PasswordInput.value;

    // Input validation
    if (!id) {
        alert("Please enter your User ID");
        idInput.focus();
        return;
    }

    if (!password) {
        alert("Please enter your Password");
        PasswordInput.focus();
        return;
    }

    const completeApplication = JSON.parse(localStorage.getItem("completeApplication"));
    const userApplications = JSON.parse(localStorage.getItem("userApplications") || "[]");

    let isValidLogin = false;
    let userData = null;

    // Check completeApplication first
    if (completeApplication && completeApplication.applicationId === id && completeApplication.password === password) {
        isValidLogin = true;
        userData = completeApplication;
    }
    // Check userApplications array
    else if (userApplications.length > 0) {
        const foundApp = userApplications.find(app =>
            app.applicationId === id && app.password === password
        );
        if (foundApp) {
            isValidLogin = true;
            userData = foundApp;
            // Update completeApplication to the found app
            localStorage.setItem("completeApplication", JSON.stringify(foundApp));
        }
    }

    if (isValidLogin && userData) {
        // Set login session using sessionStorage
        setUserSession(userData);

        // Show success message
        alert("Login successful! Redirecting...");

        // Redirect to home page
        window.location.href = "../Student Portal/index.html";

        console.log("Logged in user:", userData);
    } else {
        alert("Invalid User ID or Password");
        // Clear password field for security
        PasswordInput.value = "";
        PasswordInput.focus();
    }
});

// Function to set user session using sessionStorage
function setUserSession(userData) {
    // Set login status - using sessionStorage for auto-clear on tab close
    sessionStorage.setItem("isLoggedIn", "true");

    // Store user identification
    sessionStorage.setItem("currentUserId", userData.applicationId);

    // Store user data without password for security
    const userDataWithoutPassword = { ...userData };
    delete userDataWithoutPassword.password;
    sessionStorage.setItem("userProfile", JSON.stringify(userDataWithoutPassword));

    // Also store in localStorage for persistence if needed (optional)
    localStorage.setItem("userProfile", JSON.stringify(userDataWithoutPassword));
}