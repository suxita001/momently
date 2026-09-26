/* GET /api/session – 200 if the session cookie is valid, 401 otherwise.
   The admin panel calls this before rendering anything. */
import { route, sendJson } from "./_lib/http.js";
import { requireAuth } from "./_lib/session.js";

export default route(["GET"], async (req, res) => {
  requireAuth(req);
  sendJson(res, 200, { ok: true });
});
