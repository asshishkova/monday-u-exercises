import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { setTodosAction, deleteTodoAction, addTodosAction, markOldAction } from "../actions/todos-action";
import { setServerErrorMessageAction, clearServerErrorMessageAction } from "../actions/server-error-message";
import { saveDeletedItemAction  } from "../actions/restore-deleted-item-actions";
import { TodoElement } from "../components/todo-element";

const mapStateToProps = (state, ownProps) => {
  const todo = ownProps.todo;
  return { todo };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return bindActionCreators({ setTodosAction,
                              setServerErrorMessageAction,
                              clearServerErrorMessageAction,
                              saveDeletedItemAction,
                              deleteTodoAction, addTodosAction,
                              markOldAction
                            }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(TodoElement);
