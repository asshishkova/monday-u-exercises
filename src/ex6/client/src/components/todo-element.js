import React from "react";
// import { ItemClient } from "../item_client.js";

export function TodoElement(props) {
  const doneTime = props.done === null? "" : `Done at ${props.done.slice(11,16)} ${props.done.slice(0,10)}`;
  const checked = props.status? "checked" : "";
  return (
    <li className="todo-li existing-todo">
      <label className="todo-item" info={doneTime}>
        <label className="todo-item-checkbox">
          <div className="todo-item-text">{props.text}</div>
          <input type="checkbox" className="status-checkbox" defaultChecked={checked} />
          <span className="status-checkbox-mark"></span>
        </label>
      </label>
      <button className="delete-todo-button btn"><i className="fa fa-trash"></i></button>
    </li>
  )
}
