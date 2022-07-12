import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { getLoaded } from "../selectors/loaded-selector";
import { getServerErrorMessage } from "../selectors/server-error-message-selector";
import { setLoadedAction } from "../actions/loaded-action";
import { setTodosAction } from "../actions/todos-action";
import { setServerErrorMessageAction } from "../actions/server-error-message";
import { TodosContainer } from "../components/todos-container";

const mapStateToProps = (state, ownProps) => {
  const loaded = getLoaded(state);
  const serverErrorMessage = getServerErrorMessage(state);
  return { loaded, serverErrorMessage };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return bindActionCreators({ setTodosAction,
                              setLoadedAction,
                              setServerErrorMessageAction}, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(TodosContainer);
