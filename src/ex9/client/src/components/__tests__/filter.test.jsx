import renderer from "react-test-renderer";
import { FilterBar } from "../filter.js";


test('renders correctly `pending` filter with activated search', () => {
  const tree = renderer.create(
    <FilterBar searchStatus={true} filterName={"PENDING"}/>
  ).toJSON();
  expect(tree).toMatchSnapshot();
});

test('renders correctly `done` filter with deactivated search', () => {
  const tree = renderer.create(
    <FilterBar searchStatus={false} filterName={"DONE"}/>
  ).toJSON();
  expect(tree).toMatchSnapshot();
});
