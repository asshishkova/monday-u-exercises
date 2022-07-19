import React from "react";
import { NoTodosPlaceholder } from "./no-todos-placeholder.js";
import FilterBarConnector from "../connectors/filter-connector";
import TodoElementConnector from "../connectors/todo-element-connector";
import "../styles/todo-list.css";

export function TodosList({ loaded, todos, filterFunction }) {
  const amount = todos.length;
  return (
    <div>
      { amount === 0 && loaded && <NoTodosPlaceholder/> }
      { amount > 0 && < FilterBarConnector /> }
      { amount > 0 &&
        <ul id="todos-list">
          { todos.filter(filterFunction)
                 .map(todo => <TodoElementConnector key={todo.id} todo={todo}/>) }
        </ul>
      }
    </div>
  )
}
