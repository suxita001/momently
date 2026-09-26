/* Stateless admin session: a cookie holding {iat, exp, nonce} + an HMAC-SHA256 signature.
   Secrets come only from environment variables:
     ADMIN_PASSWORD  – the admin login password
     SESSION_SECRET  – random string (32+ chars) used to sign cookies.
   Changing SESSION_SECRET logs out every session. */
import { createHmac, createHash, randomBytes, timingSafeEqual } from "node:crypto";
import { HttpError } from "./http.js";

const COOKIE = "mly_admin";
const MAX_AGE = 7 * 24 * 60 * 60; // 7 days, in seconds

function secret() {
  const s = process.env.SESSION_SECRET || "";
  if (s.length < 32) throw new HttpError(500, "Admin is not configured (SESSION_SECRET missing or shorter than 32 characters)");
  return s;
}

const b64url = buf => Buffer.from(buf).toString("base64url");
const sign = data => createHmac("sha256", secret()).update(data).digest();

/* Timing-safe comparison of two strings of any length (compares SHA-256 digests). */
export function safeEqual(a, b) {
  const ha = createHash("sha256").update(String(a)).digest();
  const hb = createHash("sha256").update(String(b)).digest();
  return timingSafeEqual(ha, hb);
}

export function checkPassword(candidate) {
  const real = process.env.ADMIN_PASSWORD || "";
  if (real.length < 8) throw new HttpError(500, "Admin is not configured (ADMIN_PASSWORD missing or shorter than 8 characters)");
  return typeof candidate === "string" && candidate.length <= 200 && safeEqual(candidate, real);
}

/* Fail early (500 with a clear message) if the environment variables are missing. */
export function assertAdminConfigured() {
  secret();
  checkPassword("");
}

function cookieHeader(value, maxAge) {
  return `${COOKIE}=${value}; Path=/; Max-Age=${maxAge}; HttpOnly; Secure; SameSite=Strict`;
}

export function setSessionCookie(res) {
  const now = Math.floor(Date.now() / 1000);
  const payload = b64url(JSON.stringify({ iat: now, exp: now + MAX_AGE, n: randomBytes(12).toString("hex") }));
  const token = `${payload}.${b64url(sign(payload))}`;
  res.setHeader("Set-Cookie", cookieHeader(token, MAX_AGE));
}

export function clearSessionCookie(res) {
  res.setHeader("Set-Cookie", cookieHeader("", 0));
}

function readCookie(req) {
  const header = req.headers.cookie || "";
  for (const part of header.split(";")) {
    const [name, ...rest] = part.trim().split("=");
    if (name === COOKIE) return rest.join("=");
  }
  return "";
}

/* True if the request carries a valid, unexpired, correctly signed session cookie. */
export function isAuthenticated(req) {
  const token = readCookie(req);
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return false;
  const expected = sign(payload);
  const given = Buffer.from(sig, "base64url");
  if (given.length !== expected.length || !timingSafeEqual(given, expected)) return false;
  try {
    const { exp } = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    return typeof exp === "number" && exp > Math.floor(Date.now() / 1000);
  } catch {
    return false;
  }
}

/* Call at the top of every admin route. */
export function requireAuth(req) {
  if (!isAuthenticated(req)) throw new HttpError(401, "Not authenticated");
}
