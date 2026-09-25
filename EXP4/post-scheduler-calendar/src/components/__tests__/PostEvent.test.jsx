import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import PostEvent from "../PostEvent";

test("displays the post's time and title", () => {
  render(<PostEvent post={{ id: "p1", title: "Weekly newsletter", time: "08:15" }} onSelect={() => {}} />);
  expect(screen.getByText("08:15")).toBeInTheDocument();
  expect(screen.getByText("Weekly newsletter")).toBeInTheDocument();
});

test("calls onSelect with the post id when clicked, without bubbling to a parent handler", () => {
  const onSelect = jest.fn();
  const onParentClick = jest.fn();

  render(
    <div onClick={onParentClick}>
      <PostEvent post={{ id: "p42", title: "Announcement", time: "12:00" }} onSelect={onSelect} />
    </div>
  );

  fireEvent.click(screen.getByText("Announcement"));

  expect(onSelect).toHaveBeenCalledWith("p42");
  expect(onParentClick).not.toHaveBeenCalled();
});
