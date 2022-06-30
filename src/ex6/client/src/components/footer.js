import React, { useState } from "react";

export function Footer(props) {
  const [sortBy, setSortBy] = useState('Sort by');

  const onSortListButtonClicked = async () => {
    // this.sortListButton.innerHTML = `
    //   {await this.itemClient.sortItems()}
    //   <i class="fa fa-caret-down"></i>
    // `;
    setSortBy(await props.sortTodos());
    await props.updateTodos();
  }

  return (
    <footer id="footer">
      <button id="sort-list-button" className="btn" onClick={onSortListButtonClicked}>
        {sortBy} <i className="fa fa-caret-down"></i>
      </button>
      <p id="amount-info"></p>
      <button id="clear-all-button" className="btn">Clear all</button>
    </footer>
  )
}

// style={{display:'none'}
