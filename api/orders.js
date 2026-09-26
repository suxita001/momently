/* Admin only.
   GET    /api/orders          – all orders, newest first
   PATCH  /api/orders          – { id, status } change status
   DELETE /api/orders?id=...   – delete one order */
import { route, sendJson, readJson, assertSameOrigin, HttpError } from "./_lib/http.js";
import { requireAuth } from "./_lib/session.js";
import { readJson as readStored, updateJson } from "./_lib/storage.js";
import { ORDERS_FILE } from "./order.js";

export const STATUSES = ["new", "in_progress", "paid", "done"];

export default route(["GET", "PATCH", "DELETE"], async (req, res) => {
  requireAuth(req);

  if (req.method === "GET") {
    const doc = await readStored(ORDERS_FILE, "private");
    const orders = doc && Array.isArray(doc.data.orders) ? doc.data.orders : [];
    orders.sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));
    return sendJson(res, 200, { orders });
  }

  assertSameOrigin(req);

  if (req.method === "PATCH") {
    const body = await readJson(req, 2_000);
    if (!body || typeof body.id !== "string" || !STATUSES.includes(body.status)) {
      throw new HttpError(400, "Invalid status update");
    }
    const found = await updateJson(ORDERS_FILE, "private", () => ({ orders: [] }), data => {
      const order = data.orders.find(o => o.id === body.id);
      if (order) { order.status = body.status; order.updatedAt = new Date().toISOString(); }
      return !!order;
    });
    if (!found) throw new HttpError(404, "Order not found");
    return sendJson(res, 200, { ok: true });
  }

  // DELETE
  const id = new URL(req.url, "http://localhost").searchParams.get("id") || "";
  if (!/^[0-9a-f-]{36}$/.test(id)) throw new HttpError(400, "Invalid id");
  const removed = await updateJson(ORDERS_FILE, "private", () => ({ orders: [] }), data => {
    const before = data.orders.length;
    data.orders = data.orders.filter(o => o.id !== id);
    return data.orders.length < before;
  });
  if (!removed) throw new HttpError(404, "Order not found");
  sendJson(res, 200, { ok: true });
});
