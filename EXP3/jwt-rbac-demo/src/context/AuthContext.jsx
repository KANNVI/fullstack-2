import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { login as loginApi } from '../utils/mockAuthApi';
import { verifyToken, decodeToken } from '../utils/jwt';

const TOKEN_KEY = 'jwt_demo_token';
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState('checking'); // checking | authenticated | unauthenticated
  const [error, setError] = useState(null);

  // On first load, restore a session from any token already sitting in
  // storage (this is what makes the login "stateless" and refresh-proof).
  useEffect(() => {
    const restore = async () => {
      const stored = localStorage.getItem(TOKEN_KEY);
      if (!stored) {
        setStatus('unauthenticated');
        return;
      }
      try {
        const payload = await verifyToken(stored);
        setToken(stored);
        setUser(payload);
        setStatus('authenticated');
      } catch {
        localStorage.removeItem(TOKEN_KEY);
        setStatus('unauthenticated');
      }
    };
    restore();
  }, []);

  const login = useCallback(async (username, password) => {
    setError(null);
    try {
      const newToken = await loginApi(username, password);
      localStorage.setItem(TOKEN_KEY, newToken);
      setToken(newToken);
      setUser(decodeToken(newToken));
      setStatus('authenticated');
      return true;
    } catch (err) {
      setError(err.message);
      setStatus('unauthenticated');
      return false;
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
    setStatus('unauthenticated');
  }, []);

  // Simulates attaching the token to an outgoing API request, e.g.
  // fetch(url, { headers: authHeader() })
  const authHeader = useCallback(() => {
    return token ? { Authorization: `Bearer ${token}` } : {};
  }, [token]);

  const value = { token, user, status, error, login, logout, authHeader };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
