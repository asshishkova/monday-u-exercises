import React from "react";
import { TodoElement } from "./todo-element.js";

export function TodosList(props) {

  return (
    <ul id="todos-list">
      {
        props.todos.map(todo => {
          return <TodoElement key={todo.id} todo={todo} updateTodos={props.updateTodos} deleteTodo={props.deleteTodo} changeStatus={props.changeStatus} markAsOld={props.markAsOld} isDeleting={props.isDeleting}/>
        })
      }
    </ul>
  )
}
