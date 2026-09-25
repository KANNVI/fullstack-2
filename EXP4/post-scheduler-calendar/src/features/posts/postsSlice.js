import { createSlice, createSelector, nanoid } from "@reduxjs/toolkit";

const initialState = {
  // Normalized by id for O(1) lookups/updates.
  byId: {},
  allIds: [],
};

const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    postAdded: {
      reducer(state, action) {
        const post = action.payload;
        state.byId[post.id] = post;
        state.allIds.push(post.id);
      },
      prepare({ title, content, dateKey, time, platform }) {
        return {
          payload: {
            id: nanoid(),
            title,
            content: content || "",
            dateKey, // 'YYYY-MM-DD'
            time: time || "09:00",
            platform: platform || "General",
            createdAt: Date.now(),
          },
        };
      },
    },
    postUpdated(state, action) {
      const { id, changes } = action.payload;
      if (state.byId[id]) {
        state.byId[id] = { ...state.byId[id], ...changes };
      }
    },
    postMoved(state, action) {
      // Used for drag-and-drop style rescheduling to a new date/time.
      const { id, dateKey, time } = action.payload;
      if (state.byId[id]) {
        state.byId[id].dateKey = dateKey;
        if (time) state.byId[id].time = time;
      }
    },
    postDeleted(state, action) {
      const id = action.payload;
      delete state.byId[id];
      state.allIds = state.allIds.filter((existingId) => existingId !== id);
    },
  },
});

export const { postAdded, postUpdated, postMoved, postDeleted } = postsSlice.actions;

export default postsSlice.reducer;

// --- Selectors ---

export const selectAllPosts = (state) => state.posts.allIds.map((id) => state.posts.byId[id]);

export const selectPostById = (state, id) => state.posts.byId[id];

const selectAllIds = (state) => state.posts.allIds;
const selectById = (state) => state.posts.byId;

/**
 * Groups all posts by their dateKey. Built with createSelector (reselect,
 * bundled with Redux Toolkit) so the grouped object is only recomputed when
 * `allIds` or `byId` actually change reference - e.g. a post is added,
 * edited, or removed - rather than on every single render of a connected
 * component. This is what lets CalendarCell's memoization further downstream
 * be effective: unrelated re-renders (e.g. changing the modal's local state)
 * don't produce a brand-new `postsByDate` object each time.
 */
export const selectPostsGroupedByDate = createSelector(
  [selectAllIds, selectById],
  (allIds, byId) => {
    const grouped = {};
    for (const id of allIds) {
      const post = byId[id];
      if (!grouped[post.dateKey]) grouped[post.dateKey] = [];
      grouped[post.dateKey].push(post);
    }
    return grouped;
  }
);
