/* =========================================================
   MOMENTLY — CONFIGURATION
   ---------------------------------------------------------
   This is the only place you need to edit to connect the
   site to your real accounts. Every button, link and form
   on index.html and demo.html reads from here.
   ========================================================= */
const CONFIG = {
  // WhatsApp number in international format, digits only.
  // Example for Georgia: "995555123456"  (no +, spaces or dashes)
  whatsappNumber: "YOUR_WHATSAPP_NUMBER",

  // Public contact email shown in the footer and contact section.
  email: "hello@YOUR_DOMAIN",

  // Your website domain (shown as the example personal link on demo pages).
  domain: "YOUR_DOMAIN",

  // Social profiles.
  instagram: "https://instagram.com/YOUR_INSTAGRAM",
  tiktok:    "https://tiktok.com/@YOUR_TIKTOK",

  // Contact-form requests are saved by /api/order and shown in the admin panel (/admin).
  // The WhatsApp number, links and email above can also be changed there without a redeploy;
  // values saved in the admin panel win over the ones in this file.

  // Language shown on a visitor's first visit: "ka" (Georgian) or "en".
  defaultLang: "ka"
};


/* =========================================================
   Shared helpers (used by script.js and demo.js)
   No need to edit below this line.
   ========================================================= */
const LANGS = ["ka", "en"];
const LANG_STORAGE_KEY = "momently-lang";

function getSavedLang() {
  try {
    const saved = localStorage.getItem(LANG_STORAGE_KEY);
    if (LANGS.includes(saved)) return saved;
  } catch (e) { /* storage blocked: fall through to default */ }
  return CONFIG.defaultLang;
}

function saveLang(lang) {
  try { localStorage.setItem(LANG_STORAGE_KEY, lang); } catch (e) { /* ignore */ }
}

/* Phones & tablets open the WhatsApp app; desktops open WhatsApp Web. */
function isMobileDevice() {
  return /Android|iPhone|iPad|iPod|Mobile|Opera Mini|IEMobile/i.test(navigator.userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1); // iPadOS
}

let warnedAboutNumber = false;

/* Builds the WhatsApp link. The ONLY place the number is used.
   By default the chat opens with MOMENTLY (CONFIG.whatsappNumber).
   Pass phone = "" to let the visitor pick the recipient instead
   (used by in-demo buttons such as "RSVP" or "Send wishes"). */
function whatsappUrl(message, phone = CONFIG.whatsappNumber) {
  const usesConfig = phone === CONFIG.whatsappNumber;
  phone = String(phone).replace(/\D/g, "");
  if (usesConfig && !phone && !warnedAboutNumber) {
    console.warn("MOMENTLY: set CONFIG.whatsappNumber in config.js to your WhatsApp number.");
    warnedAboutNumber = true;
  }
  const text = encodeURIComponent(message || "");
  return isMobileDevice()
    ? `https://wa.me/${phone}?text=${text}`
    : `https://web.whatsapp.com/send?${phone ? `phone=${phone}&` : ""}text=${text}`;
}

/* Opens a WhatsApp chat with a pre-filled message. */
function openWhatsApp(message, phone) {
  const url = whatsappUrl(message, phone);
  if (isMobileDevice()) window.location.href = url;
  else window.open(url, "_blank", "noopener");
}

/* ---------- Content saved in the admin panel ----------
   One request per page. Resolves to the content object, or null when the API
   isn't reachable (e.g. opening the files locally) — pages then keep the defaults. */
const SITE_CONTENT = (function () {
  if (!/^https?:$/.test(location.protocol) || typeof fetch !== "function") return Promise.resolve(null);
  return fetch("/api/content", { headers: { Accept: "application/json" } })
    .then(res => (res.ok ? res.json() : null))
    .then(content => {
      if (content && content.contact) applyContactContent(content.contact);
      return content;
    })
    .catch(() => null);
})();

/* Contact values from the admin panel override CONFIG (only if they look valid). */
function applyContactContent(c) {
  if (/^\d{7,15}$/.test(c.whatsapp || "")) CONFIG.whatsappNumber = c.whatsapp;
  if (/^https:\/\/\S+$/.test(c.instagram || "")) CONFIG.instagram = c.instagram;
  if (/^https:\/\/\S+$/.test(c.tiktok || "")) CONFIG.tiktok = c.tiktok;
  if (/^[^\s@<>"']+@[^\s@<>"']+\.[^\s@<>"']+$/.test(c.email || "")) CONFIG.email = c.email;
}
