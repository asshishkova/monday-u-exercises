import ACTIONS from "../actions/constants";

const initialState = {
  loaded: false
};

const setLoaded = (state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.SET_IS_LOADED:
      return { loaded: action.loaded };
    default:
      return state;
  }
};
export default setLoaded;
