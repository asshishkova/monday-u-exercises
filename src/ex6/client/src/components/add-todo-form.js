import React, { useCallback, useState } from "react";
import PropTypes from "prop-types";
import { createItem } from "../item-client.js";
import "../styles/add-todo-form.css";

export function AddTodoForm(props) {

  const {updateTodos, setLoaded} = props;
  const [todoText, setTodoText] = useState("")

  const onAddTodoFormSubmitted = useCallback(async (event) => {
    setLoaded(false);
    event.preventDefault();
    const text = todoText;
    setTodoText("");
    await createItem(text);
    await updateTodos();
  },[updateTodos, todoText,setLoaded]);

  return (
    <form id="add-todo" onSubmit={onAddTodoFormSubmitted}>
      <input type="text" id="new-todo-textbox"
        value={todoText} onChange={(e) => setTodoText(e.target.value)}
        autoFocus required placeholder="Add your new todo"/>
      <button type="submit" id="add-todo-button" className="btn">+</button>
    </form>
  )
}

AddTodoForm.propTypes = {
  updateTodos: PropTypes.func,
  setLoaded: PropTypes.func
}
