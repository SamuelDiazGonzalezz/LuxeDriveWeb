const Auth = (() => {

    const USERS_KEY = "luxedrive_users";
    const SESSION_KEY = "luxedrive_current_user";

    /* ==============================
       OBTENER USUARIOS
    ============================== */

    function getUsers() {
        const users = localStorage.getItem(USERS_KEY);
        return users ? JSON.parse(users) : [];
    }

    function saveUsers(users) {
        localStorage.setItem(USERS_KEY, JSON.stringify(users));
    }

    /* ==============================
       LOGIN
    ============================== */

    function login(email, password) {

        const users = getUsers();

        const user = users.find(
            u => u.email === email && u.password === password
        );

        if (user) {

            user.last_login = new Date().toISOString();
            saveUsers(users);

            saveSession(user);

            return { success: true, user };
        }

        return { success: false };
    }

    /* ==============================
       REGISTER
    ============================== */

    function register(name, email, password) {

        const users = getUsers();

        const exists = users.find(u => u.email === email);

        if (exists) {
            return { success: false, message: "El email ya está registrado" };
        }

        const newUser = {
            id: Date.now(),
            name,
            email,
            password,
            role: "client",
            created_at: new Date().toISOString(),
            last_login: null
        };

        users.push(newUser);
        saveUsers(users);

        saveSession(newUser);

        return { success: true };
    }

    /* ==============================
       SESIÓN
    ============================== */

    function saveSession(user) {
        localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    }

    function logout() {
        localStorage.removeItem(SESSION_KEY);
        window.location.href = "login.html";
    }

    function getCurrentUser() {
        const user = localStorage.getItem(SESSION_KEY);
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

        form.addEventListener("submit", (e) => {

            e.preventDefault();

            const email = document.getElementById("username").value.trim();
            const password = document.getElementById("password").value.trim();

            const result = login(email, password);

            if (result.success) {
                window.location.href = "index.html";
            } else {
                alert("Credenciales incorrectas");
            }
        });
    }

    /* ==============================
       FORM REGISTER
    ============================== */

    function initRegisterForm() {

        const form = document.getElementById("registerForm");
        if (!form) return;

        form.addEventListener("submit", (e) => {

            e.preventDefault();

            const name = form.querySelector('input[type="text"]').value.trim();
            const email = form.querySelector('input[type="email"]').value.trim();
            const password = document.getElementById("password").value;
            const confirmPassword = document.getElementById("confirmPassword").value;

            if (password !== confirmPassword) {
                alert("Las contraseñas no coinciden");
                return;
            }

            const result = register(name, email, password);

            if (result.success) {
                window.location.href = "index.html";
            } else {
                alert(result.message);
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