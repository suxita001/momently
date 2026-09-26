/* =========================================================
   MOMENTLY — script
   Settings (WhatsApp number, email, links) live in config.js.
   Texts live in translations.js. Content saved in the admin
   panel (/admin) is loaded from /api/content and applied on top.
   ========================================================= */

document.documentElement.classList.add("js");

const $  = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => root.querySelectorAll(sel);

let lang = getSavedLang();

/* Texts from the admin panel override translations.js key by key. */
const OVERRIDES = { ka: {}, en: {} };
const t = key => OVERRIDES[lang]?.[key] ?? (I18N[lang] && I18N[lang][key]) ?? I18N.ka[key] ?? key;


/* ---------- Contact links from CONFIG ---------- */
function applyContactLinks() {
  const contactUrls = {
    instagram: CONFIG.instagram,
    tiktok: CONFIG.tiktok,
    email: `mailto:${CONFIG.email}`
  };
  $$("[data-contact]").forEach(a => { a.href = contactUrls[a.dataset.contact]; });
  $$("[data-config-text]").forEach(el => { el.textContent = CONFIG[el.dataset.configText]; });
}
applyContactLinks();


/* ---------- WhatsApp ----------
   Any element with data-wa="<key>" opens WhatsApp with the
   message "msg.<key>" from translations.js, in the current language. */
function refreshWhatsAppLinks() {
  // Real hrefs too, so long-press / "copy link" / middle-click also work.
  $$("[data-wa]").forEach(a => { a.href = whatsappUrl(t("msg." + a.dataset.wa)); });
}

document.addEventListener("click", e => {
  const link = e.target.closest("[data-wa]");
  if (!link) return;
  e.preventDefault();
  openWhatsApp(t("msg." + link.dataset.wa));
});


/* ---------- Header: border on scroll ---------- */
const header = $("#header");
const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 10);
onScroll();
window.addEventListener("scroll", onScroll, { passive: true });


/* ---------- Scroll-spy: underline the nav link of the section in view ----------
   Sections without a nav link (Our Work, Pricing, About, FAQ) leave all links plain. */
const spyLinks = $$('.nav a[href^="#"]:not(.btn)');
const spySections = $$("main > section[id]");
let spyTicking = false;
const updateSpy = () => {
  const line = window.innerHeight * 0.35;
  let current = spySections[0] && spySections[0].id;
  spySections.forEach(sec => { if (sec.getBoundingClientRect().top <= line) current = sec.id; });
  spyLinks.forEach(a => {
    const on = a.getAttribute("href") === "#" + current;
    a.classList.toggle("active", on);
    if (on) a.setAttribute("aria-current", "true"); else a.removeAttribute("aria-current");
  });
  spyTicking = false;
};
window.addEventListener("scroll", () => { if (!spyTicking) { spyTicking = true; requestAnimationFrame(updateSpy); } }, { passive: true });
window.addEventListener("resize", updateSpy);
updateSpy();


/* ---------- Mobile menu ---------- */
const burger = $("#burger");
const nav = $("#nav");
const setMenu = open => {
  nav.classList.toggle("open", open);
  burger.classList.toggle("open", open);
  burger.setAttribute("aria-expanded", open);
  burger.setAttribute("aria-label", t(open ? "a11y.menuClose" : "a11y.menuOpen"));
};
burger.addEventListener("click", () => setMenu(!nav.classList.contains("open")));
$$("a", nav).forEach(a => a.addEventListener("click", () => setMenu(false)));
document.addEventListener("keydown", e => {
  if (e.key === "Escape" && nav.classList.contains("open")) { setMenu(false); burger.focus(); }
});


/* ---------- Language ---------- */

/* Multi-line text with accent symbols, e.g. "Nika\n♥ Mari" -> Nika<br><i>♥</i> Mari.
   Built from text nodes only, so saved content can never inject HTML. */
function renderRich(el, text) {
  el.textContent = "";
  String(text).split("\n").forEach((line, i) => {
    if (i) el.append(document.createElement("br"));
    line.split(/([♥&])/).forEach(part => {
      if (!part) return;
      if (part === "♥" || part === "&") {
        const accent = document.createElement("i");
        accent.textContent = part;
        el.append(accent);
      } else {
        el.append(part);
      }
    });
  });
}

