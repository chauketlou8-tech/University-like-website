const emailInput = document.getElementById("email");
const idInput = document.getElementById("id");
const passwordInput = document.getElementById("password");
const okBtn = document.getElementById("ok");
const cancelBtn = document.getElementById("cancel");

okBtn.addEventListener("click", (e) => {
    e.preventDefault();

    let email = emailInput.value;
    let id = idInput.value;
    let password = passwordInput.value;

    if (!email){
        alert("Please enter an email");
    }
    else if (!id){
        alert("Please enter a valid id");
    }
    else if (!password){
        alert("Please enter your password");
    }
    else if (!validateEmail(email)){
        alert("Please enter a valid email");
    }
})

cancelBtn.addEventListener("click", (e) => {
    e.preventDefault();
    if (confirm("Are you sure you want to cancel and exit this page?")) {
        window.location.href = "Apply.html";
    }
});

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}