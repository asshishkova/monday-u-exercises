// import { ItemManager } from "../server/services/item_manager.js";
// import { PokemonClient } from "../server/clients/pokemon_client.js";
import { ItemClient } from "./clients/item_client.js";

const SHOW = true;
const HIDE = false;

class Main {
  constructor() {
    // this.itemManager = new ItemManager();
    // this.pokemonClient = new PokemonClient();
    this.itemClient = new ItemClient();
  }

  init = async () => {
    const addItemButton = document.getElementById("list-item-submit");
    addItemButton.addEventListener("click", this.handleItem);

    await this.renderItems(); // this will make it so that any time you refresh the page you'll see the items already in your todo list
  }

  handleItem = async () => {
    // implement
    // this.itemClient.addTodo
  }

  deleteItem = async item => {
    // implement
  }

  renderItems = async () => {
    const list = document.getElementById("list");
    list.innerHTML = "";

    const items = 'where do you get the items from now that you have a server..?'

    items.forEach(item => {
      const listItem = document.createElement("li");
      listItem.classList.add('list-item');
      listItem.innerHTML = item;

      const listItemDeleteButton = this._createDeleteButton(item);
      listItem.appendChild(listItemDeleteButton);
      list.appendChild(listItem);
    })
  }

  _createDeleteButton = item => {
    const button = document.createElement("img");
    button.src = "./images/delete_icon.svg";
    button.classList.add('list-item-delete-button');
    button.addEventListener("click", _ => this.deleteItem(item));

    return button
  }
}

const main = new Main();

document.addEventListener("DOMContentLoaded", function () {
  main.init();
});
