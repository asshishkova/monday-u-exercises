import React from "react";

export function MainWindow() {
  return (
    <main className="window">
    <h1 className="title">TODOOPS</h1>
    <article className="todos-content">
      <form id="add-todo">
        <input type="text" id="new-todo-textbox" autofocus required placeholder="Add your new todo" />
        <button type="submit" id="add-todo-button" className="btn">+</button>
      </form>
      <div id="no-todos-placeholder">
        <img src="/pointer.png" width="100%" height="100%" alt="Add a new todo"/>
      </div>
      <ul id="todos-list">
      </ul>
      <footer id="footer" style={{display:'none'}}>
        <button id="sort-list-button" className="btn">
          Sort by <i className="fa fa-caret-down"></i>
        </button>
        <p id="amount-info"></p>
        <button id="clear-all-button" className="btn">Clear all</button>
      </footer>
    </article>
  </main>
  )
}
