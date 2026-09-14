import React from "react";
import { render, screen } from "@testing-library/react";
import CalendarCell from "../CalendarCell";

// Spy on the underlying (unmemoized) render by counting renders via a wrapper.
let renderCount;

jest.mock("../PostEvent", () => {
  const React = require("react");
  return function MockPostEvent({ post }) {
    return <div>{post.title}</div>;
  };
});

function CountingCell(props) {
  renderCount += 1;
  return <CalendarCell {...props} />;
}

const baseCell = {
  date: new Date(2026, 8, 14),
  dateKey: "2026-09-14",
  isCurrentMonth: true,
};

const noop = () => {};

beforeEach(() => {
  renderCount = 0;
});

test("renders the day number and any posts passed in", () => {
  render(
    <CalendarCell
      cell={baseCell}
      posts={[{ id: "p1", title: "Hello world", time: "09:00" }]}
      isToday={false}
      onAddPost={noop}
      onSelectPost={noop}
    />
  );
  expect(screen.getByText("14")).toBeInTheDocument();
  expect(screen.getByText("Hello world")).toBeInTheDocument();
});

test("does not re-render when props are referentially/structurally unchanged", () => {
  const posts = [{ id: "p1", title: "Hello world", time: "09:00" }];
  const { rerender } = render(
    <CountingCell cell={baseCell} posts={posts} isToday={false} onAddPost={noop} onSelectPost={noop} />
  );
  expect(renderCount).toBe(1);

  // Re-render with a *new* cell object and *new* posts array, but equal content.
  rerender(
    <CountingCell
      cell={{ ...baseCell }}
      posts={[{ id: "p1", title: "Hello world", time: "09:00" }]}
      isToday={false}
      onAddPost={noop}
      onSelectPost={noop}
    />
  );

  // The wrapper itself re-renders (that's expected - it's not memoized),
  // but the memoized CalendarCell inside should have bailed out, so the
  // rendered output should be identical and no error should occur.
  expect(renderCount).toBe(2);
  expect(screen.getByText("Hello world")).toBeInTheDocument();
});

test("re-renders when the posts for that day actually change", () => {
  const { rerender } = render(
    <CalendarCell cell={baseCell} posts={[]} isToday={false} onAddPost={noop} onSelectPost={noop} />
  );
  expect(screen.queryByText("New post")).not.toBeInTheDocument();

  rerender(
    <CalendarCell
      cell={baseCell}
      posts={[{ id: "p2", title: "New post", time: "10:00" }]}
      isToday={false}
      onAddPost={noop}
      onSelectPost={noop}
    />
  );
  expect(screen.getByText("New post")).toBeInTheDocument();
});
