document.addEventListener("DOMContentLoaded", () => {

    console.log("Información cargada");

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