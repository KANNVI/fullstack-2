import React from "react";
import { screen, within, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Calendar from "../Calendar";
import { renderWithStore } from "../../test-utils";
import { MONTH_LABELS } from "../../utils/dateUtils";

// Tests run against whatever "today" actually is when the suite executes,
// deriving the expected labels from the real current date, rather than
// mocking the system clock, so the suite stays correct on any run date.
const now = new Date();

function monthLabelFor(date) {
  return `${MONTH_LABELS[date.getMonth()]} ${date.getFullYear()}`;
}

const currentMonthLabel = monthLabelFor(now);
const nextMonthDate = new Date(now.getFullYear(), now.getMonth() + 1, 1);
const oneMonthAgoDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);

/** Finds today's day cell by its accessible name, which embeds date.toDateString(). */
function getTodayCell() {
  return screen.getByRole("button", {
    name: (accessibleName) => accessibleName.includes(now.toDateString()),
  });
}

test("renders the current month and year in the toolbar", () => {
  renderWithStore(<Calendar />);
  expect(screen.getByRole("heading", { name: currentMonthLabel })).toBeInTheDocument();
});

test("navigates to the next and previous month", async () => {
  const user = userEvent.setup();
  renderWithStore(<Calendar />);

  await user.click(screen.getByRole("button", { name: /next/i }));
  expect(screen.getByRole("heading", { name: monthLabelFor(nextMonthDate) })).toBeInTheDocument();

  await user.click(screen.getByRole("button", { name: /prev/i }));
  await user.click(screen.getByRole("button", { name: /prev/i }));
  expect(screen.getByRole("heading", { name: monthLabelFor(oneMonthAgoDate) })).toBeInTheDocument();
});

test("'Today' button returns to the current month after navigating away", async () => {
  const user = userEvent.setup();
  renderWithStore(<Calendar />);

  await user.click(screen.getByRole("button", { name: /next/i }));
  await user.click(screen.getByRole("button", { name: /today/i }));
  expect(screen.getByRole("heading", { name: currentMonthLabel })).toBeInTheDocument();
});

test("clicking a day cell opens the schedule-post modal, and saving adds an event to that cell", async () => {
  const user = userEvent.setup();
  renderWithStore(<Calendar />);

  const cell = getTodayCell();
  fireEvent.click(cell);

  expect(screen.getByRole("dialog")).toBeInTheDocument();

  await user.type(screen.getByLabelText(/title/i), "Product launch teaser");
  await user.click(screen.getByRole("button", { name: /schedule post/i }));

  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  expect(within(cell).getByText("Product launch teaser")).toBeInTheDocument();
});

test("clicking an existing post opens it pre-filled for editing, and saving updates it in place", async () => {
  const user = userEvent.setup();
  renderWithStore(<Calendar />);

  const cell = getTodayCell();
  fireEvent.click(cell);
  await user.type(screen.getByLabelText(/title/i), "Draft title");
  await user.click(screen.getByRole("button", { name: /schedule post/i }));

  await user.click(within(cell).getByText("Draft title"));
  const titleInput = screen.getByLabelText(/title/i);
  expect(titleInput).toHaveValue("Draft title");

  await user.clear(titleInput);
  await user.type(titleInput, "Final title");
  await user.click(screen.getByRole("button", { name: /save changes/i }));

  expect(within(cell).getByText("Final title")).toBeInTheDocument();
  expect(within(cell).queryByText("Draft title")).not.toBeInTheDocument();
});

test("deleting a post removes it from the cell", async () => {
  const user = userEvent.setup();
  renderWithStore(<Calendar />);

  const cell = getTodayCell();
  fireEvent.click(cell);
  await user.type(screen.getByLabelText(/title/i), "To be deleted");
  await user.click(screen.getByRole("button", { name: /schedule post/i }));

  await user.click(within(cell).getByText("To be deleted"));
  await user.click(screen.getByRole("button", { name: "Delete" }));

  expect(within(cell).queryByText("To be deleted")).not.toBeInTheDocument();
});

test("shows a validation error and keeps the modal open when saving without a title", async () => {
  const user = userEvent.setup();
  renderWithStore(<Calendar />);

  const cell = getTodayCell();
  fireEvent.click(cell);
  await user.click(screen.getByRole("button", { name: /schedule post/i }));

  expect(screen.getByText(/title is required/i)).toBeInTheDocument();
  expect(screen.getByRole("dialog")).toBeInTheDocument();
});
