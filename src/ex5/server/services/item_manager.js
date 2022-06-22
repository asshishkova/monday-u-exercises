// The ItemManager should go here. Remember that you have to export it.

const { Item } = require('../db/models');

const SORT_OPTIONS = ['id', 'text', 'status']

class ItemManager {
  init() {
    this.sortOptionIndex = 0;
    this.sortBy = SORT_OPTIONS[this.sortOptionIndex];
  }

  async addItem(text) {
    const newItem = await Item.create({
      "text": text,
      "isNew": true,
      "status": false
    });
    console.log('newItem', newItem);
    return newItem;
  }

  async getItem(itemId) {
    return await Item.findAll({
      where: {
        id: itemId
      }
    });
  }

  async updateItem(itemId, body) {
    return await Item.update({
      text: body.text,
      isNew: body.isNew,
      status: body.status
     }, {
      where: { id: itemId }
     })
  }

  async deleteItem(itemId) {
    return await Item.destroy({
      where: { id: itemId },
    });
  }

  async clearAll() {
    return await Item.destroy({
      where: {},
      truncate: true
    });
  }

  async sortItems(){
    this.sortOptionIndex = (this.sortOptionIndex + 1) % SORT_OPTIONS.length
    return this.sortBy = SORT_OPTIONS[this.sortOptionIndex];
  }

  async getAll() {
    return await Item.findAll({
      order: [
        [this.sortBy, "ASC"],
      ]
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
