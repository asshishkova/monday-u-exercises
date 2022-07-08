import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { getLoaded } from "../selectors/loaded-selector";
import { getServerErrorMessage } from "../selectors/server-error-message-selector";
import { getTodos } from "../selectors/todos-selector";
import { setLoadedAction } from "../actions/loaded-action";
import { setTodosAction } from "../actions/todos-action";
import { activateSearchAction, deactivateSearchAction  } from "../actions/activate-search-actions";
import { TodosContainer } from "../components/todos-container";

const mapStateToProps = (state, ownProps) => {
  const loaded = getLoaded(state);
  const serverErrorMessage = getServerErrorMessage(state);
  const todos = getTodos(state);
  return { loaded, serverErrorMessage, todos };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return bindActionCreators({ activateSearchAction, deactivateSearchAction,
                              setTodosAction,
                              setLoadedAction}, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(TodosContainer);
