import React from "react";
import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import { makeStore } from "./store";

/**
 * Renders a component wrapped in a Redux Provider backed by a fresh store
 * (or a given preloadedState), so each test is fully isolated and doesn't
 * leak posts between test cases.
 */
export function renderWithStore(ui, { preloadedState, store = makeStore(preloadedState) } = {}) {
  function Wrapper({ children }) {
    return <Provider store={store}>{children}</Provider>;
  }
  return { store, ...render(ui, { wrapper: Wrapper }) };
}
