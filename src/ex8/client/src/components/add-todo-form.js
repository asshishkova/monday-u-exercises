import React, { useCallback, useState } from "react";
import { createItem, getItemsWhere } from "../item-client.js";
import "../styles/add-todo-form.css";

export function AddTodoForm({ searchStatus,
                              setTodosAction,
                              addTodosAction,
                              setServerErrorMessageAction,
                              setLoadedAction }) {

  const [todoText, setTodoText] = useState("");

  const onTextChange = useCallback (async (text) => {
    setTodoText(text);
    if (searchStatus) {
      setServerErrorMessageAction("");
      setLoadedAction(false);
      try {
        setTodosAction(await getItemsWhere(text));
      } catch (error) {
        setServerErrorMessageAction(`Error: ${error.message}`);
      }
      setLoadedAction(true);
    }
  },[setTodosAction, setServerErrorMessageAction, searchStatus, setLoadedAction])


  const onAddTodoFormSubmitted = useCallback(async (event) => {
    event.preventDefault();
    setTodoText("");
    setServerErrorMessageAction("");
    setLoadedAction(false);
    const text = todoText;
    try {
      const newTodos = await createItem(text);
      addTodosAction(newTodos);
    } catch (error) {
      setServerErrorMessageAction(`Error: ${error.message}`);
    }
    setLoadedAction(true);
  },[addTodosAction, todoText, setLoadedAction, setServerErrorMessageAction]);

  return (
    <form id="add-todo" onSubmit={onAddTodoFormSubmitted}>
      <input type="text" id="new-todo-textbox"
        value={todoText} onChange={(e) => onTextChange(e.target.value)}
        autoFocus required placeholder="Add your new todo"/>
      <button type="submit" id="add-todo-button" className="btn">+</button>
    </form>
  )
}
