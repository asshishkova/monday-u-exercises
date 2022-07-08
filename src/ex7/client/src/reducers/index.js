import { combineReducers } from "redux";
import deletedItem from "./restore-deleted-item-reducer";
import search from "./activate-search-reducer";
import filter from "./filter-todos-reducer";
import todos from "./todos-reducer";
import serverError from "./server-error-message-reducer";
import loaded from "./loaded-reducer";

const allReducers = combineReducers({
  deletedItem,
  search,
  filter,
  todos,
  serverError,
  loaded
});

export default allReducers;
