import { createSlice, createEntityAdapter } from "@reduxjs/toolkit";

const platformsAdapter = createEntityAdapter({
  selectId: (platform) => platform.id,
});

// Posts reference platforms only by `platformId` (see postsSlice) —
// this is the normalized, relational-style link between the two slices,
// similar to a foreign key in a database.
const initialState = platformsAdapter.getInitialState(
  {},
  [
    { id: "pl1", name: "Twitter / X", handle: "@ourbrand", isActive: true },
    { id: "pl2", name: "LinkedIn", handle: "our-brand", isActive: true },
    { id: "pl3", name: "Instagram", handle: "@ourbrand.ig", isActive: false },
  ]
);

const platformsSlice = createSlice({
  name: "platforms",
  initialState,
  reducers: {
    platformToggled(state, action) {
      const platform = state.entities[action.payload];
      if (platform) platform.isActive = !platform.isActive;
    },
    platformAdded: platformsAdapter.addOne,
  },
});

export const { platformToggled, platformAdded } = platformsSlice.actions;

export const platformsSelectors = platformsAdapter.getSelectors(
  (state) => state.platforms
);

export default platformsSlice.reducer;
