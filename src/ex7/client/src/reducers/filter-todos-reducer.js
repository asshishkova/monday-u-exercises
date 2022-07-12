import ACTIONS from "../actions/constants";

const initialState = {
  filterFunction: (todo) => todo,
  filterName: "ALL"
};

const setFilterReducer = (state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.UPDATE_FILTER:
      return  {
                filterFunction: action.filterFunction,
                filterName: action.filterName
              };
    default:
      return state;
  }
};

export default setFilterReducer;
