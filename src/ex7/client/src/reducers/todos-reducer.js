import ACTIONS from "../actions/constants";

const initialState = {
  items: []
};

const setTodosReducer = (state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.SET_TODOS:
      return { items: action.items };
    default:
      return state;
  }
};
export default setTodosReducer;
