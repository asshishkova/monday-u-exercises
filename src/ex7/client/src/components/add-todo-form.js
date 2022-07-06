import React, { useCallback, useState } from "react";
import PropTypes from "prop-types";
import { createItem, getItemsWhere } from "../item-client.js";
import "../styles/add-todo-form.css";

export function AddTodoForm(props) {

  const {updateTodos, setLoaded, setTodos, setSwerverErrorMessage} = props;
  const [todoText, setTodoText] = useState("");

  const onAddTodoFormSubmitted = useCallback(async (event) => {
    setSwerverErrorMessage("");
    setLoaded(false);
    event.preventDefault();
    const text = todoText;
    setTodoText("");
    try {
      await createItem(text);
      await updateTodos();
    } catch (error) {
      setSwerverErrorMessage(`Error: ${error.message}`);
    }
  },[updateTodos, todoText, setLoaded, setSwerverErrorMessage]);

  const onTextChange = useCallback (async (text) => {
    setSwerverErrorMessage("");
    setLoaded(false);
    setTodoText(text);
    try {
      text.trim().length > 0 ? setTodos(await getItemsWhere(text)) : await updateTodos();
    } catch (error) {
      setSwerverErrorMessage(`Error: ${error.message}`);
    }
    setLoaded(true);
  },[setLoaded, setTodos, updateTodos, setSwerverErrorMessage])

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
  setLoaded: PropTypes.func,
  setTodos: PropTypes.func,
  setSwerverErrorMessage: PropTypes.func
}
