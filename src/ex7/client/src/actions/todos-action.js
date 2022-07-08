import ACTIONS from "./constants";

const setTodos = items => ({
  type: ACTIONS.SET_TODOS,
  items: items
});

const addTodos = items => ({
  type: ACTIONS.ADD_TODOS,
  items: items
});

const deleteTodo = item => ({
  type: ACTIONS.DELETE_TODO,
  item: item
});

const markOld = item => ({
  type: ACTIONS.MARK_OLD,
  item: item
});

export const setTodosAction = (items) => {
  return dispatch => {
      dispatch(setTodos(items));
  }
};

export const addTodosAction = (items) => {
  return dispatch => {
      dispatch(addTodos(items));
  }
};

export const deleteTodoAction = (item) => {
  return dispatch => {
      dispatch(deleteTodo(item));
  }
};

export const markOldAction = (item) => {
  return dispatch => {
      dispatch(markOld(item));
  }
};
