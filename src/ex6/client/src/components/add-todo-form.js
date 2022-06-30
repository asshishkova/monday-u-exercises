import React, { useState } from "react";

export function AddTodoForm(props) {

  const [todoText, setTodoText] = useState("")

  // this.todoTextBox.addEventListener("keypress", (event) => {
  //   if (event.key === "Enter") {
  //     event.preventDefault();
  //     document.getElementById('add-todo-button').click();
  //   }
  // });

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
