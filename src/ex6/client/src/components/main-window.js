import React, { useState, useEffect, useCallback } from "react";
import { AddTodoForm } from "./add-todo-form.js";
import { NoTodosPlaceholder } from "./no-todos-placeholder.js";
import { TodosList } from "./todos-list.js";
import { Footer } from "./footer.js";
import {
  getItems,
  deleteItem,
  markItemAsOld,
  changeItemStatus,
  createItem,
  clearAllItems,
  sortItems
} from "../item_client.js";

export function MainWindow() {
  const [todos, setTodos] = useState([]);
  const [isDeleting, setIsDeleting] = useState(false)

  const updateTodos = useCallback(async () => {
    setTodos(await getItems());
    console.log('updateTodos');
  },[])

  const deleteTodo = useCallback(async (todo) => {
    await deleteItem(todo);
  },[])

  const clearAll = useCallback(async () => {
    await clearAllItems();
    setIsDeleting(true);
  },[])

  const createTodo = useCallback(async (text) => {
    await createItem(text)
  },[])

  const markAsOld = useCallback(async (todo) => {
    await markItemAsOld(todo);
  },[])

  const changeStatus = useCallback(async (todo) => {
    await changeItemStatus(todo);
  },[])

  const sortTodos = useCallback(async () => {
    return await sortItems();
  },[])

  useEffect(() => {
    updateTodos();
  }, [updateTodos]);

  return (
    <main className="window">
      <h1 className="title">TODOOPS</h1>
      <article className="todos-content">
        <AddTodoForm createTodo={createTodo} updateTodos={updateTodos}/>
        {todos.length === 0 && <NoTodosPlaceholder/>}
        {todos.length > 0 && <TodosList todos={todos} updateTodos={updateTodos} deleteTodo={deleteTodo} changeStatus={changeStatus} markAsOld={markAsOld} isDeleting={isDeleting} setIsDeleting={setIsDeleting} />}
        <Footer sortTodos={sortTodos} updateTodos={updateTodos} amount={todos.length} clearAll={clearAll}/>
      </article>
    </main>
  )
}
