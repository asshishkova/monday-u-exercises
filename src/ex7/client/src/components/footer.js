import React from "react";
import { clearAllItems, restoreItem } from "../item-client.js";
import "../styles/footer.css";

export function Footer({  lastDeletedItem, todos,
                          setServerErrorMessageAction,
                          saveDeletedItemAction,
                          setTodosAction,
                          addTodosAction }) {

  const amount = todos.length;
  const amountDone = todos.filter((todo) => todo.status).length;
  const amountPending = amount - amountDone;

  const onClearAllButtonClicked = async () => {
    setServerErrorMessageAction("");
    saveDeletedItemAction(null);
    if (window.confirm('Are you sure?')) {
      try {
        await clearAllItems();
        setTodosAction([]);
      } catch (error) {
        setServerErrorMessageAction(`Error: ${error.message}`)
      }
    }
  }

  const restoreDeletedTodo = async () => {
    setServerErrorMessageAction("");
    try {
      await restoreItem(lastDeletedItem);
      saveDeletedItemAction(null);
      addTodosAction([lastDeletedItem]);
    } catch (error) {
      setServerErrorMessageAction(`Error: ${error.message}`)
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
      { amountInfo }
      { lastDeletedItem && restoreDeletedIcon }
      { clearAllButton }
    </footer>
  )
}
