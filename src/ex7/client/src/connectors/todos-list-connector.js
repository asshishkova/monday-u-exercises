import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { getLoaded } from "../selectors/loaded-selector";
import { getTodos } from "../selectors/todos-selector";
import { getFilterFunction } from "../selectors/filter-todos-selector";
import { TodosList } from "../components/todos-list";

const mapStateToProps = (state, ownProps) => {
  const loaded = getLoaded(state);
  const todos = getTodos(state);
  const filterFunction = getFilterFunction(state);
  return { loaded, todos, filterFunction };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return bindActionCreators({ }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(TodosList);
