import React, { useEffect, useState } from "react";

const PLATFORMS = ["General", "Instagram", "Twitter/X", "LinkedIn", "Facebook"];

/**
 * Controlled form for creating a new post (when `existingPost` is null)
 * or editing/deleting one (when `existingPost` is provided).
 *
 * This is intentionally NOT memoized: it only mounts while the modal is
 * open, so there's nothing to save by skipping re-renders, and memoizing
 * a form component with fast-changing local input state would add
 * comparison overhead for no benefit.
 */
export default function PostModal({ dateKey, existingPost, onSave, onDelete, onClose }) {
  const [title, setTitle] = useState(existingPost?.title ?? "");
  const [content, setContent] = useState(existingPost?.content ?? "");
  const [time, setTime] = useState(existingPost?.time ?? "09:00");
  const [platform, setPlatform] = useState(existingPost?.platform ?? "General");
  const [error, setError] = useState("");

  // Keep the form in sync if the caller opens the modal for a different post.
  useEffect(() => {
    setTitle(existingPost?.title ?? "");
    setContent(existingPost?.content ?? "");
    setTime(existingPost?.time ?? "09:00");
    setPlatform(existingPost?.platform ?? "General");
    setError("");
  }, [existingPost]);

  function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim()) {
      setError("Title is required.");
      return;
    }
    onSave({ title: title.trim(), content, time, platform });
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="post-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="post-modal-title">{existingPost ? "Edit post" : "Schedule a post"}</h2>
        <p className="modal-date">{dateKey}</p>

        <form onSubmit={handleSubmit}>
          <label htmlFor="post-title">Title</label>
          <input
            id="post-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Product launch teaser"
            autoFocus
          />

          <label htmlFor="post-content">Content</label>
          <textarea
            id="post-content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={3}
            placeholder="Caption / notes for this post"
          />

          <div className="modal-row">
            <div>
              <label htmlFor="post-time">Time</label>
              <input
                id="post-time"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="post-platform">Platform</label>
              <select
                id="post-platform"
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
              >
                {PLATFORMS.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {error && <p className="modal-error">{error}</p>}

          <div className="modal-actions">
            {existingPost && (
              <button
                type="button"
                className="btn btn--danger"
                onClick={() => onDelete(existingPost.id)}
              >
                Delete
              </button>
            )}
            <div className="modal-actions-right">
              <button type="button" className="btn" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn btn--primary">
                {existingPost ? "Save changes" : "Schedule post"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
