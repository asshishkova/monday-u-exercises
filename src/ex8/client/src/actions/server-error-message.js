import ACTIONS from "./constants";

const setServerErrorMessage = message => ({
  type: ACTIONS.SET_SERVER_ERROR_MESSAGE,
  message: message
});

export const setServerErrorMessageAction = (message) => {
  return dispatch => {
    dispatch(setServerErrorMessage(message));
  }
};