function applyLang(next) {
  lang = LANGS.includes(next) ? next : CONFIG.defaultLang;
  document.documentElement.lang = lang;
  document.title = t("meta.title");
  $('meta[name="description"]').setAttribute("content", t("meta.description"));

  $$("[data-i18n]").forEach(el => { el.textContent = t(el.dataset.i18n); });
  $$("[data-i18n-html]").forEach(el => { el.innerHTML = t(el.dataset.i18nHtml); });   // trusted strings from translations.js only
  $$("[data-i18n-rich]").forEach(el => renderRich(el, t(el.dataset.i18nRich)));
  $$("[data-i18n-attr]").forEach(el => {
    el.dataset.i18nAttr.split(";").forEach(pair => {
      const [attr, key] = pair.split(":").map(s => s.trim());
      el.setAttribute(attr, t(key));
    });
  });
  $$("[data-lang]").forEach(btn => btn.setAttribute("aria-pressed", btn.dataset.lang === lang));
  $$(".service__price").forEach(el => { el.hidden = !el.textContent.trim(); });   // price pills only when a price is set

  setMenu(nav.classList.contains("open"));   // re-translate burger label
  if (formStatusKey) showFormStatus(formStatusKey);
  refreshWhatsAppLinks();                     // messages follow the language
}

$$("[data-lang]").forEach(btn => btn.addEventListener("click", () => {
  if (btn.dataset.lang === lang) return;
  saveLang(btn.dataset.lang);
  applyLang(btn.dataset.lang);
}));


/* ---------- Fade-in on scroll ---------- */
const fadeObserver = "IntersectionObserver" in window
  ? new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        e.target.classList.add("visible");
        fadeObserver.unobserve(e.target);
        // once faded in, drop the stagger delay so hover effects respond instantly
        setTimeout(() => { e.target.style.transitionDelay = ""; }, 1500);
      });
    }, { threshold: 0.12 })
  : null;

function watchFade(el, step) {
  el.style.transitionDelay = `${step * 90}ms`;
  if (fadeObserver) fadeObserver.observe(el);
  else el.classList.add("visible");
}
$$(".fade").forEach((el, i) => {
  watchFade(el, el.dataset.stagger !== undefined ? +el.dataset.stagger : i % 3);   // data-stagger = order within a group
});


/* ---------- FAQ: keep only one answer open ---------- */
const faqItems = $$(".faq__item");
faqItems.forEach(item => item.addEventListener("toggle", () => {
  if (item.open) faqItems.forEach(other => { if (other !== item) other.open = false; });
}));


/* ---------- Contact form (saved by /api/order, shown in the admin panel) ---------- */
const form = $("#contactForm");
const formStatus = $("#formStatus");
const submitBtn = $("#formSubmit");
let formStatusKey = null;   // "success" | "error" | "invalid" | null

function showFormStatus(key) {
  formStatusKey = key;
  formStatus.innerHTML = t("form." + key);   // trusted strings from translations.js
  formStatus.className = "form__status form__status--" + (key === "success" ? "success" : "error");
  formStatus.hidden = false;
  refreshWhatsAppLinks();                    // the error message contains a WhatsApp link
}

function hideFormStatus() {
  formStatusKey = null;
  formStatus.hidden = true;
}

function validateForm() {
  let firstInvalid = null;
  $$("[required]", form).forEach(field => {
    const value = field.value.trim();
    const valid = value && (field.type !== "email" || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value));
    field.classList.toggle("invalid", !valid);
    field.setAttribute("aria-invalid", !valid);
    if (!valid && !firstInvalid) firstInvalid = field;
  });
  if (firstInvalid) firstInvalid.focus();
  return !firstInvalid;
}

function setSending(sending) {
  submitBtn.disabled = sending;
  submitBtn.textContent = t(sending ? "form.sending" : "form.submit");
}

