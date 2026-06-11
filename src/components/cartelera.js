export async function renderCartelera() {
    const contenedor = document.getElementById('app');
    const usuarioActivo = JSON.parse(localStorage.getItem('usuarioSesion'));

    if (!usuarioActivo) {
        window.location.hash = '#/login';
        return;
    }

    // Traemos las películas vivas del servidor
    const respuesta = await fetch('http://localhost:3000/funciones');
    const funciones = await respuesta.json();

    let html = `
        <div class="space-y-6">
            <div class="flex justify-between items-center">
                <h1 class="text-3xl font-extrabold text-gray-800">Películas en Cartelera</h1>
                ${usuarioActivo.role === 'admin' ? '<button id="btn-nueva-funcion" class="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition">➕ Agregar Película</button>' : ''}
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    `;

    funciones.forEach(f => {
        html += `
            <div class="bg-white p-6 rounded-xl shadow-md border border-gray-100 flex flex-col justify-between">
                <div>
                    <h3 class="text-2xl font-bold text-gray-800 mb-2">${f.Pelicula}</h3>
                    <p class="text-gray-600"><span class="font-semibold">Sala:</span> ${f.Sala}</p>
                    <p class="text-gray-600"><span class="font-semibold">Hora:</span> ⏰ ${f.Hora}</p>
                    <p class="text-gray-600"><span class="font-semibold">Asientos libres:</span> ${f.CuposDisponibles} / ${f.CapacidadTotal}</p>
                    <span class="inline-block mt-3 px-3 py-1 text-xs font-bold rounded-full ${f.Estado === 'Activa' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}">${f.Estado}</span>
                </div>
                <div class="mt-6 pt-4 border-t border-gray-100 space-y-2">
        `;

        if (usuarioActivo.role === 'user' && f.Estado === 'Activa') {
            html += `<button data-id="${f.id}" data-cupos="${f.CuposDisponibles}" class="btn-reservar w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 rounded-lg transition">🎟️ Reservar 1 Asiento</button>`;
        }

        if (usuarioActivo.role === 'admin') {
            html += `
                <div class="flex gap-2">
                    <button data-id="${f.id}" class="btn-eliminar flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-2 rounded-lg transition text-sm">❌ Eliminar</button>
                </div>
            `;
        }

        html += `</div></div>`;
    });

    html += `</div></div>`;
    contenedor.innerHTML = html;

    // AGREGAMOS VIDA A LOS BOTONES DE LA CARTELERA:
    
    // 1. Botón Reservar
    document.querySelectorAll('.btn-reservar').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            const id = e.target.dataset.id;
            const cupos = parseInt(e.target.dataset.cupos);
            if (cupos < 1) { return alert("❌ ¡Sala llena!"); }

            // Guardamos la reserva
            await fetch('http://localhost:3000/reservas', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ Usuario: usuarioActivo.name, funcionId: parseInt(id), CantidadDeEntradas: 1, FechaReserva: new Date().toLocaleDateString() })
            });

            // Restamos un cupo a la película
            await fetch(`http://localhost:3000/funciones/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ CuposDisponibles: cupos - 1 })
            });

            alert("🎉 ¡Tu asiento está reservado!");
            renderCartelera(); // Recargamos el dibujo
        });
    });

    // 2. Botón Eliminar (Solo Jefes)
    document.querySelectorAll('.btn-eliminar').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            if (confirm("¿Seguro que quieres borrar esta película de la cartelera?")) {
                const id = e.target.dataset.id;
                await fetch(`http://localhost:3000/funciones/${id}`, { method: 'DELETE' });
                renderCartelera();
            }
        });
    });

    // 3. Botón Agregar Película Nueva (Solo Jefes)
    const btnNueva = document.getElementById('btn-nueva-funcion');
    if (btnNueva) {
        btnNueva.addEventListener('click', async () => {
            const nombre = prompt("Nombre de la película:");
            const sala = prompt("Sala (Ej: Sala 1):");
            const hora = prompt("Hora (Ej: 18:00):");
            if (!nombre || !sala || !hora) return;

            await fetch('http://localhost:3000/funciones', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ Pelicula: nombre, Sala: sala, Hora: hora, CapacidadTotal: 50, CuposDisponibles: 50, Estado: "Activa" })
            });
            renderCartelera();
        });
    }
}