import React from "react";
import PropTypes from "prop-types";
import { NoTodosPlaceholder } from "./no-todos-placeholder.js";
import FilterConnector from "../connectors/filter-connector";
import TodoElementConnector from "../connectors/todo-element-connector";
import FooterConnector from "../connectors/footer-connector.js";
import "../styles/todo-list.css";

export function TodosList({loaded, todos, filter, updateTodos}) {

  return (
    <div>
      { todos.length === 0 && loaded && <NoTodosPlaceholder/> }
      { todos.length > 0 && < FilterConnector /> }
      { todos.length > 0 &&
        <ul id="todos-list">
          { todos.filter(filter)
                 .map(todo => <TodoElementConnector key={todo.id} todo={todo}
                                                    updateTodos={updateTodos} />) }
        </ul>
      }
      <FooterConnector updateTodos={updateTodos}/>
    </div>
  )
}

TodosList.propTypes = {
  updateTodos: PropTypes.func,
}
