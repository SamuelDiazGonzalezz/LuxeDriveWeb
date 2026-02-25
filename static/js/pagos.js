document.addEventListener("DOMContentLoaded", () => {


    const cocheJSON = localStorage.getItem("cocheSeleccionado");

    if (!cocheJSON) {
        console.log("No hay coche guardado");
        return;
    }

    const coche = JSON.parse(cocheJSON);
    console.log("Coche:", coche);

    // ===== PRODUCTO =====
    const img = document.getElementById("product-img");
    const nombre = document.querySelector(".product-name");
    const categoria = document.querySelector(".product-category");
    const precio = document.querySelector(".product-price");

    if (img) img.src = coche.imagen;
    if (img) img.alt = coche.nombre;
    if (nombre) nombre.textContent = coche.nombre;
    if (categoria) categoria.textContent = coche.tipo;
    if (precio) precio.textContent = coche.precio;

    // ===== CALCULAR PRECIO =====
    const precioNumero = Number(
        coche.precio.replace("€", "").replace(/\./g, "")
    );

    const iva = precioNumero * 0.21;
    const total = precioNumero + iva;

    // ===== RESUMEN =====
    const subtotalEl = document.getElementById("subtotal");
    const ivaEl = document.getElementById("iva");
    const totalEl = document.getElementById("total");

    if (subtotalEl) subtotalEl.textContent = coche.precio;
    if (ivaEl) ivaEl.textContent = "€" + iva.toLocaleString("es-ES");
    if (totalEl) totalEl.textContent = "€" + total.toLocaleString("es-ES");

});
// Formateo automático número de tarjeta
const cardNumber = document.getElementById("cardNumber");

cardNumber.addEventListener("input", function(e) {
    let value = e.target.value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    let formatted = value.match(/.{1,4}/g);
    if (formatted) {
        e.target.value = formatted.join(" ");
    }
});

// Formateo fecha MM/AA
const expiry = document.getElementById("expiry");

expiry.addEventListener("input", function(e) {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length >= 3) {
        value = value.slice(0,2) + "/" + value.slice(2,4);
    }
    e.target.value = value;
});

// Validación simple
document.getElementById("paymentForm").addEventListener("submit", function(e) {
    e.preventDefault();

    const cvv = document.getElementById("cvv").value;

    if (cvv.length !== 3) {
        alert("CVV inválido");
        return;
    }

    alert("Pago realizado con éxito 🚀");
    window.location.href = "index.html";
});