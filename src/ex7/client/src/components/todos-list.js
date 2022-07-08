import React from "react";
import PropTypes from "prop-types";
import { NoTodosPlaceholder } from "./no-todos-placeholder.js";
import FilterConnector from "../connectors/filter-connector";
import TodoElementConnector from "../connectors/todo-element-connector";
import FooterConnector from "../connectors/footer-connector.js";
import "../styles/todo-list.css";

export function TodosList({loaded, todos, filter}) {
  const amount = todos.length;
  return (
    <div>
      { amount === 0 && loaded && <NoTodosPlaceholder/> }
      { amount > 0 && < FilterConnector /> }
      { amount > 0 &&
        <ul id="todos-list">
          { todos.filter(filter)
                 .map(todo => <TodoElementConnector key={todo.id} todo={todo}/>) }
        </ul>
      }
      { amount > 0 && <FooterConnector/> }
    </div>
  )
}

TodosList.propTypes = {
  updateTodos: PropTypes.func,
}
