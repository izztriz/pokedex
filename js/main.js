const pokemonInfo = document.getElementById('pokemon-info');
const pokemonNombre = document.getElementById('pokemon-nombre');
const pokemonNumero = document.getElementById('pokemon-numero');
const pokemonImagen = document.getElementById('pokemon-imagen');

const tiposContainer = document.getElementById('tipos');
const debilidadesContainer = document.getElementById('debilidades');
const resistenciasContainer = document.getElementById('resistencias');
const inmunesContainer = document.getElementById('inmunes');
const neutrosContainer = document.getElementById('neutros');

const errorMensaje = document.getElementById('error');
const buscador = document.getElementById('buscador');
const buscarBtn = document.getElementById('buscarBtn');
const sugerenciasDiv = document.getElementById('sugerencias');

let listaPokemon = [];
let tiposES = {};

// =====================
// CONFIGURACIÓN DE JUEGOS
// =====================
const juegosGeneraciones = [
    { id: 'gen1', nombre: 'Rojo / Azul', maxId: 151, icono: 'assets/icons/gen1.png' },
    { id: 'gen2', nombre: 'Oro / Plata', maxId: 251, icono: 'assets/icons/gen2.png' },
    { id: 'gen3', nombre: 'Rubí / Zafiro', maxId: 386, icono: 'assets/icons/gen3.png' },
    { id: 'gen4', nombre: 'Platino', maxId: 493, icono: 'assets/icons/gen4.png' },
    { id: 'gen5', nombre: 'Negro / Blanco', maxId: 649, icono: 'assets/icons/gen5.png' },
    { id: 'gen6', nombre: 'X / Y', maxId: 721, icono: 'assets/icons/gen6.png' },
    { id: 'gen7', nombre: 'Sol / Luna', maxId: 809, icono: 'assets/icons/gen7.png' },
    { id: 'gen8', nombre: 'Espada / Escudo', maxId: 905, icono: 'assets/icons/gen8.png' },
    { id: 'gen9', nombre: 'Scarlet / Violet', maxId: 1025, icono: 'assets/icons/gen9.png' },
    { id: 'todos', nombre: 'Todas (Nacional)', maxId: 100000, icono: 'assets/icons/all.png' }
];

let juegoSeleccionadoId = juegosGeneraciones[0].id;

function inicializarSelectorJuegosCustom() {
    const selectorContainer = document.getElementById('selector-juego');
    const trigger = document.getElementById('dropdown-trigger');
    const optionsContainer = document.getElementById('dropdown-options');
    const triggerTexto = document.getElementById('juego-seleccionado-nombre');
    const triggerImg = trigger.querySelector('.juego-icono-img');

    optionsContainer.innerHTML = '';
    juegosGeneraciones.forEach(juego => {
        const optionDiv = document.createElement('div');
        optionDiv.className = `dropdown-option ${juego.id === juegoSeleccionadoId ? 'seleccionado' : ''}`;
        
        optionDiv.innerHTML = `
            <img src="${juego.icono}" alt="" class="juego-icono-img" onerror="this.style.opacity='0.3'">
            <span>${juego.nombre}</span>
        `;

        optionDiv.addEventListener('click', () => {
            juegoSeleccionadoId = juego.id;
            triggerTexto.textContent = juego.nombre;
            triggerImg.src = juego.icono;
            
            document.querySelectorAll('.dropdown-option').forEach(el => el.classList.remove('seleccionado'));
            optionDiv.classList.add('seleccionado');

            optionsContainer.classList.add('oculto');
            selectorContainer.classList.remove('abierto');
            
            buscador.value = '';
            buscarPokemon('bulbasaur');
        });

        optionsContainer.appendChild(optionDiv);
    });

    const defecto = juegosGeneraciones.find(j => j.id === juegoSeleccionadoId);
    if (defecto) {
        triggerTexto.textContent = defecto.nombre;
        triggerImg.src = defecto.icono;
    }

    trigger.addEventListener('click', (e) => {
        e.stopPropagation();
        optionsContainer.classList.toggle('oculto');
        selectorContainer.classList.toggle('abierto');
    });

    document.addEventListener('click', () => {
        optionsContainer.classList.add('oculto');
        selectorContainer.classList.remove('abierto');
    });
}

function obtenerMaxIdActual() {
    const juegoSeleccionado = juegosGeneraciones.find(j => j.id === juegoSeleccionadoId);
    return juegoSeleccionado ? juegoSeleccionado.maxId : 100000;
}

