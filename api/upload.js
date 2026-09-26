/* POST /api/upload – admin only. Body = the raw image file, Content-Type = its type.
   JPG / PNG / WebP up to 3 MB; the file signature is checked, not just the header.
   Returns { url } of the public Blob file. */
import { route, sendJson, readBody, assertSameOrigin, HttpError } from "./_lib/http.js";
import { requireAuth } from "./_lib/session.js";
import { uploadImage } from "./_lib/storage.js";

const MAX_BYTES = 3 * 1024 * 1024;
const TYPES = {
  "image/jpeg": { ext: "jpg", ok: b => b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff },
  "image/png": { ext: "png", ok: b => b.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) },
  "image/webp": { ext: "webp", ok: b => b.toString("ascii", 0, 4) === "RIFF" && b.toString("ascii", 8, 12) === "WEBP" }
};

export default route(["POST"], async (req, res) => {
  assertSameOrigin(req);
  requireAuth(req);

  const type = String(req.headers["content-type"] || "").split(";")[0].trim().toLowerCase();
  const kind = TYPES[type];
  if (!kind) throw new HttpError(415, "Only JPG, PNG or WebP images are allowed");

  const buffer = await readBody(req, MAX_BYTES);
  if (buffer.length < 12 || !kind.ok(buffer)) throw new HttpError(415, "The file is not a valid image");

  const url = await uploadImage(buffer, kind.ext, type);
  sendJson(res, 200, { url });
});
