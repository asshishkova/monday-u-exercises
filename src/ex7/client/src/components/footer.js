import React from "react";
import { clearAllItems, getItems, restoreItem } from "../item-client.js";
import "../styles/footer.css";

export function Footer({  lastDeletedItem, todos,
                          setServerErrorMessageAction,
                          saveDeletedItemAction,
                          setTodosAction,
                          updateTodos }) {

                            const amount = todos.length;
  const amountDone = todos.filter((todo) => todo.status).length;
  const amountPending = amount - amountDone;

  const onClearAllButtonClicked = async () => {
    setServerErrorMessageAction("");
    if (window.confirm('Are you sure?')) {
      try {
        await clearAllItems();
        setTodosAction(await getItems());
      } catch (error) {
        setServerErrorMessageAction(`Error: ${error.message}`)
      }
    }
  }

  const restoreDeletedTodo = async () => {
    setServerErrorMessageAction("");
    try {
      await restoreItem(lastDeletedItem.text, lastDeletedItem.status, lastDeletedItem.done)
      saveDeletedItemAction(null);
      await updateTodos();
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
      { amount > 0 && amountInfo }
      { lastDeletedItem && restoreDeletedIcon }
      { amount > 0 && clearAllButton }
    </footer>
  )
}
