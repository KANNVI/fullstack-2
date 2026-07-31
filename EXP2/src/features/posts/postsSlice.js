import {
  createSlice,
  createEntityAdapter,
  createAsyncThunk,
  nanoid,
} from "@reduxjs/toolkit";
import { fetchPostsAPI, createPostAPI, deletePostAPI } from "./postsAPI";

// createEntityAdapter normalizes the posts collection into:
//   { ids: ["p1", "p2", ...], entities: { p1: {...}, p2: {...} } }
// instead of a raw array — this gives O(1) lookups by id and avoids
// duplicated/nested post objects scattered across the state tree.
const postsAdapter = createEntityAdapter({
  selectId: (post) => post.id,
  sortComparer: (a, b) => b.createdAt.localeCompare(a.createdAt),
});

const initialState = postsAdapter.getInitialState({
  status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
});

// ---- Async thunks (simulated API integration) ----
export const fetchPosts = createAsyncThunk("posts/fetchPosts", async () => {
  return await fetchPostsAPI();
});

export const addNewPost = createAsyncThunk(
  "posts/addNewPost",
  async ({ title, content, platformId, isDraft }) => {
    const newPost = {
      id: nanoid(),
      title,
      content,
      platformId,
      isDraft: !!isDraft,
      createdAt: new Date().toISOString(),
    };
    return await createPostAPI(newPost);
  }
);

export const removePost = createAsyncThunk(
  "posts/removePost",
  async (id) => {
    await deletePostAPI(id);
    return id;
  }
);

const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    // Synchronous CRUD reducers using adapter helper functions
    postUpdated: postsAdapter.updateOne,
    postSavedAsDraft(state, action) {
      const { id, changes } = action.payload;
      postsAdapter.updateOne(state, {
        id,
        changes: { ...changes, isDraft: true },
      });
    },
    postPublished(state, action) {
      postsAdapter.updateOne(state, {
        id: action.payload,
        changes: { isDraft: false },
      });
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.status = "succeeded";
        postsAdapter.setAll(state, action.payload);
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(addNewPost.fulfilled, (state, action) => {
        postsAdapter.addOne(state, action.payload);
      })
      .addCase(removePost.fulfilled, (state, action) => {
        postsAdapter.removeOne(state, action.payload);
      });
  },
});

export const { postUpdated, postSavedAsDraft, postPublished } =
  postsSlice.actions;

// Adapter-generated selectors: selectAll, selectById, selectIds, etc.
export const postsSelectors = postsAdapter.getSelectors(
  (state) => state.posts
);

export const selectPostsStatus = (state) => state.posts.status;
export const selectPostsError = (state) => state.posts.error;

export default postsSlice.reducer;
