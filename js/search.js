// ==========================
// BUSCADOR DE POKÉMON
// ==========================

const buscadorInput = document.getElementById('buscador-pokemon');
const sugerenciasLista = document.getElementById('sugerencias');

// Lista de Pokémon (podemos poblarla automáticamente con nombres más tarde)
let listaPokemon = [];

// ==========================
// CARGAR LISTA DE POKÉMON
// ==========================
async function cargarListaPokemon() {
    try {
        const respuesta = await fetch('https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0');
        const datos = await respuesta.json();
        listaPokemon = datos.results.map(p => p.name);
    } catch (error) {
        console.error('Error al cargar lista de Pokémon:', error);
    }
}

// ==========================
// FUNCIONES DE SUGERENCIAS
// ==========================
function filtrarSugerencias(valor) {
    const valorLower = valor.toLowerCase();
    return listaPokemon.filter(p => p.startsWith(valorLower)).slice(0, 10);
}

function mostrarSugerencias(sugerencias) {
    sugerenciasLista.innerHTML = '';
    if (!sugerencias.length) {
        sugerenciasLista.style.display = 'none';
        return;
    }
    sugerencias.forEach(nombre => {
        const li = document.createElement('li');
        li.textContent = nombre;
        li.addEventListener('click', () => {
            buscadorInput.value = nombre;
            sugerenciasLista.style.display = 'none';
            buscarPokemon(nombre);
        });
        sugerenciasLista.appendChild(li);
    });
    sugerenciasLista.style.display = 'block';
}

// ==========================
// EVENTOS DEL BUSCADOR
// ==========================
buscadorInput.addEventListener('input', () => {
    const valor = buscadorInput.value.trim();
    if (valor.length === 0) {
        sugerenciasLista.style.display = 'none';
        return;
    }
    const sugerencias = filtrarSugerencias(valor);
    mostrarSugerencias(sugerencias);
});

buscadorInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        const valor = buscadorInput.value.trim();
        if (valor.length > 0) {
            sugerenciasLista.style.display = 'none';
            buscarPokemon(valor);
        }
    }
});

// ==========================
// INICIALIZAR
// ==========================
cargarListaPokemon();
