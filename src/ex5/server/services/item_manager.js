// The ItemManager should go here. Remember that you have to export it.

const { Todo } = require('../db/models');

const UNSORTED = Symbol("unsorted");
const SORTED_ASC = Symbol("sortedAsc");
const SORTED_DESC = Symbol("sortedDesc");

class ItemManager {
  init() {
    this.sortOrder = UNSORTED;
  }

  async addItem(text) {
    await Todo.create({
      "text": text,
      "isNew": true,
    });
  }

  async getItem(todo_id) {
    return await Todo.findAll({
      where: {
        id: todo_id
      }
    });
  }

  // async updateItem(itemId, body) {
  //   const data = await this.getAll();
  //   const index = data.findIndex(value => {
  //       return value.id === itemId;
  //   });
  //   const item = data[index];
  //   Object.assign(item, body);
  //   await this.writeItemsToFile(data);
  //   return item;
  // }

  async deleteItem(todo_id) {
    await Todo.destroy({
      where: { id: todo_id },
    });
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
    return await Todo.findAll();
  }

  async writeItemsToFile(data){
    await fs.writeFile(DATA_FILE_NAME, JSON.stringify(data, null, 2), err => {
      if (err) throw err;
    });
  }
}

module.exports = ItemManager;

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
