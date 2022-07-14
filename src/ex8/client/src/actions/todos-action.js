import ACTIONS from "./constants";
import { getItems, getItemsWhere, clearAllItems, createItem, restoreItem } from "../item-client.js";

export const setAllTodos = items => ({
  type: ACTIONS.SET_ALL_TODOS,
  items: items
});

export const setTodosWhere = items => ({
  type: ACTIONS.SET_TODOS_WHERE,
  items: items
});

export const clearTodos = () => ({
  type: ACTIONS.CLEAR_TODOS,
  items: []
});

export const addTodos = items => ({
  type: ACTIONS.ADD_TODOS,
  items: items
});

export const deleteTodo = item => ({
  type: ACTIONS.DELETE_TODO,
  item: item
});

export const markOld = item => ({
  type: ACTIONS.MARK_OLD,
  item: item
});

export const restoreTodo = item => ({
  type: ACTIONS.RESTORE_TODO,
  item: item
});

export const clearTodosAction = () => {
  return async dispatch => {
    await clearAllItems();
    dispatch(clearTodos());
  }
};

export const setAllTodosAction = () => {
  return async dispatch => {
    const items = await getItems();
    dispatch(setAllTodos(items));
  }
};

export const setTodosWhereAction = (text) => {
  return async dispatch => {
    const items = await getItemsWhere(text);
    dispatch(setTodosWhere(items));
  }
};

export const addTodosAction = (text) => {
  return async dispatch => {
    const newTodos = await createItem(text);
    dispatch(addTodos(newTodos));
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

export const restoreTodoAction = (item) => {
  return async dispatch => {
    await restoreItem(item);
    dispatch(restoreTodo(item));
  }
};
