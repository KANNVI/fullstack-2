# JWT Authentication + RBAC Demo

A single React app implementing both lab experiments:

- **Experiment 1.3.1** — JWT-based authentication and stateless session management
- **Experiment 1.3.2** — Role-based access control (RBAC) and protected routes

## Run it

```bash
npm install
npm run dev
```

Then open the printed localhost URL. Three demo accounts are shown on the
login screen (click a chip to autofill):

| Username | Password   | Role   |
|----------|------------|--------|
| admin    | admin123   | Admin  |
| editor   | editor123  | Editor |
| viewer   | viewer123  | Viewer |

## How it maps to the experiment steps

**1.3.1 — Authentication**
- `src/pages/Login.jsx` — the login form (step 1)
- `src/utils/mockAuthApi.js` — validates credentials against a mock user table (step 2)
- `src/utils/jwt.js` — creates a real, signed HS256 JWT with `createToken()`, and
  reads it back with `decodeToken()` / `verifyToken()` (step 3, 6)
- `src/context/AuthContext.jsx` — stores the token in `localStorage`, restores
  the session on page refresh, and exposes `authHeader()` for attaching the
  token to outgoing requests (`Authorization: Bearer <token>`) (steps 4, 5)

**1.3.2 — RBAC / protected routes**
- `src/components/ProtectedRoute.jsx` — route guard: redirects to `/login` if
  unauthenticated, or to `/unauthorized` if the user's role isn't in
  `allowedRoles`
- `src/App.jsx` — wires `/admin` (Admin only) and `/editor` (Admin + Editor)
  behind `ProtectedRoute`
- `src/components/NavBar.jsx` — conditionally renders nav links based on
  `user.role`
- `src/pages/Unauthorized.jsx` — shown to authenticated users hitting a route
  their role doesn't cover

## A note on the "signing" in `src/utils/jwt.js`

The token is genuinely signed with HMAC-SHA256 via the browser's Web Crypto
API, so you can see all three real JWT parts (header, payload, signature) and
verify that tampering breaks the signature. In a production system this
signing step happens **only on the server**, using a secret that never
reaches the client — doing it in the browser (as here) is just what makes the
mechanism visible for the experiment. This is called out in the file's
comments too.

## Extending toward a real backend

To make this non-mock: move `createToken`/`verifyToken` to a Node/Express
server (`jsonwebtoken` package), replace `mockAuthApi.login()` with a real
`fetch('/api/login', { method: 'POST', body: ... })`, and keep the client-side
`AuthContext`/`ProtectedRoute` logic almost exactly as-is — that part already
reflects how a real stateless JWT frontend is structured.
