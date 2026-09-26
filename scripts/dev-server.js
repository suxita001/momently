/* Local preview of the whole site (static pages + /api routes + /admin) without Vercel.
   Data is stored in ./.local-blob instead of Vercel Blob. Not deployed (see .vercelignore).

   PowerShell:
     $env:ADMIN_PASSWORD="choose-a-password"; $env:SESSION_SECRET="at-least-32-random-characters-here!!"; npm run local
   Then open http://localhost:4321 and http://localhost:4321/admin */
import http from "node:http";
import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { randomBytes } from "node:crypto";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
process.chdir(root);
process.env.LOCAL_BLOB_DIR ||= path.join(root, ".local-blob");
// Local only: a random session secret per run if none is set (you just log in again after a restart).
process.env.SESSION_SECRET ||= randomBytes(32).toString("hex");
const PORT = Number(process.env.PORT || 4321);

const TYPES = {
  ".html": "text/html; charset=utf-8", ".css": "text/css; charset=utf-8", ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8", ".png": "image/png", ".jpg": "image/jpeg", ".webp": "image/webp",
  ".svg": "image/svg+xml", ".ico": "image/x-icon"
};

async function serveFile(res, file) {
  try {
    const data = await fs.readFile(file);
    res.writeHead(200, { "Content-Type": TYPES[path.extname(file)] || "application/octet-stream" });
    res.end(data);
  } catch {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Not found");
  }
}

/* Apply the "headers" rules from vercel.json like Vercel does (a function may still override them). */
const vercelConfig = JSON.parse(await fs.readFile(path.join(root, "vercel.json"), "utf8"));
const headerRules = (vercelConfig.headers || []).map(rule => ({
  test: new RegExp("^" + rule.source.replace(/\(\.\*\)/g, "(.*)") + "$"),
  headers: rule.headers
}));

http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  const pathname = decodeURIComponent(url.pathname);
  for (const rule of headerRules) {
    if (rule.test.test(pathname)) rule.headers.forEach(h => res.setHeader(h.key, h.value));
  }

  // API routes: /api/<name> -> api/<name>.js
  if (pathname.startsWith("/api/")) {
    const name = pathname.slice(5);
    if (!/^[a-z-]+$/.test(name)) { res.writeHead(404); return res.end(); }
    try {
      const mod = await import(pathToFileURL(path.join(root, "api", `${name}.js`)).href);
      return await mod.default(req, res);
    } catch (err) {
      if (err.code === "ERR_MODULE_NOT_FOUND") { res.writeHead(404); return res.end("Not found"); }
      console.error(err);
      res.writeHead(500); return res.end("Server error");
    }
  }

  // uploaded images in local mode
  if (pathname.startsWith("/_localblob/")) {
    return serveFile(res, path.join(process.env.LOCAL_BLOB_DIR, "public", pathname.slice("/_localblob/".length).replace(/\.\./g, "")));
  }

  // static files (same rewrite as vercel.json: /admin -> admin.html)
  let file = pathname === "/" ? "/index.html" : pathname === "/admin" ? "/admin.html" : pathname;
  file = path.join(root, file.replace(/\.\./g, ""));
  if (!file.startsWith(root) || /[\\/](\.|node_modules|scripts|api)/.test(path.relative(root, file).replace(/^/, "/"))) {
    res.writeHead(404); return res.end("Not found");
  }
  const stat = await fs.stat(file).catch(() => null);
  if (stat && stat.isDirectory()) file = path.join(file, "index.html");
  return serveFile(res, file);
}).on("error", err => {
  if (err.code === "EADDRINUSE") console.error(`Port ${PORT} is already used by another program. Close it or run with another port, e.g.  set PORT=4322`);
  else console.error(err);
  process.exit(1);
}).listen(PORT, "localhost", () => {
  console.log(`MOMENTLY local server: http://localhost:${PORT}  (admin: /admin, data: ${process.env.LOCAL_BLOB_DIR})`);
  if ((process.env.ADMIN_PASSWORD || "").length < 8) {
    console.warn("ADMIN_PASSWORD is not set (or shorter than 8 characters) - the admin login will not work.");
  }
});
