import React, { useCallback, useState } from "react";
import PropTypes from "prop-types";
import { createItem, getItemsWhere } from "../item-client.js";
import "../styles/add-todo-form.css";

export function AddTodoForm({ searchStatus,
                              setTodosAction,
                              setServerErrorMessageAction,
                              setLoadedAction,
                              updateTodos }) {

  const [todoText, setTodoText] = useState("");

  const onAddTodoFormSubmitted = useCallback(async (event) => {
    setServerErrorMessageAction("");
    setLoadedAction(false);
    event.preventDefault();
    const text = todoText;
    setTodoText("");
    try {
      await createItem(text);
      await updateTodos();
    } catch (error) {
      setServerErrorMessageAction(`Error: ${error.message}`);
    }
  },[updateTodos, todoText, setLoadedAction, setServerErrorMessageAction]);

  const onTextChange = useCallback (async (text) => {
    setTodoText(text);
    if (searchStatus) {
      setServerErrorMessageAction("");
      setLoadedAction(false);
      try {
        text.trim().length > 0 ? setTodosAction(await getItemsWhere(text)) : await updateTodos();
      } catch (error) {
        setServerErrorMessageAction(`Error: ${error.message}`);
      }
      setLoadedAction(true);
    }
  },[setLoadedAction, setTodosAction, updateTodos, setServerErrorMessageAction, searchStatus])

  return (
    <form id="add-todo" onSubmit={onAddTodoFormSubmitted}>
      <input type="text" id="new-todo-textbox"
        value={todoText} onChange={(e) => onTextChange(e.target.value)}
        autoFocus required placeholder="Add your new todo"/>
      <button type="submit" id="add-todo-button" className="btn">+</button>
    </form>
  )
}

AddTodoForm.propTypes = {
  updateTodos: PropTypes.func,
}
