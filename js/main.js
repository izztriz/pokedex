const pokemonInfo = document.getElementById('pokemon-info');
const pokemonNombre = document.getElementById('pokemon-nombre');
const pokemonNumero = document.getElementById('pokemon-numero');
const pokemonImagen = document.getElementById('pokemon-imagen');

const tiposContainer = document.getElementById('tipos');
const debilidadesContainer = document.getElementById('debilidades');
const resistenciasContainer = document.getElementById('resistencias');
const inmunesContainer = document.getElementById('inmunes');
const neutrosContainer = document.getElementById('neutros');

const buscador = document.getElementById('buscador');
const buscarBtn = document.getElementById('buscarBtn');
const sugerenciasDiv = document.getElementById('sugerencias');

const seccionInfo = document.getElementById('seccion-info');
const seccionEvoluciones = document.getElementById('seccion-evoluciones');
const seccionCapturar = document.getElementById('seccion-capturar');

const contenedorEvoluciones = document.getElementById('contenedor-evoluciones');
const contenedorCapturar = document.getElementById('contenedor-capturar');

let pokemonActual = null;
let listaPokemon = [];
let tiposES = {};
let ubicacionesES = {};
let objetosES = {};

// =====================
// COLORES Y VERSIONES
// =====================
const coloresGeneracion = {
    'gen1': '#ff5959', 
    'gen2': '#d4ac0d', 
    'gen3': '#3498db', 
    'gen4': '#9b59b6', 
    'gen5': '#e67e22', 
    'gen6': '#e91e63', 
    'gen7': '#00bcd4', 
    'gen8': '#3f51b5', 
    'gen9': '#ff9800', 
    'todos': '#2ecc71'  
};

const coloresVersiones = {
    'red': '#ff5959', 'blue': '#3498db', 'yellow': '#f1c40f',
    'gold': '#d4ac0d', 'silver': '#bdc3c7', 'crystal': '#1abc9c',
    'ruby': '#e74c3c', 'sapphire': '#2980b9', 'emerald': '#27ae60', 'firered': '#e67e22', 'leafgreen': '#2ecc71',
    'diamond': '#3498db', 'pearl': '#e84393', 'platinum': '#7f8c8d', 'heartgold': '#d4ac0d', 'soulsilver': '#95a5a6',
    'black': '#2c3e50', 'white': '#ecf0f1', 'black-2': '#34495e', 'white-2': '#bdc3c7',
    'x': '#3498db', 'y': '#e74c3c', 'omega-ruby': '#c0392b', 'alpha-sapphire': '#1b1464',
    'sun': '#e67e22', 'moon': '#8e44ad', 'ultra-sun': '#d35400', 'ultra-moon': '#6c5ce7',
    'sword': '#00a8ff', 'shield': '#e84118',
    'scarlet': '#ff4757', 'violet': '#706fd3'
};

const versionesES = {
    'red': 'Rojo', 'blue': 'Azul', 'yellow': 'Amarillo',
    'gold': 'Oro', 'silver': 'Plata', 'crystal': 'Cristal',
    'ruby': 'Rubí', 'sapphire': 'Zafiro', 'emerald': 'Esmeralda', 'firered': 'Rojo Fuego', 'leafgreen': 'Verde Hoja',
    'diamond': 'Diamante', 'pearl': 'Perla', 'platinum': 'Platino', 'heartgold': 'Oro HeartGold', 'soulsilver': 'Plata SoulSilver',
    'black': 'Negro', 'white': 'Blanco', 'black-2': 'Negro 2', 'white-2': 'Blanco 2',
    'x': 'X', 'y': 'Y', 'omega-ruby': 'Rubí Omega', 'alpha-sapphire': 'Zafiro Alfa',
    'sun': 'Sol', 'moon': 'Luna', 'ultra-sun': 'Ultrasol', 'ultra-moon': 'Ultraluna',
    'sword': 'Espada', 'shield': 'Escudo',
    'scarlet': 'Escarlata', 'violet': 'Púrpura'
};

