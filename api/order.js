/* POST /api/order – public contact form. Validates, rate-limits per IP and appends the
   request to orders.json in the PRIVATE Blob store with status "new". */
import { randomUUID } from "node:crypto";
import { route, sendJson, readJson, assertSameOrigin, clientIp, HttpError } from "./_lib/http.js";
import { memoryLimit } from "./_lib/ratelimit.js";
import { updateJson } from "./_lib/storage.js";

export const ORDERS_FILE = "orders.json";
export const ORDER_TYPES = ["Love / Anniversary", "Birthday", "Wedding", "Event", "Graduation", "Baby / Baptism", "Custom"];

const CONTROL = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;
function clean(value, max, label, { required = false, multiline = false } = {}) {
  if (value === undefined || value === null) value = "";
  if (typeof value !== "string") throw new HttpError(400, `${label}: invalid`);
  let v = value.replace(/\r\n?/g, "\n").replace(CONTROL, "").trim();
  if (!multiline) v = v.replace(/\s+/g, " ");
  if (v.length > max) throw new HttpError(400, `${label}: too long`);
  if (required && !v) throw new HttpError(400, `${label}: required`);
  return v;
}

export default route(["POST"], async (req, res) => {
  assertSameOrigin(req);
  if (!memoryLimit(`order:${clientIp(req)}`, 5, 10 * 60 * 1000)) {
    throw new HttpError(429, "Too many requests, please try again later");
  }

  const body = await readJson(req, 20_000);
  if (!body || typeof body !== "object") throw new HttpError(400, "Invalid request");

  // Honeypot: real visitors never fill this hidden field. Pretend success, store nothing.
  if (body._gotcha) return sendJson(res, 200, { ok: true });

  const order = {
    id: randomUUID(),
    createdAt: new Date().toISOString(),
    status: "new",
    name: clean(body.name, 80, "Name", { required: true }),
    email: clean(body.email, 120, "Email", { required: true }),
    phone: clean(body.phone, 30, "Phone"),
    type: clean(body.type, 40, "Type", { required: true }),
    message: clean(body.message, 2000, "Message", { multiline: true }),
    lang: body.lang === "en" ? "en" : "ka"
  };
  if (!/^[^\s@<>"']+@[^\s@<>"']+\.[^\s@<>"']+$/.test(order.email)) throw new HttpError(400, "Email: invalid");
  if (order.phone && !/^[+\d\s()-]{5,30}$/.test(order.phone)) throw new HttpError(400, "Phone: invalid");
  if (!ORDER_TYPES.includes(order.type)) throw new HttpError(400, "Type: invalid");

  await updateJson(ORDERS_FILE, "private", () => ({ orders: [] }), data => {
    data.orders.push(order);
    if (data.orders.length > 2000) data.orders.splice(0, data.orders.length - 2000); // keep the file small
  });
  sendJson(res, 200, { ok: true });
});
