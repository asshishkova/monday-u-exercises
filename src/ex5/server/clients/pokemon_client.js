const axios = require("axios");
const popularPokemons = require("./popular_pokemons.js")

class PokemonClient {
  constructor() {
    this.API_BASE = 'https://pokeapi.co/api/v2/pokemon';
  }

  async fetchPokemon(pokemonText) {
    let pokemons = pokemonText.split(',').map( el => el.trim() );
    pokemons = pokemons.filter(element => element.length > 0);
    const promises = pokemons.map(async (pokemon) => {
      try {
        const response = await axios.get(`${this.API_BASE}/${pokemon}/`)
        return {
          success: true,
          name: response.data.forms[0].name,
          type: response.data.types[0].type.name,
          id: response.data.id
        }
      } catch (error) {
        return {
          success: false,
          name: `Failed to fetch ${pokemon}`
        }
      }
    });
    return await Promise.all(promises);
  }

  isPokemon(name) {
    return popularPokemons.find(pokemon => pokemon.toLowerCase() === name.trim().toLowerCase());
  }
}

module.exports = PokemonClient;
