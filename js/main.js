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

// =====================
// DICCIONARIOS DE TRADUCCIÓN Y COLORES
// =====================
const coloresGeneracion = {
    'gen1': '#ff5959', // Rojo Kanto
    'gen2': '#d4ac0d', // Oro Johto
    'gen3': '#3498db', // Azul Hoenn
    'gen4': '#9b59b6', // Morado Sinnoh
    'gen5': '#e67e22', // Naranja Teselia
    'gen6': '#e91e63', // Rosa Kalos
    'gen7': '#00bcd4', // Cian Alola
    'gen8': '#3f51b5', // Índigo Galar
    'gen9': '#ff9800', // Ámbar Paldea
    'todos': '#2ecc71'  // Verde Nacional
};

const objetosES = {
    'thunder-stone': 'Piedra Trueno',
    'water-stone': 'Piedra Agua',
    'fire-stone': 'Piedra Fuego',
    'leaf-stone': 'Piedra Hoja',
    'moon-stone': 'Piedra Lunar',
    'sun-stone': 'Piedra Solar',
    'dusk-stone': 'Piedra Noche',
    'shiny-stone': 'Piedra Día',
    'dawn-stone': 'Piedra Alba',
    'oval-stone': 'Piedra Oval',
    'ice-stone': 'Piedra Hielo',
    'metal-coat': 'Revest. Metálico',
    'kings-rock': 'Roca del Rey',
    'dragon-scale': 'Escama Dragón',
    'upgrade': 'Mejora',
    'dubious-disc': 'Disco Dubioso',
    'deep-sea-tooth': 'Dientes Marino',
    'deep-sea-scale': 'Escama Marina',
    'electirizer': 'Electrizador',
    'magmarizer': 'Magmatizador',
    'reaper-cloth': 'Tela Terrible',
    'protector': 'Protector'
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
    'gift': 'Regalo'
};

function traducirObjeto(nombreIngles) {
    if (!nombreIngles) return 'Objeto';
    return objetosES[nombreIngles] || capitalize(nombreIngles.replace(/-/g, ' '));
}

function limpiarUbicacion(nombreArea) {
    if (!nombreArea) return '';
    let limpio = nombreArea
        .replace(/-area/g, '')
        .replace(/-/g, ' ');

    limpiado = limpio
        .replace(/route /gi, 'Ruta ')
        .replace(/viridian forest/gi, 'Bosque Verde')
        .replace(/mt moon/gi, 'Monte Moon')
        .replace(/rock tunnel/gi, 'Túnel Roca')
        .replace(/pokemon tower/gi, 'Torre Pokémon')
        .replace(/power plant/gi, 'Central Energía')
        .replace(/victory road/gi, 'Calle Victoria')
        .replace(/cerulean cave/gi, 'Cueva Celeste');

    return capitalize(limpiado);
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
   LÓGICA DE CAPTURAR (UBICACIONES)
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

        let encontrados = false;

        data.forEach(encounter => {
            const versionDetails = juegoId === 'todos' 
                ? encounter.version_details 
                : encounter.version_details.filter(v => versionesValidas.includes(v.version.name));

            if (versionDetails.length > 0) {
                encontrados = true;
                const nombreUbicacion = limpiarUbicacion(encounter.location_area.name);

                const tarjeta = document.createElement('div');
                tarjeta.className = 'tarjeta-captura';

                let detallesHTML = '';
                versionDetails.forEach(v => {
                    v.encounter_details.forEach(det => {
                        const metodoTraducido = metodosCapturaES[det.method.name] || capitalize(det.method.name.replace(/-/g, ' '));
                        detallesHTML += `
                            <div>
                                <span class="metodo-badge">${metodoTraducido}</span>
                                Nivel: ${det.min_level === det.max_level ? det.min_level : `${det.min_level}-${det.max_level}`} 
                                (Probabilidad: ${det.chance}%)
                            </div>
                        `;
                    });
                });

                tarjeta.innerHTML = `
                    <div class="captura-ubicacion">${nombreUbicacion}</div>
                    <div class="captura-detalles">${detallesHTML}</div>
                `;

                contenedorCapturar.appendChild(tarjeta);
            }
        });

        if (!encontrados) {
            contenedorCapturar.innerHTML = '<p>No disponible de forma salvaje en este juego/generación.</p>';
        }

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
    await cargarTipos();
    await cargarListaPokemon();
    buscador.value = '';
    buscarPokemon('bulbasaur');
});