const metodosCapturaES = {
    'walk': 'Caminar',
    'surf': 'Surf',
    'good-rod': 'Buena Caña',
    'super-rod': 'Supercaña',
    'old-rod': 'Caña Vieja',
    'rock-smash': 'Golpe Roca',
    'headbutt': 'Golpe Cabeza',
    'dark-grass': 'Hierba Oscura',
    'grass-spots': 'Manchas de Hierba',
    'cave-spots': 'Manchas en Cueva',
    'bridge': 'Puente',
    'gift': 'Regalo',
    'seaweed': 'Algas Marinas',
    'pokeflute': 'Poké Flauta',
    'squirt-bottle': 'Regadera Cubo'
};

function traducirObjeto(nombreIngles) {
    if (!nombreIngles) return 'Objeto';
    let clave = nombreIngles.toLowerCase().trim();
    return objetosES[clave] || capitalize(nombreIngles.replace(/-/g, ' '));
}

function limpiarUbicacion(nombreArea) {
    if (!nombreArea) return '';
    let claveBase = nombreArea.replace(/-area$/i, '').toLowerCase();

    if (ubicacionesES[claveBase]) {
        return ubicacionesES[claveBase];
    }

    if (claveBase.startsWith('route-')) {
        let numRuta = claveBase.replace('route-', '').replace(/-/g, ' ');
        return `Ruta ${numRuta.toUpperCase()}`;
    }

    let limpio = claveBase.replace(/-/g, ' ');
    return limpio.split(' ').map(palabra => capitalize(palabra)).join(' ');
}

