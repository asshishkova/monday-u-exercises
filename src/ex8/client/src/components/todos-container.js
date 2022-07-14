import React, { useEffect, useCallback } from "react";
import { ThreeDots } from  'react-loader-spinner'
import { getItems } from "../item-client.js";
import AddTodoFormConnector from "../connectors/add-todo-form-connector";
import TodosListConnector from "../connectors/todos-list-connector";
import FooterConnector from "../connectors/footer-connector.js";
import "../styles/todos-container.css";

export function TodosContainer({loaded,
                                serverErrorMessage, setServerErrorMessageAction,
                                setTodosAction,
                                setLoadedAction }) {

  const updateTodos = useCallback(async () => {
    setServerErrorMessageAction("");
    try {
      setTodosAction(await getItems());
    } catch (error) {
      setServerErrorMessageAction(`Error: ${error.message}`);
    }
    setLoadedAction(true);
  },[setTodosAction, setLoadedAction, setServerErrorMessageAction])

  useEffect(() => {
    updateTodos();
  }, [updateTodos, setTodosAction]);

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
