import ACTIONS from "./constants";

const showAll = () => ({
  type: ACTIONS.SHOW_ALL,
});

const showPending = () => ({
  type: ACTIONS.SHOW_PENDING,
});

const showDone = () => ({
  type: ACTIONS.SHOW_DONE,
});

export const showAllAction = () => {
  return dispatch => {
    dispatch(showAll());
  }
};

export const showPendingAction = () => {
  return dispatch => {
      dispatch(showPending());
  }
};

export const showDoneAction = () => {
  return dispatch => {
      dispatch(showDone());
  }
};
