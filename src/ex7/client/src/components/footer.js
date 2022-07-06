import React from "react";
import PropTypes from "prop-types";
import { clearAllItems } from "../item-client.js";
import "../styles/footer.css";


export function Footer(props) {
  const {updateTodos, todos, setSwerverErrorMessage} = props;
  const amount = todos.length;
  const amountDone = todos.filter((todo) => todo.status).length;
  const amountPending = amount - amountDone;

  const onClearAllButtonClicked = async () => {
    setSwerverErrorMessage("");
    if (window.confirm('Are you sure?')) {
      try {
        await clearAllItems();
        await updateTodos();
      } catch (error) {
        setSwerverErrorMessage(`Error: ${error.message}`)
      }
    }
  }

  const restoreDeletedTodo = async () => {
    setSwerverErrorMessage("");
    try {
      console.log('Restore the last deleted todo');
    } catch (error) {
      setSwerverErrorMessage(`Error: ${error.message}`)
    }
  }

  const amountInfo = <p id="amount-info">Tasks: {amountPending} pending, {amountDone} done.</p>;
  const clearAllButton =  <button id="clear-all-button" className="btn"
                            onClick={onClearAllButtonClicked}>Clear all
                          </button>;
  const restoreDeletedIcon =  <button id="restore-deleted" className="btn"
                                onClick={restoreDeletedTodo}><i className="fa fa-undo" aria-hidden="true"></i>
                              </button>

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
  todos: PropTypes.array,
  setSwerverErrorMessage: PropTypes.func
}
