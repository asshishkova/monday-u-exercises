const ACTIONS = {

  // Restore deleted item types
  SAVE_DELETED: "SAVE_DELETED",
  RESTORE_DELETED: "RESTORE_DELETED",

  // Activate and deactivate search
  UPDATE_SEARCH_STATUS: "UPDATE_SEARCH_STATUS",

  // Show todos
  SHOW_ALL: "SHOW_ALL",
  SHOW_PENDING: "SHOW_PENDING",
  SHOW_DONE: "SHOW_DONE",

  // Set todos
  SET_TODOS: "SET_TODOS",
  ADD_TODOS: "ADD_TODOS",
  DELETE_TODO: "DELETE_TODO",
  MARK_OLD: "MARK_OLD",

  // Set error message
  SET_SERVER_ERROR_MESSAGE: "SET_SERVER_ERROR_MESSAGE",

  // Loaded
  SET_IS_LOADED: "SET_IS_LOADED"
};

export default ACTIONS;
