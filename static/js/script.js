// ================================
// FUNCIÓN DEL PROFESOR (NO TOCAR)
// ================================
async function xLuIncludeFile() {
    let z = document.getElementsByTagName("*");

    for (let i = 0; i < z.length; i++) {
        if (z[i].getAttribute("xlu-include-file")) {
            let a = z[i].cloneNode(false);
            let file = z[i].getAttribute("xlu-include-file");

            try {
                let response = await fetch(file);
                if (response.ok) {

                    let content = await response.text();

                    a.removeAttribute("xlu-include-file");
                    a.innerHTML = content;
                    z[i].parentNode.replaceChild(a, z[i]);

                    await xLuIncludeFile();
                }
            } catch (error) {
                console.error("Error fetching file:", error);
            }

            return;
        }
    }
}


// ================================
// INICIALIZACIÓN GENERAL
// ================================
document.addEventListener("DOMContentLoaded", async () => {

    // Cargar templates primero
    await xLuIncludeFile();

    // MENÚ RESPONSIVE
    const menuToggle = document.getElementById("menu-toggle");
    const navLinks = document.querySelector(".nav-links");

    if (menuToggle && navLinks) {
        menuToggle.addEventListener("click", () => {
            navLinks.classList.toggle("active");
        });
    }

    // ANIMACIÓN SCROLL
    const sections = document.querySelectorAll(".section");

    sections.forEach(sec => {
        sec.style.opacity = "0";
        sec.style.transform = "translateY(40px)";
        sec.style.transition = "0.6s";
    });

    function reveal() {
        const trigger = window.innerHeight * 0.85;

        sections.forEach(sec => {
            const top = sec.getBoundingClientRect().top;
            if (top < trigger) {
                sec.style.opacity = "1";
                sec.style.transform = "translateY(0)";
            }
        });
    }

    window.addEventListener("scroll", reveal);
    reveal();

    // FORMULARIO
    const form = document.querySelector("form");
    if (form) {
        form.addEventListener("submit", function (e) {
            e.preventDefault();
            alert("Mensaje enviado correctamente 🚗✨");
            form.reset();
        });
    }

});
document.addEventListener("DOMContentLoaded", async () => {

    await xLuIncludeFile();

    // Scroll manual para enlaces internos
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener("click", function (e) {
            e.preventDefault();

            const target = document.querySelector(this.getAttribute("href"));

            if (target) {
                target.scrollIntoView({
                    behavior: "smooth"
                });
            }
        });
    });

});
