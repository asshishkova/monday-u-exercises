const todos = state => state.todos;

export const getTodos = state => todos(state).items;
