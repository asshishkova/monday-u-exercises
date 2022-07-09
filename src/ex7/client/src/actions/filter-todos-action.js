import ACTIONS from "./constants";

const updateFilter = (filterName, filterFunction) => ({
  type: ACTIONS.UPDATE_FILTER,
  filterFunction: filterFunction,
  filterName: filterName
});

export const updateFilterAction = (filterName, filterFunction) => {
  return dispatch => {
    dispatch(updateFilter(filterName, filterFunction));
  }
};
