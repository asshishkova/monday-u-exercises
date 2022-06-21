import { ItemClient } from "./clients/item_client.js";

const SHOW = true;
const HIDE = false;

class Main {
  constructor() {
    this.itemClient = new ItemClient();
  }

  init = async () => {
    this.todoList = document.getElementById("todos-list");
    this.todoTextBox = document.getElementById("new-todo-textbox");
    this.todoAmountInfo = document.getElementById("amount-info");

    this.updateTodos();

    this.clearAllButton = document.getElementById("clear-all-button");
    this.addTodoForm = document.getElementById("add-todo");
    this.sortListButton = document.getElementById("sort-list-button");

    this.clearAllButton.addEventListener('click', () => this.onClearAllButtonClicked());
    this.addTodoForm.addEventListener('submit', async (event) => await this.onAddTodoFormSubmitted(event));
    this.sortListButton.addEventListener('click', async() => await this.onSortListButtonClicked());
    this.todoTextBox.addEventListener("keypress", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        document.getElementById('add-todo-button').click();
      }
    });
  }

  async renderTodos() {
    this.todoList.innerHTML = "";
    for (const todoItem of this.todos) {
      await this.addTodoItem(todoItem);
    }
    this.showFooterAndImage();
  }

  async addTodoItem(todoItem) {
    const listItem = await this.createTodoListElement(todoItem);
    // this.addEventListenerForTodoText(listItem);
    this.addEventListenerForDeleteButton(listItem);
    this.todoList.appendChild(listItem);
  }

  async createTodoListElement(todoItem) {
    const todoListElement = document.createElement("li");
    todoListElement.className = "todo-li existing-todo";
    if (todoItem.isNew) {
      await this.showTodoWithAnimation(todoListElement, todoItem);
    }
    todoListElement.innerHTML = `<label class="todo-item">
                                    <label class="todo-item-checkbox">${todoItem.text}
                                      <input type="checkbox" class="done-checkbox">
                                      <span class="done-checkbox-mark"></span>
                                    </label>
                                </label>
                                <button class="delete-todo-button btn"><i class="fa fa-trash"></i></button>`;
    return todoListElement;
  }

  async showTodoWithAnimation(todoListElement, todoItem) {
    todoListElement.className = "todo-li animation-add-todo";
    setTimeout (() => { todoListElement.className = "todo-li existing-todo";}, 700);
    await this.itemClient.markItemAsOld(todoItem);
  }

  // addEventListenerForTodoText(listElement) {
  //   const todoText = listElement.getElementsByClassName("todo-text")[0];
  //   todoText.addEventListener('click', ({target}) => {
  //     this.onTodoTextClicked(target);
  //   });
  // }

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
      this.showOrHideElement('no-todos-placeholder', SHOW)
      this.showOrHideElement('footer', HIDE)

    } else {
      this.showOrHideElement('no-todos-placeholder', HIDE)
      this.showOrHideElement('footer', SHOW)
    }
  }

  showOrHideElement(elementId, showElement) {
    this.displayStyle = showElement ? "" : "none";
    document.getElementById(elementId).style.display = this.displayStyle;
  }

  // onTodoTextClicked(clickedTodo) {
  //   alert(clickedTodo.textContent);
  // }

  async onDeleteButtonClicked(clickedButton) {
    const index = Array.prototype.indexOf.call(this.todoList.getElementsByClassName("existing-todo"), clickedButton.parentElement);
    const todoItem = this.todos[index];
    const todoLi = clickedButton.parentElement;
    await this.itemClient.deleteItem(todoItem);
    await this.activateDeleteAnimation(todoLi);
  }

  async activateDeleteAnimation(todoLi) {
    todoLi.classList.remove("existing-todo");
    todoLi.classList.add("animation-delete-todo");
    setTimeout (async() => {
      await this.updateTodos();
    }, 700);
  }

  async updateTodos() {
    this.todos = await this.itemClient.getItems();
    await this.renderTodos();
  }

  async onClearAllButtonClicked() {
    await this.itemClient.clearAll();
    for (let i = 0; i < this.todos.length; i++) {
      const todoLi = document.getElementById('todos-list').children.item(i);
      await this.activateDeleteAnimation(todoLi);
    }
  }

  async onAddTodoFormSubmitted(event) {
    event.preventDefault();
    const text = this.todoTextBox.value;
    this.todoTextBox.value = "";
    await this.itemClient.createItem(text);
    await this.updateTodos();
  }

  async onSortListButtonClicked() {
    await this.itemClient.sortItems();
    await this.updateTodos();
  }
}

const main = new Main();

document.addEventListener("DOMContentLoaded", function () {
  main.init();
});

// class Main {
//     constructor() {
//         this.itemClient = new ItemClient()
//     }

//     init = async () => {
//         const addItemButton = document.getElementById("list-item-submit");
//         addItemButton.addEventListener("click", this.handleItem);

//         await this.renderItems();
//     }

//     handleItem = async () => {
//         const input = document.getElementById("list-item-input");
//         const inputValue = input.value;

//         await this.itemClient.postItem(inputValue)
//         await this.renderItems()
//     }

//     deleteItem = async item => {
//         await this.itemClient.deleteItem(item);
//         await this.renderItems();
//     }

//     renderItems = async () => {
//         const list = document.getElementById("list");
//         list.innerHTML = "";

//         const items = await this.itemClient.getItems()

//         items.forEach(item => {
//             const listItem = document.createElement("li");
//             listItem.classList.add('list-item');
//             listItem.innerHTML = item;

//             const listItemDeleteButton = this._createDeleteButton(item);
//             listItem.appendChild(listItemDeleteButton);
//             list.appendChild(listItem);
//         })
//     }

//     _createDeleteButton = item => {
//         const button = document.createElement("img");
//         button.src = "./images/delete_icon.svg";
//         button.classList.add('list-item-delete-button');
//         button.addEventListener("click", _ => this.deleteItem(item));

//         return button
//     }
// }

// const main = new Main();

// document.addEventListener("DOMContentLoaded", function () {
//     main.init();
// });
