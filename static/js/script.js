// ================================
// FUNCIONES
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

function updateNavbarUser() {
    const userArea = document.getElementById("userArea");
    if (!userArea) return; // Header aún no cargado

    const user = localStorage.getItem("luxedrive_current_user");

    if (!user) {
        userArea.innerHTML = `
            <a href="./login.html" class="login-btn">Iniciar sesión</a>
        `;
    } else {
        const parsedUser = JSON.parse(user);

        userArea.innerHTML = `
            <div class="user-profile">
                <img src="images/perfil.png" class="profile-icon" alt="Perfil">
                <span class="username">${parsedUser.name}</span>
                <button class="logout-btn">Cerrar sesión</button>
            </div>
        `;

        // Evento cerrar sesión
        const logoutBtn = userArea.querySelector(".logout-btn");
        logoutBtn.addEventListener("click", () => {
            localStorage.removeItem("luxedrive_current_user");
            updateNavbarUser(); // Volver a mostrar "Iniciar sesión"
        });
    }
}

// ================================
// INICIALIZACIÓN
// ================================
document.addEventListener("DOMContentLoaded", async () => {

    // 1️⃣ Cargar templates
    await xLuIncludeFile();

    // 2️⃣ Actualizar usuario en navbar
    updateNavbarUser();

    // 3️⃣ Menú responsive
    const menuToggle = document.getElementById("menu-toggle");
    const navLinks = document.querySelector(".nav-links");
    if (menuToggle && navLinks) {
        menuToggle.addEventListener("click", () => {
            navLinks.classList.toggle("active");
        });
    }

    // 4️⃣ Animación scroll
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

    // 5️⃣ Formularios
    const form = document.querySelector("form");
    if (form) {
        form.addEventListener("submit", function(e){
            e.preventDefault();
            alert("Mensaje enviado correctamente 🚗✨");
            form.reset();
        });
    }

});