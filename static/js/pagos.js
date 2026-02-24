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
});