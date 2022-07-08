import ACTIONS from "../actions/constants";

const initialState = {
  items: []
};

const todosReducer = (state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.SET_TODOS:
      return { items: action.items };
    case ACTIONS.ADD_TODOS:
      const newItems = state.items;
      action.items.forEach(item => {
        const updatingItemIndex = newItems.findIndex( oldItem => oldItem.text === item.text )
        if (updatingItemIndex > -1) {
          newItems[updatingItemIndex] = {...newItems[updatingItemIndex], isNew: true}
        } else {
          newItems.push(item);
        }
      });
      return { items: newItems.slice() };
    case ACTIONS.DELETE_TODO:
      const deletingItem = action.item;
      const updatedItems = state.items.filter(item => item.id !== deletingItem.id);
      return { items: updatedItems };
    default:
      return state;
  }
};
export default todosReducer;
