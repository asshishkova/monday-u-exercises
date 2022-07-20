import ACTIONS from "./constants";

const setServerErrorMessage = message => ({
  type: ACTIONS.SET_SERVER_ERROR_MESSAGE,
  message: message
});

const clearServerErrorMessage = () => ({
  type: ACTIONS.SET_SERVER_ERROR_MESSAGE,
  message: ""
});

export const setServerErrorMessageAction = (message) => {
  return dispatch => {
    dispatch(setServerErrorMessage(message));
  }
};

export const clearServerErrorMessageAction = () => {
  return dispatch => {
    dispatch(clearServerErrorMessage());
  }
};
