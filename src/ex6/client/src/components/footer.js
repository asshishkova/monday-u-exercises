import React from "react";

export function Footer() {
  return (
    <footer id="footer" style={{display:'none'}}>
      <button id="sort-list-button" className="btn">
        Sort by <i className="fa fa-caret-down"></i>
      </button>
      <p id="amount-info"></p>
      <button id="clear-all-button" className="btn">Clear all</button>
    </footer>
  )
}
