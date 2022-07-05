import React from "react";
import PropTypes from "prop-types";
import { TodoElement } from "./todo-element.js";
import { NoTodosPlaceholder } from "./no-todos-placeholder.js";
import "../styles/todo-list.css";

export function TodosList(props) {
  const {todos, updateTodos} = props;
  return (
    <ul id="todos-list">
      { todos.length === 0 && <NoTodosPlaceholder/> }
      { todos.length > 0 &&
        todos.map(todo => {
          return <TodoElement key={todo.id} todo={todo} updateTodos={updateTodos}/>
        })
      }
    </ul>
  )
}

TodosList.propTypes = {
  updateTodos: PropTypes.func,
  todos: PropTypes.array
}
