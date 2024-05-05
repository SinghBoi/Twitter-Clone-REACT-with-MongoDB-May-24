import React, { useState, createContext } from "react";
import { render, screen } from "@testing-library/react";
import Search from "../components/Search";

const testUsers = [
  {
    id: "1",
    name: "test",
    username: "test",
  },
  {
    id: "2",
    name: "test2",
    username: "test2",
  },
];

const mockHandleSearch = jest.fn();
const MockParent = () => {
  const [searchResult] = useState({
    tweets: [],
    users: testUsers,
  });
  return <Search searchResult={searchResult} />;
};

export const AppContext = createContext();
const renderWithContext = (ui, { providerProps, ...renderOptions }) => {
  return render(
    <AppContext.Provider value={providerProps}>{ui}</AppContext.Provider>,
    renderOptions
  );
};

describe("Search", () => {
  test("renders a search bar", () => {
    render(<Search />);
    const searchBar = screen.getByRole("textbox");
    expect(searchBar).toBeInTheDocument();
  });

  // test("renders a user from search", () => {
  //   renderWithContext(<MockParent />, {
  //     providerProps: {
  //       handleSearch: mockHandleSearch,
  //     },
  //   });
  //   // testUsers.forEach((testUser) => {
  //   // const user = screen.getByText(testUser.name);
  //   // expect(user).toBeInTheDocument();
  //   // });
  // });
});
