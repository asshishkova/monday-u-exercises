import React, { useCallback } from "react";
import "../styles/filter.css";

const ALL = "ALL";
const PENDING = "PENDING";
const DONE = "DONE";

const filters = {
  ALL: (todo) => todo,
  PENDING: (todo) => todo.status === false,
  DONE: (todo) => todo.status === true
}

export function Filter({  searchStatus, updateSearchStatusAction,
                          filterName, updateFilterAction }) {

  const filterTodos = useCallback( async (filterName) => {
    updateFilterAction(filterName, filters[filterName]);
  },[updateFilterAction]);

  const onCheckboxClicked = useCallback ( async () => {
    updateSearchStatusAction(!searchStatus);
  },[updateSearchStatusAction, searchStatus]);

  const createFilterInput = (value) => {
    return (
      <input type="radio" id={value} name="radios" value={value}
        onChange={(e) => filterTodos(e.target.value)}
        checked = {filterName === value} />)
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
  const searchCheckbox =  <label className="search-filter">
                            Search
                            <input type="checkbox" className="search-checkbox"
                                  defaultChecked={searchStatus} onClick={onCheckboxClicked} />
                            <span className="search-checkbox-mark"></span>
                          </label>;

  return (
    <div className="filters">
      { filterRadioButtons }
      { searchCheckbox }
    </div>
  )
}
