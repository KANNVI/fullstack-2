import React, { memo } from "react";

/**
 * Renders a single scheduled post as a small pill inside a calendar cell.
 *
 * Wrapped in React.memo: in a month grid there can be dozens of these
 * rendered at once, and a click on a single post (opening the edit modal)
 * or an edit to a single post should not force every other PostEvent in
 * every other cell to re-render. Because onSelect is passed down as a
 * useCallback from the parent (see Calendar.jsx), the props reference here
 * stays stable across unrelated re-renders, so memo actually pays off.
 */
function PostEvent({ post, onSelect }) {
  return (
    <button
      type="button"
      className="post-event"
      title={`${post.time} · ${post.title}`}
      onClick={(e) => {
        e.stopPropagation(); // don't also trigger the cell's "add post" click
        onSelect(post.id);
      }}
    >
      <span className="post-event-time">{post.time}</span>
      <span className="post-event-title">{post.title}</span>
    </button>
  );
}

export default memo(PostEvent);
