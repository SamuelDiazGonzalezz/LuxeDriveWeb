document.addEventListener("DOMContentLoaded", () => {

    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");

    const coches = {

        gt: {
            nombre: "Superdeportivo GT",
            precio: "€285.000",
            tipo: "Deportivo",
            imagen: "https://images.unsplash.com/photo-1503376780353-7e6692767b70",
            descripcion: "El Superdeportivo GT representa la cúspide de la ingeniería automotriz. Con un motor V8 biturbo que genera una potencia brutal de 730 caballos, este vehículo no solo es rápido, es una experiencia de conducción incomparable.",
            specs: [
                { titulo: "Motor", valor: "V8 Biturbo 4.0L" },
                { titulo: "Potencia", valor: "730 CV" },
                { titulo: "Velocidad Máx.", valor: "340 km/h" },
                { titulo: "0-100 km/h", valor: "3.2 segundos" },
                { titulo: "Combustible", valor: "Gasolina Premium" },
                { titulo: "Año", valor: "2026" }
            ],
            caracteristicas: [
                "Sistema de suspensión activa adaptativa",
                "Frenos cerámicos de carbono de alto rendimiento",
                "Interior en cuero Nappa de primera calidad",
                "Sistema de sonido premium con 20 altavoces",
                "Control de tracción y estabilidad avanzado",
                "Conectividad total con pantallas digitales integradas"
            ]
        }
    };

    const coche = coches[id];
    if (!coche) return;

    const container = document.getElementById("detalle-container");

    container.innerHTML = `
        <div class="detalle-img">
            <span class="badge">${coche.tipo}</span>
            <img src="${coche.imagen}" alt="">
        </div>

        <div class="detalle-info">
            <h1>${coche.nombre}</h1>
            <h2 class="precio">${coche.precio}</h2>

            <p class="descripcion">${coche.descripcion}</p>

            <h3>Especificaciones Técnicas</h3>

            <div class="spec-grid">
                ${coche.specs.map(spec => `
                    <div class="spec-card">
                        <span class="spec-title">${spec.titulo}</span>
                        <span class="spec-value">${spec.valor}</span>
                    </div>
                `).join("")}
            </div>

            <h3 class="caract-title">Características Destacadas</h3>

            <ul class="caracteristicas">
                ${coche.caracteristicas.map(c => `
                    <li>✔ ${c}</li>
                `).join("")}
            </ul>

            <button class="btn-detalle">🛒 Añadir al Carrito</button>
        </div>
    `;
});