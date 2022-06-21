// The ItemManager should go here. Remember that you have to export it.

const { Todo } = require('../db/models');

const UNSORTED = "unsorted";
const ASC = 'ASC';
const DESC = 'DESC';

class ItemManager {
  init() {
    this.sortOrder = UNSORTED;
  }

  async addItem(text) {
    this.sortOrder = UNSORTED;
    return await Todo.create({
      "text": text,
      "isNew": true,
    });
  }

  async getItem(itemId) {
    return await Todo.findAll({
      where: {
        id: itemId
      }
    });
  }

  async updateItem(itemId, body) {
    return await Todo.update({
      text: body.text, // undefined does not affect anything?
      isNew: body.isNew
     }, {
      where: { id: itemId }
     })
  }

  async deleteItem(itemId) {
    return await Todo.destroy({
      where: { id: itemId },
    });
  }

  async clearAll() {
    return await Todo.destroy({
      where: {},
      truncate: true
    });
  }

  async sortItems(){
    this.sortOrder = this.sortOrder === ASC? DESC : ASC
  }

  async getAll() {
    if (this.sortOrder === UNSORTED) {
      return await Todo.findAll()
    } else {
      return await Todo.findAll({
        order: [
          ["text", `${this.sortOrder}`],
        ]
      });
    }

    // const oldItems = Todo.findAll({
    //   where: { isNew: false },
    // });
    // const newItems = Todo.findAll({
    //   where: { isNew: true },
    //   order: [
    //     ["text", `${this.sortOrder}`],
    //   ]
    // });
    // const promises = [oldItems, newItems];
    // return (await Promise.all(promises)).flat();
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
