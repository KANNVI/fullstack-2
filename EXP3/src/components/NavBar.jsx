import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function NavBar() {
  const { user, logout } = useAuth();

  return (
    <header className="navbar">
      <div className="navbar-left">
        <span className="brand">JWT + RBAC Demo</span>
        <Link to="/dashboard">Dashboard</Link>
        {/* Conditionally rendered based on role — Experiment 1.3.2, step 5 */}
        {user.role === 'Admin' && <Link to="/admin">Admin panel</Link>}
        <Link to="/editor">Post Composer</Link>
      </div>
      <div className="navbar-right">
        <span className="user-chip">
          {user.name} <em>({user.role})</em>
        </span>
        <button onClick={logout}>Log out</button>
      </div>
    </header>
  );
}
