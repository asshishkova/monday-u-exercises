import ACTIONS from "./constants";

const setTodos = items => ({
  type: ACTIONS.SET_TODOS,
  items: items
});

export const setTodosAction = (items) => {
  return dispatch => {
      dispatch(setTodos(items));
  }
};
