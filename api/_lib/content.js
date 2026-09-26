/* Editable site content: defaults + strict validation.

   content.default.json (project root) holds the defaults — the site as it is shipped.
   Saved content is rebuilt field by field from this schema, so unknown fields,
   wrong types, oversized text or unsafe URLs never reach storage or the public site. */
import { readFileSync } from "node:fs";
import path from "node:path";
import { HttpError } from "./http.js";

export const SERVICE_IDS = ["love", "birthday", "wedding", "graduation", "event", "baby", "custom"];
export const PLAN_IDS = ["basic", "premium", "custom"];
export const THEMES = ["rose", "sage", "cream", "navy", "sand", "sky", "ivory", "neon", "noir"];
export const CONTENT_FILE = "content.json";

let cachedDefaults = null;
export function loadDefaults() {
  if (!cachedDefaults) {
    cachedDefaults = JSON.parse(readFileSync(path.join(process.cwd(), "content.default.json"), "utf8"));
  }
  return structuredClone(cachedDefaults);
}

const fail = msg => { throw new HttpError(400, msg); };

/* ---------- field validators ---------- */
const CONTROL = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;

function text(value, max, where, { multiline = false, required = false } = {}) {
  if (typeof value !== "string") fail(`${where}: expected text`);
  let v = value.replace(/\r\n?/g, "\n").replace(CONTROL, "");
  v = multiline ? v.split("\n").map(l => l.trim()).join("\n").trim() : v.replace(/\s*\n\s*/g, " ").trim();
  if (v.length > max) fail(`${where}: too long (max ${max} characters)`);
  if (required && !v) fail(`${where}: required`);
  return v;
}

function bilingual(value, max, where, opts) {
  if (!value || typeof value !== "object" || Array.isArray(value)) fail(`${where}: expected { ka, en }`);
  return { ka: text(value.ka, max, `${where} (KA)`, opts), en: text(value.en, max, `${where} (EN)`, opts) };
}

