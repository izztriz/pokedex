const pokemonInfo = document.getElementById('pokemon-info');
const pokemonNombre = document.getElementById('pokemon-nombre');
const pokemonNumero = document.getElementById('pokemon-numero');
const pokemonImagen = document.getElementById('pokemon-imagen');

const tiposContainer = document.getElementById('tipos');
const debilidadesContainer = document.getElementById('debilidades');
const resistenciasContainer = document.getElementById('resistencias');
const inmunesContainer = document.getElementById('inmunes');
const neutrosContainer = document.getElementById('neutros');
const estadisticasContainer = document.getElementById('estadisticas');

const errorMensaje = document.getElementById('error');
const buscador = document.getElementById('buscador');
const buscarBtn = document.getElementById('buscarBtn');
const sugerenciasDiv = document.getElementById('sugerencias');

let listaPokemon = [];
let tiposES = {};

/* =====================
   UTILIDADES
===================== */
function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function traducirStat(stat) {
    const mapa = {
        hp: 'PS:',
        attack: 'Ataque:',
        defense: 'Defensa:',
        'special-attack': 'Ataque Especial:',
        'special-defense': 'Defensa Especial:',
        speed: 'Velocidad:'
    };
    return mapa[stat] || stat;
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
    span.style.padding = '4px 8px';
    span.style.margin = '2px';
    span.style.borderRadius = '6px';
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
    estadisticasContainer.innerHTML = '';
}

/* =====================
   CARGAS INICIALES
===================== */
async function cargarTipos() {
    const res = await fetch('data/types.json');
    tiposES = await res.json();
}

async function cargarListaPokemon() {
    const res = await fetch('https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0');
    const data = await res.json();
    listaPokemon = data.results.map(p => p.name);
}

/* =====================
   API POKÉMON
===================== */
async function obtenerPokemon(nombre) {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${nombre.toLowerCase()}`);
    if (!res.ok) return null;
    const data = await res.json();

    return {
        nombre: data.name,
        numero: data.id,
        tipos: data.types.map(t => t.type.name),
        imagen: data.sprites.other['official-artwork'].front_default,
        stats: data.stats.map(s => ({
            nombre: s.stat.name,
            valor: s.base_stat
        }))
    };
}

async function obtenerMultiplicadores(tipos) {
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

    // MULTIPLICADORES
    const multiplicadores = await obtenerMultiplicadores(pokemon.tipos);
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
	
		function colorPorStat(stat) {
    switch(stat) {
        case 'hp': return '#FF5959'; // rojo
        case 'attack': return '#F5AC78'; // naranja
        case 'defense': return '#FAE078'; // amarillo
        case 'special-attack': return '#9DB7F5'; // azul
        case 'special-defense': return '#A7DB8D'; // verde
        case 'speed': return '#FA92B2'; // rosa
        default: return '#4caf50'; // verde
    }
}

    mostrarCategoria(inmunesContainer, categorias.inmunes, 'Inmunes');
    mostrarCategoria(resistenciasContainer, categorias.resistencias, 'Resistencias');
    mostrarCategoria(neutrosContainer, categorias.neutros, 'Neutros');
    mostrarCategoria(debilidadesContainer, categorias.debilidades, 'Debilidades');

    // ESTADÍSTICAS
    estadisticasContainer.appendChild(crearTitulo('Estadísticas base'));
    pokemon.stats.forEach(s => {
        const statCont = document.createElement('div');
        statCont.style.display = 'flex';
        statCont.style.alignItems = 'center';
        statCont.style.margin = '6px 0';

        const nombre = document.createElement('span');
        nombre.textContent = traducirStat(s.nombre);
        nombre.style.width = '125px';
        nombre.style.fontWeight = 'bold';

        const barraCont = document.createElement('div');
        barraCont.style.flex = '1';
        barraCont.style.height = '25px';
        barraCont.style.background = '#e0e0e0';
        barraCont.style.borderRadius = '12px';
        barraCont.style.position = 'relative';
        barraCont.style.overflow = 'hidden';
        barraCont.style.marginLeft = '8px';

        const barra = document.createElement('div');
        barra.style.height = '100%';
        barraCont.style.width = '200px'; // proporcional al max
        barra.style.background = '#4caf50';
        barra.style.borderRadius = '12px 0 0 12px';
        barra.style.display = 'flex';
        barra.style.alignItems = 'center';
        barra.style.justifyContent = 'center';
        barra.style.color = '#fff';
        barra.style.fontWeight = 'bold';
        barra.textContent = s.valor;

        barraCont.appendChild(barra);
        statCont.appendChild(nombre);
        statCont.appendChild(barraCont);
        estadisticasContainer.appendChild(statCont);
		barra.style.background = colorPorStat(s.nombre);

    });
}

/* =====================
   BUSCADOR
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

    listaPokemon
        .filter(p => p.startsWith(valor))
        .slice(0, 5)
        .forEach(p => {
            const div = document.createElement('div');
            div.textContent = capitalize(p);
            div.onclick = () => {
                buscador.value = p;
                buscarPokemon(p);
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
   INICIO
===================== */
window.addEventListener('load', async () => {
    await cargarTipos();
    await cargarListaPokemon();
    buscador.value = '';
    buscarPokemon('bulbasaur');
});
