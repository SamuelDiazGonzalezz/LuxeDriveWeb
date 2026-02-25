document.addEventListener("DOMContentLoaded", () => {

    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");

    const coches = {
        gt: {
            nombre: "Superdeportivo GT",
            precio: "€285.000",
            tipo: "Deportivo",
            imagen: "images/gt.jpg",
            descripcion: "El Superdeportivo GT representa la cúspide de la ingeniería automotriz...",
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
                "Frenos cerámicos de carbono",
                "Interior en cuero Nappa",
                "Sistema de sonido premium",
                "Control de tracción avanzado",
                "Pantallas digitales integradas"
            ]
        },

        sedan: {
            nombre: "Sedán Ejecutivo",
            precio: "€165.000",
            tipo: "Sedán",
            imagen: "images/sedan.jpeg",
            descripcion: "El Sedán Ejecutivo combina elegancia, confort y tecnología...",
            specs: [
                { titulo: "Motor", valor: "V6 Turbo 3.0L" },
                { titulo: "Potencia", valor: "420 CV" },
                { titulo: "Velocidad Máx.", valor: "280 km/h" },
                { titulo: "0-100 km/h", valor: "4.5 segundos" },
                { titulo: "Combustible", valor: "Gasolina Premium" },
                { titulo: "Año", valor: "2025" }
            ],
            caracteristicas: [
                "Suspensión neumática",
                "Asientos ventilados",
                "Pantalla 15”",
                "Conducción autónoma nivel 3"
            ]
        }
        // Puedes dejar los demás igual
    };

    const coche = coches[id];
    if (!coche) return;

    const container = document.getElementById("detalle-container");

    container.innerHTML = `
        <div class="detalle-img">
            <span class="badge">${coche.tipo}</span>
            <img src="${coche.imagen}" alt="${coche.nombre}">
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

            <button id="btn-comprar" class="btn-card">Comprar</button>
        </div>
    `;

    // 🔥 AHORA SÍ FUNCIONA
    const btnComprar = document.getElementById("btn-comprar");

    btnComprar.addEventListener("click", () => {
        localStorage.setItem("cocheSeleccionado", JSON.stringify(coche));
        window.location.href = "informacion.html";
    });

});