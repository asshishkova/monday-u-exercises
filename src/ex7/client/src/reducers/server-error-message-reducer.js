import ACTIONS from "../actions/constants";

const initialState = {
  message: ""
};

const setServerErrorMessage = (state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.SET_SERVER_ERROR_MESSAGE:
      return { message: action.message };
    default:
      return state;
  }
};
export default setServerErrorMessage;
