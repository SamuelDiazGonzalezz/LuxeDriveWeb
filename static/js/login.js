const Auth = (() => {

    const API_URL = "http://localhost:3000/users";
    const STORAGE_KEY = "currentUser";

    /* ==============================
       LOGIN CONTRA JSON SERVER
    ============================== */

    async function login(email, password) {
        try {

            const response = await fetch(
                `${API_URL}?email=${email}&password=${password}`
            );

            const users = await response.json();

            if (users.length > 0) {
                const user = users[0];
                saveSession(user);
                return { success: true, user };
            }

            return { success: false };

        } catch (error) {
            console.error("Error en login:", error);
            return { success: false };
        }
    }

    /* ==============================
       REGISTRO (POST)
    ============================== */

    async function register(name, email, password) {

        try {

            // Verificar si el email ya existe
            const check = await fetch(`${API_URL}?email=${email}`);
            const existing = await check.json();

            if (existing.length > 0) {
                return { success: false, message: "El email ya está registrado" };
            }

            const newUser = {
                name,
                email,
                password,
                role: "client"
            };

            const response = await fetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newUser)
            });

            const createdUser = await response.json();

            saveSession(createdUser);

            return { success: true };

        } catch (error) {
            console.error("Error en registro:", error);
            return { success: false };
        }
    }

    /* ==============================
       SESIÓN
    ============================== */

    function saveSession(user) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    }

    function logout() {
        localStorage.removeItem(STORAGE_KEY);
        window.location.href = "login.html";
    }

    function getCurrentUser() {
        const user = localStorage.getItem(STORAGE_KEY);
        return user ? JSON.parse(user) : null;
    }

    function isAuthenticated() {
        return getCurrentUser() !== null;
    }

    function requireAuth() {
        if (!isAuthenticated()) {
            window.location.href = "login.html";
        }
    }

    /* ==============================
       FORM LOGIN
    ============================== */

    function initLoginForm() {

        const form = document.getElementById("loginForm");
        if (!form) return;

        form.addEventListener("submit", async (e) => {
            e.preventDefault();

            const email = document.getElementById("username").value.trim();
            const password = document.getElementById("password").value.trim();

            const result = await login(email, password);

            if (result.success) {
                window.location.href = "index.html";
            } else {
                alert("Credenciales incorrectas");
            }
        });
    }

    /* ==============================
       FORM REGISTRO
    ============================== */

    function initRegisterForm() {

        const form = document.getElementById("registerForm");
        if (!form) return;

        form.addEventListener("submit", async (e) => {
            e.preventDefault();

            const name = form.querySelector('input[type="text"]').value.trim();
            const email = form.querySelector('input[type="email"]').value.trim();
            const password = document.getElementById("password").value;
            const confirmPassword = document.getElementById("confirmPassword").value;

            if (password !== confirmPassword) {
                alert("Las contraseñas no coinciden");
                return;
            }

            const result = await register(name, email, password);

            if (result.success) {
                window.location.href = "index.html";
            } else {
                alert(result.message || "Error en el registro");
            }
        });
    }

    function init() {
        initLoginForm();
        initRegisterForm();
    }

    return {
        init,
        login,
        register,
        logout,
        requireAuth,
        isAuthenticated,
        getCurrentUser
    };

})();

document.addEventListener("DOMContentLoaded", () => {
    Auth.init();
});