const getDeletedItem = state => state.deletedItem;

export const getLastDeletedItem = state => getDeletedItem(state).lastDeletedItem;
