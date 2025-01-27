import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { getSearchStatus } from "../selectors/activate-search-selector";
import { getFilterName } from "../selectors/filter-todos-selector";
import { setServerErrorMessageAction } from "../actions/server-error-message";
import { updateSearchStatusAction  } from "../actions/activate-search-actions";
import { updateFilterAction  } from "../actions/filter-todos-action";
import { setTodosAction } from "../actions/todos-action";
import { Filter } from "../components/filter";

const mapStateToProps = (state, ownProps) => {
  const searchStatus = getSearchStatus(state);
  const filterName = getFilterName(state);
  return { searchStatus, filterName};
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return bindActionCreators({ updateSearchStatusAction,
                              updateFilterAction,
                              setServerErrorMessageAction,
                              setTodosAction }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(Filter);