// =====================
// CONFIGURACIÓN DE JUEGOS
// =====================
const juegosGeneraciones = [
    { id: 'gen1', nombre: 'Rojo / Azul', maxId: 151, icono: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png' },
    { id: 'gen2', nombre: 'Oro / Plata', maxId: 251, icono: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/great-ball.png' },
    { id: 'gen3', nombre: 'Rubí / Zafiro', maxId: 386, icono: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/ultra-ball.png' },
    { id: 'gen4', nombre: 'Platino', maxId: 493, icono: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/master-ball.png' },
    { id: 'gen5', nombre: 'Negro / Blanco', maxId: 649, icono: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/luxury-ball.png' },
    { id: 'gen6', nombre: 'X / Y', maxId: 721, icono: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/premier-ball.png' },
    { id: 'gen7', nombre: 'Sol / Luna', maxId: 809, icono: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/beast-ball.png' },
    { id: 'gen8', nombre: 'Espada / Escudo', maxId: 905, icono: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/level-ball.png' },
    { id: 'gen9', nombre: 'Scarlet / Violet', maxId: 1025, icono: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/cherish-ball.png' },
    { id: 'todos', nombre: 'Todas (Nacional)', maxId: 100000, icono: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/safari-ball.png' }
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
        
        const colorGen = coloresGeneracion[juego.id] || '#ffffff';
        const textoGen = juego.id === 'todos' ? 'Todos' : juego.id.replace('gen', 'Gen ');

        optionDiv.innerHTML = `
            <img src="${juego.icono}" alt="" class="juego-icono-img" onerror="this.style.opacity='0.3'">
            <span style="flex: 1;">${juego.nombre}</span>
            <span class="gen-badge" style="color: ${colorGen}; border: 1px solid ${colorGen};">${textoGen}</span>
        `;

        optionDiv.addEventListener('click', () => {
            juegoSeleccionadoId = juego.id;
            triggerTexto.textContent = juego.nombre;
            triggerImg.src = juego.icono;
            
            document.querySelectorAll('.dropdown-option').forEach(el => el.classList.remove('seleccionado'));
            optionDiv.classList.add('seleccionado');

            optionsContainer.classList.add('oculto');
            selectorContainer.classList.remove('abierto');
            
            const textoBuscador = buscador.value.trim();
            if (textoBuscador) {
                buscarPokemon(textoBuscador);
            } else {
                buscarPokemon('bulbasaur');
            }
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
    if (!str) return '';
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
async function cargarDatosExternos() {
    try {
        const resTipos = await fetch('data/types.json');
        tiposES = await resTipos.json();
    } catch (e) {
        console.error("Error al cargar data/types.json");
    }

    try {
        const resUbicaciones = await fetch('data/locations.json');
        ubicacionesES = await resUbicaciones.json();
    } catch (e) {
        console.error("Error al cargar data/locations.json");
    }

    try {
        const resItems = await fetch('data/items.json');
        objetosES = await resItems.json();
    } catch (e) {
        console.error("Error al cargar data/items.json");
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
        imagen: data.sprites.other['official-artwork'].front_default,
        speciesUrl: data.species.url
    };
}

async function obtenerMultiplicadores(tipos, maxIdActual) {
    const resTipos = await fetch('https://pokeapi.co/api/v2/type/');
    const dataTipos = await resTipos.json();
    
    let multiplicadores = {};
    dataTipos.results.forEach(t => {
        if (t.name !== 'shadow' && t.name !== 'unknown') {
            multiplicadores[t.name] = 1;
        }
    });

    for (const tipo of tipos) {
        const res = await fetch(`https://pokeapi.co/api/v2/type/${tipo}`);
        const data = await res.json();
        const dmg = data.damage_relations;

        dmg.double_damage_from.forEach(t => {
            if (multiplicadores[t.name] !== undefined) multiplicadores[t.name] *= 2;
        });
        dmg.half_damage_from.forEach(t => {
            if (multiplicadores[t.name] !== undefined) multiplicadores[t.name] *= 0.5;
        });
        dmg.no_damage_from.forEach(t => {
            if (multiplicadores[t.name] !== undefined) multiplicadores[t.name] *= 0;
        });
    }

    if (maxIdActual === 151) {
        if (tipos.includes('psychic')) {
            multiplicadores['ghost'] = 0;
        }
        if (tipos.includes('poison')) {
            multiplicadores['bug'] = 1;
        }
    }

    if (maxIdActual >= 251 && maxIdActual <= 649) {
        if (tipos.includes('steel')) {
            multiplicadores['ghost'] = 0.5;
            multiplicadores['dark'] = 0.5;
        }
    }

    if (maxIdActual < 721) {
        delete multiplicadores['fairy'];
    }

    return multiplicadores;
}

/* =====================
   LÓGICA DE EVOLUCIONES
===================== */
function obtenerDetalleEvolucion(details) {
    if (!details || details.length === 0) return 'Método especial';
    const d = details[0];

    if (d.trigger.name === 'level-up') {
        if (d.min_level) return `Nivel ${d.min_level}`;
        if (d.min_happiness) return `Felicidad alta`;
        if (d.item) return `Nivel + ${traducirObjeto(d.item.name)}`;
        if (d.known_move) return `Conocer movimiento`;
        return 'Subir de Nivel';
    } else if (d.trigger.name === 'use-item') {
        return `Objeto: ${traducirObjeto(d.item ? d.item.name : '')}`;
    } else if (d.trigger.name === 'trade') {
        if (d.held_item) return `Intercambio con ${traducirObjeto(d.held_item.name)}`;
        return 'Intercambio';
    }
    return 'Evolución especial';
}

async function cargarEvoluciones(speciesUrl) {
    contenedorEvoluciones.innerHTML = '<p>Cargando evoluciones...</p>';

    try {
        const resSpecies = await fetch(speciesUrl);
        const dataSpecies = await resSpecies.json();

        const resChain = await fetch(dataSpecies.evolution_chain.url);
        const dataChain = await resChain.json();

        contenedorEvoluciones.innerHTML = '';
        const maxId = obtenerMaxIdActual();

        await desglosarCadenaEvolutiva(dataChain.chain, maxId);

        if (contenedorEvoluciones.children.length === 0) {
            contenedorEvoluciones.innerHTML = '<p>Este Pokémon no tiene evoluciones disponibles en la generación seleccionada.</p>';
        }
    } catch (e) {
        console.error("Error al cargar evoluciones:", e);
        contenedorEvoluciones.innerHTML = '<p>No se pudo cargar la información de evoluciones.</p>';
    }
}

async function desglosarCadenaEvolutiva(nodo, maxId) {
    if (!nodo) return;

    const idActual = parseInt(nodo.species.url.split('/').filter(Boolean).pop());
    
    for (const evo of nodo.evolves_to) {
        const idEvo = parseInt(evo.species.url.split('/').filter(Boolean).pop());

        if (idActual <= maxId && idEvo <= maxId) {
            const metodo = obtenerDetalleEvolucion(evo.evolution_details);
            
            const tarjeta = document.createElement('div');
            tarjeta.className = 'tarjeta-evolucion';

            tarjeta.innerHTML = `
                <div class="evo-pkmn" onclick="buscarPokemon('${nodo.species.name}')">
                    <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${idActual}.png" alt="${nodo.species.name}">
                    <span>${capitalize(nodo.species.name)}</span>
                </div>
                <div class="evo-metodo">
                    <i class="fa-solid fa-right-long"></i>
                    <span>${metodo}</span>
                </div>
                <div class="evo-pkmn" onclick="buscarPokemon('${evo.species.name}')">
                    <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${idEvo}.png" alt="${evo.species.name}">
                    <span>${capitalize(evo.species.name)}</span>
                </div>
            `;

            contenedorEvoluciones.appendChild(tarjeta);
        }

        await desglosarCadenaEvolutiva(evo, maxId);
    }
}

/* =====================
   LÓGICA DE CAPTURAR (SIN CORCHETES Y CON COLOR)
===================== */
async function cargarCapturas(nombrePokemon) {
    contenedorCapturar.innerHTML = '<p>Buscando lugares de captura...</p>';

    try {
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${nombrePokemon}/encounters`);
        const data = await res.json();

        contenedorCapturar.innerHTML = '';

        if (!data || data.length === 0) {
            contenedorCapturar.innerHTML = '<p>No hay datos de localización salvaje para este Pokémon.</p>';
            return;
        }

        const juegoId = juegoSeleccionadoId;
        let versionesValidas = [];

        if (juegoId === 'gen1') versionesValidas = ['red', 'blue', 'yellow'];
        else if (juegoId === 'gen2') versionesValidas = ['gold', 'silver', 'crystal'];
        else if (juegoId === 'gen3') versionesValidas = ['ruby', 'sapphire', 'emerald', 'firered', 'leafgreen'];
        else if (juegoId === 'gen4') versionesValidas = ['diamond', 'pearl', 'platinum', 'heartgold', 'soulsilver'];
        else if (juegoId === 'gen5') versionesValidas = ['black', 'white', 'black-2', 'white-2'];
        else if (juegoId === 'gen6') versionesValidas = ['x', 'y', 'omega-ruby', 'alpha-sapphire'];
        else if (juegoId === 'gen7') versionesValidas = ['sun', 'moon', 'ultra-sun', 'ultra-moon'];
        else if (juegoId === 'gen8') versionesValidas = ['sword', 'shield'];
        else if (juegoId === 'gen9') versionesValidas = ['scarlet', 'violet'];

        let mapaUbicacionesAgrupadas = {};

        data.forEach(encounter => {
            const versionDetails = juegoId === 'todos' 
                ? encounter.version_details 
                : encounter.version_details.filter(v => versionesValidas.includes(v.version.name));

            if (versionDetails.length > 0) {
                const nombreUbicacion = limpiarUbicacion(encounter.location_area.name);

                if (!mapaUbicacionesAgrupadas[nombreUbicacion]) {
                    mapaUbicacionesAgrupadas[nombreUbicacion] = [];
                }

                versionDetails.forEach(v => {
                    const versionKey = v.version.name;
                    const nombreVersionES = versionesES[versionKey] || capitalize(versionKey);
                    const colorVersion = coloresVersiones[versionKey] || '#ffcb05';
                    
                    v.encounter_details.forEach(det => {
                        const metodoTraducido = metodosCapturaES[det.method.name] || capitalize(det.method.name.replace(/-/g, ' '));
                        
                        mapaUbicacionesAgrupadas[nombreUbicacion].push({
                            version: nombreVersionES,
                            color: colorVersion,
                            metodo: metodoTraducido,
                            minLevel: det.min_level,
                            maxLevel: det.max_level,
                            chance: det.chance
                        });
                    });
                });
            }
        });

        const ubicacionesKeys = Object.keys(mapaUbicacionesAgrupadas);

        if (ubicacionesKeys.length === 0) {
            contenedorCapturar.innerHTML = '<p>No disponible de forma salvaje en este juego/generación.</p>';
            return;
        }

        ubicacionesKeys.forEach(ubicacion => {
            const tarjeta = document.createElement('div');
            tarjeta.className = 'tarjeta-captura';

            let detallesHTML = '';
            mapaUbicacionesAgrupadas[ubicacion].forEach(item => {
                detallesHTML += `
                    <div style="margin-bottom: 4px; display: flex; align-items: center; gap: 6px; flex-wrap: wrap;">
                        <span style="color: ${item.color}; font-weight: bold; background: rgba(255,255,255,0.06); padding: 1px 6px; border-radius: 4px; border: 1px solid ${item.color}; font-size: 0.85em;">
                            ${item.version}
                        </span>
                        <span class="metodo-badge">${item.metodo}</span>
                        <span>Nivel: ${item.minLevel === item.maxLevel ? item.minLevel : `${item.minLevel}-${item.maxLevel}`} 
                        (Probabilidad: ${item.chance}%)</span>
                    </div>
                `;
            });

            tarjeta.innerHTML = `
                <div class="captura-ubicacion">${ubicacion}</div>
                <div class="captura-detalles">${detallesHTML}</div>
            `;

            contenedorCapturar.appendChild(tarjeta);
        });

    } catch (e) {
        console.error("Error al cargar capturas:", e);
        contenedorCapturar.innerHTML = '<p>No se pudieron cargar los datos de captura.</p>';
    }
}

/* =====================
   MOSTRAR POKÉMON
===================== */
async function mostrarPokemon(pokemon) {
    limpiarContenedores();

    if (!pokemon) return;

    pokemonActual = pokemon;
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
    inmunesContainer.innerHTML = '';
    resistenciasContainer.innerHTML = '';
    neutrosContainer.innerHTML = '';
    debilidadesContainer.innerHTML = '';

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

    cargarEvoluciones(pokemon.speciesUrl);
    cargarCapturas(pokemon.nombre);
}

/* =====================
   BUSCADOR Y SUGERENCIAS
===================== */
async function buscarPokemon(valor) {
    if (!valor) return;
    const pokemon = await obtenerPokemon(valor);
    if (pokemon) {
        await mostrarPokemon(pokemon);
    }
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
   CONTROL BARRA INFERIOR (PESTAÑAS)
===================== */
const menuItems = document.querySelectorAll('.menu-item');
menuItems.forEach(item => {
    item.addEventListener('click', () => {
        menuItems.forEach(i => i.classList.remove('activo'));
        item.classList.add('activo');
        
        const seccion = item.dataset.seccion;

        seccionInfo.classList.add('oculto');
        seccionEvoluciones.classList.add('oculto');
        seccionCapturar.classList.add('oculto');

        if (seccion === 'info') {
            seccionInfo.classList.remove('oculto');
        } else if (seccion === 'evoluciones') {
            seccionEvoluciones.classList.remove('oculto');
        } else if (seccion === 'capturar') {
            seccionCapturar.classList.remove('oculto');
        }
    });
});

/* =====================
   INICIO
===================== */
window.addEventListener('load', async () => {
    inicializarSelectorJuegosCustom();
    await cargarDatosExternos();
    await cargarListaPokemon();
    buscador.value = '';
    buscarPokemon('bulbasaur');
});