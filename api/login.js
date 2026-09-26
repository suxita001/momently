/* POST /api/login – { password } → sets the signed session cookie.
   5 failed attempts per IP within 15 minutes → blocked; every failure is slowed down. */
import { route, sendJson, readJson, assertSameOrigin, clientIp, sleep, HttpError } from "./_lib/http.js";
import { checkPassword, setSessionCookie, assertAdminConfigured } from "./_lib/session.js";
import { isLoginBlocked, recordLoginFailure, clearLoginFailures } from "./_lib/ratelimit.js";

export default route(["POST"], async (req, res) => {
  assertSameOrigin(req);
  assertAdminConfigured();
  const ip = clientIp(req);

  if (await isLoginBlocked(ip)) {
    await sleep(800);
    throw new HttpError(429, "Too many failed attempts. Try again in 15 minutes.");
  }

  const body = await readJson(req, 2_000);
  if (!checkPassword(body && body.password)) {
    await recordLoginFailure(ip);
    await sleep(700 + Math.floor(Math.random() * 500));
    throw new HttpError(401, "Wrong password");
  }

  await clearLoginFailures(ip);
  setSessionCookie(res);
  sendJson(res, 200, { ok: true });
});
