import React, { useEffect, useCallback } from "react";
import { ThreeDots } from  'react-loader-spinner'
import AddTodoFormConnector from "../connectors/add-todo-form-connector";
import TodosListConnector from "../connectors/todos-list-connector";
import FooterConnector from "../connectors/footer-connector.js";
import "../styles/todos-container.css";

export function TodosContainer({loaded,
                                serverErrorMessage,
                                setServerErrorMessageAction,
                                clearServerErrorMessageAction,
                                setAllTodosAction,
                                setLoadedAction }) {

  const updateTodos = useCallback(async () => {
    clearServerErrorMessageAction();
    try {
      await setAllTodosAction();
    } catch (error) {
      setServerErrorMessageAction(`Error: ${error.message}`);
    }
    setLoadedAction(true);
  },[setAllTodosAction, setLoadedAction, setServerErrorMessageAction, clearServerErrorMessageAction])

  useEffect(() => {
    updateTodos();
  }, [updateTodos]);

  return (
    <main className="window">
      <h1 className="title">TODOOPS</h1>
        <article className="todos-content">
          <AddTodoFormConnector/>
          { !loaded &&
            <div className="loader">
              <ThreeDots color="#21825B" height={20} width={60} />
            </div>
          }
          <TodosListConnector/>
          <FooterConnector/>
          { serverErrorMessage.length > 0 &&
            <p id="error-message">
              {serverErrorMessage}
            </p>
          }
        </article>
    </main>
  )
}
