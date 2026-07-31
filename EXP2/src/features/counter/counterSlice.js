import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: 0,
};

const counterSlice = createSlice({
  name: "counter",
  initialState,
  reducers: {
    incremented(state) {
      state.value += 1; // Redux Toolkit uses Immer internally,
      // so this "mutation" is actually safe and produces a new state.
    },
    decremented(state) {
      state.value -= 1;
    },
    incrementedByAmount(state, action) {
      state.value += action.payload;
    },
    reset(state) {
      state.value = 0;
    },
  },
});

export const { incremented, decremented, incrementedByAmount, reset } =
  counterSlice.actions;

export const selectCount = (state) => state.counter.value;

export default counterSlice.reducer;
