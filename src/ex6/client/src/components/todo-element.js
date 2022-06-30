import React, { useEffect, useState } from "react";
import { deleteItem, markItemAsOld, changeItemStatus } from "../item_client.js";

export function TodoElement(props) {
  const [todoClassName, setTodoClassName] = useState("todo-li existing-todo")

  const todo = props.todo;
  const doneTime = todo.done === null? "" : `Done at ${todo.done.slice(11,16)} ${todo.done.slice(0,10)}`;
  const checked = todo.status? "checked" : "";

  useEffect(() => {
    if (todo.isNew) {
      setTodoClassName("todo-li animation-add-todo");
      markItemAsOld(todo);
    }
  },[props, todo])

  const animationEndHandler = () => {
    if (todoClassName === "todo-li animation-add-todo") {
      setTodoClassName("todo-li existing-todo")
    } else {
      props.updateTodos();
    }
  }

  const onDeleteButtonClicked = async (e) => {
    await deleteItem(todo);
    setTodoClassName("todo-li animation-delete-todo");
    // updateTodos runs in animationEndHandler
  }

  const onCheckboxClicked = async (e) => {
    await changeItemStatus(todo);
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
    <li className={todoClassName} onAnimationEnd={animationEndHandler}>
      {todoItem}
      {deleteButton}
    </li>
  )
}
