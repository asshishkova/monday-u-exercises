import React, { useState, useEffect, useCallback } from "react";
import { ThreeDots } from  'react-loader-spinner'
import { AddTodoForm } from "./add-todo-form.js";
import { TodosList } from "./todos-list.js";
import { getItems } from "../item-client.js";
import "../styles/todos-container.css";

export function TodosContainer() {
  const [todos, setTodos] = useState([]);
  const [loaded, setLoaded] = useState(false)

  const updateTodos = useCallback(async () => {
    setTodos(await getItems());
    setLoaded(true);
  },[])

  useEffect(() => {
    updateTodos();
  }, [updateTodos]);

  return (
    <main className="window">
      <h1 className="title">TODOOPS</h1>
        <article className="todos-content">
          <AddTodoForm updateTodos={updateTodos} setLoaded={setLoaded}/>
          { !loaded &&
            <div className="loader">
              <ThreeDots color="#21825B" height={20} width={60} />
            </div>
          }
          <TodosList todos={todos} updateTodos={updateTodos} loaded={loaded}
                    setLoaded={setLoaded} setTodos={setTodos} />
        </article>
    </main>
  )
}
