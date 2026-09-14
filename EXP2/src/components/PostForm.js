import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addNewPost } from "../features/posts/postsSlice";
import { platformsSelectors } from "../features/platforms/platformsSlice";

export default function PostForm() {
  const dispatch = useDispatch();
  const platforms = useSelector(platformsSelectors.selectAll);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [platformId, setPlatformId] = useState(platforms[0]?.id ?? "");
  const [statusValue, setStatusValue] = useState("draft"); // "draft" | "published"
  const [submitting, setSubmitting] = useState(false);

  const canSave = title.trim() && content.trim() && platformId && !submitting;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canSave) return;
    try {
      setSubmitting(true);
      await dispatch(
        addNewPost({
          title,
          content,
          platformId,
          isDraft: statusValue === "draft",
        })
      ).unwrap();
      setTitle("");
      setContent("");
      setStatusValue("draft");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="panel post-form" onSubmit={handleSubmit}>
      <h2>Create New Post</h2>
      <input
        placeholder="Post Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        placeholder="Write your post..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <select value={platformId} onChange={(e) => setPlatformId(e.target.value)}>
        {platforms.map((p) => (
          <option key={p.id} value={p.id}>
            {p.name}
          </option>
        ))}
      </select>
      <select value={statusValue} onChange={(e) => setStatusValue(e.target.value)}>
        <option value="draft">Draft</option>
        <option value="published">Published</option>
      </select>
      <button type="submit" className="add-post-btn" disabled={!canSave}>
        Add Post
      </button>
    </form>
  );
}
