document.addEventListener("DOMContentLoaded", () => {

    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");

    const coches = {

        gt: {
            nombre: "Superdeportivo GT",
            precio: "€285.000",
            tipo: "Deportivo",
            imagen: "images/gt.jpg" ,
            descripcion: "El Superdeportivo GT representa la cúspide de la ingeniería automotriz. Con un motor V8 biturbo que genera una potencia brutal de 730 caballos, cada aceleración es pura adrenalina.",
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
        },

        sedan: {
            nombre: "Sedán Ejecutivo",
            precio: "€165.000",
            tipo: "Sedán",
            imagen: "images/sedan.jpeg",
            descripcion: "El Sedán Ejecutivo combina elegancia, confort y tecnología de última generación. Diseñado para quienes buscan lujo y sofisticación en cada trayecto.",
            specs: [
                { titulo: "Motor", valor: "V6 Turbo 3.0L" },
                { titulo: "Potencia", valor: "420 CV" },
                { titulo: "Velocidad Máx.", valor: "280 km/h" },
                { titulo: "0-100 km/h", valor: "4.5 segundos" },
                { titulo: "Combustible", valor: "Gasolina Premium" },
                { titulo: "Año", valor: "2025" }
            ],
            caracteristicas: [
                "Suspensión neumática inteligente",
                "Asientos ventilados y calefactados",
                "Sistema multimedia con pantalla 15”",
                "Asistente de conducción autónoma nivel 3",
                "Iluminación ambiental personalizable",
                "Sistema de sonido envolvente premium"
            ]
        },

        suv: {
            nombre: "SUV Premium",
            precio: "€198.000",
            tipo: "SUV",
            imagen: "images/suv.jpg",
            descripcion: "El SUV Premium redefine la versatilidad de lujo. Espacio, potencia y tecnología en un diseño robusto y elegante.",
            specs: [
                { titulo: "Motor", valor: "V8 Twin Turbo 4.4L" },
                { titulo: "Potencia", valor: "600 CV" },
                { titulo: "Velocidad Máx.", valor: "300 km/h" },
                { titulo: "0-100 km/h", valor: "3.8 segundos" },
                { titulo: "Combustible", valor: "Gasolina Premium" },
                { titulo: "Año", valor: "2026" }
            ],
            caracteristicas: [
                "Tracción integral inteligente AWD",
                "Sistema Off-Road adaptativo",
                "Interior de lujo con acabado en madera noble",
                "Pantallas traseras para pasajeros",
                "Asistente de aparcamiento automático",
                "Techo panorámico eléctrico"
            ]
        },

        electrico: {
            nombre: "Eléctrico Premium",
            precio: "€145.000",
            tipo: "Eléctrico",
            imagen: "images/electrico.jpg",
            descripcion: "El Eléctrico Premium ofrece rendimiento sostenible sin comprometer el lujo. Tecnología avanzada y autonomía extendida.",
            specs: [
                { titulo: "Motor", valor: "Dual Motor Eléctrico" },
                { titulo: "Potencia", valor: "520 CV" },
                { titulo: "Autonomía", valor: "620 km" },
                { titulo: "0-100 km/h", valor: "3.9 segundos" },
                { titulo: "Batería", valor: "100 kWh" },
                { titulo: "Año", valor: "2026" }
            ],
            caracteristicas: [
                "Carga rápida 80% en 20 minutos",
                "Sistema de regeneración inteligente",
                "Pantalla central curva 17”",
                "Actualizaciones OTA automáticas",
                "Modo conducción autónoma avanzada",
                "Materiales sostenibles premium"
            ]
        }

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

            <button class="btn-detalle">🛒 Comprar ahora</button>
        </div>
    `;
});