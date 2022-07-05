import React, { useState } from "react";
import PropTypes from "prop-types";
import { createItem } from "../item-client.js";
import "../styles/add-todo-form.css";


export function AddTodoForm(props) {

  const [todoText, setTodoText] = useState("")

  const onAddTodoFormSubmitted = async (event) => {
    event.preventDefault();
    const text = todoText;
    setTodoText("");
    await createItem(text);
    await props.updateTodos();
  }

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
  updateTodos: PropTypes.func
}
