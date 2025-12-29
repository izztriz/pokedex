// ==========================
// API DE POKÉMON
// ==========================

// Función para obtener datos de un Pokémon por nombre o número
async function obtenerPokemon(pokemon) {
    const url = `https://pokeapi.co/api/v2/pokemon/${pokemon.toLowerCase()}`;
    try {
        const respuesta = await fetch(url);
        if (!respuesta.ok) throw new Error('Pokémon no encontrado');
        const datos = await respuesta.json();
        return {
            nombre: datos.name,
            numero: datos.id,
            tipos: datos.types.map(tipo => tipo.type.name),
            imagen: datos.sprites.other['official-artwork'].front_default
        };
    } catch (error) {
        console.error(error);
        return null;
    }
}