/* =====================
   UTILIDADES
===================== */
function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function crearTitulo(texto) {
    const div = document.createElement('div');
    div.className = 'categoria-titulo';
    div.textContent = texto + ':';
    return div;
}

function crearSpan(tipo, clase, mult = null) {
    const tData = tiposES[tipo];
    if (!tData) return null;

    const span = document.createElement('span');
    span.className = clase;
    span.textContent = `${tData.nombre}${mult !== null ? ` (x${mult})` : ''}`;
    span.style.backgroundColor = tData.color;
    span.style.color = '#fff';
    return span;
}

function limpiarContenedores() {
    pokemonNombre.textContent = '';
    pokemonNumero.textContent = '';
    pokemonImagen.src = '';
    pokemonImagen.alt = '';

    tiposContainer.innerHTML = '';
    debilidadesContainer.innerHTML = '';
    resistenciasContainer.innerHTML = '';
    inmunesContainer.innerHTML = '';
    neutrosContainer.innerHTML = '';
}

/* =====================
   CARGAS INICIALES
===================== */
async function cargarTipos() {
    try {
        const res = await fetch('data/types.json');
        tiposES = await res.json();
    } catch (e) {
        console.error("Asegúrate de tener data/types.json");
    }
}

async function cargarListaPokemon() {
    const res = await fetch('https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0');
    const data = await res.json();
    listaPokemon = data.results.map((p, index) => ({
        name: p.name,
        id: index + 1
    }));
}

/* =====================
   API POKÉMON Y REGLAS HISTÓRICAS
===================== */
async function obtenerPokemon(nombreOId) {
    const busquedaLower = nombreOId.toString().toLowerCase().trim();
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${busquedaLower}`);
    if (!res.ok) return null;
    const data = await res.json();

    const maxId = obtenerMaxIdActual();
    const esBulbasaur = (data.id === 1 || data.name.toLowerCase() === 'bulbasaur');
    
    if (!esBulbasaur && data.id > maxId) {
        return null;
    }

    let tiposPokemon = data.types.map(t => t.type.name);
    const maxIdActual = obtenerMaxIdActual();

    // El tipo Hada no existía antes de la Generación 6 (maxId < 721)
    if (maxIdActual < 721) {
        tiposPokemon = tiposPokemon.filter(t => t !== 'fairy');
        if (tiposPokemon.length === 0 && data.types.length > 0) {
            tiposPokemon = [data.types[0].type.name];
        }
    }

    return {
        nombre: data.name,
        numero: data.id,
        tipos: tiposPokemon,
        imagen: data.sprites.other['official-artwork'].front_default
    };
}

async function obtenerMultiplicadores(tipos, maxIdActual) {
    let multiplicadores = {};
    const resTipos = await fetch('https://pokeapi.co/api/v2/type/');
    const dataTipos = await resTipos.json();
    dataTipos.results.forEach(t => multiplicadores[t.name] = 1);

    for (const tipo of tipos) {
        const res = await fetch(`https://pokeapi.co/api/v2/type/${tipo}`);
        const data = await res.json();
        const dmg = data.damage_relations;

        dmg.double_damage_from.forEach(t => multiplicadores[t.name] *= 2);
        dmg.half_damage_from.forEach(t => multiplicadores[t.name] *= 0.5);
        dmg.no_damage_from.forEach(t => multiplicadores[t.name] *= 0);
    }

    // --- APLICAR REGLAS HISTÓRICAS SEGÚN LA GENERACIÓN SELECCIONADA ---

    // 1. Generación 1 (Rojo / Azul, maxId === 151)
    if (maxIdActual === 151) {
        // En Gen 1, el tipo Psíquico era inmune al tipo Fantasma (bug de programación)
        if (tipos.includes('psychic')) {
            multiplicadores['ghost'] = 0;
        }
        // En Gen 1, el tipo Bicho vs Veneno era neutral (x1)
        if (tipos.includes('poison')) {
            multiplicadores['bug'] = 1;
        }
    }

    // 2. Generaciones 2 a 5 (Oro/Plata hasta Negro/Blanco, maxId >= 251 && maxId <= 649)
    if (maxIdActual >= 251 && maxIdActual <= 649) {
        // En Gen 2-5, el tipo Acero resistía a Fantasma y Siniestro (x0.5)
        if (tipos.includes('steel')) {
            multiplicadores['ghost'] = 0.5;
            multiplicadores['dark'] = 0.5;
        }
    }

    // 3. Eliminar tipo Hada de los cálculos si la gen es anterior a la 6
    if (maxIdActual < 721) {
        delete multiplicadores['fairy'];
    }

    return multiplicadores;
}

