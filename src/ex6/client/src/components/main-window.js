import React, { useState, useEffect, useCallback, useMemo } from "react";
import { AddTodoForm } from "./add-todo-form.js";
import { NoTodosPlaceholder } from "./no-todos-placeholder.js";
import { TodosList } from "./todos-list.js";
import { Footer } from "./footer.js";
import { ItemClient } from "../item_client.js";

export function MainWindow() {

  const [todos, setTodos] = useState([]);

  const itemClient = useMemo( () => {
    return new ItemClient();
  },[])

  const updateTodos = useCallback(async () => {
    setTodos(await itemClient.getItems());
  },[itemClient])

  const sortTodos = useCallback(async () => {
    return await itemClient.sortItems();
  },[itemClient])

  useEffect(() => {
    updateTodos();
  }, [updateTodos]);

  return (
    <main className="window">
      <h1 className="title">TODOOPS</h1>
      <article className="todos-content">
        <AddTodoForm />
        <NoTodosPlaceholder />
        <TodosList todos={todos} />
        <Footer sortTodos={sortTodos} updateTodos={updateTodos} />
      </article>
    </main>
  )
}
