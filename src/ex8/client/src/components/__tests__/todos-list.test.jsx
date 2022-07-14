import { render, screen } from "@testing-library/react";
import { TodosList } from "../todos-list";
import { Provider } from "react-redux";
import { store } from "../../store";

const todos = [
  {
    id: 56,
    text: "Take dog out for a walk",
    status: false,
    done: null,
    isNew: false
  },
  {
    id: 32,
    text: "Do the dishes",
    status: true,
    done: "2022-07-13T12:49:57.000Z",
    isNew: false
  },
];

describe("TodosList", () => {
  test("should render both items (one done and one not)", () => {
    const filterFunction = (todo) => todo;
    render(
      <Provider store={store}>
        <TodosList todos={todos} filterFunction={filterFunction} />
        {/* sfetchItems={jest.fn(() => items) */}
      </Provider>
    );

    const dogTodo = screen.getByText(`${todos[0].text}`);
    expect(dogTodo).toBeInTheDocument();
    const checkbox = screen.getAllByRole('checkbox');
    expect(checkbox[1]).not.toBeChecked()

    const dishesTodo = screen.getByText(`${todos[1].text}`);
    expect(dishesTodo).toBeInTheDocument();
    expect(checkbox[2]).toBeChecked()
  });
});
