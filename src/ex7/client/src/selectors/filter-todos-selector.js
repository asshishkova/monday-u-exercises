const filterTodos = state => state.filter;

export const getFilterFunction = state => filterTodos(state).filterFunction;
export const getFilterName = state => filterTodos(state).filterName;
