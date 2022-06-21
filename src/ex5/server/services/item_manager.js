// The ItemManager should go here. Remember that you have to export it.

const { Item } = require('../db/models');

class ItemManager {
  init() {
    this.sortBy = "id";
  }

  async addItem(text) {
    return await Item.create({
      "text": text,
      "isNew": true,
    });
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
      text: body.text, // undefined does not affect anything?
      isNew: body.isNew
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
    return this.sortBy = this.sortBy === "id"? "text" : "id";
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
