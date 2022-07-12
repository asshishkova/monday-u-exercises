import todosReducer, {  } from "../todos-reducer";
import { setTodos, addTodos, deleteTodo, markOld } from "../../actions/todos-action";

const oldItems = [
  {id: 1, text: 'one', isNew: false},
  {id: 2, text: 'two', isNew: false},
  {id: 3, text: 'three', isNew: false}
];

const newItems = [
  {id: 4, text: 'four', isNew: true},
  {id: 5, text: 'five', isNew: true},
];

test('todosReducer should return the initial state', () => {
  expect(todosReducer(undefined, { type: undefined })).toEqual(
    { items: [] }
  )
})

test('todosReducer should set a todo list', () => {
  const previousState = { items: [] };
  expect(todosReducer(previousState, setTodos(oldItems))).toEqual(
    { items: oldItems }
  )
})

test('todosReducer should add new todos to the existing list', () => {
  const previousState = { items: [...oldItems] };
  expect(todosReducer(previousState, addTodos(newItems))).toEqual(
    { items: [...oldItems, ...newItems] }
  )
})

test('todosReducer should not add a new todo if it\'s text already exists but changes isNew to true', () => {
  const previousState = { items: [...oldItems] };
  expect(todosReducer(previousState, addTodos([{id: 1, text: 'one', isNew: false}]))).toEqual(
    { items: [
      {id: 1, text: 'one', isNew: true},
      {id: 2, text: 'two', isNew: false},
      {id: 3, text: 'three', isNew: false}
    ] }
  )
})

test('todosReducer should delete an existing todo', () => {
  const previousState = { items: [...newItems] };
  expect(todosReducer(previousState, deleteTodo({id: 4, text: 'four', isNew: true}))).toEqual(
    { items: [{id: 5, text: 'five', isNew: true}] }
  )
})

test('todosReducer should not delete anything if todo does not exist', () => {
  const previousState = { items: [...oldItems] };
  expect(todosReducer(previousState, deleteTodo({id: 6, text: 'six', isNew: false}))).toEqual(
    { items: oldItems }
  )
})

test('todosReducer should mark an old item as new', () => {
  const previousState = { items: [...newItems] };
  expect(todosReducer(previousState, markOld({id: 5, text: 'five', isNew: true}))).toEqual(
    { items: [
      {id: 4, text: 'four', isNew: true},
      {id: 5, text: 'five', isNew: false},
    ] }
  )
})

test('todosReducer should not change the list in markOld if todo is old', () => {
  const previousState = { items: [...oldItems] };
  expect(todosReducer(previousState, markOld({id: 1, text: 'one', isNew: false}))).toEqual(
    { items: oldItems }
  )
})
