import React, { useCallback, useState } from "react";
import "../styles/add-todo-form.css";

export function AddTodoForm({ searchStatus,
                              setTodosWhereAction,
                              addTodosAction,
                              setServerErrorMessageAction,
                              clearServerErrorMessageAction,
                              setLoadedAction }) {

  const [todoText, setTodoText] = useState("");

  const onTextChange = useCallback (async (text) => {
    setTodoText(text);
    if (searchStatus) {
      clearServerErrorMessageAction();
      setLoadedAction(false);
      try {
        await setTodosWhereAction(text);
      } catch (error) {
        setServerErrorMessageAction(`Error: ${error.message}`);
      }
      setLoadedAction(true);
    }
  },[setTodosWhereAction, setServerErrorMessageAction, searchStatus, setLoadedAction, clearServerErrorMessageAction])


  const onAddTodoFormSubmitted = useCallback(async (event) => {
    event.preventDefault();
    setTodoText("");
    clearServerErrorMessageAction();
    setLoadedAction(false);
    const text = todoText;
    try {
      await addTodosAction(text);
    } catch (error) {
      setServerErrorMessageAction(`Error: ${error.message}`);
    }
    setLoadedAction(true);
  },[addTodosAction, todoText, setLoadedAction, setServerErrorMessageAction, clearServerErrorMessageAction]);

  return (
    <form id="add-todo" onSubmit={onAddTodoFormSubmitted}>
      <input type="text" id="new-todo-textbox"
        value={todoText} onChange={(e) => onTextChange(e.target.value)}
        autoFocus required placeholder="Add your new todo"/>
      <button type="submit" id="add-todo-button" className="btn">+</button>
    </form>
  )
}
