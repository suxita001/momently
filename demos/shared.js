/* =========================================================
   MOMENTLY demos — shared engine
   Needs ../config.js (CONFIG, whatsappUrl, openWhatsApp, getSavedLang, saveLang).

   A demo page calls:  Demo.init({ i18n: { ka: {...}, en: {...} }, onLang(lang) {} })

   Markup helpers:
     data-t="key"           -> textContent
     data-t-html="key"      -> innerHTML (trusted strings from the demo file)
     data-t-attr="alt:key"  -> attributes
     data-split             -> text split into <span class="ch" style="--i:n"> for letter animations
     data-img="unsplashId"  -> responsive Unsplash photo (data-eager for above-the-fold)
     class rv / rv-fade / rv-img / rv-mask -> scroll reveal   (style="--d:.2s" to delay)
     data-speed="0.15"      -> parallax (desktop only)
     data-count="20"        -> number counts up when revealed
     data-wa="cta"          -> WhatsApp chat with MOMENTLY
     data-share="msgKey"    -> WhatsApp with a message; visitor picks the recipient
     <div id="dm-cta"></div> -> the MOMENTLY closing section is inserted here
   ========================================================= */
(function () {
  document.documentElement.classList.add("js");

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const lite = reduced || window.matchMedia("(max-width: 760px), (pointer: coarse)").matches;
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  const WA_ICON = '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/><g transform="translate(7.3 7) scale(.4)"><path fill="currentColor" d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></g></svg>';

  /* Texts shared by every demo */
  const COMMON = {
    ka: {
      "dm.demo": "დემო",
      "dm.langLabel": "ენის არჩევა",
      "dm.toTop": "ზემოთ ასვლა",
      "dm.backLabel": "დაბრუნება MOMENTLY-ის მთავარ გვერდზე",
      "cta.q": "მოგეწონა ეს იდეა?",
      "cta.title": "შექმენი შენი <em>MOMENTLY</em>",
      "cta.btn": "შექმენი შენი",
      "cta.note": "ეს სადემონსტრაციო ვებსაიტია. ფოტოები: Unsplash.",
      "cta.back": "ყველა ნამუშევრის ნახვა",
      "msg.cta": "გამარჯობა MOMENTLY! მომეწონა დემო და მინდა მსგავსი პერსონალიზებული ვებსაიტის შექმნა."
    },
    en: {
      "dm.demo": "Demo",
      "dm.langLabel": "Choose language",
      "dm.toTop": "Back to top",
      "dm.backLabel": "Back to the MOMENTLY homepage",
      "cta.q": "Love this idea?",
      "cta.title": "Create your own <em>MOMENTLY</em>",
      "cta.btn": "Create Yours",
      "cta.note": "This is a demo website. Photos: Unsplash.",
      "cta.back": "See all our work",
      "msg.cta": "Hi MOMENTLY! I loved the demo and I'd like to create a similar personalized website."
    }
  };

  let dict = { ka: {}, en: {} };
  let onLang = null;
  let lang = typeof getSavedLang === "function" ? getSavedLang() : "ka";

  const t = key => (dict[lang] && dict[lang][key]) ?? COMMON[lang][key] ?? dict.ka[key] ?? COMMON.ka[key] ?? key;

  /* ---------- Chrome: nav, back-to-top, closing CTA ---------- */
  function buildChrome() {
    const nav = document.createElement("header");
    nav.className = "dm-nav";
    nav.innerHTML = `
      <a class="dm-back" href="../index.html#work" data-t-attr="aria-label:dm.backLabel"><span aria-hidden="true">←</span><b>MOMENTLY</b></a>
      <span class="dm-badge" data-t="dm.demo"></span>
      <div class="dm-lang" role="group" data-t-attr="aria-label:dm.langLabel">
        <button type="button" data-lang="ka" lang="ka">ქართული</button><i aria-hidden="true">|</i><button type="button" data-lang="en" lang="en">EN</button>
      </div>`;
    document.body.prepend(nav);

    const top = document.createElement("button");
    top.className = "dm-top";
    top.type = "button";
    top.innerHTML = '<span aria-hidden="true">↑</span>';
    top.setAttribute("data-t-attr", "aria-label:dm.toTop");
    top.addEventListener("click", () => window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" }));
    document.body.append(top);

    const slot = document.getElementById("dm-cta");
    if (slot) {
      slot.outerHTML = `
        <section class="dm-cta" aria-labelledby="dmCtaTitle">
          <p class="dm-cta__q rv" data-t="cta.q"></p>
          <h2 class="dm-cta__title rv" style="--d:.1s" id="dmCtaTitle" data-t-html="cta.title"></h2>
          <a class="dm-cta__btn rv" style="--d:.2s" href="../index.html#contact" data-wa="cta">${WA_ICON}<span data-t="cta.btn"></span></a>
          <p class="dm-cta__note rv" style="--d:.3s"><span data-t="cta.note"></span> · <a href="../index.html#work" data-t="cta.back"></a></p>
        </section>`;
    }

    const onScroll = () => {
      nav.classList.toggle("solid", window.scrollY > 80);
      top.classList.toggle("show", window.scrollY > window.innerHeight * 1.2);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---------- Language ---------- */
  function split(el) {
    const text = el.textContent;
    el.setAttribute("aria-label", text);
    el.innerHTML = Array.from(text).map((ch, i) =>
      `<span class="ch" aria-hidden="true" style="--i:${i}">${ch === " " ? "&nbsp;" : ch}</span>`).join("");
  }

  function applyLang(next) {
    lang = next === "en" ? "en" : "ka";
    document.documentElement.lang = lang;
    if (dict[lang]["meta.title"]) document.title = t("meta.title");
    $$("[data-t]").forEach(el => { el.textContent = t(el.dataset.t); });
    $$("[data-t-html]").forEach(el => { el.innerHTML = t(el.dataset.tHtml); });
    $$("[data-t-attr]").forEach(el => el.dataset.tAttr.split(";").forEach(pair => {
      const [attr, key] = pair.split(":").map(s => s.trim());
      el.setAttribute(attr, t(key));
    }));
    $$("[data-split]").forEach(split);
    $$("[data-lang]").forEach(b => b.setAttribute("aria-pressed", b.dataset.lang === lang));
    refreshWhatsApp();
    if (onLang) onLang(lang);
  }

  /* ---------- WhatsApp ---------- */
  function refreshWhatsApp() {
    $$("[data-wa]").forEach(a => { a.href = whatsappUrl(t("msg." + a.dataset.wa)); });
    $$("[data-share]").forEach(a => { a.href = whatsappUrl(t(a.dataset.share), ""); });
  }
  document.addEventListener("click", e => {
    const wa = e.target.closest("[data-wa]");
    const share = e.target.closest("[data-share]");
    if (wa) { e.preventDefault(); openWhatsApp(t("msg." + wa.dataset.wa)); }
    else if (share) { e.preventDefault(); openWhatsApp(t(share.dataset.share), ""); }
  });

  /* ---------- Unsplash images ---------- */
  function images() {
    $$("img[data-img]").forEach(img => {
      const id = img.dataset.img;
      const max = +(img.dataset.w || 1800);
      const url = w => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=78`;
      const widths = [480, 800, 1200, 1800, 2400].filter(w => w <= max);
      img.srcset = widths.map(w => `${url(w)} ${w}w`).join(", ");
      img.sizes = img.dataset.sizes || "100vw";
      img.src = url(Math.min(max, 1200));
      img.decoding = "async";
      if (!img.hasAttribute("data-eager")) img.loading = "lazy";
      if (!img.hasAttribute("alt")) img.alt = "";
    });
  }

  /* ---------- Reveal, count-up, parallax ---------- */
  const revealCallbacks = new Map();
  let io;
  function reveals() {
    const targets = $$(".rv, .rv-fade, .rv-img, .rv-mask, [data-count]");
    if (!("IntersectionObserver" in window)) { targets.forEach(show); return; }
    io = new IntersectionObserver(entries => entries.forEach(e => {
      if (e.isIntersecting) { show(e.target); io.unobserve(e.target); }
    }), { threshold: 0.18, rootMargin: "0px 0px -6% 0px" });
    targets.forEach(el => io.observe(el));
  }
  function show(el) {
    el.classList.add("in");
    if (el.dataset.count) countUp(el);
    const cb = revealCallbacks.get(el);
    if (cb) { revealCallbacks.delete(el); cb(el); }
  }
  function onReveal(el, cb) {
    if (!el) return;
    if (!io) { cb(el); return; }
    revealCallbacks.set(el, cb);
    io.observe(el);
  }
  function countUp(el) {
    const end = +el.dataset.count;
    if (reduced) { el.textContent = end; return; }
    const dur = +(el.dataset.duration || 1800);
    const start = performance.now();
    const step = now => {
      const p = Math.min(1, (now - start) / dur);
      el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }
  function parallax() {
    const els = $$("[data-speed]");
    if (lite || !els.length) return;
    let ticking = false;
    const update = () => {
      const vh = window.innerHeight;
      els.forEach(el => {
        const r = el.parentElement.getBoundingClientRect();
        if (r.bottom < -200 || r.top > vh + 200) return;
        const offset = (r.top + r.height / 2 - vh / 2) * +el.dataset.speed;
        el.style.transform = `translate3d(0, ${offset.toFixed(1)}px, 0)`;
      });
      ticking = false;
    };
    window.addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
    window.addEventListener("resize", update);
    update();
  }

  /* ---------- Loader ---------- */
  function loader() {
    const started = performance.now();
    const minTime = reduced ? 0 : 1300;
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      setTimeout(() => {
        document.body.classList.add("loaded");
        document.dispatchEvent(new Event("demo:loaded"));
      }, Math.max(0, minTime - (performance.now() - started)));
    };
    if (document.readyState === "complete") finish();
    else window.addEventListener("load", finish);
    setTimeout(finish, 4000); // never hold the visitor back on a slow connection
  }

  /* ---------- Dates ---------- */
  /* Next future occurrence of a yearly date, so demo countdowns never expire. */
  function nextOccurrence(month, day, hour = 0, minute = 0) {
    const now = new Date();
    const d = new Date(now.getFullYear(), month - 1, day, hour, minute);
    if (d <= now) d.setFullYear(d.getFullYear() + 1);
    return d;
  }

  /* Localized date text, e.g. formatDate(d, { day: "numeric", month: "long" }).
     Georgian is built by hand: many browsers ship without Georgian date data. */
  const KA_MONTHS = ["იანვარი", "თებერვალი", "მარტი", "აპრილი", "მაისი", "ივნისი", "ივლისი", "აგვისტო", "სექტემბერი", "ოქტომბერი", "ნოემბერი", "დეკემბერი"];
  const KA_DAYS = ["კვირა", "ორშაბათი", "სამშაბათი", "ოთხშაბათი", "ხუთშაბათი", "პარასკევი", "შაბათი"];
  function formatDate(date, opts) {
    if (lang === "ka") {
      const dayMonth = [opts.day && date.getDate(), opts.month && KA_MONTHS[date.getMonth()]].filter(Boolean).join(" ");
      const parts = [opts.weekday && KA_DAYS[date.getDay()], dayMonth, opts.year && date.getFullYear()].filter(Boolean);
      return parts.join(", ");
    }
    try { return new Intl.DateTimeFormat("en-GB", opts).format(date); }
    catch (e) { return date.toDateString(); }
  }

  function countdown(root, target, opts = {}) {
    const cells = {};
    $$("[data-cd]", root).forEach(el => { cells[el.dataset.cd] = el; });
    let timer;
    const tick = () => {
      let diff = Math.floor((target - Date.now()) / 1000);
      if (diff <= 0) { clearInterval(timer); diff = 0; if (opts.onDone) opts.onDone(); }
      const v = { d: Math.floor(diff / 86400), h: Math.floor(diff / 3600) % 24, m: Math.floor(diff / 60) % 60, s: diff % 60 };
      Object.entries(cells).forEach(([k, el]) => {
        const text = k === "d" ? String(v.d) : String(v[k]).padStart(2, "0");
        if (el.textContent !== text) {
          el.textContent = text;
          el.classList.remove("tick"); void el.offsetWidth; el.classList.add("tick");
        }
      });
    };
    tick();
    timer = setInterval(tick, 1000);
  }

  /* ---------- Particles ---------- */
  const TAU = Math.PI * 2;
  const rand = (a, b) => a + Math.random() * (b - a);
  const pick = arr => arr[Math.floor(Math.random() * arr.length)];

  function heart(ctx, s) {
    ctx.beginPath();
    ctx.moveTo(0, s * .3);
    ctx.bezierCurveTo(0, 0, -s * .5, 0, -s * .5, s * .3);
    ctx.bezierCurveTo(-s * .5, s * .6, 0, s * .75, 0, s);
    ctx.bezierCurveTo(0, s * .75, s * .5, s * .6, s * .5, s * .3);
    ctx.bezierCurveTo(s * .5, 0, 0, 0, 0, s * .3);
    ctx.fill();
  }
  function star4(ctx, r) {
    ctx.beginPath();
    for (let i = 0; i < 8; i++) {
      const a = i * Math.PI / 4, rr = i % 2 ? r * .28 : r;
      ctx.lineTo(Math.cos(a) * rr, Math.sin(a) * rr);
    }
    ctx.closePath(); ctx.fill();
  }

  const TYPES = {
    /* falling petals, optionally mixed with tiny hearts */
    petals: {
      spawn: (W, H, o, initial) => ({
        x: rand(0, W), y: initial ? rand(0, H) : rand(-60, -10), s: rand(7, 14),
        rot: rand(0, TAU), vr: rand(-.02, .02), vy: rand(.25, .7), sway: rand(0, TAU), c: pick(o.colors),
        heart: Math.random() < (o.hearts || 0), a: rand(.45, .85)
      }),
      step: (p, W, H) => { p.sway += .012; p.x += Math.sin(p.sway) * .5; p.y += p.vy; p.rot += p.vr; return p.y < H + 30; },
      draw: (ctx, p) => {
        ctx.translate(p.x, p.y); ctx.rotate(p.rot); ctx.globalAlpha = p.a; ctx.fillStyle = p.c;
        if (p.heart) { heart(ctx, p.s * .8); return; }
        ctx.beginPath(); ctx.moveTo(0, -p.s / 2);
        ctx.bezierCurveTo(p.s * .55, -p.s * .3, p.s * .45, p.s * .4, 0, p.s / 2);
        ctx.bezierCurveTo(-p.s * .45, p.s * .4, -p.s * .55, -p.s * .3, 0, -p.s / 2);
        ctx.fill();
      }
    },
    /* twinkling four-point stars */
    sparkle: {
      spawn: (W, H, o) => ({ x: rand(0, W), y: rand(0, H), r: rand(1.5, o.max || 5), ph: rand(0, TAU), sp: rand(.01, .035), c: pick(o.colors), vy: rand(-.12, -.02) }),
      step: (p, W, H) => { p.ph += p.sp; p.y += p.vy; return p.y > -10; },
      draw: (ctx, p) => { ctx.translate(p.x, p.y); ctx.globalAlpha = Math.pow(Math.sin(p.ph), 2) * .9; ctx.fillStyle = p.c; star4(ctx, p.r); }
    },
    /* warm glowing particles rising slowly */
    glow: {
      spawn: (W, H, o, initial) => ({ x: rand(0, W), y: initial ? rand(0, H) : H + 10, r: rand(1, 3.4), vy: rand(-.7, -.2), vx: rand(-.15, .15), ph: rand(0, TAU), c: pick(o.colors) }),
      step: (p) => { p.ph += .03; p.x += p.vx + Math.sin(p.ph) * .2; p.y += p.vy; return p.y > -20; },
      draw: (ctx, p) => {
        ctx.globalCompositeOperation = "lighter";
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 6);
        g.addColorStop(0, p.c); g.addColorStop(1, "rgba(0,0,0,0)");
        ctx.globalAlpha = .55 + Math.sin(p.ph) * .3; ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r * 6, 0, TAU); ctx.fill();
      }
    },
    /* soft floating dust, very slow */
    dust: {
      spawn: (W, H, o) => ({ x: rand(0, W), y: rand(0, H), r: rand(1, o.max || 3), vx: rand(-.12, .12), vy: rand(-.18, .05), ph: rand(0, TAU), c: pick(o.colors) }),
      step: (p, W, H) => { p.ph += .01; p.x += p.vx; p.y += p.vy; return p.x > -10 && p.x < W + 10 && p.y > -10 && p.y < H + 10; },
      draw: (ctx, p) => { ctx.globalAlpha = .35 + Math.sin(p.ph) * .25; ctx.fillStyle = p.c; ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, TAU); ctx.fill(); }
    }
  };

  function fx(canvas, type, o = {}) {
    if (reduced || !canvas || !canvas.getContext) return;
    const T = TYPES[type];
    const ctx = canvas.getContext("2d");
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const count = Math.round((o.count || 30) * (lite ? .5 : 1));
    o.colors = o.colors || ["#ffffff"];
    let W = 0, H = 0, parts = [], visible = true, raf = null;

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      W = r.width; H = r.height;
      canvas.width = W * dpr; canvas.height = H * dpr;
    };
    resize();
    if ("ResizeObserver" in window) new ResizeObserver(resize).observe(canvas);
    for (let i = 0; i < count; i++) parts.push(T.spawn(W, H, o, true));

    const frame = () => {
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      parts.forEach((p, i) => {
        if (!T.step(p, W, H)) parts[i] = p = T.spawn(W, H, o, false);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.globalAlpha = 1; ctx.globalCompositeOperation = "source-over";
        T.draw(ctx, p);
      });
      raf = requestAnimationFrame(frame);
    };
    const run = () => { if (!raf && visible && !document.hidden) raf = requestAnimationFrame(frame); };
    const stop = () => { cancelAnimationFrame(raf); raf = null; };
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(([e]) => { visible = e.isIntersecting; visible ? run() : stop(); }).observe(canvas);
    }
    document.addEventListener("visibilitychange", () => document.hidden ? stop() : run());
    run();
  }

  /* One-shot confetti shower over the whole screen */
  function confetti(o = {}) {
    if (reduced) return;
    const canvas = document.createElement("canvas");
    canvas.className = "dm-fx dm-fx--fixed";
    canvas.style.zIndex = 200;
    document.body.append(canvas);
    const ctx = canvas.getContext("2d");
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const W = window.innerWidth, H = window.innerHeight;
    canvas.width = W * dpr; canvas.height = H * dpr;
    ctx.scale(dpr, dpr);
    const colors = o.colors || ["#f7c6d9", "#d9ccf2", "#c9c9d6", "#fff"];
    const n = Math.round((o.count || 140) * (lite ? .55 : 1));
    const parts = Array.from({ length: n }, () => ({
      x: rand(0, W), y: rand(-H * .6, -10), w: rand(6, 11), h: rand(8, 15), vy: rand(1.6, 3.6), vx: rand(-.8, .8),
      rot: rand(0, TAU), vr: rand(-.12, .12), fl: rand(0, TAU), c: pick(colors), round: Math.random() < .3
    }));
    const frame = () => {
      ctx.clearRect(0, 0, W, H);
      let alive = 0;
      parts.forEach(p => {
        p.fl += .1; p.x += p.vx + Math.sin(p.fl) * .6; p.y += p.vy; p.rot += p.vr;
        if (p.y > H + 20) return;
        alive++;
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot); ctx.scale(Math.cos(p.fl), 1);
        ctx.fillStyle = p.c;
        if (p.round) { ctx.beginPath(); ctx.arc(0, 0, p.w / 2.2, 0, TAU); ctx.fill(); }
        else ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      });
      if (alive) requestAnimationFrame(frame); else canvas.remove();
    };
    requestAnimationFrame(frame);
  }

  /* ---------- Music box: a gentle melody generated in the browser ----------
     Nothing plays until the visitor presses the button (no autoplay). */
  function musicBox(btn, o = {}) {
    if (!btn) return;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) { btn.hidden = true; return; }
    const seq = o.notes || [
      60, 64, 67, 72, 76, 72, 67, 64,  57, 60, 64, 69, 72, 69, 64, 60,
      53, 57, 60, 65, 69, 65, 60, 57,  55, 59, 62, 67, 71, 67, 62, 59
    ];
    const tempo = o.tempo || 330;
    let ac, master, timer = null, step = 0;

    const note = (midi, when, vol) => {
      const f = 440 * Math.pow(2, (midi - 69) / 12);
      [[f, "sine", vol], [f * 2, "triangle", vol * .18]].forEach(([freq, type, v]) => {
        const osc = ac.createOscillator(), g = ac.createGain();
        osc.type = type; osc.frequency.value = freq;
        g.gain.setValueAtTime(0, when);
        g.gain.linearRampToValueAtTime(v, when + .015);
        g.gain.exponentialRampToValueAtTime(.0001, when + 2.2);
        osc.connect(g).connect(master);
        osc.start(when); osc.stop(when + 2.3);
      });
    };
    const setup = () => {
      ac = new AC();
      master = ac.createGain(); master.gain.value = .0001;
      const lp = ac.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 2600;
      const delay = ac.createDelay(); delay.delayTime.value = .33;
      const fb = ac.createGain(); fb.gain.value = .28;
      master.connect(lp); lp.connect(ac.destination);
      lp.connect(delay); delay.connect(fb); fb.connect(delay); delay.connect(ac.destination);
    };
    const play = () => {
      if (!ac) setup();
      ac.resume();
      master.gain.cancelScheduledValues(ac.currentTime);
      master.gain.linearRampToValueAtTime(.16, ac.currentTime + .8);
      timer = setInterval(() => {
        const m = seq[step % seq.length];
        note(m, ac.currentTime + .02, step % 8 === 0 ? .5 : .32);
        if (step % 8 === 4) note(m + 12, ac.currentTime + .02, .12);
        step++;
      }, tempo);
      btn.setAttribute("aria-pressed", "true");
    };
    const pause = () => {
      clearInterval(timer); timer = null;
      master.gain.cancelScheduledValues(ac.currentTime);
      master.gain.linearRampToValueAtTime(.0001, ac.currentTime + .6);
      btn.setAttribute("aria-pressed", "false");
    };
    btn.setAttribute("aria-pressed", "false");
    btn.addEventListener("click", () => (timer ? pause() : play()));
  }

  /* ---------- Public API ---------- */
  window.Demo = {
    reduced, lite, fx, confetti, countdown, nextOccurrence, formatDate, onReveal, musicBox,
    t: key => t(key),
    get lang() { return lang; },
    init(opts) {
      dict = opts.i18n || dict;
      onLang = opts.onLang || null;
      buildChrome();
      images();
      $$("[data-lang]").forEach(b => b.addEventListener("click", () => {
        if (b.dataset.lang === lang) return;
        saveLang(b.dataset.lang);
        applyLang(b.dataset.lang);
      }));
      applyLang(lang);
      // WhatsApp number saved in the admin panel (config.js loads it) -> refresh button links
      if (typeof SITE_CONTENT !== "undefined") SITE_CONTENT.then(refreshWhatsApp);
      reveals();
      parallax();
      loader();
    }
  };
})();
