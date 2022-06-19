// The Pokemon Client (using axios) goes here

import axios from "axios";
import { popularPokemons } from "./popular-pokemons.js";

export class PokemonClient {
  constructor() {
    this.API_BASE = 'https://pokeapi.co/api/v2/pokemon';
  }

  async fetchPokemon(pokemonText) {
    try {
      const pokemons = pokemonText.split(',').map( el => el.trim() );
      const promises = pokemons.map(pokemon => {
        return axios.get(`${this.API_BASE}/${pokemon}/`);
      });
      const responses = await Promise.all(promises);
      const elements = await Promise.all(responses.map(response => response.data));
      return elements.map(element => {
        return {
          name: element.forms[0].name,
          type: element.types[0].type.name,
          id: element.id
        }
      });
    } catch (error) {
      this.handleFailure(error, pokemonText);
    }
  }

  handleFailure(error, pokemon) {
    console.log(`Failed to fetch ${pokemon}: `, error);
  }

  isPokemon(name) {
    return popularPokemons.find(pokemon => pokemon.toLowerCase() === name.trim().toLowerCase());
  }
}

// const axios = require("axios")

// class PokemonClient {
//     constructor() {
//         this.API_URL = 'https://pokeapi.co/api/v2/pokemon/'
//     }

//     async getPokemon(id) {
//         try {
//             const response = await axios.get(`${this.API_URL}${id}`)
//             const pokemon = response.data

//             return pokemon
//         } catch (error) {
//             console.error(error)
//             throw new Error("Failed to fetch pokemon")
//         }
//     }

//     async getManyPokemon(ids) {
//         try {
//             const promises = ids.map(id => axios.get(`${this.API_URL}${id}`))
//             const responses = await Promise.all(promises)

//             const pokemons = responses.map(r => r.data)
//             return pokemons
//         } catch (error) {
//             console.error(error)
//             throw new Error("Failed to fetch pokemon")
//         }
//     }
// }

// module.exports = PokemonClient
