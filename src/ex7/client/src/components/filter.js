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
  const [searchOn, setSearchOn] = useState(true)

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

  const onCheckboxClicked = useCallback ( async () => {
    setSearchOn(!searchOn);
  },[searchOn]);

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
        <div className="filters">
          { filterRadioButtons }
          <label className="search-filter">
            Search
            <input type="checkbox" className="search-checkbox" defaultChecked={searchOn} onClick={onCheckboxClicked} />
            <span className="search-checkbox-mark"></span>
          </label>
        </div>

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
