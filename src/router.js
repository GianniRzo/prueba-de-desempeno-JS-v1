import { renderLogin } from './components/login.js';
import { renderCartelera } from './components/cartelera.js';
import { renderReservas } from './components/reservas.js';

const rutas = {
    '#/login': renderLogin,
    '#/cartelera': renderCartelera,
    '#/reservas': renderReservas
};

export function cambiarPantalla() {
    const rutaActual = window.location.hash || '#/login';
    const dibujarPantalla = rutas[rutaActual];
    const contenedor = document.getElementById('app');
    
    // Actualizamos los botones del menú superior según quién esté jugando
    actualizarMenu();

    if (dibujarPantalla) {
        contenedor.innerHTML = ''; // Borramos la pantalla vieja
        dibujarPantalla();          // Pintamos los nuevos bloques de lego
    } else {
        contenedor.innerHTML = '<div class="text-center mt-10 text-2xl font-bold text-red-500">❌ Habitación secreta no encontrada (404)</div>';
    }
}

function actualizarMenu() {
    const menu = document.getElementById('menu-navegacion');
    const usuarioActivo = JSON.parse(localStorage.getItem('usuarioSesion'));

    if (!usuarioActivo) {
        menu.innerHTML = `<a href="#/login" class="hover:underline font-semibold">Iniciar Sesión</a>`;
        return;
    }

    // Si hay alguien logueado, le mostramos sus opciones y el botón de salir
    let links = `<span class="text-yellow-300 font-medium">👋 ¡Hola, ${usuarioActivo.name}!</span>`;
    links += `<a href="#/cartelera" class="hover:text-gray-200 transition">🎬 Cartelera</a>`;
    
    if (usuarioActivo.role === 'user') {
        links += `<a href="#/reservas" class="hover:text-gray-200 transition">🎟️ Mis Tiquetes</a>`;
    }

    links += `<button id="btn-cerrar-sesion" class="bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-sm transition">Salir</button>`;
    menu.innerHTML = links;

    // Le damos vida al botón de cerrar sesión si existe en pantalla
    const btnSalir = document.getElementById('btn-cerrar-sesion');
    if (btnSalir) {
        btnSalir.addEventListener('click', () => {
            localStorage.removeItem('usuarioSesion'); // Borramos el bolsillo secreto
            window.location.hash = '#/login';         // Al login directo
        });
    }
}