import renderer from "react-test-renderer";
import { Filter } from "../filter.js";


test('renders correctly `pending` filter with activated search', () => {
  const tree = renderer.create(
    <Filter searchStatus={true} filterName={"PENDING"}/>
  ).toJSON();
  expect(tree).toMatchSnapshot();
});

test('renders correctly `done` filter with deactivated search', () => {
  const tree = renderer.create(
    <Filter searchStatus={false} filterName={"DONE"}/>
  ).toJSON();
  expect(tree).toMatchSnapshot();
});
