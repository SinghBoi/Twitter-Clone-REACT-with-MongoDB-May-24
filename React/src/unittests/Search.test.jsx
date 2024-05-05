import React, { useState, createContext } from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter as Router } from "react-router-dom";
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

const testHashtags = ["#one", "#two", "#three"];

const mockHandleSearch = jest.fn();
const MockParent = () => {
  const [searchResult] = useState({
    tweets: [],
    users: testUsers,
    hashtags: testHashtags,
  });
  return <Search searchResult={searchResult} />;
};

export const AppContext = createContext();
const renderWithContext = (ui, { providerProps, ...renderOptions }) => {
  return render(
    <AppContext.Provider value={providerProps}>
      <Router>{ui}</Router>
    </AppContext.Provider>,
    renderOptions
  );
};

describe("Search", () => {
  test("renders a search bar", () => {
    render(<Search />);
    const searchBar = screen.getByRole("textbox");
    expect(searchBar).toBeInTheDocument();
  });

  test("renders a user from search", () => {
    renderWithContext(<MockParent />, {
      providerProps: {
        handleSearch: mockHandleSearch,
      },
    });
    testUsers.forEach((testUser) => {
      const userElement = screen.getByTestId(testUser.username);
      expect(userElement).toBeInTheDocument();
    });
  });

  test("renders a hashtag from search", () => {
    renderWithContext(<MockParent />, {
      providerProps: {
        handleSearch: mockHandleSearch,
      },
    });
    testHashtags.forEach((hashtag) => {
      const hashtagElement = screen.getByTestId(hashtag);
      expect(hashtagElement).toBeInTheDocument();
    });
  });
});
