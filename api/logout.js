/* POST /api/logout – admin only; clears the session cookie. */
import { route, sendJson, assertSameOrigin } from "./_lib/http.js";
import { requireAuth, clearSessionCookie } from "./_lib/session.js";

export default route(["POST"], async (req, res) => {
  assertSameOrigin(req);
  requireAuth(req);
  clearSessionCookie(res);
  sendJson(res, 200, { ok: true });
});
