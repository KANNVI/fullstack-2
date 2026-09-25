import React, { memo } from "react";
import PostEvent from "./PostEvent";

const MAX_VISIBLE_POSTS = 3;

/**
 * Renders one day cell of the month grid.
 *
 * Wrapped in React.memo with a custom comparator: `cell` and `today` are
 * plain objects/Dates re-created on every Calendar render, so a naive
 * shallow-prop-compare from memo would never skip a re-render. Instead we
 * compare the values that actually matter (the date key, whether it's in
 * the current month, and the specific posts scheduled on this day) so a
 * cell only re-renders when its own content changed - not when a post on
 * a *different* day is added, edited, or removed.
 */
function CalendarCell({ cell, posts, isToday, onAddPost, onSelectPost }) {
  const { dateKey, date, isCurrentMonth } = cell;
  const visiblePosts = posts.slice(0, MAX_VISIBLE_POSTS);
  const overflowCount = posts.length - visiblePosts.length;

  return (
    <div
      className={[
        "calendar-cell",
        isCurrentMonth ? "" : "calendar-cell--muted",
        isToday ? "calendar-cell--today" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      onClick={() => onAddPost(dateKey)}
      role="button"
      tabIndex={0}
      aria-label={`Schedule a post on ${date.toDateString()}`}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onAddPost(dateKey);
      }}
    >
      <div className="calendar-cell-header">
        <span className="calendar-cell-daynum">{date.getDate()}</span>
      </div>

      <div className="calendar-cell-events">
        {visiblePosts.map((post) => (
          <PostEvent key={post.id} post={post} onSelect={onSelectPost} />
        ))}
        {overflowCount > 0 && (
          <div className="post-event post-event--overflow">+{overflowCount} more</div>
        )}
      </div>
    </div>
  );
}

function areEqual(prevProps, nextProps) {
  if (prevProps.cell.dateKey !== nextProps.cell.dateKey) return false;
  if (prevProps.cell.isCurrentMonth !== nextProps.cell.isCurrentMonth) return false;
  if (prevProps.isToday !== nextProps.isToday) return false;
  if (prevProps.onAddPost !== nextProps.onAddPost) return false;
  if (prevProps.onSelectPost !== nextProps.onSelectPost) return false;

  const prevPosts = prevProps.posts;
  const nextPosts = nextProps.posts;
  if (prevPosts.length !== nextPosts.length) return false;
  for (let i = 0; i < prevPosts.length; i++) {
    const a = prevPosts[i];
    const b = nextPosts[i];
    if (a.id !== b.id || a.title !== b.title || a.time !== b.time) return false;
  }
  return true;
}

export default memo(CalendarCell, areEqual);
