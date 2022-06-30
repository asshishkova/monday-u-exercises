import React from "react";
// import { ItemClient } from "../item_client.js";

export function TodoElement(props) {
  const todo = props.todo;
  const doneTime = todo.done === null? "" : `Done at ${todo.done.slice(11,16)} ${todo.done.slice(0,10)}`;
  const checked = todo.status? "checked" : "";

  const onDeleteButtonClicked = async (e) => {
    await props.deleteTodo(todo);
    await props.updateTodos();
  }

  const activateDeleteAnimation = async (todoLi) => {
    todoLi.classList.remove("existing-todo");
    todoLi.classList.add("animation-delete-todo");
    todoLi.addEventListener('animationend', () => {
      this.renderTodos();
    });
  }

  const onCheckboxClicked = async (e) => {
    await props.changeStatus(todo);
    await props.updateTodos();
  }

  const todoItem =  <label className="todo-item" info={doneTime}>
                      <label className="todo-item-checkbox">
                        <div className="todo-item-text">{todo.text}</div>
                        <input type="checkbox" className="status-checkbox" defaultChecked={checked} onClick={onCheckboxClicked} />
                        <span className="status-checkbox-mark"></span>
                      </label>
                    </label>

  const deleteButton = <button className="delete-todo-button btn" onClick={onDeleteButtonClicked}>
                          <i className="fa fa-trash"></i></button>

  return (
    <li className="todo-li existing-todo">
      {todoItem}
      {deleteButton}
    </li>
  )
}
