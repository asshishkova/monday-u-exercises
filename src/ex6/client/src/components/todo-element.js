import React from "react";
// import { ItemClient } from "../item_client.js";

export function TodoElement(props) {
  const doneTime = props.done === null? "" : `Done at ${props.done.slice(11,16)} ${props.done.slice(0,10)}`;
  const checked = props.status? "checked" : "";

  const onDeleteButtonClicked = async (clickedButton) => {
    // await itemClient.deleteItem(todoItem);

    // const index = Array.prototype.indexOf.call(this.todoList.getElementsByClassName("existing-todo"), clickedButton.parentElement);
    // const todoItem = this.todos[index];
    // const todoLi = clickedButton.parentElement;
    // await this.itemClient.deleteItem(todoItem);
    // this.todos = await this.itemClient.getItems();
    // await activateDeleteAnimation(todoLi);
  }

  const activateDeleteAnimation = async (todoLi) => {
    todoLi.classList.remove("existing-todo");
    todoLi.classList.add("animation-delete-todo");
    todoLi.addEventListener('animationend', () => {
      this.renderTodos();
    });
  }

  return (
    <li className="todo-li existing-todo">
      <label className="todo-item" info={doneTime}>
        <label className="todo-item-checkbox">
          <div className="todo-item-text">{props.text}</div>
          <input type="checkbox" className="status-checkbox" defaultChecked={checked} />
          <span className="status-checkbox-mark"></span>
        </label>
      </label>
      <button className="delete-todo-button btn" onClick={onDeleteButtonClicked}>
        <i className="fa fa-trash">
      </i></button>
    </li>
  )
}
