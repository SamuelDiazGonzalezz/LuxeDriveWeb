// login.js
// Módulo de autenticación en Vanilla JS

const Auth = (() => {

    const DATA_URL = "data.json";
    const STORAGE_KEY = "currentUser";

    let users = [];

    /* ==============================
       CARGA DE USUARIOS
    ============================== */

    async function loadUsers() {
        try {
            const response = await fetch(DATA_URL);
            const data = await response.json();
            users = data.users || [];
        } catch (error) {
            console.error("Error cargando usuarios:", error);
        }
    }

    /* ==============================
       VALIDACIÓN
    ============================== */

    function validateCredentials(username, password) {
        return users.find(
            user =>
                user.username === username &&
                user.password === password
        );
    }

    /* ==============================
       LOGIN
    ============================== */

    async function login(username, password) {

        if (users.length === 0) {
            await loadUsers();
        }

        const user = validateCredentials(username, password);

        if (user) {
            saveSession(user);
            return { success: true, user };
        }

        return { success: false };
    }

    /* ==============================
       LOGOUT
    ============================== */

    function logout() {
        localStorage.removeItem(STORAGE_KEY);
        window.location.href = "index.html";
    }

    /* ==============================
       SESIÓN
    ============================== */

    function saveSession(user) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    }

    function getCurrentUser() {
        const user = localStorage.getItem(STORAGE_KEY);
        return user ? JSON.parse(user) : null;
    }

    function isAuthenticated() {
        return getCurrentUser() !== null;
    }

    /* ==============================
       PROTEGER PÁGINAS
    ============================== */

    function requireAuth() {
        if (!isAuthenticated()) {
            window.location.href = "login.html";
        }
    }

    /* ==============================
       CONTROL DE ROLES (opcional)
    ============================== */

    function requireRole(role) {
        const user = getCurrentUser();

        if (!user || user.role !== role) {
            window.location.href = "index.html";
        }
    }

    /* ==============================
       EVENT LISTENER DEL FORM
    ============================== */

    function initLoginForm() {

        const form = document.getElementById("loginForm");
        if (!form) return;

        form.addEventListener("submit", async (e) => {
            e.preventDefault();

            const username = document.getElementById("username").value.trim();
            const password = document.getElementById("password").value.trim();

            const result = await login(username, password);

            if (result.success) {
                window.location.href = "index.html";
            } else {
                alert("Credenciales incorrectas");
            }
        });
    }

    /* ==============================
       INICIALIZACIÓN
    ============================== */

    function init() {
        initLoginForm();
    }

    return {
        init,
        login,
        logout,
        isAuthenticated,
        getCurrentUser,
        requireAuth,
        requireRole
    };

})();

/* ==============================
   AUTO-INICIO
============================== */

document.addEventListener("DOMContentLoaded", () => {
    Auth.init();
});