import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Wraps a route element and enforces two checks in order:
 *  1. Authentication — is there a valid session at all?
 *  2. Authorization  — if `allowedRoles` is given, does this user's role
 *     appear in it?
 *
 * Usage:
 *   <Route path="/admin" element={
 *     <ProtectedRoute allowedRoles={['Admin']}><AdminPanel /></ProtectedRoute>
 *   } />
 */
export default function ProtectedRoute({ children, allowedRoles }) {
  const { status, user } = useAuth();
  const location = useLocation();

  if (status === 'checking') {
    return <div className="page-loading">Checking session…</div>;
  }

  if (status !== 'authenticated') {
    // Remember where the user was headed so we can send them back post-login.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}
