import React from "react";

export function AddTodoForm() {
  return (
    <form id="add-todo">
      <input type="text" id="new-todo-textbox" autofocus required placeholder="Add your new todo" />
      <button type="submit" id="add-todo-button" className="btn">+</button>
    </form>
  )
}
