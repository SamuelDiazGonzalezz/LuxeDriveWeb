document.addEventListener("DOMContentLoaded", async () => {
    const container = document.getElementById("detalle-container");

    if (!container) return;

    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");

    try {
        const response = await fetch("./static/coches.json");

        if (!response.ok) {
            throw new Error("No se pudo cargar coches.json");
        }

        const coches = await response.json();

        let coche = null;

        /* 1. Intentar por id en la URL */
        if (id && coches[id]) {
            coche = coches[id];
        }

        /* 2. Si no hay id, intentar recuperar desde localStorage */
        if (!coche) {
            const cocheGuardado = localStorage.getItem("cocheSeleccionado");
            if (cocheGuardado) {
                coche = JSON.parse(cocheGuardado);
            }
        }

        /* 3. Si sigue sin haber coche, mostrar mensaje */
        if (!coche) {
            container.innerHTML = `
                <div class="detalle-error">
                    <h2>No se ha encontrado ningún vehículo.</h2>
                    <p>Vuelve a la página principal y selecciona un coche.</p>
                </div>
            `;
            return;
        }

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

        const btnComprar = document.getElementById("btn-comprar");

        if (btnComprar) {
            btnComprar.addEventListener("click", () => {
                localStorage.setItem("cocheSeleccionado", JSON.stringify(coche));
                window.location.href = "informacion.html";
            });
        }

    } catch (error) {
        console.error("Error al cargar el detalle:", error);

        container.innerHTML = `
            <div class="detalle-error">
                <h2>Error al cargar el vehículo.</h2>
                <p>Revisa la ruta del archivo JSON y las imágenes.</p>
            </div>
        `;
    }
});