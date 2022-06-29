import React from "react";
import { TodoElement } from "./todo-element.js";
// import { ItemClient } from "../item_client.js";

export function TodosList() {
  // const todoElements =


  const updateTodos = async () => {
    this.todos = await this.itemClient.getItems();
    await this.renderTodos();
  }

  const renderTodos = async () => {
    this.todoList.innerHTML = "";
    for (const todoItem of this.todos) {
      await this.addTodoItem(todoItem);
    }
    for (const [i, todoItem] of this.todos.entries()) {
      if (todoItem.isNew) {
        const listElement = this.todoList.children.item(i);
        await this.showTodoWithAnimation(listElement, todoItem);
      }
    }
    this.todos = await this.itemClient.getItems();
  }

  const addTodoItem = async (todoItem) => {
    const listElement = await this.createTodoListElement(todoItem);
    this.addEventListenerForCheckbox(listElement);
    this.addEventListenerForDeleteButton(listElement);
    this.todoList.appendChild(listElement);
  }

  const createTodoListElement = async (todoItem) => {
    const doneTime = todoItem.done === null? "" : `Done at ${todoItem.done.slice(11,16)} ${todoItem.done.slice(0,10)}`;
    const todoListElement = document.createElement("li");
    todoListElement.className = "todo-li existing-todo";
    todoListElement.innerHTML = `<label className="todo-item" info="${doneTime}">
                                    <label className="todo-item-checkbox">
                                      <div className="todo-item-text">${todoItem.text}</div>
                                      <input type="checkbox" className="status-checkbox" ${todoItem.status? "checked" : ""}>
                                      <span className="status-checkbox-mark"></span>
                                    </label>
                                </label>
                                <button className="delete-todo-button btn"><i className="fa fa-trash"></i></button>`;
    return todoListElement;
  }

  const showTodoWithAnimation = async (todoListElement, todoItem) => {
    todoListElement.className = "todo-li animation-add-todo";
    todoListElement.addEventListener('animationend', () => {
      todoListElement.className = "todo-li existing-todo";
    });
    await this.itemClient.markItemAsOld(todoItem);
  }

  // await this.updateTodos();

  const todos = [
    {id: 1, text: 'abc', status: false, done: null},
    {id: 2, text: 'abcsdsd', status: true, done: "today"},
    {id: 3, text: '111', status: true, done: "yesterday"},
  ];


  return (
    <ul id="todos-list">
      {
        todos.map(todo => {
          return <TodoElement key={todo.id} text={todo.text} status={todo.status} done={todo.done}/>
        })
      }
    </ul>
  )
}
