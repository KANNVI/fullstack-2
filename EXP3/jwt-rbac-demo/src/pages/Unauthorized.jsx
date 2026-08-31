import { Link } from 'react-router-dom';

export default function Unauthorized() {
  return (
    <div className="auth-shell">
      <div className="auth-card" style={{ textAlign: 'center' }}>
        <h1>403 — Not authorized</h1>
        <p className="muted">Your role doesn't have access to that page.</p>
        <Link to="/dashboard">Back to dashboard</Link>
      </div>
    </div>
  );
}
