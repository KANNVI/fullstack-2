import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import NavBar from '../components/NavBar';

// Central permission matrix — the single source of truth for what each
// role can do on this page. Extending roles/permissions later just means
// adding a row/column here.
const PERMISSIONS = {
  Admin: { view: true, create: true, edit: true, delete: true },
  Editor: { view: true, create: true, edit: true, delete: false },
  Viewer: { view: true, create: false, edit: false, delete: false }
};

const PERMISSION_ROWS = [
  { key: 'view', label: 'View', icon: '👁️' },
  { key: 'create', label: 'Create', icon: '✍️' },
  { key: 'edit', label: 'Edit', icon: '📝' },
  { key: 'delete', label: 'Delete', icon: '🗑️' }
];

// Seed data so the list isn't empty on first load.
const INITIAL_POSTS = [
  {
    id: 1,
    title: 'Welcome to Post Composer',
    body: 'This is the first post. Admin can edit or delete it.'
  },
  {
    id: 2,
    title: 'Role Based Access Control',
    body: 'Different users get different permissions.'
  }
];

export default function PostComposer() {
  const { user } = useAuth();
  const perms = PERMISSIONS[user.role] || PERMISSIONS.Viewer;
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [saved, setSaved] = useState(false);
  const [posts, setPosts] = useState(INITIAL_POSTS);
  const [editingId, setEditingId] = useState(null);
  const [editDraft, setEditDraft] = useState({ title: '', body: '' });

  const handleSave = (e) => {
    e.preventDefault();
    if (!perms.create || !title.trim()) return;
    setPosts((prev) => [
      { id: Date.now(), title: title.trim(), body: body.trim() },
      ...prev
    ]);
    setTitle('');
    setBody('');
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleDelete = (id) => {
    if (!perms.delete) return;
    setPosts((prev) => prev.filter((p) => p.id !== id));
  };

  const startEdit = (post) => {
    if (!perms.edit) return;
    setEditingId(post.id);
    setEditDraft({ title: post.title, body: post.body });
  };

  const saveEdit = (id) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, title: editDraft.title, body: editDraft.body } : p
      )
    );
    setEditingId(null);
  };

  return (
    <div className="page">
      <NavBar />
      <main className="composer-shell">
        <section className="composer-header">
          <div>
            <h1>Post Composer</h1>
            <p className="muted">
              Welcome, <strong>{user.name}</strong>
            </p>
          </div>
          <div className="composer-header-right">
            <span className="role-badge">{user.role}</span>
          </div>
        </section>

        <section className="panel">
          <h2>Your Permissions</h2>
          <div className="permission-grid">
            {PERMISSION_ROWS.map((row) => {
              const allowed = perms[row.key];
              return (
                <div
                  key={row.key}
                  className={`permission-card ${allowed ? 'allowed' : 'denied'}`}
                >
                  <span className="permission-label">
                    <span className="permission-icon">{row.icon}</span>
                    {row.label}
                  </span>
                  <span className="permission-status">
                    {allowed ? 'Allowed' : 'Not allowed'}
                  </span>
                </div>
              );
            })}
          </div>
        </section>

        <section className="panel">
          <h2>Create New Post</h2>

          {!perms.create && (
            <p className="muted small" style={{ marginTop: '-0.4rem' }}>
              Your role ({user.role}) doesn't have create permission — this
              form is view-only.
            </p>
          )}

          <form onSubmit={handleSave} className="composer-form">
            <input
              placeholder="Post title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={!perms.create}
            />
            <textarea
              rows={6}
              placeholder="Write your post..."
              value={body}
              onChange={(e) => setBody(e.target.value)}
              disabled={!perms.create}
            />
            <button type="submit" disabled={!perms.create || !title.trim()}>
              {saved ? 'Saved ✓' : 'Create & Save Post'}
            </button>
          </form>
        </section>

        <section className="panel">
          <div className="posts-header">
            <h2>All Posts</h2>
            <span className="muted small">{posts.length} posts</span>
          </div>

          <div className="post-list">
            {posts.map((post) => (
              <div className="post-card" key={post.id}>
                {editingId === post.id ? (
                  <div className="post-edit-form">
                    <input
                      value={editDraft.title}
                      onChange={(e) =>
                        setEditDraft((d) => ({ ...d, title: e.target.value }))
                      }
                    />
                    <textarea
                      rows={3}
                      value={editDraft.body}
                      onChange={(e) =>
                        setEditDraft((d) => ({ ...d, body: e.target.value }))
                      }
                    />
                    <div className="post-actions">
                      <button className="btn-view" onClick={() => setEditingId(null)}>
                        Cancel
                      </button>
                      <button className="btn-edit" onClick={() => saveEdit(post.id)}>
                        Save
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="post-card-text">
                      <h3>{post.title}</h3>
                      <p className="muted">{post.body}</p>
                    </div>
                    <div className="post-actions">
                      <button
                        className="btn-view"
                        disabled={!perms.view}
                        onClick={() => alert(`${post.title}\n\n${post.body}`)}
                      >
                        View
                      </button>
                      <button
                        className="btn-edit"
                        disabled={!perms.edit}
                        onClick={() => startEdit(post)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn-delete"
                        disabled={!perms.delete}
                        onClick={() => handleDelete(post.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
            {posts.length === 0 && (
              <p className="muted small">No posts yet.</p>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
