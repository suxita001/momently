/* GET  /api/content            – public: saved content (or the defaults), cached briefly at the edge
   GET  /api/content?admin=1    – admin: same, never cached (so the panel always sees the latest save)
   GET  /api/content?defaults=1 – public: the shipped defaults (used by "Reset to defaults")
   PUT  /api/content            – admin: validate and save the whole content document */
import { route, sendJson, readJson, assertSameOrigin } from "./_lib/http.js";
import { requireAuth } from "./_lib/session.js";
import { readJson as readStored, writeJson } from "./_lib/storage.js";
import { CONTENT_FILE, contentOrDefaults, sanitizeContent, loadDefaults } from "./_lib/content.js";

/* Browsers always revalidate (so a save shows up on the next page load);
   only Vercel's CDN keeps a copy for 30 s and refreshes it in the background. */
const PUBLIC_CACHE = "public, max-age=0, must-revalidate";
const CDN_CACHE = "max-age=30, stale-while-revalidate=300";

async function loadStored() {
  try {
    const doc = await readStored(CONTENT_FILE, "public");
    return doc ? doc.data : null;
  } catch (err) {
    // Blob unreachable or not configured: the site keeps working on its defaults.
    console.error("Reading content failed:", err.message);
    return null;
  }
}

export default route(["GET", "PUT"], async (req, res) => {
  const params = new URL(req.url, "http://localhost").searchParams;

  if (req.method === "GET") {
    if (params.has("defaults")) return sendJson(res, 200, loadDefaults(), { cache: "public, max-age=300" });
    if (params.has("admin")) {
      requireAuth(req);
      return sendJson(res, 200, contentOrDefaults(await loadStored()));
    }
    res.setHeader("Vercel-CDN-Cache-Control", CDN_CACHE);
    return sendJson(res, 200, contentOrDefaults(await loadStored()), { cache: PUBLIC_CACHE });
  }

  // PUT: save (admin only)
  assertSameOrigin(req);
  requireAuth(req);
  const clean = sanitizeContent(await readJson(req, 200_000));
  await writeJson(CONTENT_FILE, clean, "public");
  sendJson(res, 200, clean);
});
