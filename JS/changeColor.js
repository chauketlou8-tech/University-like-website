document.addEventListener("DOMContentLoaded", () => {
    const spans = document.getElementsByClassName('span');
    const colors = ["#0cac74", "#64ac0c", "#770cac", "#0ca7ac", "#ac0c24", "#ac910c"];

    for (let i = 0; i < 6; i++) {
        let randomIndex = Math.floor(Math.random() * colors.length);
        spans[i].style.background = colors[randomIndex];
        colors.splice(randomIndex, 1);
    }
});
