import './style.css';
import { cambiarPantalla } from '../src/router.js';

// Le decimos al navegador que escuche cuando cambie la ruta en la barra de direcciones
window.addEventListener('hashchange', cambiarPantalla);

// También ejecutamos al guardia la primera vez que se carga la página web
window.addEventListener('DOMContentLoaded', cambiarPantalla);