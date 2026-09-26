/* Storage on Vercel Blob.

   Two stores (Vercel sets "public" / "private" per store, not per file):
     public  – content.json + uploaded images. Uses the store connected to the project
               (the SDK authenticates automatically on Vercel).
     private – orders.json + login-attempt counters. Uses PRIVATE_BLOB_READ_WRITE_TOKEN.

   LOCAL_BLOB_DIR (local development only, see scripts/dev-server.js) swaps Blob for a folder on disk. */
import { put, get, BlobPreconditionFailedError } from "@vercel/blob";
import { promises as fs } from "node:fs";
import path from "node:path";
import { HttpError } from "./http.js";

const LOCAL_DIR = process.env.LOCAL_BLOB_DIR || "";

function blobOptions(scope) {
  if (scope === "private") {
    const token = process.env.PRIVATE_BLOB_READ_WRITE_TOKEN;
    if (!token) throw new HttpError(500, "Private storage is not configured (PRIVATE_BLOB_READ_WRITE_TOKEN)");
    return { access: "private", token };
  }
  return { access: "public" };
}

/* ---------- local-disk fallback (dev only) ---------- */
const localPath = (scope, name) => path.join(LOCAL_DIR, scope, name.replace(/\.\./g, ""));

async function localRead(scope, name) {
  try {
    const file = localPath(scope, name);
    const [text, stat] = await Promise.all([fs.readFile(file, "utf8"), fs.stat(file)]);
    return { data: JSON.parse(text), etag: String(stat.mtimeMs) };
  } catch (err) {
    if (err.code === "ENOENT") return null;
    throw err;
  }
}

async function localWrite(scope, name, body, ifMatch) {
  const file = localPath(scope, name);
  if (ifMatch) {
    const current = await localRead(scope, name);
    if (current && current.etag !== ifMatch) throw new ConflictError();
  }
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, body);
}

export class ConflictError extends Error {}

/* ---------- JSON documents ---------- */

/* Returns { data, etag } or null when the file doesn't exist yet. */
export async function readJson(name, scope) {
  if (LOCAL_DIR) return localRead(scope, name);
  const result = await get(name, { ...blobOptions(scope), useCache: false });
  if (!result || result.statusCode !== 200) return null;
  const text = await new Response(result.stream).text();
  return { data: JSON.parse(text), etag: result.blob.etag };
}

/* Overwrites the file. Pass ifMatch (etag from readJson) to fail with ConflictError
   if someone else wrote in between — used for read-modify-write updates. */
export async function writeJson(name, data, scope, { ifMatch } = {}) {
  const body = JSON.stringify(data);
  if (LOCAL_DIR) return localWrite(scope, name, body, ifMatch);
  try {
    await put(name, body, {
      ...blobOptions(scope),
      contentType: "application/json",
      addRandomSuffix: false,
      allowOverwrite: true,
      cacheControlMaxAge: 60,
      ...(ifMatch ? { ifMatch } : {})
    });
  } catch (err) {
    if (err instanceof BlobPreconditionFailedError) throw new ConflictError();
    throw err;
  }
}

/* Read-modify-write with optimistic locking and a few retries. */
export async function updateJson(name, scope, fallback, mutate) {
  for (let attempt = 0; attempt < 4; attempt++) {
    const current = await readJson(name, scope);
    const data = current ? current.data : fallback();
    const result = mutate(data);
    try {
      await writeJson(name, data, scope, { ifMatch: current?.etag });
      return result;
    } catch (err) {
      if (!(err instanceof ConflictError)) throw err;
    }
  }
  throw new HttpError(503, "Storage is busy, please try again");
}

/* ---------- images (public store) ---------- */
export async function uploadImage(buffer, ext, contentType) {
  const name = `uploads/work-${Date.now()}.${ext}`;
  if (LOCAL_DIR) {
    await fs.mkdir(path.join(LOCAL_DIR, "public", "uploads"), { recursive: true });
    await fs.writeFile(path.join(LOCAL_DIR, "public", name), buffer);
    return `/_localblob/${name}`;
  }
  const blob = await put(name, buffer, { access: "public", contentType, addRandomSuffix: true });
  return blob.url;
}
