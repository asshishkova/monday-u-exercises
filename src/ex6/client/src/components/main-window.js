import React from "react";
import { AddTodoForm } from "./add-todo-form.js";
import { NoTodosPlaceholder } from "./no-todos-placeholder.js";
import { TodosList } from "./todos-list.js";
import { Footer } from "./footer.js";

export function MainWindow() {
  return (
    <main className="window">
      <h1 className="title">TODOOPS</h1>
      <article className="todos-content">
        <AddTodoForm />
        <NoTodosPlaceholder />
        <TodosList />
        <Footer />
      </article>
    </main>
  )
}
