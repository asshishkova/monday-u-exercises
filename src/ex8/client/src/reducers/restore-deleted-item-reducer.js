import ACTIONS from "../actions/constants";

const initialState = {
  lastDeletedItem: null
};

const restoreDeletedItemReducer = (state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.SAVE_DELETED:
      return { lastDeletedItem: action.item };
    case ACTIONS.RESTORE_DELETED:
      return { lastDeletedItem: null};
    default:
      return state;
  }
};
export default restoreDeletedItemReducer;
