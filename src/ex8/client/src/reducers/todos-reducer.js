import ACTIONS from "../actions/constants";

const initialState = {
  items: []
};

const todosReducer = (state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.SET_TODOS:
      return { items: action.items };
    case ACTIONS.ADD_TODOS:
      const updatedItems = state.items;
      action.items.forEach(item => {
        const updatingItemIndex = updatedItems.findIndex( oldItem => oldItem.text === item.text )
        if (updatingItemIndex > -1) {
          updatedItems[updatingItemIndex] = {...updatedItems[updatingItemIndex], isNew: true}
        } else {
          updatedItems.push(item);
        }
      });
      return { items: updatedItems.slice() };
    case ACTIONS.DELETE_TODO:
      const deletingItem = action.item;
      const itemsWithoutDeleted = state.items.filter(item => item.id !== deletingItem.id);
      return { items: itemsWithoutDeleted };
    case ACTIONS.MARK_OLD:
      const allItems = state.items;
      const oldItem = action.item;
      const oldItemIndex = allItems.findIndex( item => item.id === oldItem.id )
      allItems[oldItemIndex] = {...allItems[oldItemIndex], isNew: false}
      return { items: allItems };
    default:
      return state;
  }
};
export default todosReducer;
