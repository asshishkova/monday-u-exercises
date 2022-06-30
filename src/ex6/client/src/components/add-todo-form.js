import React, { useState } from "react";

export function AddTodoForm(props) {

  const [todoText, setTodoText] = useState("")

  const onAddTodoFormSubmitted = async (event) => {
    event.preventDefault();
    const text = todoText;
    setTodoText("");
    await props.createTodo(text);
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
