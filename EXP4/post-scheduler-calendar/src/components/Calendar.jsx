import React, { useCallback, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CalendarCell from "./CalendarCell";
import PostModal from "./PostModal";
import {
  postAdded,
  postUpdated,
  postDeleted,
  selectPostsGroupedByDate,
} from "../features/posts/postsSlice";
import { buildMonthGrid, WEEKDAY_LABELS, MONTH_LABELS, toDateKey } from "../utils/dateUtils";

export default function Calendar() {
  const dispatch = useDispatch();

  const today = useMemo(() => new Date(), []);
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  // { dateKey } for "add new post on this day" or { post } for "edit this post"
  const [modalState, setModalState] = useState(null);

  // selectPostsGroupedByDate is a reselect-memoized selector (see
  // postsSlice.js): it only recomputes when posts are actually added,
  // edited, or removed, so this returns the *same* object reference across
  // renders caused by unrelated state changes (e.g. navigating months or
  // opening the modal). That stability is what lets CalendarCell's memo
  // comparator skip re-rendering cells whose posts haven't changed.
  const postsByDate = useSelector(selectPostsGroupedByDate);

  // The grid only depends on the viewed year/month, not on posts, so it is
  // memoized separately - navigating months doesn't recompute it either
  // unless year/month actually changed.
  const monthGrid = useMemo(() => buildMonthGrid(viewYear, viewMonth), [viewYear, viewMonth]);

  const todayKey = useMemo(() => toDateKey(today), [today]);

  const goToPreviousMonth = useCallback(() => {
    setViewMonth((m) => {
      if (m === 0) {
        setViewYear((y) => y - 1);
        return 11;
      }
      return m - 1;
    });
  }, []);

  const goToNextMonth = useCallback(() => {
    setViewMonth((m) => {
      if (m === 11) {
        setViewYear((y) => y + 1);
        return 0;
      }
      return m + 1;
    });
  }, []);

  const goToToday = useCallback(() => {
    setViewYear(today.getFullYear());
    setViewMonth(today.getMonth());
  }, [today]);

  // Stable across renders (empty dep arrays / dispatch is stable from
  // react-redux) so CalendarCell/PostEvent's memoization isn't defeated by
  // a freshly-allocated callback on every Calendar render.
  const handleAddPost = useCallback((dateKey) => {
    setModalState({ dateKey, post: null });
  }, []);

  const handleSelectPost = useCallback(
    (postId) => {
      // Find the post from the grouped map to avoid a second selector/store read.
      for (const dateKey of Object.keys(postsByDate)) {
        const found = postsByDate[dateKey].find((p) => p.id === postId);
        if (found) {
          setModalState({ dateKey, post: found });
          return;
        }
      }
    },
    [postsByDate]
  );

  const closeModal = useCallback(() => setModalState(null), []);

  const handleSave = useCallback(
    (formValues) => {
      if (!modalState) return;
      if (modalState.post) {
        dispatch(postUpdated({ id: modalState.post.id, changes: formValues }));
      } else {
        dispatch(postAdded({ ...formValues, dateKey: modalState.dateKey }));
      }
      setModalState(null);
    },
    [dispatch, modalState]
  );

  const handleDelete = useCallback(
    (postId) => {
      dispatch(postDeleted(postId));
      setModalState(null);
    },
    [dispatch]
  );

  return (
    <div className="calendar">
      <header className="calendar-toolbar">
        <div className="calendar-toolbar-title">
          <h1>
            {MONTH_LABELS[viewMonth]} {viewYear}
          </h1>
        </div>
        <div className="calendar-toolbar-actions">
          <button className="btn" onClick={goToPreviousMonth} aria-label="Previous month">
            ‹ Prev
          </button>
          <button className="btn" onClick={goToToday}>
            Today
          </button>
          <button className="btn" onClick={goToNextMonth} aria-label="Next month">
            Next ›
          </button>
        </div>
      </header>

      <div className="calendar-weekday-row">
        {WEEKDAY_LABELS.map((label) => (
          <div key={label} className="calendar-weekday-label">
            {label}
          </div>
        ))}
      </div>

      <div className="calendar-grid">
        {monthGrid.map((cell) => (
          <CalendarCell
            key={cell.dateKey}
            cell={cell}
            posts={postsByDate[cell.dateKey] || []}
            isToday={cell.dateKey === todayKey}
            onAddPost={handleAddPost}
            onSelectPost={handleSelectPost}
          />
        ))}
      </div>

      {modalState && (
        <PostModal
          dateKey={modalState.dateKey}
          existingPost={modalState.post}
          onSave={handleSave}
          onDelete={handleDelete}
          onClose={closeModal}
        />
      )}
    </div>
  );
}
