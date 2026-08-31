// A small, dependency-free JWT implementation for demo/teaching purposes.
//
// IMPORTANT (mentioned since this is a lab experiment on secure auth):
// In a real application, the token must be *signed on the server*, using a
// secret that never reaches the browser. Here we sign in the browser with
// the Web Crypto API purely so the whole HS256 flow (header.payload.signature)
// is visible and inspectable for the experiment. Do not ship this pattern
// to production — client-side signing means the client controls its own
// "trusted" claims.

const DEMO_SECRET = 'lab-experiment-demo-secret-do-not-use-in-prod';

function base64UrlEncode(str) {
  return btoa(unescape(encodeURIComponent(str)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

function base64UrlDecode(str) {
  str = str.replace(/-/g, '+').replace(/_/g, '/');
  while (str.length % 4) str += '=';
  return decodeURIComponent(escape(atob(str)));
}

async function hmacSha256(message, secret) {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const signature = await crypto.subtle.sign('HMAC', key, enc.encode(message));
  const bytes = new Uint8Array(signature);
  let binary = '';
  bytes.forEach((b) => (binary += String.fromCharCode(b)));
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

/**
 * Create a signed JWT.
 * @param {object} payload - claims to embed (e.g. { sub, name, role })
 * @param {number} expiresInSeconds - token lifetime
 */
export async function createToken(payload, expiresInSeconds = 60 * 60) {
  const header = { alg: 'HS256', typ: 'JWT' };
  const now = Math.floor(Date.now() / 1000);
  const fullPayload = {
    ...payload,
    iat: now,
    exp: now + expiresInSeconds
  };

  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(fullPayload));
  const signature = await hmacSha256(`${encodedHeader}.${encodedPayload}`, DEMO_SECRET);

  return `${encodedHeader}.${encodedPayload}.${signature}`;
}

/**
 * Verify a token's signature and expiry. Returns the decoded payload if valid,
 * or throws if the token is malformed, tampered with, or expired.
 */
export async function verifyToken(token) {
  const parts = token.split('.');
  if (parts.length !== 3) throw new Error('Malformed token');
  const [encodedHeader, encodedPayload, signature] = parts;

  const expectedSignature = await hmacSha256(`${encodedHeader}.${encodedPayload}`, DEMO_SECRET);
  if (expectedSignature !== signature) throw new Error('Invalid signature');

  const payload = JSON.parse(base64UrlDecode(encodedPayload));
  const now = Math.floor(Date.now() / 1000);
  if (payload.exp && now > payload.exp) throw new Error('Token expired');

  return payload;
}

/**
 * Decode a token's payload WITHOUT verifying the signature.
 * Useful for reading claims client-side after the server (or, here, our
 * mock login) has already verified the token.
 */
export function decodeToken(token) {
  const parts = token.split('.');
  if (parts.length !== 3) return null;
  try {
    return JSON.parse(base64UrlDecode(parts[1]));
  } catch {
    return null;
  }
}
