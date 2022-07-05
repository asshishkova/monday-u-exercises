import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { deleteItem, markItemAsOld, changeItemStatus } from "../item-client.js";
import "../styles/todo-element.css";


export function TodoElement(props) {
  const {todo, updateTodos} = props;

  const [todoClassName, setTodoClassName] = useState("todo-li existing-todo")

  const doneTime = todo.done === null? "" : `Done at ${todo.done.slice(11,16)} ${todo.done.slice(0,10)}`;
  const checkedDefaultValue = todo.status? "checked" : "";

  useEffect(() => {
    if (todo.isNew) {
      setTodoClassName("todo-li existing-todo animation-add-todo");
      markItemAsOld(todo);
    }
  },[todo])

  const animationEndHandler = async () => {
    if (todoClassName === "todo-li existing-todo animation-add-todo") {
      setTodoClassName("todo-li existing-todo")
    } else {
      await updateTodos();
    }
  }

  const onDeleteButtonClicked = async (e) => {
    await deleteItem(todo);
    setTodoClassName("todo-li animation-delete-todo");
    // updateTodos runs in animationEndHandler
  }

  const onCheckboxClicked = async (e) => {
    await changeItemStatus(todo);
    await updateTodos();
  }

  const todoItem =  <label className="todo-item" info={doneTime}>
                      <label className="todo-item-checkbox">
                        <div className="todo-item-text">{todo.text}</div>
                        <input type="checkbox" className="status-checkbox" defaultChecked={checkedDefaultValue} onClick={onCheckboxClicked} />
                        <span className="status-checkbox-mark"></span>
                      </label>
                    </label>

  const deleteButton = <button className="delete-todo-button btn" onClick={onDeleteButtonClicked}>
                          <i className="fa fa-trash"></i></button>

  return (
    <li className={todoClassName} onAnimationEnd={animationEndHandler} >
      {todoItem}
      {deleteButton}
    </li>
  )
}

TodoElement.propTypes = {
  updateTodos: PropTypes.func,
  todo: PropTypes.object
}
