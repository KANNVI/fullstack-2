import { configureStore } from "@reduxjs/toolkit";
import postsReducer from "../features/posts/postsSlice";
import platformsReducer from "../features/platforms/platformsSlice";
import counterReducer from "../features/counter/counterSlice";

export const store = configureStore({
  reducer: {
    posts: postsReducer,
    platforms: platformsReducer,
    counter: counterReducer,
  },
});

// Resulting normalized global state shape:
// {
//   posts: {
//     ids: ["p1", "p2", "p3"],
//     entities: { p1: {...}, p2: {...}, p3: {...} },
//     status: "idle" | "loading" | "succeeded" | "failed",
//     error: null
//   },
//   platforms: {
//     ids: ["pl1", "pl2", "pl3"],
//     entities: { pl1: {...}, pl2: {...}, pl3: {...} }
//   }
// }
