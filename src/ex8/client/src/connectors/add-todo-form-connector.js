import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { getSearchStatus } from "../selectors/activate-search-selector";
import { setTodosWhereAction, addTodosAction } from "../actions/todos-action";
import { setServerErrorMessageAction, clearServerErrorMessageAction } from "../actions/server-error-message";
import { setLoadedAction } from "../actions/loaded-action";
import { AddTodoForm } from "../components/add-todo-form";

const mapStateToProps = (state, ownProps) => {
  const searchStatus = getSearchStatus(state);
  return { searchStatus };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return bindActionCreators({ setTodosWhereAction,
                              addTodosAction,
                              setServerErrorMessageAction,
                              clearServerErrorMessageAction,
                              setLoadedAction,
                            }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(AddTodoForm);
