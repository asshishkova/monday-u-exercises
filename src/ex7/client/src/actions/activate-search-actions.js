import ACTIONS from "./constants";

const updateSearchStatus = (searchIsActive) => ({
  type: ACTIONS.UPDATE_SEARCH_STATUS,
  searchIsActive: searchIsActive
});


export const updateSearchStatusAction = (searchIsActive) => {
  return dispatch => {
    dispatch(updateSearchStatus(searchIsActive));
  }
};
