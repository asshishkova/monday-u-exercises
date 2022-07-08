import React, { useEffect, useCallback } from "react";
import { ThreeDots } from  'react-loader-spinner'
import { getItems } from "../item-client.js";
import AddTodoFormConnector from "../connectors/add-todo-form-connector";
import TodosListConnector from "../connectors/todos-list-connector";
import "../styles/todos-container.css";

export function TodosContainer({loaded,
                                setTodosAction,
                                setLoadedAction,
                                serverErrorMessage}) {

  const updateTodos = useCallback(async () => {
    console.log('todos updated');
    setTodosAction(await getItems());
    setLoadedAction(true);
  },[setTodosAction, setLoadedAction])

  useEffect(() => {
    updateTodos();
  }, [updateTodos, setTodosAction]);

  return (
    <main className="window">
      <h1 className="title">TODOOPS</h1>
        <article className="todos-content">
          <AddTodoFormConnector updateTodos={updateTodos}/>
          { !loaded &&
            <div className="loader">
              <ThreeDots color="#21825B" height={20} width={60} />
            </div>
          }
          <TodosListConnector updateTodos={updateTodos}/>
          { serverErrorMessage.length > 0 &&
            <p id="error-message">
              {serverErrorMessage}
            </p>
          }
        </article>
    </main>
  )
}
