// Mock API layer — simulates a real backend with network latency.
// In a real app this would be replaced by fetch()/axios calls.

let mockDB = [
  {
    id: "p1",
    title: "Launching our new product",
    content: "Excited to announce our new product line!",
    platformId: "pl1",
    isDraft: false,
    createdAt: "2026-07-20T09:00:00.000Z",
  },
  {
    id: "p2",
    title: "Behind the scenes",
    content: "A look at how our team builds features.",
    platformId: "pl2",
    isDraft: false,
    createdAt: "2026-07-22T11:30:00.000Z",
  },
  {
    id: "p3",
    title: "Draft: Q3 roadmap teaser",
    content: "Working on the wording for this one...",
    platformId: "pl1",
    isDraft: true,
    createdAt: "2026-07-25T15:45:00.000Z",
  },
];

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export async function fetchPostsAPI() {
  await delay(600);
  return [...mockDB];
}

export async function createPostAPI(post) {
  await delay(400);
  mockDB = [...mockDB, post];
  return post;
}

export async function deletePostAPI(id) {
  await delay(300);
  mockDB = mockDB.filter((p) => p.id !== id);
  return id;
}
