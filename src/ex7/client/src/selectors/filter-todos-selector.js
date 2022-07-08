const filterTodos = state => state.filter;

export const getFilter = state => filterTodos(state).filter;
