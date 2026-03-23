// ================================
// FUNCIONES
// ================================
async function xLuIncludeFile() {
    const z = document.querySelectorAll("[xlu-include-file]");

    for (const el of z) {
        const file = el.getAttribute("xlu-include-file");
        try {
            const response = await fetch(file);
            if (response.ok) {
                const content = await response.text();
                el.removeAttribute("xlu-include-file");
                el.innerHTML = content;

                // ⚡ Inicializar nodos recién insertados
                initializeDynamicElements(el);

                // Recursión para cualquier template dentro del insertado
                await xLuIncludeFile();
            }
        } catch (err) {
            console.error("Error fetching file:", err);
        }
        return; // procesar uno por uno
    }
}

function initializeDynamicElements(root) {
    // 1️⃣ Navbar usuario
    const userArea = root.querySelector("#userArea");
    if (userArea) updateNavbarUser(userArea);

    // 2️⃣ Menú responsive
    const menuToggle = root.querySelector("#menu-toggle");
    const navLinks = root.querySelector(".nav-links");
    if (menuToggle && navLinks) {
        // Toggle menú al presionar el botón
        menuToggle.addEventListener("click", () => {
            navLinks.classList.toggle("active");
        });

        // Cerrar menú al presionar un enlace
        const links = navLinks.querySelectorAll("a");
        links.forEach(link => {
            link.addEventListener("click", () => {
                navLinks.classList.remove("active");
            });
        });
    }
}

function updateNavbarUser(userArea) {
    const user = localStorage.getItem("luxedrive_current_user");
    if (!user) {
        userArea.innerHTML = `<a href="./login.html" class="login-btn">Iniciar sesión</a>`;
    } else {
        const parsedUser = JSON.parse(user);
        userArea.innerHTML = `
            <div class="user-profile">
                <img src="images/perfil.png" class="profile-icon" alt="Perfil">
                <span class="username">${parsedUser.name}</span>
                <button class="logout-btn">Cerrar sesión</button>
            </div>
        `;

        const logoutBtn = userArea.querySelector(".logout-btn");
        logoutBtn.addEventListener("click", () => {
            localStorage.removeItem("luxedrive_current_user");
            updateNavbarUser(userArea); // actualizar nuevamente
        });
    }
}

// ================================
// INICIALIZACIÓN
// ================================
document.addEventListener("DOMContentLoaded", async () => {

    // 1️⃣ Cargar templates
    await xLuIncludeFile();

    // 2️⃣ Animación scroll
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

    // 3️⃣ Formularios
    const form = document.querySelector("form");
    if (form) {
        form.addEventListener("submit", function(e){
            e.preventDefault();
            alert("Mensaje enviado correctamente 🚗✨");
            form.reset();
        });
    }

});