// The ItemManager should go here. Remember that you have to export it.

import { promises as fs } from 'fs';

const DATA_FILE_NAME = "savedData.json";

const UNSORTED = Symbol("unsorted");
const SORTED_ASC = Symbol("sortedAsc");
const SORTED_DESC = Symbol("sortedDesc");

export class ItemManager {
  init() {
    this.sortOrder = UNSORTED;
    try {
      this.getItemsFromFile();
    } catch (error) {
      this.writeItemsToFile([]);
    }
  }

  async addItem(text) {
    const data = await this.getItemsFromFile();
    const itemIndex = data.findIndex(item => item.text === text);
    let newItem;
    if (itemIndex > -1) {
      data[itemIndex].isNew = true;
      newItem = data[itemIndex];
    } else {
      const newId = data.reduce((maxId, data) => maxId = maxId > data.id ? maxId : data.id, 0) + 1;
      newItem = {id: newId, text: text, isNew: true};
      data.push(newItem);
    }
    await this.writeItemsToFile(data);
    return newItem;
  }

  async getItem(id) {
    const data = await this.getAll();
    return data.find((value) => value.id === id);
  }

  async updateItem(itemId, body) {
    const data = await this.getAll();
    const index = data.findIndex(value => {
        return value.id === itemId;
    });
    const item = data[index];
    Object.assign(item, body);
    await this.writeItemsToFile(data);
    return item;
  }

  async deleteItem(id) {
    const data = await this.getAll();
    const itemIndex = data.findIndex(item => item.id === id);
    const deletedTodo = data[itemIndex]
    data.splice(itemIndex, 1);
    await this.writeItemsToFile(data);
    return deletedTodo;
  }

  async clearAll(){
    await this.writeItemsToFile([]);
    return [];
  }

  async sortItems(){
    const data = await this.getAll();
    if (this.sortOrder === UNSORTED || this.sortOrder === SORTED_DESC) {
      data.sort((a, b) => a.text.localeCompare(b.text));
      this.sortOrder = SORTED_ASC;
    } else {
      data.reverse();
      this.sortOrder = SORTED_DESC;
    }
    await this.writeItemsToFile(data);
    return data;
  }

  async getAll() {
    return await this.getItemsFromFile();
  }

  async getItemsFromFile(){
    const data = await fs.readFile(DATA_FILE_NAME);
    return JSON.parse(data);
  }

  async writeItemsToFile(data){
    await fs.writeFile(DATA_FILE_NAME, JSON.stringify(data, null, 2), err => {
      if (err) throw err;
    });
  }
}

// const PokemonClient = require('../clients/pokemon_client')

// class ItemManager {
//     constructor() {
//         this.pokemonClient = new PokemonClient();
//         this.items = []; //TODO: remove, items should be stored to DB using Item sequelize model
//     }

//     getItems = () => this.items

//     handleItem = async item => {
//         if (this._isNumber(item)) { return await this.fetchAndAddPokemon(item); }
//         if (this._isList(item)) { return await this.fetchAndAddManyPokemon(item); }

//         this.addItem(item)
//     }

//     addItem = item => {
//         this.items.push(item);
//     }

//     addPokemonItem = pokemon => {
//         this.addItem(`Catch ${pokemon.name}`);
//     }

//     fetchAndAddPokemon = async pokemonId => {
//         try {
//             const pokemon = await this.pokemonClient.getPokemon(pokemonId);
//             this.addPokemonItem(pokemon);
//         } catch (error) {
//             this.addItem(`Pokemon with ID ${pokemonId} was not found`);
//         }
//     }

//     fetchAndAddManyPokemon = async inputValue => {
//         try {
//             const pokemons = await this.pokemonClient.getManyPokemon(inputValue.replace("/ /g", "").split(","));
//             pokemons.forEach(this.addPokemonItem);
//         } catch (error) {
//             console.error(error)
//             this.addItem(`Failed to fetch pokemon with this input: ${inputValue}`)
//         }
//     }

//     deleteItem = item => {
//         this.items = this.items.filter(i => i !== item);
//     }

//     _isNumber = value => !isNaN(Number(value));
//     _isList = value => value.split(",").every(this._isNumber);
// }

// module.exports = new ItemManager()
