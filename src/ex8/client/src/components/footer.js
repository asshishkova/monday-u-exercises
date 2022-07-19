import React from "react";
import "../styles/footer.css";

export function Footer({  lastDeletedItem, todos,
                          setServerErrorMessageAction,
                          clearServerErrorMessageAction,
                          saveDeletedItemAction,
                          clearTodosAction,
                          restoreTodoAction }) {

  const amount = todos.length;
  const amountDone = todos.filter((todo) => todo.status).length;
  const amountPending = amount - amountDone;

  const onClearAllButtonClicked = async () => {
    clearServerErrorMessageAction();
    saveDeletedItemAction(null);
    if (window.confirm('Are you sure?')) {
      try {
        await clearTodosAction();
      } catch (error) {
        setServerErrorMessageAction(`Error: ${error.message}`)
      }
    }
  }

  const restoreDeletedTodo = async () => {
    clearServerErrorMessageAction();
    try {
      saveDeletedItemAction(null);
      await restoreTodoAction(lastDeletedItem);
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
    <div>
      { amount > 0 &&
        <footer id="footer">
          { amountInfo }
          { lastDeletedItem && restoreDeletedIcon }
          { clearAllButton }
        </footer>
      }
    </div>
  )
}
