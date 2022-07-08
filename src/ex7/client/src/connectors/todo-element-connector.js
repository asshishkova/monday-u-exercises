import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { setTodosAction } from "../actions/todos-action";
import { setServerErrorMessageAction } from "../actions/server-error-message";
import { saveDeletedItemAction  } from "../actions/restore-deleted-item-actions";
import { TodoElement } from "../components/todo-element";

const mapStateToProps = (state, ownProps) => {
  const todo = ownProps.todo;
  return { todo };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  const updateTodos = ownProps.updateTodos;
  return bindActionCreators({ setTodosAction,
                              setServerErrorMessageAction,
                              saveDeletedItemAction,
                              updateTodos }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(TodoElement);
