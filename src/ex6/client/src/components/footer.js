import React from "react";
import PropTypes from "prop-types";
import { clearAllItems } from "../item-client.js";
import "../styles/footer.css";


export function Footer(props) {
  const {updateTodos, amount} = props;

  const onClearAllButtonClicked = async () => {
    if (window.confirm('Are you sure?')) {
      await clearAllItems();
      await updateTodos();
    }
  }

  let tasks = "tasks";
  if (amount === 1) tasks = "task";
  const amountInfo = <p id="amount-info">{amount} {tasks}</p>
  const clearAllButton = <button id="clear-all-button" className="btn" onClick={onClearAllButtonClicked}>Clear all</button>

  return (
    <footer id="footer">
      { amount > 0 && amountInfo }
      { amount > 1 && clearAllButton }
    </footer>
  )
}

Footer.propTypes = {
  updateTodos: PropTypes.func,
  amount: PropTypes.number
}
