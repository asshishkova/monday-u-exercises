import ACTIONS from "../actions/constants";

const noFilter = (todo) => todo;
const pendingFilter = (todo) => todo.status === false;
const doneFilter = (todo) => todo.status === true;

const initialState = {
  filterFunction: noFilter,
};

const setFilterReducer = (state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.SHOW_ALL:
      return { filterFunction: noFilter };
    case ACTIONS.SHOW_PENDING:
      return { filterFunction: pendingFilter };
    case ACTIONS.SHOW_DONE:
      return { filterFunction: doneFilter };
    default:
      return state;
  }
};

export default setFilterReducer;