const HTTPS_URL = /^https:\/\/[^\s"'<>\\`]{3,400}$/;
function httpsUrl(value, where) {
  const v = text(value, 400, where);
  if (!v) return "";
  if (!HTTPS_URL.test(v)) fail(`${where}: must be an https:// link`);
  try { new URL(v); } catch { fail(`${where}: invalid link`); }
  return v;
}

/* Demo links: an https URL or a relative .html page on this site (e.g. demos/love.html). */
const RELATIVE_PAGE = /^\/?[A-Za-z0-9_\-./]+\.html(#[A-Za-z0-9_-]*)?$/;
function demoLink(value, where) {
  const v = text(value, 400, where, { required: true });
  if (RELATIVE_PAGE.test(v) && !v.includes("..")) return v;
  return httpsUrl(v, where);
}

/* Images: only files uploaded to our own Blob store (or the local dev store). */
const BLOB_IMAGE = /^https:\/\/[a-z0-9-]+\.public\.blob\.vercel-storage\.com\/[A-Za-z0-9_\-./%]+$/;
const LOCAL_IMAGE = /^\/_localblob\/uploads\/[A-Za-z0-9_\-.]+$/;
function imageUrl(value, where) {
  const v = text(value ?? "", 400, where);
  if (!v || BLOB_IMAGE.test(v) || LOCAL_IMAGE.test(v)) return v;
  fail(`${where}: images must be uploaded through the admin panel`);
}

function whatsapp(value, where) {
  const v = text(value, 30, where).replace(/[\s()+-]/g, "");
  if (v && !/^\d{7,15}$/.test(v)) fail(`${where}: digits only, international format (e.g. 995555123456)`);
  return v;
}

function email(value, where) {
  const v = text(value, 120, where);
  if (v && !/^[^\s@<>"']+@[^\s@<>"']+\.[^\s@<>"']+$/.test(v)) fail(`${where}: invalid email`);
  return v;
}

function bool(value, where) {
  if (typeof value !== "boolean") fail(`${where}: expected true/false`);
  return value;
}

function list(value, where, min, max) {
  if (!Array.isArray(value)) fail(`${where}: expected a list`);
  if (value.length < min || value.length > max) fail(`${where}: needs ${min}–${max} items`);
  return value;
}

/* ---------- sections ---------- */
const sections = {
  hero(h) {
    return {
      title: bilingual(h.title, 120, "Hero headline", { required: true }),
      accent: bilingual(h.accent, 60, "Hero highlighted words"),
      lead: bilingual(h.lead, 300, "Hero subheadline")
    };
  },

  services(list7) {
    list(list7, "Services", SERVICE_IDS.length, SERVICE_IDS.length);
    return SERVICE_IDS.map((id, i) => {
      const s = list7[i] || {};
      if (s.id !== id) fail(`Services: unexpected card order (expected "${id}")`);
      return {
        id,
        title: bilingual(s.title, 80, `Service "${id}" title`, { required: true }),
        desc: bilingual(s.desc, 300, `Service "${id}" description`),
        price: bilingual(s.price, 40, `Service "${id}" price`)
      };
    });
  },

  plans(plans) {
    list(plans, "Pricing plans", PLAN_IDS.length, PLAN_IDS.length);
    return PLAN_IDS.map((id, i) => {
      const p = plans[i] || {};
      if (p.id !== id) fail(`Pricing: unexpected plan order (expected "${id}")`);
      return {
        id,
        name: bilingual(p.name, 40, `Plan "${id}" name`, { required: true }),
        price: text(p.price, 20, `Plan "${id}" price`, { required: true }),
        popular: bool(p.popular, `Plan "${id}" most popular`),
        features: list(p.features, `Plan "${id}" features`, 1, 12)
          .map((f, j) => bilingual(f, 100, `Plan "${id}" feature ${j + 1}`, { required: true }))
      };
    });
  },

  work(items) {
    list(items, "Work items", 0, 24);
    const ids = new Set();
    return items.map((w, i) => {
      const where = `Work item ${i + 1}`;
      if (!w || typeof w !== "object") fail(`${where}: invalid`);
      if (typeof w.id !== "string" || !/^[a-z0-9-]{1,40}$/.test(w.id) || ids.has(w.id)) fail(`${where}: invalid id`);
      ids.add(w.id);
      if (!THEMES.includes(w.theme)) fail(`${where}: unknown theme`);
      const screen = w.screen || {};
      return {
        id: w.id,
        title: bilingual(w.title, 80, `${where} title`, { required: true }),
        category: bilingual(w.category, 60, `${where} category`),
        desc: bilingual(w.desc, 300, `${where} description`),
        price: text(w.price ?? "", 20, `${where} price`),
        link: demoLink(w.link, `${where} demo link`),
        theme: w.theme,
        image: imageUrl(w.image, `${where} image`),
        screen: {
          label: bilingual(screen.label, 40, `${where} screen label`),
          title: bilingual(screen.title, 60, `${where} screen title`, { multiline: true, required: true }),
          date: bilingual(screen.date, 40, `${where} screen date`)
        }
      };
    });
  },

  contact(c) {
    return {
      instagram: httpsUrl(c.instagram, "Instagram link"),
      tiktok: httpsUrl(c.tiktok, "TikTok link"),
      whatsapp: whatsapp(c.whatsapp, "WhatsApp number"),
      email: email(c.email, "Email"),
      message: bilingual(c.message, 500, "WhatsApp message", { required: true })
    };
  }
};

export const SECTION_NAMES = Object.keys(sections);

/* Validate content strictly. Sections missing from the input fall back to the defaults.
   Throws HttpError(400) with a readable message on the first problem. */
export function sanitizeContent(input, defaults = loadDefaults()) {
  if (!input || typeof input !== "object" || Array.isArray(input)) fail("Content must be an object");
  const out = { version: 1 };
  for (const name of SECTION_NAMES) {
    const value = input[name] === undefined ? defaults[name] : input[name];
    if (value === null || typeof value !== "object") fail(`${name}: invalid section`);
    out[name] = sections[name](value);
  }
  return out;
}

/* Lenient version for reading stored content: a broken section falls back to its default. */
export function contentOrDefaults(stored) {
  const defaults = loadDefaults();
  if (!stored || typeof stored !== "object") return defaults;
  const out = { version: 1 };
  for (const name of SECTION_NAMES) {
    try {
      out[name] = stored[name] === undefined ? defaults[name] : sections[name](stored[name]);
    } catch (err) {
      console.error(`Stored content section "${name}" is invalid, using defaults:`, err.message);
      out[name] = defaults[name];
    }
  }
  return out;
}
