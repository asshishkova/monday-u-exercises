import React, { useCallback, useState } from "react";
import { createItem, getItemsWhere, getItems } from "../item-client.js";
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
  },[setTodosAction, setServerErrorMessageAction, searchStatus])


  const onAddTodoFormSubmitted = useCallback(async (event) => {
    event.preventDefault();
    setTodoText("");
    setServerErrorMessageAction("");
    setLoadedAction(false);
    // showAllAction();
    const text = todoText;
    try {
      const newTodos = await createItem(text);
      addTodosAction(newTodos);
      setTodosAction(await getItems());
      setLoadedAction(true);
    } catch (error) {
      setServerErrorMessageAction(`Error: ${error.message}`);
    }
  },[addTodosAction, todoText, setLoadedAction, setServerErrorMessageAction, setTodosAction]);

  return (
    <form id="add-todo" onSubmit={onAddTodoFormSubmitted}>
      <input type="text" id="new-todo-textbox"
        value={todoText} onChange={(e) => onTextChange(e.target.value)}
        autoFocus required placeholder="Add your new todo"/>
      <button type="submit" id="add-todo-button" className="btn">+</button>
    </form>
  )
}
