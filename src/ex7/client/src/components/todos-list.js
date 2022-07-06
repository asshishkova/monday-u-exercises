import React from "react";
import PropTypes from "prop-types";
import { TodoElement } from "./todo-element.js";
import { Filter } from "./filter.js";
import { NoTodosPlaceholder } from "./no-todos-placeholder.js";
import { Footer } from "./footer.js";
import "../styles/todo-list.css";

export function TodosList(props) {
  const {todos, updateTodos, setTodos,
        loaded, setLoaded,
        setSwerverErrorMessage} = props;
  return (
    <div>
      { todos.length === 0 && loaded && <NoTodosPlaceholder/> }
      <Filter todos={todos} setTodos={setTodos} setLoaded={setLoaded}
              setSwerverErrorMessage={setSwerverErrorMessage}/>
      { todos.length > 0 &&
        <ul id="todos-list">
          { todos.map(todo => <TodoElement key={todo.id} todo={todo}
                                updateTodos={updateTodos}
                                setSwerverErrorMessage={setSwerverErrorMessage}/>) }
        </ul>
      }
      <Footer todos={todos} updateTodos={updateTodos} setSwerverErrorMessage={setSwerverErrorMessage}/>
    </div>
  )
}

TodosList.propTypes = {
  updateTodos: PropTypes.func,
  setTodos: PropTypes.func,
  setLoaded: PropTypes.func,
  todos: PropTypes.array,
  loaded: PropTypes.bool,
  setSwerverErrorMessage: PropTypes.func
}