form.addEventListener("submit", async e => {
  e.preventDefault();
  if (form.elements._gotcha.value) return;          // bot filled the honeypot
  if (!validateForm()) { showFormStatus("invalid"); return; }

  const f = form.elements;
  const payload = {
    name: f.name.value, email: f.email.value, phone: f.phone.value,
    type: f.type.value, message: f.message.value, _gotcha: f._gotcha.value, lang
  };

  hideFormStatus();
  setSending(true);
  try {
    const res = await fetch("/api/order", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error(`Order API responded ${res.status}`);
    form.reset();
    $$("[aria-invalid]", form).forEach(field => field.removeAttribute("aria-invalid"));
    showFormStatus("success");
  } catch (err) {
    console.error("MOMENTLY: form submission failed.", err);
    showFormStatus("error");                         // includes a WhatsApp fallback link
  } finally {
    setSending(false);
  }
});

form.addEventListener("input", e => {
  if (!e.target.classList.contains("invalid")) return;
  e.target.classList.remove("invalid");
  e.target.removeAttribute("aria-invalid");
});


/* =========================================================
   Content from the admin panel
   The HTML + translations.js are the defaults. When /api/content
   answers, its values are applied on top; on any error the page
   simply keeps the defaults.
   ========================================================= */
const THEMES = ["rose", "sage", "cream", "navy", "sand", "sky", "ivory", "neon", "noir"];
const SAFE_LINK = /^(https:\/\/[^\s"'<>\\`]+|\/?[A-Za-z0-9_\-./]+\.html(#[A-Za-z0-9_-]*)?)$/;
const SAFE_IMAGE = /^(https:\/\/[a-z0-9-]+\.public\.blob\.vercel-storage\.com\/[A-Za-z0-9_\-./%]+|\/_localblob\/uploads\/[A-Za-z0-9_\-.]+)$/;

function setText(key, value) {
  if (!value || typeof value !== "object") return;
  if (typeof value.ka === "string") OVERRIDES.ka[key] = value.ka;
  if (typeof value.en === "string") OVERRIDES.en[key] = value.en;
}

function make(tag, className, attrs = {}) {
  const el = document.createElement(tag);
  if (className) el.className = className;
  for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
  return el;
}

/* ----- Pricing plans ----- */
const planDefaults = {};   // original name/price, to keep the translated WhatsApp messages unless they change

function applyPlan(p) {
  const card = $(`.plan[data-plan="${p.id}"]`);
  if (!card) return;
  const priceEl = $(".plan__price", card);
  planDefaults[p.id] ??= { price: priceEl.textContent, ka: I18N.ka[`plan.${p.id}`], en: I18N.en[`plan.${p.id}`] };

  setText(`plan.${p.id}`, p.name);
  priceEl.textContent = p.price;

  const list = $("ul", card);
  list.textContent = "";
  p.features.forEach((feature, i) => {
    const key = `plan.${p.id}.f${i + 1}`;
    setText(key, feature);
    list.append(make("li", "", { "data-i18n": key }));
  });

  card.classList.toggle("plan--featured", !!p.popular);
  let badge = $(".badge", card);
  if (p.popular && !badge) { badge = make("span", "badge", { "data-i18n": "plan.popular" }); card.prepend(badge); }
  if (!p.popular && badge) badge.remove();
  const btn = $(".btn", card);
  btn.classList.toggle("btn--light", !!p.popular);
  btn.classList.toggle("btn--ghost", !p.popular);

  const d = planDefaults[p.id];
  if (p.price !== d.price || p.name.ka !== d.ka || p.name.en !== d.en) {
    setText(`msg.${p.id === "custom" ? "customPlan" : p.id}`, {
      ka: `გამარჯობა MOMENTLY! მაინტერესებს ${p.name.ka} პაკეტი (${p.price}). მინდა დეტალები გავიგო.`,
      en: `Hi MOMENTLY! I'm interested in the ${p.name.en} package (${p.price}). I'd like to know more about the details.`
    });
  }
}

/* ----- Our Work cards (rebuilt from the saved list) ----- */
const workTemplates = {};   // per theme: decoration SVG, divider ornament, wedding rings — taken from the shipped cards
$$("#workGrid .thumb").forEach(thumb => {
  const theme = [...thumb.classList].find(c => c.startsWith("theme-"))?.slice(6);
  if (!theme || workTemplates[theme]) return;
  workTemplates[theme] = {
    deco: $(".mini__deco", thumb)?.cloneNode(true),
    ornament: $(".mini__div b", thumb)?.textContent || "✦",
    rings: $(".mini__rings", thumb)?.cloneNode(true)
  };
});

function buildWorkCard(item) {
  const key = `work.${item.id}`;
  ["title", "category", "desc"].forEach(f => setText(`${key}.${f}`, item[f]));
  ["label", "title", "date"].forEach(f => setText(`${key}.screen.${f}`, item.screen[f]));

  const theme = THEMES.includes(item.theme) ? item.theme : "cream";
  const tpl = workTemplates[theme] || {};
  const link = SAFE_LINK.test(item.link) ? item.link : "#work";
  const nameId = `w-${item.id}-name`;

  const article = make("article", "project fade");
  const thumb = make("a", `thumb theme-${theme}`, { href: link, target: "_blank", rel: "noopener", tabindex: "-1", "aria-hidden": "true" });
  thumb.append(make("span", "demo-tag", { "data-i18n": "work.badge" }));

  const mini = make("div", "mini");
  if (SAFE_IMAGE.test(item.image || "")) {
    mini.classList.add("mini--photo");
    mini.style.setProperty("--photo", `url("${item.image}")`);
  }
  const bar = make("span", "mini__bar", { "aria-hidden": "true" });
  bar.append(Object.assign(make("b"), { textContent: "9:41" }), make("i"), Object.assign(make("b"), { textContent: "●●●" }));
  mini.append(bar);
  if (tpl.deco) mini.append(tpl.deco.cloneNode(true));
  mini.append(make("span", "s-small", { "data-i18n": `${key}.screen.label` }));
  if (tpl.rings) mini.append(tpl.rings.cloneNode(true));
  mini.append(make("span", "s-title", { "data-i18n-rich": `${key}.screen.title` }));
  const divider = make("span", "mini__div", { "aria-hidden": "true" });
  divider.append(make("i"), Object.assign(make("b"), { textContent: tpl.ornament || "✦" }), make("i"));
  mini.append(divider);
  mini.append(make("span", "s-small mini__date", { "data-i18n": `${key}.screen.date` }));
  mini.append(make("span", "mini__btn", { "data-i18n": "work.open" }));
  mini.append(make("span", "mini__swipe", { "aria-hidden": "true" }));
  thumb.append(mini);

  const info = make("div", "project__info");
  info.append(make("p", "project__cat", { "data-i18n": `${key}.category` }));
  info.append(make("h3", "", { id: nameId, "data-i18n": `${key}.title` }));
  info.append(make("p", "project__desc", { "data-i18n": `${key}.desc` }));
  if (item.price) info.append(Object.assign(make("span", "project__price"), { textContent: item.price }));

  const button = make("a", "btn btn--small", { href: link, target: "_blank", rel: "noopener", "aria-describedby": nameId });
  const arrow = make("span", "", { "aria-hidden": "true" });
  arrow.textContent = " ↗";
  button.append(make("span", "", { "data-i18n": "work.view" }), arrow);

  article.append(thumb, info, button);
  return article;
}

function applyWork(items) {
  const grid = $("#workGrid");
  if (!grid || !Array.isArray(items)) return;
  grid.textContent = "";
  items.forEach((item, i) => {
    const card = buildWorkCard(item);
    grid.append(card);
    watchFade(card, i % 3);
  });
}

/* ----- Apply everything ----- */
function applyContent(c) {
  if (!c || c.version !== 1) return;
  setText("hero.titleMain", c.hero.title);
  setText("hero.titleAccent", c.hero.accent);
  setText("hero.lead", c.hero.lead);
  c.services.forEach(s => {
    setText(`svc.${s.id}.title`, s.title);
    setText(`svc.${s.id}.desc`, s.desc);
    setText(`svc.${s.id}.price`, s.price);
  });
  c.plans.forEach(applyPlan);
  applyWork(c.work);
  setText("msg.general", c.contact.message);
  applyContactLinks();   // CONFIG was already updated by config.js
  applyLang(lang);
}


/* ---------- Start ---------- */
applyLang(lang);
SITE_CONTENT.then(content => {
  try { applyContent(content); }
  catch (err) { console.error("MOMENTLY: could not apply saved content, keeping defaults.", err); }
});
