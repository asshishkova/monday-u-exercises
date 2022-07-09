import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { getSearchStatus } from "../selectors/activate-search-selector";
import { getFilterFunction, getFilterName } from "../selectors/filter-todos-selector";
import { setServerErrorMessageAction } from "../actions/server-error-message";
import { updateSearchStatusAction  } from "../actions/activate-search-actions";
import { showAllAction, showDoneAction, showPendingAction} from "../actions/filter-todos-action";
import { Filter } from "../components/filter";


const mapStateToProps = (state, ownProps) => {
  const searchStatus = getSearchStatus(state);
  const filterFunction = getFilterFunction(state);
  const filterName = getFilterName(state);
  return { searchStatus, filterFunction, filterName};
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return bindActionCreators({ updateSearchStatusAction,
                              showAllAction, showDoneAction, showPendingAction,
                              setServerErrorMessageAction }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(Filter);
