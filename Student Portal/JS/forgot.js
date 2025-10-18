import emailjs from 'https://cdn.emailjs.com/dist/email.min.js';

/* global emailjs */
document.addEventListener("DOMContentLoaded", () => {
    emailjs.init("ZoyqwzwHkBaMH06-G"); // Replace with your EmailJS user ID

    const form = document.getElementById("forgot-form");
    const emailInput = document.getElementById("email");
    const submitBtn = document.getElementById("submit-btn");
    const loaderOverlay = document.getElementById("loader-overlay");
    const successOverlay = document.getElementById("success-overlay");
    const errorMessage = document.getElementById("email-error");

    form.addEventListener("submit", (e) => {
    e.preventDefault();

    const email = emailInput.value.trim();

    if (!validateEmail(email)) {
    emailInput.classList.add("input-error");
    errorMessage.style.display = "block";
    return;
}

    emailInput.classList.remove("input-error");
    errorMessage.style.display = "none";

    loaderOverlay.style.display = "flex";
    submitBtn.disabled = true;
    successOverlay.style.display = "none";

    // EmailJS template parameters
        const templateParams = {
            to_email: email,           // recipient (doesn't need verification)
            from_name: "UniversityApp",               // sender display name
            from_email: "chauketlou8@gmail.com",    // must be verified in EmailJS
            link: "https://yourdomain.com/passwordReset.html"
        };


    emailjs.send("service_7ivrgyl", "template_57ddqv9", templateParams)
    .then((response) => {
    console.log("SUCCESS!", response.status, response.text);

    loaderOverlay.style.display = "none";
    successOverlay.style.display = "flex";
    submitBtn.disabled = false;
    form.reset();

    setTimeout(() => {
    successOverlay.style.display = "none";
}, 2000);
}, (error) => {
    console.log("FAILED...", error);
    loaderOverlay.style.display = "none";
    submitBtn.disabled = false;
    alert("Failed to send email. Please try again.");
});
});

    emailInput.addEventListener("input", () => {
    if (emailInput.classList.contains("input-error")) {
    emailInput.classList.remove("input-error");
    errorMessage.style.display = "none";
}
});

    function validateEmail(email) {
    const pattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/i;
    return pattern.test(email);
}
});

