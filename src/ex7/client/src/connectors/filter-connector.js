import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { getSearchStatus } from "../selectors/activate-search-selector";
import { setServerErrorMessageAction } from "../actions/server-error-message";
import { activateSearchAction, deactivateSearchAction  } from "../actions/activate-search-actions";
import { showAllAction, showDoneAction, showPendingAction} from "../actions/filter-todos-action";
import { Filter } from "../components/filter";


const mapStateToProps = (state, ownProps) => {
  const searchStatus = getSearchStatus(state);
  return { searchStatus };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return bindActionCreators({ activateSearchAction, deactivateSearchAction,
                              showAllAction, showDoneAction, showPendingAction,
                              setServerErrorMessageAction }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(Filter);
