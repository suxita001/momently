/* Small HTTP helpers shared by every API route.
   Files in api/_lib are not deployed as routes (underscore prefix). */

export class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

/* Send JSON. Admin/auth routes default to no-store. */
export function sendJson(res, status, data, { cache = "no-store" } = {}) {
  const body = JSON.stringify(data);
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", cache);
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.end(body);
}

/* Run a handler and turn thrown HttpErrors into JSON responses. */
export function route(methods, handler) {
  return async (req, res) => {
    try {
      if (!methods.includes(req.method)) {
        res.setHeader("Allow", methods.join(", "));
        throw new HttpError(405, "Method not allowed");
      }
      await handler(req, res);
    } catch (err) {
      if (err instanceof HttpError) return sendJson(res, err.status, { error: err.message });
      console.error(err);
      sendJson(res, 500, { error: "Server error" });
    }
  };
}

/* Read the raw request body with a hard size limit (never trust Content-Length alone). */
export async function readBody(req, limit) {
  const declared = Number(req.headers["content-length"] || 0);
  if (declared > limit) throw new HttpError(413, "Request too large");
  const chunks = [];
  let size = 0;
  for await (const chunk of req) {
    size += chunk.length;
    if (size > limit) throw new HttpError(413, "Request too large");
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
}

/* Parse a JSON body. Requiring application/json also blocks classic cross-site form posts. */
export async function readJson(req, limit = 200_000) {
  if (!String(req.headers["content-type"] || "").toLowerCase().startsWith("application/json")) {
    throw new HttpError(415, "Expected application/json");
  }
  const raw = await readBody(req, limit);
  try {
    return JSON.parse(raw.toString("utf8") || "null");
  } catch {
    throw new HttpError(400, "Invalid JSON");
  }
}

/* Reject state-changing requests coming from another site (defence in depth next to SameSite=Strict). */
export function assertSameOrigin(req) {
  const origin = req.headers.origin;
  if (!origin) return; // same-origin fetches from some browsers omit it for same-origin GET; non-browser clients have no cookie anyway
  const host = req.headers["x-forwarded-host"] || req.headers.host;
  try {
    if (new URL(origin).host === host) return;
  } catch { /* fall through */ }
  throw new HttpError(403, "Cross-origin request blocked");
}

/* Best-effort client IP (Vercel sets x-real-ip and x-forwarded-for). */
export function clientIp(req) {
  const fwd = String(req.headers["x-forwarded-for"] || "").split(",")[0].trim();
  return String(req.headers["x-real-ip"] || fwd || req.socket?.remoteAddress || "unknown").slice(0, 64);
}

export const sleep = ms => new Promise(r => setTimeout(r, ms));
