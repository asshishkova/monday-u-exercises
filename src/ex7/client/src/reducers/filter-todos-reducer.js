import ACTIONS from "../actions/constants";

const noFilter = (todo) => todo;
const pendingFilter = (todo) => todo.status === false;
const doneFilter = (todo) => todo.status === true;

const initialState = {
  filter: noFilter
};

const setFilterReducer = (state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.SHOW_ALL:
      return { filter: noFilter};
    case ACTIONS.SHOW_PENDING:
      return { filter: pendingFilter };
    case ACTIONS.SHOW_DONE:
      return { filter: doneFilter};
    default:
      return state;
  }
};
export default setFilterReducer;
