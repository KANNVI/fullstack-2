# Experiment: Centralized State Management with Redux Toolkit

Implementation of a Redux Toolkit store for managing **posts**, **platforms**,
and **drafts**, satisfying the objectives of the experiment: global state,
normalized state structure, and async data flow via a mock API.

## How to run

```bash
npm install
npm start
```

Opens at `http://localhost:3000`. You can:
- Add a post (as **Draft** or **Published**) against a platform
- Publish a saved draft
- Delete a post
- Toggle a platform active/inactive

Posts are loaded on mount via an async thunk (`fetchPosts`) that simulates a
network call with a 600ms delay, then falls into `succeeded`/`failed` status —
demonstrating the async data flow objective.

## Project structure

```
src/
  app/
    store.js              # configureStore() — combines posts + platforms + counter reducers
  features/
    posts/
      postsSlice.js        # createSlice + createEntityAdapter + async thunks
      postsAPI.js           # mock API (simulated network latency)
    platforms/
      platformsSlice.js     # createSlice + createEntityAdapter
    counter/
      counterSlice.js        # createSlice — increment/decrement/reset (basic RTK pattern)
  components/
    PostForm.js             # dispatches addNewPost thunk
    PostList.js              # useSelector + useDispatch, CRUD actions
    PlatformList.js          # toggles platform.isActive
    Counter.js                # increment/decrement/reset/add-amount buttons
  App.js
  index.js                   # <Provider store={store}>
```

## Counter slice (basic Redux Toolkit pattern)

A minimal `counterSlice` is included to demonstrate the simplest possible
`createSlice` usage — no entity adapter, no async thunk, just direct state
mutation (safe because Redux Toolkit uses Immer under the hood):

```js
reducers: {
  incremented(state) { state.value += 1; },
  decremented(state) { state.value -= 1; },
  incrementedByAmount(state, action) { state.value += action.payload; },
  reset(state) { state.value = 0; },
}
```

UI: `+` / `-` buttons, a **Reset** button, and an "Add Amount" input that
dispatches `incrementedByAmount(amount)` — useful for showing action
payloads in Redux DevTools.

## State normalization

Both slices use `createEntityAdapter`, which stores collections as:

```js
{
  ids: ["p1", "p2", "p3"],
  entities: {
    p1: { id: "p1", title: "...", platformId: "pl1", isDraft: false, ... },
    p2: { ... },
    p3: { ... }
  }
}
```

instead of a plain array. Benefits demonstrated here:
- **O(1) lookup** by id (`state.posts.entities[id]`) instead of `array.find()`
- **No duplication**: a post stores only `platformId` (a foreign-key-style
  reference), not a copy of the platform object — this is the relational-DB
  style normalization the experiment calls for
- Adapter-generated selectors (`selectAll`, `selectById`, `selectIds`) remove
  boilerplate for common read patterns

Full store shape:

```js
{
  posts: {
    ids: [...],
    entities: { ... },
    status: "idle" | "loading" | "succeeded" | "failed",
    error: null
  },
  platforms: {
    ids: [...],
    entities: { ... }
  }
}
```

## CRUD / async flow mapped to Redux Toolkit features

| Requirement                     | Implementation                                             |
|----------------------------------|-------------------------------------------------------------|
| Create post                      | `addNewPost` thunk → `postsAdapter.addOne` in `extraReducers` |
| Read posts                       | `fetchPosts` thunk + `postsSelectors.selectAll`             |
| Update / save draft               | `postSavedAsDraft`, `postUpdated` reducers → `updateOne`     |
| Publish (draft → published)       | `postPublished` reducer                                     |
| Delete post                      | `removePost` thunk → `postsAdapter.removeOne`                |
| Toggle platform                  | `platformToggled` reducer                                    |
| Async data flow / loading states  | `status` field driven by thunk `pending/fulfilled/rejected`  |
| No prop drilling                 | Every component reads/writes the store directly via hooks    |

## Notes for the report

- **Global state**: `store.js` is the single source of truth; any component
  can `useSelector` into it without passing props through intermediate
  components (see `App.js` — it renders children with zero data props).
- **Scalability**: new features (e.g. a `usersSlice` or `commentsSlice`) can
  be added as additional slices and registered in `configureStore` without
  touching existing slices.
- **Mock API**: `postsAPI.js` simulates latency with `setTimeout`, isolating
  the "network" concern so it can later be swapped for real `fetch`/`axios`
  calls without changing the slice's action/reducer logic.
