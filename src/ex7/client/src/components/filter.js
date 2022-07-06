import React, { useCallback, useState } from "react";
import PropTypes from "prop-types";
import { getItems, getItemsPending, getItemsDone } from "../item-client.js";
import "../styles/filter.css";

const ALL = "ALL";
const PENDING = "PENDING";
const DONE = "DONE";

export function Filter(props) {
  const {todos, setLoaded, setTodos} = props;
  const [filter, setFilter] = useState(ALL);

  const filterTodos = useCallback( async (status) => {
    setLoaded(false);
    setFilter(status);
    if (status === ALL) {
      setTodos(await getItems());
    } else if (status === PENDING) {
      setTodos(await getItemsPending());
    } else { // status === DONE
      setTodos(await getItemsDone());
    }
    setLoaded(true);
  },[setLoaded, setTodos]);

  const createFilterInput = (value) => {
    return (
      <input type="radio" id={value} name="radios" value={value}
        onChange={(e) => filterTodos(e.target.value)}
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
  setTodos: PropTypes.func,
  setLoaded: PropTypes.func,
  todos: PropTypes.array
}
