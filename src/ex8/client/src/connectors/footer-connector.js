import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { getLastDeletedItem } from "../selectors/restore-deleted-item-selector";
import { getTodos } from "../selectors/todos-selector";
import { setServerErrorMessageAction, clearServerErrorMessageAction } from "../actions/server-error-message";
import { setTodosAction, addTodosAction } from "../actions/todos-action";
import { saveDeletedItemAction } from "../actions/restore-deleted-item-actions";
import { Footer } from "../components/footer";

const mapStateToProps = (state, ownProps) => {
  const lastDeletedItem = getLastDeletedItem(state);
  const todos = getTodos(state);
  return { lastDeletedItem, todos };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return bindActionCreators({ setServerErrorMessageAction,
                              clearServerErrorMessageAction,
                              saveDeletedItemAction,
                              setTodosAction,
                              addTodosAction,
                            }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(Footer);
