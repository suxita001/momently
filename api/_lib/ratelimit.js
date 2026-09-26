/* Simple fixed-window rate limits.

   - memoryLimit: per server instance, best effort (serverless instances come and go).
   - Login failures are also stored in the private Blob store ("security/login-attempts.json"),
     so they survive cold starts and are shared between instances. */
import { readJson, writeJson } from "./storage.js";

const memory = new Map(); // key -> { count, start }

/* Returns true if the action is allowed, and counts it. */
export function memoryLimit(key, max, windowMs) {
  const now = Date.now();
  const entry = memory.get(key);
  if (!entry || now - entry.start > windowMs) {
    memory.set(key, { count: 1, start: now });
    return true;
  }
  entry.count++;
  return entry.count <= max;
}

/* ---------- login failures ---------- */
const FILE = "security/login-attempts.json";
const MAX_FAILURES = 5;
const WINDOW_MS = 15 * 60 * 1000;

async function loadAttempts() {
  try {
    const doc = await readJson(FILE, "private");
    return doc ? doc.data : {};
  } catch {
    return null; // storage unavailable -> memory only
  }
}

function prune(attempts) {
  const now = Date.now();
  for (const [ip, a] of Object.entries(attempts)) if (now - a.start > WINDOW_MS) delete attempts[ip];
}

export async function isLoginBlocked(ip) {
  const mem = memory.get(`login:${ip}`);
  if (mem && Date.now() - mem.start <= WINDOW_MS && mem.count >= MAX_FAILURES) return true;
  const attempts = await loadAttempts();
  const a = attempts && attempts[ip];
  return !!a && Date.now() - a.start <= WINDOW_MS && a.count >= MAX_FAILURES;
}

export async function recordLoginFailure(ip) {
  memoryLimit(`login:${ip}`, MAX_FAILURES, WINDOW_MS);
  const attempts = await loadAttempts();
  if (!attempts) return;
  prune(attempts);
  const a = attempts[ip];
  attempts[ip] = a ? { count: a.count + 1, start: a.start } : { count: 1, start: Date.now() };
  try { await writeJson(FILE, attempts, "private"); } catch { /* memory limit still applies */ }
}

export async function clearLoginFailures(ip) {
  memory.delete(`login:${ip}`);
  const attempts = await loadAttempts();
  if (!attempts || !attempts[ip]) return;
  delete attempts[ip];
  try { await writeJson(FILE, attempts, "private"); } catch { /* ignore */ }
}
