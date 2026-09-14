import { createToken } from './jwt';

// Stand-in for a users table. In a real backend, passwords would be hashed
// (bcrypt/argon2) and this lookup would be a database query.
const USERS = [
  { id: 1, username: 'admin', password: 'admin123', name: 'Aditi Sharma', role: 'Admin' },
  { id: 2, username: 'editor', password: 'editor123', name: 'Rohan Mehta', role: 'Editor' },
  { id: 3, username: 'viewer', password: 'viewer123', name: 'Kannvi Rani', role: 'Viewer' }
];

/**
 * Simulates POST /api/login. Validates credentials and, on success,
 * issues a signed JWT carrying the user's id, name and role as claims.
 */
export function login(username, password) {
  return new Promise((resolve, reject) => {
    // Simulate network latency so the UI's loading state is meaningful.
    setTimeout(async () => {
      const user = USERS.find((u) => u.username === username && u.password === password);
      if (!user) {
        reject(new Error('Invalid username or password'));
        return;
      }
      const token = await createToken(
        { sub: user.id, name: user.name, username: user.username, role: user.role },
        60 * 30 // 30 minute expiry
      );
      resolve(token);
    }, 500);
  });
}

export const DEMO_ACCOUNTS = USERS.map(({ username, password, role }) => ({
  username,
  password,
  role
}));
