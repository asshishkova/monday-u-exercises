import ACTIONS from "./constants";

const saveDeletedItem = item => ({
  type: ACTIONS.SAVE_DELETED,
  item: item
});

export const saveDeletedItemAction = (item) => {
  return dispatch => {
    dispatch(saveDeletedItem(item));
  }
};
