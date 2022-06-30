import React, { useState } from "react";

export function Footer(props) {

  const [sortBy, setSortBy] = useState('Sort by');

  const onSortListButtonClicked = async () => {
    setSortBy(await props.sortTodos());
    await props.updateTodos();
  }

  const onClearAllButtonClicked = async () => {
    await props.clearAll();
    // await props.updateTodos();
  }

  let tasks = "tasks";
  if (props.amount === 1) tasks = "task";
  const amountInfo = <p id="amount-info">{props.amount} pending {tasks}</p>
  const clearAllButton = <button id="clear-all-button" className="btn" onClick={onClearAllButtonClicked}>Clear all</button>
  const sortListButton =  <button id="sort-list-button" className="btn" onClick={onSortListButtonClicked}>
                            {sortBy} <i className="fa fa-caret-down"></i>
                          </button>

  return (
    <footer id="footer">
      { props.amount > 1 && sortListButton }
      { props.amount > 0 && amountInfo }
      { props.amount > 1 && clearAllButton }
    </footer>
  )
}
