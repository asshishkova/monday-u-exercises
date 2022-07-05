import React from "react";
import PropTypes from "prop-types";
import { TodoElement } from "./todo-element.js";
import { NoTodosPlaceholder } from "./no-todos-placeholder.js";
import { Footer } from "./footer.js";
import "../styles/todo-list.css";

export function TodosList(props) {
  const {todos, updateTodos, loaded} = props;
  return (
    <div>
      { todos.length === 0 && loaded && <NoTodosPlaceholder/> }
      { todos.length > 0 &&
        <ul id="todos-list">
          { todos.map(todo => <TodoElement key={todo.id} todo={todo} updateTodos={updateTodos}/>) }
        </ul>
      }
      <Footer todos={todos} updateTodos={updateTodos}/>
    </div>
  )
}

TodosList.propTypes = {
  updateTodos: PropTypes.func,
  todos: PropTypes.array,
  loaded: PropTypes.bool
}
