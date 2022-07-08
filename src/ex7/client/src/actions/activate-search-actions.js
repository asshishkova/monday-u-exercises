import ACTIONS from "./constants";

const activateSearch = () => ({
  type: ACTIONS.ACTIVATE_SEARCH,
});

const deactivateSearch = () => ({
  type: ACTIONS.DEACTIVATE_SEARCH,
});

export const activateSearchAction = () => {
  return dispatch => {
    dispatch(activateSearch());
  }
};

export const deactivateSearchAction = () => {
  return dispatch => {
    dispatch(deactivateSearch());
  }
};
