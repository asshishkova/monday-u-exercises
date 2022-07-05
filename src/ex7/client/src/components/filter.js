import React, { useState } from "react";
import PropTypes from "prop-types";
import "../styles/filter.css";

const ALL = "ALL";
const PENDING = "PENDING";
const DONE = "DONE";

export function Filter(props) {
  const {todos} = props;
  const [filter, setFilter] = useState(ALL);

  const createFilterInput = (value) => {
    return (
      <input type="radio" id={value} name="radios" value={value}
        onChange={(e) => setFilter(e.target.value)}
        checked = {filter === value} />)
  }

  const filterRadioButtons =  <div className="filter-radio-buttons">
                                Show
                                {createFilterInput(ALL)}
                                <label htmlFor={ALL}>all</label>
                                {createFilterInput(PENDING)}
                                <label htmlFor={PENDING}>pending</label>
                                {createFilterInput(DONE)}
                                <label htmlFor={DONE}>done</label>
                              </div>;
  return (
    <div>
      {
        todos.length > 0 &&
        filterRadioButtons
      }
    </div>
  )
}

Filter.propTypes = {
  updateTodos: PropTypes.func,
  todos: PropTypes.array
}
