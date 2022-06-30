import React from "react";
import { TodoElement } from "./todo-element.js";

export function TodosList(props) {

  return (
    <ul id="todos-list">
      {
        props.todos.map(todo => {
          return <TodoElement key={todo.id} text={todo.text} status={todo.status} done={todo.done}/>
        })
      }
    </ul>
  )
}
