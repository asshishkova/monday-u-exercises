import React from "react";
import PropTypes from "prop-types";
import { TodoElement } from "./todo-element.js";
import "../styles/todo-list.css";

export function TodosList(props) {

  return (
    <ul id="todos-list">
      {
        props.todos.map(todo => {
          return <TodoElement key={todo.id} todo={todo} updateTodos={props.updateTodos}/>
        })
      }
    </ul>
  )
}

TodosList.propTypes = {
  updateTodos: PropTypes.func,
  todos: PropTypes.array
}
