import React from "react";
import PropTypes from "prop-types";
import { clearAllItems } from "../item-client.js";
import "../styles/footer.css";


export function Footer(props) {
  const {updateTodos, todos} = props;
  const amount = todos.length;
  const amountDone = todos.filter((todo) => todo.status).length;
  const amountPending = amount - amountDone;

  const onClearAllButtonClicked = async () => {
    if (window.confirm('Are you sure?')) {
      await clearAllItems();
      await updateTodos();
    }
  }

  const restoreDeletedTodo = async () => {
    console.log('Restore deleted');
  }

  const amountInfo = <p id="amount-info">Tasks: {amountPending} pending, {amountDone} done.</p>;
  const clearAllButton = <button id="clear-all-button" className="btn" onClick={onClearAllButtonClicked}>Clear all</button>;
  const restoreDeletedIcon = <p id="restore-deleted" onClick={restoreDeletedTodo}><i class="fa fa-undo" aria-hidden="true"></i>
  </p>

  return (
    <footer id="footer">
      { amount > 0 && amountInfo }
      { amount === 2 && restoreDeletedIcon }
      { amount > 0 && clearAllButton }
    </footer>
  )
}

Footer.propTypes = {
  updateTodos: PropTypes.func,
  todos: PropTypes.array
}
