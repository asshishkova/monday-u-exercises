import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { deleteItem, markItemAsOld, changeItemStatus } from "../item-client.js";
import "../styles/todo-element.css";

const NO_ANIMATION = Symbol("no animation");
const ADDING_ANIMATION = Symbol("adding animation");
const DELETING_ANIMATION = Symbol("deleting animation");

export function TodoElement({ todo,
                              setServerErrorMessageAction,
                              saveDeletedItemAction,
                              updateTodos }) {

  const [currentAnimation, setCurrentAnimation] = useState(NO_ANIMATION)

  const doneTime = todo.done === null? "" : `Done at ${todo.done.slice(11,16)} ${todo.done.slice(0,10)}`;
  const checkedDefaultValue = todo.status? "checked" : "";

  useEffect(() => {
    if (todo.isNew) {
      setCurrentAnimation(ADDING_ANIMATION);
      try {
        markItemAsOld(todo);
      } catch (error) {
        setServerErrorMessageAction(`Error: ${error.message}`);
      }
    }
  },[todo, setServerErrorMessageAction])

  const animationEndHandler = async () => {
    if (currentAnimation === ADDING_ANIMATION) {
      setCurrentAnimation(NO_ANIMATION)
    } else { // if currentAnimation === DELETONG_ANIMATION
      try {
        await updateTodos();
      } catch (error) {
        setServerErrorMessageAction(`Error: ${error.message}`);
      }
    }
  }

  const onDeleteButtonClicked = async (e) => {
    setServerErrorMessageAction("");
    try {
      await deleteItem(todo);
      saveDeletedItemAction(todo);
      setCurrentAnimation(DELETING_ANIMATION);
      // setTodosAction runs in animationEndHandler
    } catch (error) {
      setServerErrorMessageAction(`Error: ${error.message}`);
    }
  }

  const onCheckboxClicked = async (e) => {
    setServerErrorMessageAction("");
    try {
      await changeItemStatus(todo);
      await updateTodos();
    } catch (error) {
      setServerErrorMessageAction(`Error: ${error.message}`);
    }
  }

  let todoClassName;
  if (currentAnimation === NO_ANIMATION) {
    todoClassName = "todo-li existing-todo";
  } else if (currentAnimation === ADDING_ANIMATION) {
    todoClassName = "todo-li existing-todo animation-add-todo";
  } else { // if currentAnimation === DELETONG_ANIMATION
    todoClassName = "todo-li animation-delete-todo";
  }

  let todoItem;

  todoItem =  <label className="todo-item" info={doneTime}>
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
      { todoItem }
      { deleteButton }
    </li>
  )
}

TodoElement.propTypes = {
  updateTodos: PropTypes.func,
  todo: PropTypes.object,
}
