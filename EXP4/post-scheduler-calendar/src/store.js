import { configureStore } from "@reduxjs/toolkit";
import postsReducer from "./features/posts/postsSlice";

export function makeStore(preloadedState) {
  return configureStore({
    reducer: {
      posts: postsReducer,
    },
    preloadedState,
  });
}

const store = makeStore();

export default store;
