import renderer from "react-test-renderer";
import { TodoElement } from "../todo-element.js";

const pendingTodo = {id: 1, text: 'do this', status: false, done: null}
const doneTodo = {id: 2, text: 'already done this', status: true, done: "2022-07-13T12:49:57.000Z"}

test('renders correctly pending todo', () => {
  const tree = renderer.create(
    <TodoElement key={pendingTodo.id} todo={pendingTodo}/>
  ).toJSON();
  expect(tree).toMatchSnapshot();
});

test('renders correctly done todo', () => {
  const tree = renderer.create(
    <TodoElement key={doneTodo.id} todo={doneTodo}/>
  ).toJSON();
  expect(tree).toMatchSnapshot();
});