/* =====================
   MOSTRAR POKÉMON
===================== */
async function mostrarPokemon(pokemon) {
    limpiarContenedores();

    if (!pokemon) {
        pokemonInfo.classList.add('oculto');
        errorMensaje.classList.remove('oculto');
        return;
    }

    errorMensaje.classList.add('oculto');
    pokemonInfo.classList.remove('oculto');

    pokemonNombre.textContent = capitalize(pokemon.nombre);
    pokemonNumero.textContent = `#${pokemon.numero.toString().padStart(3, '0')}`;
    pokemonImagen.src = pokemon.imagen;
    pokemonImagen.alt = pokemon.nombre;

    // TIPOS
    tiposContainer.appendChild(crearTitulo('Tipo de Pokémon'));
    pokemon.tipos.forEach(t => {
        const span = crearSpan(t, 'tipo');
        if (span) tiposContainer.appendChild(span);
    });

    // MULTIPLICADORES Y CATEGORÍAS
    const maxIdActual = obtenerMaxIdActual();
    const multiplicadores = await obtenerMultiplicadores(pokemon.tipos, maxIdActual);
    const categorias = { inmunes: [], resistencias: [], neutros: [], debilidades: [] };

    Object.entries(multiplicadores).forEach(([tipo, mult]) => {
        if (mult === 0) categorias.inmunes.push({ tipo, mult });
        else if (mult < 1) categorias.resistencias.push({ tipo, mult });
        else if (mult === 1) categorias.neutros.push({ tipo, mult });
        else categorias.debilidades.push({ tipo, mult });
    });

    function mostrarCategoria(container, lista, titulo) {
        if (!lista.length) return;
        container.appendChild(crearTitulo(titulo));
        lista.sort((a, b) => b.mult - a.mult);
        lista.forEach(e => {
            const span = crearSpan(e.tipo, 'tipo', e.mult);
            if (span) container.appendChild(span);
        });
    }

    mostrarCategoria(inmunesContainer, categorias.inmunes, 'Inmunes');
    mostrarCategoria(resistenciasContainer, categorias.resistencias, 'Resistencias');
    mostrarCategoria(neutrosContainer, categorias.neutros, 'Neutros');
    mostrarCategoria(debilidadesContainer, categorias.debilidades, 'Debilidades');
}

/* =====================
   BUSCADOR Y SUGERENCIAS
===================== */
async function buscarPokemon(valor) {
    if (!valor) return;
    const pokemon = await obtenerPokemon(valor);
    await mostrarPokemon(pokemon);
}

buscador.addEventListener('input', () => {
    const valor = buscador.value.toLowerCase();
    sugerenciasDiv.innerHTML = '';
    if (!valor) return;

    const maxId = obtenerMaxIdActual();

    listaPokemon
        .filter(p => (p.id === 1 || p.id <= maxId) && p.name.startsWith(valor))
        .slice(0, 5)
        .forEach(p => {
            const div = document.createElement('div');
            div.textContent = capitalize(p.name);
            div.onclick = () => {
                buscador.value = p.name;
                buscarPokemon(p.name);
                sugerenciasDiv.innerHTML = '';
            };
            sugerenciasDiv.appendChild(div);
        });
});

buscarBtn.onclick = () => {
    buscarPokemon(buscador.value.trim());
    sugerenciasDiv.innerHTML = '';
};

buscador.addEventListener('keypress', e => {
    if (e.key === 'Enter') {
        buscarPokemon(buscador.value.trim());
        sugerenciasDiv.innerHTML = '';
    }
});

/* =====================
   CONTROL BARRA INFERIOR
===================== */
const menuItems = document.querySelectorAll('.menu-item');
menuItems.forEach(item => {
    item.addEventListener('click', () => {
        menuItems.forEach(i => i.classList.remove('activo'));
        item.classList.add('activo');
        
        const seccion = item.dataset.seccion;
        console.log("Sección activa:", seccion);
    });
});

/* =====================
   INICIO
===================== */
window.addEventListener('load', async () => {
    inicializarSelectorJuegosCustom();
    await cargarTipos();
    await cargarListaPokemon();
    buscador.value = '';
    buscarPokemon('bulbasaur');
});