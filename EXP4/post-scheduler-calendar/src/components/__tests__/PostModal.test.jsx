import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PostModal from "../PostModal";

const noop = () => {};

test("renders empty fields with defaults for a brand-new post", () => {
  render(
    <PostModal dateKey="2026-09-20" existingPost={null} onSave={noop} onDelete={noop} onClose={noop} />
  );
  expect(screen.getByLabelText(/title/i)).toHaveValue("");
  expect(screen.getByLabelText(/time/i)).toHaveValue("09:00");
  expect(screen.queryByRole("button", { name: /delete/i })).not.toBeInTheDocument();
});

test("pre-fills fields when editing an existing post", () => {
  const existingPost = {
    id: "p1",
    title: "Existing title",
    content: "Some caption",
    time: "14:30",
    platform: "LinkedIn",
  };
  render(
    <PostModal
      dateKey="2026-09-20"
      existingPost={existingPost}
      onSave={noop}
      onDelete={noop}
      onClose={noop}
    />
  );
  expect(screen.getByLabelText(/title/i)).toHaveValue("Existing title");
  expect(screen.getByLabelText(/content/i)).toHaveValue("Some caption");
  expect(screen.getByLabelText(/time/i)).toHaveValue("14:30");
  expect(screen.getByRole("button", { name: /delete/i })).toBeInTheDocument();
});

test("calls onSave with form values when submitted with a title", async () => {
  const user = userEvent.setup();
  const onSave = jest.fn();
  render(
    <PostModal dateKey="2026-09-20" existingPost={null} onSave={onSave} onDelete={noop} onClose={noop} />
  );

  await user.type(screen.getByLabelText(/title/i), "New post title");
  await user.click(screen.getByRole("button", { name: /schedule post/i }));

  expect(onSave).toHaveBeenCalledWith(
    expect.objectContaining({ title: "New post title", time: "09:00", platform: "General" })
  );
});

test("blocks submission and shows an error when the title is empty", async () => {
  const user = userEvent.setup();
  const onSave = jest.fn();
  render(
    <PostModal dateKey="2026-09-20" existingPost={null} onSave={onSave} onDelete={noop} onClose={noop} />
  );

  await user.click(screen.getByRole("button", { name: /schedule post/i }));

  expect(onSave).not.toHaveBeenCalled();
  expect(screen.getByText(/title is required/i)).toBeInTheDocument();
});

test("calls onDelete with the post id when Delete is clicked", async () => {
  const user = userEvent.setup();
  const onDelete = jest.fn();
  const existingPost = { id: "p9", title: "To delete", content: "", time: "09:00", platform: "General" };
  render(
    <PostModal
      dateKey="2026-09-20"
      existingPost={existingPost}
      onSave={noop}
      onDelete={onDelete}
      onClose={noop}
    />
  );

  await user.click(screen.getByRole("button", { name: /delete/i }));
  expect(onDelete).toHaveBeenCalledWith("p9");
});

test("calls onClose when Cancel is clicked or the backdrop is clicked", async () => {
  const user = userEvent.setup();
  const onClose = jest.fn();
  const { container } = render(
    <PostModal dateKey="2026-09-20" existingPost={null} onSave={noop} onDelete={noop} onClose={onClose} />
  );

  await user.click(screen.getByRole("button", { name: /cancel/i }));
  expect(onClose).toHaveBeenCalledTimes(1);

  await user.click(container.querySelector(".modal-backdrop"));
  expect(onClose).toHaveBeenCalledTimes(2);
});
