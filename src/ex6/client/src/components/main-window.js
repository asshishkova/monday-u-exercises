import React, { useState, useEffect, useCallback } from "react";
import { AddTodoForm } from "./add-todo-form.js";
import { NoTodosPlaceholder } from "./no-todos-placeholder.js";
import { TodosList } from "./todos-list.js";
import { Footer } from "./footer.js";
import { getItems } from "../item_client.js";

export function MainWindow() {
  const [todos, setTodos] = useState([]);

  const updateTodos = useCallback(async () => {
    setTodos(await getItems());
    console.log('updateTodos');
  },[])

  useEffect(() => {
    updateTodos();
  }, [updateTodos]);

  return (
    <main className="window">
      <h1 className="title">TODOOPS</h1>
      <article className="todos-content">
        <AddTodoForm updateTodos={updateTodos}/>
        {todos.length === 0 && <NoTodosPlaceholder/>}
        {todos.length > 0 && <TodosList todos={todos} updateTodos={updateTodos} />}
        <Footer updateTodos={updateTodos} amount={todos.length}/>
      </article>
    </main>
  )
}
