import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { getItems } from "../item-client.js";
import { deleteItem, markItemAsOld, changeItemStatus } from "../item-client.js";
import "../styles/todo-element.css";

const NO_ANIMATION = Symbol("no animation");
const ADDING_ANIMATION = Symbol("adding animation");
const DELETING_ANIMATION = Symbol("deleting animation");

export function TodoElement({ todo,
                              deleteTodoAction,
                              setServerErrorMessageAction,
                              saveDeletedItemAction,
                              setTodosAction,
                              markOldAction
                            }) {

  const [currentAnimation, setCurrentAnimation] = useState(NO_ANIMATION)

  const doneTime = todo.done === null? "" : `Done at ${todo.done.slice(11,16)} ${todo.done.slice(0,10)}`;
  const checkedDefaultValue = todo.status? "checked" : "";

  useEffect(() => {
    const markItemAsOldEffect = async () => {
      try {
        await markItemAsOld(todo);
        markOldAction(todo);
      } catch (error) {
        setServerErrorMessageAction(`Error: ${error.message}`);
      }
    }
    if (todo.isNew) {
      setCurrentAnimation(ADDING_ANIMATION);
      markItemAsOldEffect();
    }
  },[todo, setServerErrorMessageAction, markOldAction])

  const animationEndHandler = async (todo) => {
    setCurrentAnimation(NO_ANIMATION);
    if (currentAnimation === DELETING_ANIMATION) {
      deleteTodoAction(todo);
      saveDeletedItemAction(todo);
    }
  }

  const onDeleteButtonClicked = async (e) => {
    setServerErrorMessageAction("");
    try {
      await deleteItem(todo);
      setCurrentAnimation(DELETING_ANIMATION);
      // setTodosAction and saveDeletedItemAction runs in animationEndHandler
    } catch (error) {
      setServerErrorMessageAction(`Error: ${error.message}`);
    }
  }

  const onCheckboxClicked = async (e) => {
    setServerErrorMessageAction("");
    try {
      await changeItemStatus(todo);
      setTodosAction(await getItems());
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
    <li className={todoClassName} onAnimationEnd={() => animationEndHandler(todo)} >
      { todoItem }
      { deleteButton }
    </li>
  )
}

TodoElement.propTypes = {
  todo: PropTypes.object,
}
