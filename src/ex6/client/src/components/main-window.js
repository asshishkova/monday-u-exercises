import React, { useState, useEffect, useCallback, useMemo } from "react";
import { AddTodoForm } from "./add-todo-form.js";
import { NoTodosPlaceholder } from "./no-todos-placeholder.js";
import { TodosList } from "./todos-list.js";
import { Footer } from "./footer.js";
import { ItemClient } from "../item_client.js";

export function MainWindow() {
  const [todos, setTodos] = useState([]);
  const [isDeleting, setIsDeleting] = useState(false)

  const itemClient = useMemo( () => {
    return new ItemClient();
  },[])

  const updateTodos = useCallback(async () => {
    setTodos(await itemClient.getItems());
  },[itemClient])

  const deleteTodo = useCallback(async (todo) => {
    await itemClient.deleteItem(todo);
  },[itemClient])

  const clearAll = useCallback(async () => {
    await itemClient.clearAll();
    setIsDeleting(true);
  },[itemClient])

  const createTodo = useCallback(async (text) => {
    await itemClient.createItem(text)
  },[itemClient])

  const markAsOld = useCallback(async (todo) => {
    await itemClient.markItemAsOld(todo);
  },[itemClient])

  const changeStatus = useCallback(async (todo) => {
    await itemClient.changeItemStatus(todo);
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
        <AddTodoForm createTodo={createTodo} updateTodos={updateTodos}/>
        {todos.length === 0 && <NoTodosPlaceholder/>}
        {todos.length > 0 && <TodosList todos={todos} updateTodos={updateTodos} deleteTodo={deleteTodo} changeStatus={changeStatus} markAsOld={markAsOld} isDeleting={isDeleting} />}
        <Footer sortTodos={sortTodos} updateTodos={updateTodos} amount={todos.length} clearAll={clearAll}/>
      </article>
    </main>
  )
}
