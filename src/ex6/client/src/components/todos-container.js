import React, { useState, useEffect, useCallback } from "react";
import { AddTodoForm } from "./add-todo-form.js";
import { TodosList } from "./todos-list.js";
import { Footer } from "./footer.js";
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
      { loaded &&
        <article className="todos-content">
          <AddTodoForm updateTodos={updateTodos}/>
          <TodosList todos={todos} updateTodos={updateTodos} />
          <Footer updateTodos={updateTodos} amount={todos.length}/>
        </article>
      }
    </main>
  )
}
