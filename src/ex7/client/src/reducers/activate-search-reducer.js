import ACTIONS from "../actions/constants";

const initialState = {
  searchIsActive: false
};

const activateSearchReducer = (state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.UPDATE_SEARCH_STATUS:
      return { searchIsActive: action.searchIsActive };
    default:
      return state;
  }
};
export default activateSearchReducer;
