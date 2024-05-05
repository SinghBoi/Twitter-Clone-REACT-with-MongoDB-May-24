import React from "react";
import { render, screen } from "@testing-library/react";
import Hashtags from "../components/Hashtags";

describe("<Hashtags />", () => {
  test("It renders hashtags", () => {
    const hashtags = ["#one", "#two", "#three"];
    render(<Hashtags hashtags={hashtags} />);

    // Check that the UL is rendered
    const list = screen.getByRole("list");
    expect(list).toBeInTheDocument();

    // Check that each hashtag is rendered
    hashtags.forEach((hashtag) => {
      const item = screen.getByText(hashtag);
      expect(item).toBeInTheDocument();
    });
  });

  test("Check what happens with a empty array", () => {
    render(<Hashtags hashtags={[]} />);

    const list = screen.queryAllByRole("listitem");
    expect(list).toHaveLength(0);
  });
});
