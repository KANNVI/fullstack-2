import { useAuth } from '../context/AuthContext';
import NavBar from '../components/NavBar';

export default function Dashboard() {
  const { user, token } = useAuth();

  return (
    <div className="page">
      <NavBar />
      <main className="page-content">
        <h1>Welcome, {user.name}</h1>
        <p className="muted">
          You're signed in as <strong>{user.role}</strong>. This page reads its
          content straight from the decoded JWT payload — no separate profile
          request needed.
        </p>

        <section className="panel">
          <h2>Decoded token claims</h2>
          <pre className="token-view">{JSON.stringify(user, null, 2)}</pre>
        </section>

        <section className="panel">
          <h2>What your role can see</h2>
          <ul className="capability-list">
            <li>✅ Everyone: this dashboard, your profile claims</li>
            <li>{user.role === 'Admin' ? '✅' : '🔒'} Admin: user management panel</li>
            <li>
              {user.role === 'Admin' || user.role === 'Editor' ? '✅' : '🔒'} Editor:
              content editing tools
            </li>
          </ul>
          <p className="muted small">
            Try visiting <code>/admin</code> while logged in as Viewer to see the
            authorization redirect in action.
          </p>
        </section>

        <details className="panel">
          <summary>Raw JWT (as sent with each request)</summary>
          <pre className="token-view raw">{token}</pre>
        </details>
      </main>
    </div>
  );
}
