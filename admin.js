/* =========================================================
   MOMENTLY — admin panel
   - Nothing is shown until /api/session confirms the login.
   - All data is inserted with textContent / value (never innerHTML).
   - Each content tab saves only its own section.
   ========================================================= */
(function () {
  "use strict";

  const $ = (sel, root = document) => root.querySelector(sel);

  const SECTIONS = { hero: "Hero", services: "Services", plans: "Pricing", work: "Our Work", contact: "Contact" };
  const SERVICE_NAMES = {
    love: "Love & Anniversary", birthday: "Birthday", wedding: "Wedding & Engagement", graduation: "Graduation",
    event: "Events & Parties", baby: "Baby & Baptism", custom: "Custom (dark card)"
  };
  const PLAN_NAMES = { basic: "Basic", premium: "Premium", custom: "Custom" };
  const THEMES = {
    rose: { label: "Blush (love)", color: "#f2d9d3" },
    sage: { label: "Sage (birthday)", color: "#dfe6d8" },
    cream: { label: "Cream (wedding)", color: "#f7efe3" },
    navy: { label: "Navy (graduation)", color: "#23293a" },
    sand: { label: "Sand (event)", color: "#e9dcc4" },
    sky: { label: "Sky (baby)", color: "#dbe6ee" },
    ivory: { label: "Ivory & burgundy (envelope wedding)", color: "#f3ebdd" },
    neon: { label: "Neon night (party)", color: "#150c28" },
    noir: { label: "Midnight (proposal)", color: "#140c18" }
  };
  const STATUSES = { new: "New", in_progress: "In progress", paid: "Paid", done: "Done" };
  const SAFE_IMAGE = /^(https:\/\/[a-z0-9-]+\.public\.blob\.vercel-storage\.com\/[A-Za-z0-9_\-./%]+|\/_localblob\/uploads\/[A-Za-z0-9_\-.]+)$/;
  const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
  const MAX_IMAGE = 3 * 1024 * 1024;

  const state = { saved: null, draft: null, defaults: null, orders: null, tab: "hero", busy: false, openItems: new Set() };
  const clone = v => JSON.parse(JSON.stringify(v));

  /* ---------- DOM helper (text only, never HTML) ---------- */
  function h(tag, props = {}, ...children) {
    const el = document.createElement(tag);
    for (const [key, value] of Object.entries(props)) {
      if (value == null || value === false) continue;
      if (key === "class") el.className = value;
      else if (key === "text") el.textContent = value;
      else if (key === "value") el.value = value;
      else if (key === "checked") el.checked = value;
      else if (key.startsWith("on")) el.addEventListener(key.slice(2), value);
      else el.setAttribute(key, value === true ? "" : value);
    }
    for (const child of children.flat()) {
      if (child == null || child === false) continue;
      el.append(child instanceof Node ? child : String(child));
    }
    return el;
  }

  /* ---------- toasts ---------- */
  function toast(message, kind = "") {
    const el = h("div", { class: `toast ${kind ? "toast--" + kind : ""}`, text: message });
    $("#toasts").append(el);
    setTimeout(() => el.remove(), kind === "err" ? 6000 : 3500);
  }

  /* ---------- API ---------- */
  class AuthError extends Error {}

  async function api(path, { method = "GET", json, body, headers = {} } = {}) {
    const options = { method, credentials: "same-origin", headers: { Accept: "application/json", ...headers } };
    if (json !== undefined) {
      options.body = JSON.stringify(json);
      options.headers["Content-Type"] = "application/json";
    } else if (body) {
      options.body = body;
    }
    let res;
    try { res = await fetch(path, options); }
    catch { throw new Error("Network error — check your connection"); }
    let data = {};
    try { data = await res.json(); } catch { /* empty body */ }
    if (res.status === 401 && path !== "/api/login") {
      // only mention expiry if we were actually logged in (not on the first visit)
      showLogin(state.saved ? "Your session has ended. Please log in again." : "");
      throw new AuthError("Not authenticated");
    }
    if (res.status === 404 && !data.error) {
      // a bare 404 means the /api functions are not running where this page is served
      throw new Error("The admin API was not found (404). Open /admin on your Vercel deployment (with the api/ folder deployed) or run it locally with “npm run local” — not as a file or with Live Server.");
    }
    if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`);
    return data;
  }

  /* ---------- screens ---------- */
  function showLogin(message) {
    // forget all loaded data so nothing stays in the page after logout / expiry
    Object.assign(state, { saved: null, draft: null, defaults: null, orders: null });
    $("#panel").textContent = "";
    $("#app").hidden = true;
    $("#boot").hidden = true;
    $("#login").hidden = false;
    const err = $("#loginError");
    err.textContent = message || "";
    err.hidden = !message;
    $("#password").value = "";
    $("#password").focus();
  }

  async function startApp() {
    const [content, defaults] = await Promise.all([api("/api/content?admin=1"), api("/api/content?defaults=1")]);
    state.saved = content;
    state.draft = clone(content);
    state.defaults = defaults;
    $("#boot").hidden = true;
    $("#login").hidden = true;
    $("#app").hidden = false;
    const fromHash = location.hash.slice(1);
    selectTab(SECTIONS[fromHash] || fromHash === "orders" ? fromHash : "hero");
    loadOrders().catch(() => {});   // badge count in the background
  }

  async function boot() {
    try {
      await api("/api/session");
      await startApp();
    } catch (err) {
      if (!(err instanceof AuthError)) showLogin(err.message);
    }
  }

  /* ---------- login / logout ---------- */
  $("#loginForm").addEventListener("submit", async e => {
    e.preventDefault();
    const password = $("#password").value;
    if (!password) return;
    const btn = $("#loginBtn");
    btn.disabled = true;
    btn.textContent = "Checking…";
    try {
      await api("/api/login", { method: "POST", json: { password } });
      $("#password").value = "";
      await startApp();
    } catch (err) {
      const errEl = $("#loginError");
      errEl.textContent = err.message;
      errEl.hidden = false;
    } finally {
      btn.disabled = false;
      btn.textContent = "Log in";
    }
  });

  $("#logoutBtn").addEventListener("click", async () => {
    if (anyDirty() && !confirm("You have unsaved changes. Log out anyway?")) return;
    try { await api("/api/logout", { method: "POST" }); } catch { /* cookie may already be gone */ }
    showLogin("You are logged out.");
  });

  window.addEventListener("beforeunload", e => {
    if (anyDirty()) { e.preventDefault(); e.returnValue = ""; }
  });

  /* ---------- tabs + dirty state ---------- */
  const isDirty = sec => !!state.saved && JSON.stringify(state.draft[sec]) !== JSON.stringify(state.saved[sec]);
  const anyDirty = () => Object.keys(SECTIONS).some(isDirty);

  function updateDirty() {
    document.querySelectorAll("#tabs [data-tab]").forEach(b => b.classList.toggle("dirty", !!SECTIONS[b.dataset.tab] && isDirty(b.dataset.tab)));
    const status = $("#saveStatus");
    if (status) {
      const dirty = isDirty(state.tab);
      status.textContent = dirty ? "Unsaved changes" : "All changes saved";
      status.classList.toggle("dirty", dirty);
      $("#saveBtn").disabled = !dirty || state.busy;
    }
  }
  const changed = () => updateDirty();

  function selectTab(tab) {
    state.tab = tab;
    history.replaceState(null, "", `#${tab}`);
    document.querySelectorAll("#tabs [data-tab]").forEach(b => b.setAttribute("aria-selected", b.dataset.tab === tab));
    render();
  }
  document.querySelectorAll("#tabs [data-tab]").forEach(b => b.addEventListener("click", () => selectTab(b.dataset.tab)));

  /* ---------- form building blocks ---------- */
  function biField(label, obj, key, { multiline = false, max = 300, rows = 2, hint } = {}) {
    const pair = h("div", { class: "bi" });
    ["ka", "en"].forEach(lng => {
      const input = multiline
        ? h("textarea", { rows, maxlength: max, lang: lng })
        : h("input", { type: "text", maxlength: max, lang: lng });
      input.value = obj[key][lng] ?? "";
      input.addEventListener("input", () => { obj[key][lng] = input.value; changed(); });
      pair.append(h("label", {}, h("span", { class: "lang-tag", text: lng === "ka" ? "ქართული" : "English" }), input));
    });
    return h("div", { class: "field" }, h("span", { text: label }), pair, hint && h("p", { class: "hint", text: hint }));
  }

  function textField(label, obj, key, { type = "text", max = 400, hint, placeholder, onInput } = {}) {
    const input = h("input", { type, maxlength: max, placeholder });
    input.value = obj[key] ?? "";
    input.addEventListener("input", () => { obj[key] = input.value; changed(); if (onInput) onInput(); });
    return h("label", { class: "field" }, h("span", { text: label }), input, hint && h("p", { class: "hint", text: hint }));
  }

  function panelHead(title, subtitle, ...actions) {
    return h("div", { class: "panel__head" },
      h("div", {}, h("h2", { text: title }), subtitle && h("p", { text: subtitle })),
      actions.length ? h("div", { class: "row" }, actions) : null);
  }

  function saveBar(sec) {
    return h("div", { class: "savebar" },
      h("span", { class: "status", id: "saveStatus" }),
      h("button", { type: "button", class: "btn btn--ghost btn--sm", text: "Reset to defaults", onclick: () => resetSection(sec) }),
      h("button", { type: "button", class: "btn btn--dark", id: "saveBtn", text: "Save", onclick: () => saveSection(sec) }));
  }

  /* ---------- save / reset ---------- */
  async function saveSection(sec) {
    if (state.busy) return;
    state.busy = true;
    const btn = $("#saveBtn");
    btn.disabled = true;
    btn.textContent = "Saving…";
    try {
      // publish only this tab: everything else is sent exactly as it is currently saved
      const payload = clone(state.saved);
      payload[sec] = state.draft[sec];
      const clean = await api("/api/content", { method: "PUT", json: payload });
      state.saved = clean;
      state.draft[sec] = clone(clean[sec]);
      toast(`${SECTIONS[sec]} saved. The site updates within about 30 seconds.`, "ok");
      state.busy = false;
      render();
    } catch (err) {
      state.busy = false;
      if (err instanceof AuthError) return;
      toast(err.message, "err");
      btn.textContent = "Save";
      updateDirty();
    }
  }

  function resetSection(sec) {
    if (!confirm(`Reset "${SECTIONS[sec]}" to the original texts?\nNothing changes on the site until you click Save.`)) return;
    state.draft[sec] = clone(state.defaults[sec]);
    render();
    toast("Defaults loaded — click Save to publish them.");
  }

  /* ---------- tabs ---------- */
  function render() {
    const panel = $("#panel");
    panel.textContent = "";
    if (!state.draft) return;
    const renderers = { hero: renderHero, services: renderServices, plans: renderPlans, work: renderWork, contact: renderContact, orders: renderOrders };
    renderers[state.tab](panel);
    if (SECTIONS[state.tab]) panel.append(saveBar(state.tab));
    updateDirty();
  }

  function renderHero(panel) {
    const hero = state.draft.hero;
    panel.append(
      panelHead("Hero", "The big headline at the top of the page."),
      h("div", { class: "card block" },
        biField("Headline", hero, "title", { max: 120 }),
        biField("Highlighted words (shown in italic accent colour after the headline)", hero, "accent", { max: 60 }),
        biField("Subheadline", hero, "lead", { multiline: true, rows: 3, max: 300 })));
  }

  function renderServices(panel) {
    panel.append(panelHead("Services", "The seven cards in “What we create”."));
    const stack = h("div", { class: "stack" });
    state.draft.services.forEach(s => {
      stack.append(h("div", { class: "card block" },
        h("h3", { text: SERVICE_NAMES[s.id] || s.id }),
        biField("Title", s, "title", { max: 80 }),
        biField("Description", s, "desc", { multiline: true, max: 300 }),
        biField("Starting price", s, "price", { max: 40, hint: "e.g. “49₾-დან” / “from 49₾”. Leave empty to hide the price tag." })));
    });
    panel.append(stack);
  }

  function renderPlans(panel) {
    panel.append(panelHead("Pricing", "The three packages. Only one can be “Most Popular”."));
    const stack = h("div", { class: "stack" });
    state.draft.plans.forEach(plan => {
      const features = h("div", { class: "stack" });
      plan.features.forEach((feature, i) => {
        features.append(h("div", { class: "feature" },
          biField(`Feature ${i + 1}`, plan.features, i, { max: 100 }),
          h("button", {
            type: "button", class: "icon-btn", title: "Remove feature", "aria-label": `Remove feature ${i + 1}`, text: "✕",
            disabled: plan.features.length <= 1,
            onclick: () => { plan.features.splice(i, 1); render(); }
          })));
      });
      stack.append(h("div", { class: "card block" },
        h("div", { class: "row row--between" },
          h("h3", { text: PLAN_NAMES[plan.id] }),
          h("label", { class: "radio" },
            h("input", {
              type: "radio", name: "popular", checked: plan.popular,
              onchange: () => { state.draft.plans.forEach(p => { p.popular = p === plan; }); changed(); }
            }),
            "Most Popular")),
        h("div", { class: "grid2" },
          biField("Name", plan, "name", { max: 40 }),
          textField("Price", plan, "price", { max: 20, hint: "e.g. 49₾ or 149₾+" })),
        h("span", { class: "label", text: "Features" }),
        features,
        h("div", {}, h("button", {
          type: "button", class: "btn btn--ghost btn--sm", text: "+ Add feature",
          disabled: plan.features.length >= 12,
          onclick: () => { plan.features.push({ ka: "", en: "" }); render(); }
        }))));
    });
    panel.append(stack);
  }

  function newWorkItem() {
    return {
      id: `item-${Date.now().toString(36)}`,
      title: { ka: "", en: "" }, category: { ka: "", en: "" }, desc: { ka: "", en: "" },
      price: "", link: "demos/love.html", theme: "rose", image: "",
      screen: { label: { ka: "", en: "" }, title: { ka: "", en: "" }, date: { ka: "", en: "" } }
    };
  }

  function moveItem(list, from, to) {
    if (to < 0 || to >= list.length) return;
    const [item] = list.splice(from, 1);
    list.splice(to, 0, item);
    render();
  }

  function imageField(item) {
    const preview = SAFE_IMAGE.test(item.image) ? h("img", { src: item.image, alt: "" }) : null;
    const input = h("input", { type: "file", accept: IMAGE_TYPES.join(",") });
    input.addEventListener("change", async () => {
      const file = input.files[0];
      if (!file) return;
      if (!IMAGE_TYPES.includes(file.type)) return toast("Only JPG, PNG or WebP images.", "err");
      if (file.size > MAX_IMAGE) return toast("The image is larger than 3 MB.", "err");
      input.disabled = true;
      try {
        const { url } = await api("/api/upload", { method: "POST", body: file, headers: { "Content-Type": file.type } });
        item.image = url;
        toast("Image uploaded — click Save to publish.", "ok");
        render();
      } catch (err) {
        if (!(err instanceof AuthError)) toast(err.message, "err");
        input.disabled = false;
      }
    });
    return h("div", { class: "field" },
      h("span", { text: "Photo on the phone screen (optional)" }),
      h("div", { class: "upload" }, preview, input,
        item.image ? h("button", { type: "button", class: "btn btn--ghost btn--sm", text: "Remove photo", onclick: () => { item.image = ""; render(); } }) : null),
      h("p", { class: "hint", text: "JPG, PNG or WebP, max 3 MB. It is shown softly behind the screen text." }));
  }

  function renderWork(panel) {
    const items = state.draft.work;
    panel.append(panelHead("Our Work", "Demo cards. Reorder with ↑ ↓; click a card to edit it.",
      h("button", {
        type: "button", class: "btn btn--dark btn--sm", text: "+ Add item", disabled: items.length >= 24,
        onclick: () => { const item = newWorkItem(); items.push(item); state.openItems.add(item.id); render(); }
      })));
    if (!items.length) panel.append(h("div", { class: "card empty", text: "No items — the Our Work section will be empty." }));

    const stack = h("div", { class: "stack" });
    items.forEach((item, i) => {
      const title = h("h3", { text: item.title.ka || item.title.en || "New item" });
      const swatch = h("span", { class: "item__swatch" });
      swatch.style.background = THEMES[item.theme]?.color || "#eee";   // CSSOM, allowed by the CSP (inline style attributes are not)
      const stop = fn => e => { e.preventDefault(); e.stopPropagation(); fn(); };
      const details = h("details", { class: "card block item", open: state.openItems.has(item.id) },
        h("summary", {},
          h("div", { class: "item__head" },
            h("span", { class: "chev", "aria-hidden": "true", text: "›" }), swatch, title,
            h("div", { class: "item__tools" },
              h("button", { type: "button", class: "icon-btn", title: "Move up", "aria-label": "Move up", text: "↑", disabled: i === 0, onclick: stop(() => moveItem(items, i, i - 1)) }),
              h("button", { type: "button", class: "icon-btn", title: "Move down", "aria-label": "Move down", text: "↓", disabled: i === items.length - 1, onclick: stop(() => moveItem(items, i, i + 1)) }),
              h("button", {
                type: "button", class: "icon-btn", title: "Delete", "aria-label": "Delete item", text: "✕",
                onclick: stop(() => { if (confirm(`Delete "${title.textContent}"?`)) { items.splice(i, 1); render(); } })
              })))),
        biField("Title", item, "title", { max: 80 }),
        h("div", { class: "grid2" },
          biField("Category", item, "category", { max: 60 }),
          textField("Price (optional)", item, "price", { max: 20, hint: "e.g. 89₾ — leave empty to hide" })),
        biField("Description", item, "desc", { multiline: true, max: 300 }),
        h("div", { class: "grid2" },
          textField("Demo link", item, "link", { max: 400, hint: "demos/love.html or a full https:// link" }),
          h("label", { class: "field" }, h("span", { text: "Phone-screen theme" }),
            h("select", {
              onchange: e => { item.theme = e.target.value; swatch.style.background = THEMES[item.theme].color; changed(); }
            }, Object.entries(THEMES).map(([value, t]) => h("option", { value, text: t.label, selected: value === item.theme }))))),
        h("span", { class: "label", text: "Phone screen" }),
        biField("Small label", item.screen, "label", { max: 40 }),
        biField("Title on the screen", item.screen, "title", { multiline: true, max: 60, hint: "A new line = a line break. ♥ and & are shown in the accent colour." }),
        biField("Date / small text", item.screen, "date", { max: 40 }),
        imageField(item));
      details.addEventListener("toggle", () => { details.open ? state.openItems.add(item.id) : state.openItems.delete(item.id); });
      details.querySelector(".bi input").addEventListener("input", () => { title.textContent = item.title.ka || item.title.en || "New item"; });
      stack.append(details);
    });
    panel.append(stack);
  }

  function renderContact(panel) {
    const c = state.draft.contact;
    const hint = "Leave empty to use the value from config.js.";
    panel.append(
      panelHead("Contact", "Links and the WhatsApp number used by every button on the site and the demos."),
      h("div", { class: "card block" },
        h("div", { class: "grid2" },
          textField("WhatsApp number", c, "whatsapp", { type: "tel", max: 30, placeholder: "995555123456", hint: "International format, digits only. " + hint }),
          textField("Email", c, "email", { type: "email", max: 120, placeholder: "hello@example.com", hint })),
        h("div", { class: "grid2" },
          textField("Instagram link", c, "instagram", { type: "url", max: 400, placeholder: "https://instagram.com/…", hint }),
          textField("TikTok link", c, "tiktok", { type: "url", max: 400, placeholder: "https://tiktok.com/@…", hint })),
        biField("WhatsApp pre-filled message", c, "message", { multiline: true, rows: 3, max: 500 })));
  }

  /* ---------- orders ---------- */
  async function loadOrders() {
    const data = await api("/api/orders");
    state.orders = data.orders;
    const newCount = state.orders.filter(o => o.status === "new").length;
    const badge = $("#ordersCount");
    badge.textContent = String(newCount);
    badge.hidden = !newCount;
  }

  function renderOrders(panel) {
    const refresh = h("button", {
      type: "button", class: "btn btn--ghost btn--sm", text: "Refresh",
      onclick: async () => { try { await loadOrders(); render(); } catch (err) { if (!(err instanceof AuthError)) toast(err.message, "err"); } }
    });
    panel.append(panelHead("Orders", "Requests from the contact form, newest first.", refresh));

    if (!state.orders) {
      panel.append(h("div", { class: "card empty", text: "Loading…" }));
      loadOrders().then(() => { if (state.tab === "orders") render(); })
        .catch(err => { if (!(err instanceof AuthError)) { toast(err.message, "err"); panel.lastChild.textContent = err.message; } });
      return;
    }
    if (!state.orders.length) return panel.append(h("div", { class: "card empty", text: "No orders yet." }));

    const stack = h("div", { class: "stack" });
    state.orders.forEach(order => {
      const phoneDigits = String(order.phone || "").replace(/\D/g, "");
      const select = h("select", { "aria-label": "Status" },
        Object.entries(STATUSES).map(([value, label]) => h("option", { value, text: label, selected: value === order.status })));
      select.addEventListener("change", async () => {
        const previous = order.status;
        try {
          await api("/api/orders", { method: "PATCH", json: { id: order.id, status: select.value } });
          order.status = select.value;
          toast("Status updated.", "ok");
          await loadOrders();
          render();
        } catch (err) {
          select.value = previous;
          if (!(err instanceof AuthError)) toast(err.message, "err");
        }
      });

      stack.append(h("article", { class: `card order ${order.status === "done" ? "is-done" : ""}` },
        h("div", { class: "order__top" },
          h("span", { class: "order__name", text: order.name }),
          h("span", { class: `pill pill--${order.status}`, text: STATUSES[order.status] || order.status })),
        h("div", { class: "order__date", text: new Date(order.createdAt).toLocaleString() }),
        h("div", { class: "order__meta" },
          h("a", { href: `mailto:${order.email}`, text: order.email }),
          phoneDigits ? h("a", { href: `tel:+${phoneDigits}`, text: order.phone }) : null,
          h("span", { text: order.type }),
          h("span", { text: order.lang === "en" ? "English" : "Georgian" })),
        order.message ? h("p", { class: "order__msg", text: order.message }) : null,
        h("div", { class: "order__actions" },
          select,
          phoneDigits ? h("a", { class: "btn btn--ghost btn--sm", href: `https://wa.me/${phoneDigits}`, target: "_blank", rel: "noopener", text: "WhatsApp" }) : null,
          h("button", {
            type: "button", class: "btn btn--danger btn--sm", text: "Delete",
            onclick: async () => {
              if (!confirm(`Delete the request from ${order.name}?`)) return;
              try {
                await api(`/api/orders?id=${encodeURIComponent(order.id)}`, { method: "DELETE" });
                toast("Order deleted.", "ok");
                await loadOrders();
                render();
              } catch (err) { if (!(err instanceof AuthError)) toast(err.message, "err"); }
            }
          }))));
    });
    panel.append(stack);
  }

  boot();
})();
