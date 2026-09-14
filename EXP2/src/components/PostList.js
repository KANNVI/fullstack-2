import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchPosts,
  postsSelectors,
  selectPostsStatus,
  selectPostsError,
  postPublished,
  removePost,
} from "../features/posts/postsSlice";
import { platformsSelectors } from "../features/platforms/platformsSlice";

export default function PostList() {
  const dispatch = useDispatch();
  const posts = useSelector(postsSelectors.selectAll);
  const status = useSelector(selectPostsStatus);
  const error = useSelector(selectPostsError);

  // Platform lookups by id — O(1) thanks to normalized entities map
  const platformsById = useSelector((state) => state.platforms.entities);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchPosts());
    }
  }, [status, dispatch]);

  if (status === "loading") return <p>Loading posts…</p>;
  if (status === "failed") return <p>Error: {error}</p>;

  return (
    <div className="panel">
      <h2>Posts</h2>
      <ul className="post-list">
        {posts.map((post) => {
          const platform = platformsById[post.platformId];
          return (
            <li key={post.id} className={post.isDraft ? "draft" : "published"}>
              <div className="post-header">
                <strong>{post.title}</strong>
                <span className="badge">{post.isDraft ? "Draft" : "Published"}</span>
              </div>
              <p>{post.content}</p>
              <small>
                {platform ? platform.name : "Unknown platform"} ·{" "}
                {new Date(post.createdAt).toLocaleString()}
              </small>
              <div className="post-actions">
                {post.isDraft && (
                  <button onClick={() => dispatch(postPublished(post.id))}>
                    Publish
                  </button>
                )}
                <button onClick={() => dispatch(removePost(post.id))}>
                  Delete
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
