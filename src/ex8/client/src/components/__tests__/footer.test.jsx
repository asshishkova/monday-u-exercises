import renderer from "react-test-renderer";
import { Footer } from "../footer.js";

const todos = [
  {id: 1, text: 'one', status: false, done: null},
  {id: 2, text: 'two', status: true, done: "2022-07-13T12:49:57.000Z"},
  {id: 3, text: 'three', status: false, done: null}
]

const lastDeletedItem = {id: 4, text: 'four', status: false, done: null};

test('renders correctly amount info of todos without last deleted item', () => {
  const tree = renderer.create(
    <Footer lastDeletedItem={null} todos={todos}/>
  ).toJSON();
  expect(tree).toMatchSnapshot();
});

test('renders correctly amount info of todos with last deleted item', () => {
  const tree = renderer.create(
    <Footer lastDeletedItem={lastDeletedItem} todos={todos}/>
  ).toJSON();
  expect(tree).toMatchSnapshot();
});
