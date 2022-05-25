/*
Install http-server by typing npm install -g http-server
Change into your working directory, where your some.html lives
Start your http server by issuing http-server -c-1
*/

import { ItemManager } from "/item-manager.js";
import { PokemonClient } from "/pokemon-client.js";


const unsorted = Symbol("unsorted");
const sortedAsc = Symbol("sortedAsc");
const sortedDesc = Symbol("sortedDesc");

// Implement the `Main` class here
class Main {
  constructor(itemManager, pokemonClient) {
    this.itemManager = itemManager;
    this.pokemonClient = pokemonClient;
  }
  init() {
    this.allTodosList = document.getElementById("all-todos-list");
    this.isListSorted = unsorted;
    this.todosArray = itemManager.init();
    this.inputTitle = document.getElementById("new-todo-title");
    this.amountOfTodosInfo = document.getElementById("amount-info");

    this.clearAllButton = document.getElementById("clear-all-button");
    this.addTodoForm = document.getElementById("add-todo");
    this.sortListButton = document.getElementById("sort-list-button");

    this.clearAllButton.addEventListener('click', () => this.onClearAllButtonClicked());
    this.addTodoForm.addEventListener('submit', (event) => this.onAddTodoFormSubmitted(event));
    this.sortListButton.addEventListener('click', () => this.onSortListButtonClicked());

    this.renderTodos(0);

    this.inputTitle.addEventListener("keypress", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        document.getElementById('add-todo-button').click();
      }
    });
  }

  renderTodos(newItemsAmount) {
    this.allTodosList.innerHTML = "";
    this.todosArray.forEach((item, key, arr) => {
      if (newItemsAmount > 0 && key >= arr.length - newItemsAmount) {
        this.addTodoItem(item, true);
      } else {
        this.addTodoItem(item, false);
      }
    });
    this.displayFooterAndImage();
  }

  addEventListenerForTodoTitle(listItem) {
    const todoTitleDiv = listItem.getElementsByTagName("div")[0];
    todoTitleDiv.addEventListener('click', ({target}) => {
      this.onTodoTitleClicked(target);
    });
  }

  addEventListenerForDeleteButton(listItem) {
    const deleteButton = listItem.getElementsByTagName("button")[0]
    deleteButton.addEventListener('click', ({currentTarget}) => {
      this.onDeleteButtonClicked(currentTarget);
    });
  }

  addTodoItem(todoText, animation) {
    const listItem = this.createListElement(todoText, animation);
    this.addEventListenerForTodoTitle(listItem);
    this.addEventListenerForDeleteButton(listItem);
    this.allTodosList.appendChild(listItem);
    this.isListSorted = unsorted;
  }

  createListElement(todoText, animation) {
    const listItem = document.createElement("li");
    listItem.className = "existing-item";
    if (animation) {
      listItem.className = "add-item-animation";
      setTimeout (() => { listItem.className = "existing-item";}, 700);
    }
    listItem.innerHTML = `<div class="todo-text">${todoText}</div>
                          <button class="remove-todo-button"><i class="fa fa-trash"></i></button>`;
    return listItem;
  }

  displayFooterAndImage() {
    this.displayButtonsAndAmount();
    this.displayZeroImage();
  }

  displayButtonsAndAmount() {
    let tasks = "tasks";
    if (this.todosArray.length === 1) {
      tasks = "task";
      this.displayElement('sort-list-button', false)
      this.displayElement('clear-all-button', false)
    } else {
      this.displayElement('sort-list-button', true)
      this.displayElement('clear-all-button', true)
    }
    this.amountOfTodosInfo.textContent = `${this.todosArray.length} pending ${tasks}`;
  }

  displayZeroImage() {
    if (this.todosArray.length === 0) {
      this.displayElement('zero-todos-image', true)
      this.displayElement('footer', false)
    } else {
      this.displayElement('zero-todos-image', false)
      this.displayElement('footer', true)
    }
  }

  displayElement(elementId, toDisplay) {
    this.displayStyle = toDisplay ? "" : "none";
    document.getElementById(elementId).style.display = this.displayStyle;
  }

  onTodoTitleClicked(clickedTodo) {
    alert(clickedTodo.textContent);
  }

  onDeleteButtonClicked(clickedButton) {
    const index = Array.prototype.indexOf.call(this.allTodosList.getElementsByTagName("li"), clickedButton.parentElement);
    clickedButton.parentElement.classList.remove("existing-item");
    clickedButton.parentElement.classList.add("delete-item-animation");
    setTimeout (() => {
      this.todosArray = this.itemManager.deleteItem(index);
      this.renderTodos(0);
    }, 700);
  }

  onClearAllButtonClicked() {
    const deleteButtons = Array.prototype.slice.call(document.querySelectorAll("div"));
    deleteButtons.reverse().forEach(button => {
      this.onDeleteButtonClicked(button);
    });
  }

  onAddTodoFormSubmitted(event) {
    event.preventDefault();
    const newTodoText = this.inputTitle.value;
    this.inputTitle.value = "";
    const isNaNArray = newTodoText.split(',').map( el => isNaN(el));
    if (isNaNArray.includes(true)) {
      this.todosArray = itemManager.addItem(newTodoText);
      this.renderTodos(1);
    } else {
      this.addPokemon(newTodoText);
    }
  }

  addPokemon(newTodoText) {
    this.pokemonClient.catchPokemon(newTodoText).then(pokemons => {
      try {
        pokemons.forEach(pokemon => {
          this.todosArray = itemManager.addItem(`Catch ${pokemon}`);
        })
        this.renderTodos(pokemons.length);
      } catch (error) {
        this.todosArray = itemManager.addItem(`Failed to fetch ${newTodoText}`);
        this.renderTodos(1);
      }
    })
  }

  onSortListButtonClicked() {
    if (this.isListSorted === unsorted || this.isListSorted === sortedDesc) {
      this.sortListWithOrder(compareElementsAsc);
      this.isListSorted = sortedAsc;
    } else {
      this.sortListWithOrder(compareElementsDesc);
      this.isListSorted = sortedDesc;
    }
  }

  sortListWithOrder(comparator) {
    let switching = true;
    let shouldSwitch = false;
    while (switching) {
      switching = false;
      const liElements = this.allTodosList.getElementsByTagName("li");
      let i;
      for (i = 0; i < (liElements.length - 1); i++) {
        shouldSwitch = false;
        if (comparator(liElements[i].innerHTML.toLowerCase(), liElements[i + 1].innerHTML.toLowerCase())) {
          shouldSwitch = true;
          break;
        }
      }
      if (shouldSwitch) {
        liElements[i].parentNode.insertBefore(liElements[i + 1], liElements[i]);
        switching = true;
      }
    }
  }
}

function compareElementsAsc(a, b) {
  return a > b;
}

function compareElementsDesc(a, b) {
  return a < b;
}

const itemManager = new ItemManager();
const pokemonClient = new PokemonClient();
const main = new Main(itemManager, pokemonClient);


document.addEventListener("DOMContentLoaded", function () {
    // you should create an `init` method in your class
    // the method should add the event listener to your "add" button
    main.init();
});
