import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { getSearchStatus } from "../selectors/activate-search-selector";
import { setTodosAction } from "../actions/todos-action";
import { setServerErrorMessageAction } from "../actions/server-error-message";
import { setLoadedAction } from "../actions/loaded-action";
import { showAllAction } from "../actions/filter-todos-action";
import { AddTodoForm } from "../components/add-todo-form";

const mapStateToProps = (state, ownProps) => {
  const searchStatus = getSearchStatus(state);
  return { searchStatus };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  const updateTodos = ownProps.updateTodos;
  return bindActionCreators({ setTodosAction,
                              showAllAction,
                              setServerErrorMessageAction,
                              setLoadedAction,
                              updateTodos }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(AddTodoForm);
