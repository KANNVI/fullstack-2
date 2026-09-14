# Post Scheduler Calendar

A React + Redux Toolkit interactive calendar for scheduling social media posts,
built for **Experiment 1.4.1** (calendar UI) and **Experiment 1.4.2**
(performance optimization + testing), CONT_24CSP-337 Full Stack-II.

## Getting started

```bash
npm install
npm start      # runs the app at http://localhost:3000
npm test       # runs the full Jest/RTL test suite
npm run build  # production build
```

## Features (Experiment 1.4.1)

- **Month view** with Prev / Next / Today navigation.
- **Click any day cell** to schedule a new post (title, content, time, platform).
- **Click an existing post** to open it pre-filled for editing, or delete it.
- Posts are stored in a normalized **Redux Toolkit** slice (`byId` / `allIds`)
  and grouped by date via a memoized selector for rendering.
- Pure date-grid utilities (`src/utils/dateUtils.js`) build a full 6-week
  (42-cell) month grid, including leading/trailing days from adjacent months.

## Performance & testing (Experiment 1.4.2)

- **`React.memo`** on `CalendarCell` (with a custom comparator that checks
  the cell's date and its own posts' id/title/time, not object identity) and
  on `PostEvent`, so editing or adding one post does not re-render every
  other day cell in the grid.
- **`useCallback`** for all handlers passed down from `Calendar` (add, select,
  save, delete, month navigation) so those stable references don't defeat
  the `memo` on children.
- **`useMemo`** for the month grid (recomputed only when the viewed
  year/month changes) and for "today"'s date key.
- A **`createSelector`**-memoized Redux selector (`selectPostsGroupedByDate`)
  so the grouped-by-date posts object keeps the same reference across
  renders that don't actually change the posts data.
- **Jest + React Testing Library** tests covering:
  - `dateUtils` (grid building, leap years, date-key formatting)
  - the `postsSlice` reducer and selectors
  - `PostEvent` (rendering + click behavior/event bubbling)
  - `CalendarCell` (rendering + memo bail-out behavior)
  - `PostModal` (create/edit/validate/delete/cancel flows)
  - `Calendar` end-to-end integration (navigation, add/edit/delete via the UI)

Run `npm test` to see all suites pass.

## Project structure

```
src/
  components/
    Calendar.jsx        # main month view, navigation, wiring
    CalendarCell.jsx     # memoized day cell
    PostEvent.jsx        # memoized post pill
    PostModal.jsx        # add/edit/delete form
    __tests__/           # component + integration tests
  features/posts/
    postsSlice.js         # Redux Toolkit slice + selectors
    __tests__/
  utils/
    dateUtils.js          # pure date/grid helpers
    __tests__/
  store.js                # Redux store setup
  App.js / App.css / index.js / index.css
```

## Notes

- `.env` sets `DISABLE_ESLINT_PLUGIN=true` to work around a known version
  mismatch between `eslint-config-react-app` and `eslint-plugin-jest` in
  some npm installs of `react-scripts@5`. It does not affect the app or
  test behavior; your editor's own ESLint integration still lints normally.
- Drag-and-drop rescheduling is intentionally left out of this build (the
  experiment lists it as optional/advanced) but `postMoved` is already
  implemented in the Redux slice, ready to be wired up to a drag library
  (e.g. `@dnd-kit` or `react-beautiful-dnd`) if you want to extend it.
