const menuToggle = document.getElementById("menu-toggle");
const navLinks = document.querySelector(".nav-links");

menuToggle.addEventListener("click", () => {
    navLinks.classList.toggle("active");
});

/* Animación al hacer scroll */
const sections = document.querySelectorAll(".section");

const reveal = () => {
    const trigger = window.innerHeight * 0.85;

    sections.forEach(sec => {
        const top = sec.getBoundingClientRect().top;
        if (top < trigger) {
            sec.style.opacity = "1";
            sec.style.transform = "translateY(0)";
        }
    });
};

sections.forEach(sec => {
    sec.style.opacity = "0";
    sec.style.transform = "translateY(50px)";
    sec.style.transition = "0.8s";
});

window.addEventListener("scroll", reveal);
const form = document.querySelector("form");

form.addEventListener("submit", (e) => {
    e.preventDefault();
    alert("Solicitud enviada correctamente 🚗✨");
    form.reset();
});
