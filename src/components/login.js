export function renderLogin() {
    const contenedor = document.getElementById('app');
    
    contenedor.innerHTML = `
        <div class="max-w-md mx-auto bg-white p-8 rounded-xl shadow-lg mt-10">
            <h2 class="text-2xl font-bold text-center text-gray-800 mb-6">Ingresa al Cine Mágico 🎬</h2>
            <form id="formulario-login" class="space-y-4">
                <div>
                    <label class="block text-gray-700 font-medium mb-1">Tu Correo Electrónico</label>
                    <input type="email" id="email" class="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="ejemplo@cine.com" required>
                </div>
                <div>
                    <label class="block text-gray-700 font-medium mb-1">Tu Clave Secreta</label>
                    <input type="password" id="password" class="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="•••" required>
                </div>
                <button type="submit" class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg transition shadow-md">Entrar a la Sala</button>
            </form>
        </div>
    `;

    const formulario = document.getElementById('formulario-login');
    formulario.addEventListener('submit', async (evento) => {
        evento.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            const respuesta = await fetch(`http://localhost:3000/users?email=${email}&password=${password}`);
            const usuarios = await respuesta.json();

            if (usuarios.length > 0) {
                localStorage.setItem('usuarioSesion', JSON.stringify(usuarios[0]));
                window.location.hash = '#/cartelera'; // ¡Entramos!
            } else {
                alert('🚫 Los datos no coinciden. ¡Revisa tu llave secreta!');
            }
        } catch (error) {
            alert('⚠️ El servidor de la base de datos está apagado. Recuerda encenderlo.');
        }
    });
}