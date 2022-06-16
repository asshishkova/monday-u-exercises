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
    // const addItemButton = document.getElementById("list-item-submit");
    // addItemButton.addEventListener("click", this.handleItem);

    this.todoList = document.getElementById("todos-list");

    this.todoTextBox = document.getElementById("new-todo-textbox");
    this.todoAmountInfo = document.getElementById("amount-info");

    this.todos = await this.itemClient.getItems();
    await this.renderTodos(); // this will make it so that any time you refresh the page you'll see the items already in your todo list

    this.clearAllButton = document.getElementById("clear-all-button");
    this.addTodoForm = document.getElementById("add-todo");
    this.sortListButton = document.getElementById("sort-list-button");

    this.clearAllButton.addEventListener('click', () => this.onClearAllButtonClicked());
    this.addTodoForm.addEventListener('submit', (event) => this.onAddTodoFormSubmitted(event));
    this.sortListButton.addEventListener('click', () => this.onSortListButtonClicked());
    this.todoTextBox.addEventListener("keypress", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        document.getElementById('add-todo-button').click();
      }
    });
  }

  handleItem = async () => {
    // implement
    // this.itemClient.addTodo
  }

  // deleteItem = async item => {
  //   // implement
  //   this.itemClient.getTodos()
  // }

  async renderTodos() {
    this.todoList.innerHTML = "";
    this.todos.forEach(todoItem => {
      this.addTodoItem(todoItem);
    });
    this.showFooterAndImage();
  }

  addTodoItem(todoItem) {
    const listItem = this.createTodoListElement(todoItem);
    this.addEventListenerForTodoText(listItem);
    this.addEventListenerForDeleteButton(listItem);
    this.todoList.appendChild(listItem);
  }

  createTodoListElement(todoItem) {
    const todoListElement = document.createElement("li");
    todoListElement.className = "todo-li existing-todo";
    if (todoItem.isNew) {
      this.showTodoWithAnimation(todoListElement, todoItem);
    }
    todoListElement.innerHTML = `<div class="todo-text">${todoItem.text}</div>
                                <button class="delete-todo-button btn"><i class="fa fa-trash"></i></button>`;
    return todoListElement;
  }

  showTodoWithAnimation(todoListElement, todoItem) {
    todoListElement.className = "todo-li animation-add-todo";
    setTimeout (() => { todoListElement.className = "todo-li existing-todo";}, 700);
    this.itemClient.markItemAsOld(todoItem);
  }

  addEventListenerForTodoText(listElement) {
    const todoText = listElement.getElementsByClassName("todo-text")[0];
    todoText.addEventListener('click', ({target}) => {
      this.onTodoTextClicked(target);
    });
  }

  addEventListenerForDeleteButton(listItem) {
    const deleteButton = listItem.getElementsByClassName("delete-todo-button")[0];
    deleteButton.addEventListener('click', ({currentTarget}) => {
      this.onDeleteButtonClicked(currentTarget);
    });
  }

  showFooterAndImage() {
    this.showButtonsAndAmount();
    this.showNoTodosImage();
  }

  showButtonsAndAmount() {
    let tasks = "tasks";
    if (this.todos.length === 1) {
      tasks = "task";
      this.showOrHideElement('sort-list-button', HIDE)
      this.showOrHideElement('clear-all-button', HIDE)
    } else {
      this.showOrHideElement('sort-list-button', SHOW)
      this.showOrHideElement('clear-all-button', SHOW)
    }
    this.todoAmountInfo.textContent = `${this.todos.length} pending ${tasks}`;
  }

  showNoTodosImage() {
    if (this.todos.length === 0) {
      // setTimeout(() => {
        this.showOrHideElement('no-todos-placeholder', SHOW)
        this.showOrHideElement('footer', HIDE)
      // }, 2000);

    } else {
      this.showOrHideElement('no-todos-placeholder', HIDE)
      this.showOrHideElement('footer', SHOW)
    }
  }

  showOrHideElement(elementId, showElement) {
    this.displayStyle = showElement ? "" : "none";
    document.getElementById(elementId).style.display = this.displayStyle;
  }

  onTodoTextClicked(clickedTodo) {
    alert(clickedTodo.textContent);
  }

  onDeleteButtonClicked(clickedButton) {
    const index = Array.prototype.indexOf.call(this.todoList.getElementsByClassName("existing-todo"), clickedButton.parentElement);
    const todoItem = this.todos[index];
    const todoLi = clickedButton.parentElement;
    this.deleteToDoTaskWithAnimation(todoItem, todoLi);
   }

  deleteToDoTaskWithAnimation(todoItem, todoLi) {
    todoLi.classList.remove("existing-todo");
    todoLi.classList.add("animation-delete-todo");
    setTimeout (() => {
      this.deleteTodoTask(todoItem);
    }, 700);
  }

  async deleteTodoTask(todoItem) {
    await this.itemClient.deleteItem(todoItem);
    this.updateTodos();
  }

  async updateTodos() {
    this.todos = await this.itemClient.getItems();
    this.renderTodos();
  }

  onClearAllButtonClicked() {
    const deleteButtons = Array.prototype.slice.call(document.getElementsByClassName("delete-todo-button"));
    deleteButtons.reverse().forEach(button => {
      this.onDeleteButtonClicked(button);
    });
  }

  onAddTodoFormSubmitted(event) {
    event.preventDefault();
    const text = this.todoTextBox.value;
    this.todoTextBox.value = "";
    if (this.pokemonClient.isPokemon(text)) {
      this.addPokemon(text.toLowerCase());
    } else {
      const isTextNaN = text.split(',').map( el => isNaN(el));
      if (isTextNaN.includes(true)) {
        this.updateTodos(this.itemManager.addItem(text))
      } else {
        this.addPokemon(text);
      }
    }
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
