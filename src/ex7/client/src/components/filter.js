import React, { useCallback, useState } from "react";
import "../styles/filter.css";

const ALL = "ALL";
const PENDING = "PENDING";
const DONE = "DONE";

export function Filter({activateSearchAction, deactivateSearchAction,
                        showAllAction, showDoneAction, showPendingAction,
                        setServerErrorMessageAction }) {

  const [filter, setFilter] = useState(ALL);
  const [searchOn, setSearchOn] = useState(true)

  const filterTodos = useCallback( async (status) => {
    setFilter(status);
    try {
      if (status === ALL) {
        showAllAction();
      } else if (status === PENDING) {
        showPendingAction();
      } else { // status === DONE
        showDoneAction();
      }
    } catch (error) {
      setServerErrorMessageAction(`Error: ${error.message}`);
    }
  },[showAllAction, showDoneAction, showPendingAction, setServerErrorMessageAction]);

  const onCheckboxClicked = useCallback ( async () => {
    setSearchOn(!searchOn);
    !searchOn ? activateSearchAction() : deactivateSearchAction();
  },[searchOn, activateSearchAction, deactivateSearchAction]);

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
  const searchCheckbox =  <label className="search-filter">
                            Search
                            <input type="checkbox" className="search-checkbox" defaultChecked={searchOn} onClick={onCheckboxClicked} />
                            <span className="search-checkbox-mark"></span>
                          </label>;

  return (
    <div className="filters">
      { filterRadioButtons }
      { searchCheckbox }
    </div>
  )
}
