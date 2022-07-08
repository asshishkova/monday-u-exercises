import ACTIONS from "./constants";

const setLoaded = loaded => ({
  type: ACTIONS.SET_IS_LOADED,
  loaded: loaded
});

export const setLoadedAction = (loaded) => {
  return dispatch => {
    dispatch(setLoaded(loaded));
  }
};
