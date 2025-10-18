const closeBtn = document.getElementById("closeBtn");
const openBtn = document.getElementById("openBtn");
const sidebar = document.getElementById("navbar");

// Close sidebar
closeBtn.addEventListener("click", (event) => {
    event.preventDefault();

    sidebar.style.display = "none"   //
    closeBtn.style.display = "none";   // hide close button
    openBtn.style.display = "block";   // show open button

    localStorage.removeItem("sidebar");
});

// Open sidebar
openBtn.addEventListener("click", (event) => {
    event.preventDefault();

    sidebar.style.display = "block";
    closeBtn.style.display = "block";   // show close button
    openBtn.style.display = "none";     // hide open button

    localStorage.setItem('sidebar', "true")
});

//checks on load
if (localStorage.getItem('sidebar') === "true") {
    sidebar.style.display = "block";
    openBtn.style.display = "none";
    closeBtn.style.display = "block";
}
else{
    sidebar.style.display = "none";
    closeBtn.style.display = "none";
    openBtn.style.display = "block";
}