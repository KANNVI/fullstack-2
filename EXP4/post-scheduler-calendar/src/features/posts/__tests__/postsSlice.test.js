import postsReducer, {
  postAdded,
  postUpdated,
  postMoved,
  postDeleted,
  selectAllPosts,
  selectPostsGroupedByDate,
} from "../postsSlice";

function stateWithOnePost() {
  const state = postsReducer(undefined, { type: "@@INIT" });
  const action = postAdded({
    title: "Launch teaser",
    content: "Coming soon",
    dateKey: "2026-09-14",
    time: "10:00",
    platform: "Instagram",
  });
  return { state: postsReducer(state, action), addedId: action.payload.id };
}

describe("postsSlice reducer", () => {
  it("has an empty initial state", () => {
    const state = postsReducer(undefined, { type: "@@INIT" });
    expect(state.allIds).toEqual([]);
    expect(state.byId).toEqual({});
  });

  it("adds a post with postAdded", () => {
    const { state, addedId } = stateWithOnePost();
    expect(state.allIds).toContain(addedId);
    expect(state.byId[addedId].title).toBe("Launch teaser");
    expect(state.byId[addedId].dateKey).toBe("2026-09-14");
  });

  it("updates an existing post with postUpdated without touching other fields", () => {
    const { state, addedId } = stateWithOnePost();
    const next = postsReducer(
      state,
      postUpdated({ id: addedId, changes: { title: "Launch teaser v2" } })
    );
    expect(next.byId[addedId].title).toBe("Launch teaser v2");
    expect(next.byId[addedId].content).toBe("Coming soon"); // unchanged
  });

  it("reschedules a post to a new date/time with postMoved", () => {
    const { state, addedId } = stateWithOnePost();
    const next = postsReducer(
      state,
      postMoved({ id: addedId, dateKey: "2026-09-20", time: "14:30" })
    );
    expect(next.byId[addedId].dateKey).toBe("2026-09-20");
    expect(next.byId[addedId].time).toBe("14:30");
  });

  it("removes a post with postDeleted", () => {
    const { state, addedId } = stateWithOnePost();
    const next = postsReducer(state, postDeleted(addedId));
    expect(next.allIds).not.toContain(addedId);
    expect(next.byId[addedId]).toBeUndefined();
  });

  it("is a no-op when updating a post id that does not exist", () => {
    const { state } = stateWithOnePost();
    const next = postsReducer(
      state,
      postUpdated({ id: "does-not-exist", changes: { title: "x" } })
    );
    expect(next).toEqual(state);
  });
});

describe("postsSlice selectors", () => {
  it("selectAllPosts returns every post as a flat array", () => {
    const { state } = stateWithOnePost();
    const all = selectAllPosts({ posts: state });
    expect(all).toHaveLength(1);
    expect(all[0].title).toBe("Launch teaser");
  });

  it("selectPostsGroupedByDate groups posts under their dateKey", () => {
    let state = postsReducer(undefined, { type: "@@INIT" });
    state = postsReducer(
      state,
      postAdded({ title: "A", dateKey: "2026-09-14", time: "09:00" })
    );
    state = postsReducer(
      state,
      postAdded({ title: "B", dateKey: "2026-09-14", time: "11:00" })
    );
    state = postsReducer(
      state,
      postAdded({ title: "C", dateKey: "2026-09-15", time: "09:00" })
    );

    const grouped = selectPostsGroupedByDate({ posts: state });
    expect(grouped["2026-09-14"]).toHaveLength(2);
    expect(grouped["2026-09-15"]).toHaveLength(1);
    expect(grouped["2026-09-16"]).toBeUndefined();
  });
});
