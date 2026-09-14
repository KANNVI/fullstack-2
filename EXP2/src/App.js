import React from "react";
import { useSelector } from "react-redux";
import PostForm from "./components/PostForm";
import PostList from "./components/PostList";
import PlatformList from "./components/PlatformList";
import Counter from "./components/Counter";
import { postsSelectors } from "./features/posts/postsSlice";
import { platformsSelectors } from "./features/platforms/platformsSlice";
import "./index.css";

function StatCard({ value, label }) {
  return (
    <div className="stat-card">
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
    </div>
  );
}

// No prop drilling: every component below reads/writes the Redux
// store directly via useSelector / useDispatch hooks.
export default function App() {
  const posts = useSelector(postsSelectors.selectAll);
  const platforms = useSelector(platformsSelectors.selectAll);

  const total = posts.length;
  const published = posts.filter((p) => !p.isDraft).length;
  const drafts = posts.filter((p) => p.isDraft).length;

  return (
    <div className="app">
      <header className="hero">
        <h1>🚀 SocialSync Dashboard</h1>
        <p>Redux Toolkit Social Media Manager</p>
      </header>

      <div className="stats-row">
        <StatCard value={total} label="Total Posts" />
        <StatCard value={published} label="Published" />
        <StatCard value={drafts} label="Drafts" />
        <StatCard value={platforms.length} label="Platforms" />
      </div>

      <PostForm />

      <div className="layout">
        <div className="column">
          <PlatformList />
          <Counter />
        </div>
        <div className="column">
          <PostList />
        </div>
      </div>
    </div>
  );
}
