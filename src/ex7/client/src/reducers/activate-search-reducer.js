import ACTIONS from "../actions/constants";

const initialState = {
  searchIsActive: true
};

const activateSearchReducer = (state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.ACTIVATE_SEARCH:
      return { searchIsActive: true };
    case ACTIONS.DEACTIVATE_SEARCH:
      return { searchIsActive: false };
    default:
      return state;
  }
};
export default activateSearchReducer;
