import { render } from "@testing-library/react";
import { TodosContainer } from "../todos-container";
import { Provider } from "react-redux";
import { store } from "../../store";

describe("TodosContainer", () => {
  test("should call setAllTodosAction once", () => {
    const mockSetAllTodosAction = jest.fn(() => {});
    const mockSetServerErrorMessageAction = jest.fn(() => "Error!");
    const mockClearServerErrorMessageAction = jest.fn(() => "");
    const mockSetLoadedAction = jest.fn((value) => {});

    render(
      <Provider store={store}>
        <TodosContainer
            setAllTodosAction={mockSetAllTodosAction}
            loaded={true}
            serverErrorMessage={""}
            setServerErrorMessageAction={mockSetServerErrorMessageAction}
            clearServerErrorMessageAction={mockClearServerErrorMessageAction}
            setLoadedAction={mockSetLoadedAction}
        />
      </Provider>
    );

    expect(mockSetAllTodosAction).toHaveBeenCalledTimes(1);
  });
});
