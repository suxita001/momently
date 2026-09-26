/* =========================================================
   MOMENTLY demo — Birthday "Neon Night"
   ---------------------------------------------------------
   EDIT EVERYTHING HERE. Name, age, date, place, texts,
   photos and music all come from this one CONFIG object.
   ========================================================= */
const CONFIG = {
  name: "საბა",
  age: "30",

  // Party start, ISO format with the Tbilisi time zone (+04:00). Drives the countdown + calendar.
  date: "2026-11-14T22:00:00+04:00",
  durationHours: 6,
  dateText: "შაბათი, 14 ნოემბერი",
  timeText: "22:00 — დილამდე",

  place: {
    short: "ბარი „ფოტონი“",
    name: "ბარი „ფოტონი“ · სახურავის ტერასა",
    address: "თბილისი, ვაკე, ჭავჭავაძის გამზირი",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Vake+Tbilisi"
  },

  candles: 5,                                     // how many candles are on the cake (1–9)

  opening: {
    kicker: "🎂 სიურპრიზი შენთვის",
    title: "ჩააქრე სანთლები!",
    hint: "შეეხე სანთლებს ან თითი გადაუსვი ტორტს",
    after: "ზეიმი იწყება!",
    afterSmall: "და შენ მიწვეული ხარ"
  },

  hero: {
    tag: "✦ ღამის წვეულება ✦",
    sub: "წლის ხდება — და ეს ღამე შენ გარეშე არ გამოვა!",
    hint: "გაასკდე ბუშტები 🎈"
  },

  countdown: { title: "წვეულებამდე დარჩა", done: "წვეულება უკვე დაიწყო! 🪩" },

  ticket: {
    title: "შენი ბილეთი",
    brand: "NEON NIGHT",
    type: "VIP · პერსონალური",
    heading: "შესასვლელი ბილეთი",
    number: "030"
  },

  theme: {
    name: "დისკო",
    sub: "70-იანები",
    text: "ბრჭყვიალა, ნეონი და ბევრი ცეკვა. ჩაიცვი ის, რაშიც თავს ყველაზე ვარსკვლავად იგრძნობ.",
    dress: [
      { label: "ბრჭყვიალა", color: "#ffd24a" },
      { label: "ნეონის ფერები", color: "#ff3fa4" },
      { label: "ვერცხლისფერი", color: "#cfd0e8" },
      { label: "ცისფერი", color: "#37f3ff" },
      { label: "კომფორტული ფეხსაცმელი", color: "#9b6bff" }
    ]
  },

  vibesTitle: "როგორი ღამე იქნება",
  // PHOTOS: replace the files in assets/ with real photos (jpg/webp, portrait 4:5 works best).
  vibes: [
    { src: "assets/vibe-1.svg", caption: "დისკო ბურთის ქვეშ" },
    { src: "assets/vibe-2.svg", caption: "ავტორის ქოქტეილები" },
    { src: "assets/vibe-3.svg", caption: "DJ სეტი დილამდე" },
    { src: "assets/vibe-4.svg", caption: "ცეკვა, ცეკვა, ცეკვა" },
    { src: "assets/vibe-5.svg", caption: "ტორტი და სურვილები" }
  ],

  balloons: {
    goal: 5,                                      // pop this many to unlock the secret
    secret: "🍸 საიდუმლო: პირველი ქოქტეილი ჩემზეა!"
  },

  rsvp: {
    title: "მოდიხარ?",
    text: "დაწერე სახელი, აირჩიე პასუხი — და თუ გინდა, DJ-ს სიმღერაც შეუკვეთე.",
    yes: "იე! {name}, გელოდები 🪩",
    maybe: "{name}, იმედია, „ალბათ“ მალე „კი“ გახდება 😉",
    no: "მომენატრები, {name} 😢 სადღეგრძელოს შენთვისაც დავლევ!",
    // Where answers are sent. Empty = demo mode (nothing leaves the browser). See sendRsvp() below.
    endpoint: ""
  },

  footer: "გელოდები! 🪩",

  // MUSIC: put an mp3 at this path. If it's missing the button just says so.
  music: "assets/music.mp3",
  momentlyUrl: "../../index.html"
};


/* =========================================================
   No need to edit below this line.
   ========================================================= */
(function () {
  "use strict";

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const wait = ms => new Promise(r => setTimeout(r, ms));
  const rand = (a, b) => a + Math.random() * (b - a);
  const RM = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const FINE = matchMedia("(hover: hover) and (pointer: fine)").matches;
  const get = path => path.split(".").reduce((o, k) => (o == null ? o : o[k]), CONFIG);
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  /* ---------- Texts ---------- */
  $$("[data-c]").forEach(el => { const v = get(el.dataset.c); if (v != null) el.textContent = v; });
  document.title = `${CONFIG.name} ${CONFIG.age} — ღამის წვეულება`;
  $("#heroTitle").textContent = `${CONFIG.name} ${CONFIG.age} ${CONFIG.hero.sub}`;
  $("#madeBy").href = CONFIG.momentlyUrl;
  $("#mapBtn").href = CONFIG.place.mapsUrl;

  /* =========================================================
     Particles: confetti, emoji rain, sparkles — one canvas
     ========================================================= */
  const fx = (() => {
    const c = $("#fx"), ctx = c.getContext("2d");
    const COLORS = ["#ff3fa4", "#37f3ff", "#ffd24a", "#9b6bff", "#ffffff", "#ff6f61"];
    let w = 0, h = 0, parts = [], raf = 0, last = 0;
    const size = () => {
      const dpr = Math.min(devicePixelRatio || 1, 2);
      w = innerWidth; h = innerHeight;
      c.width = w * dpr; c.height = h * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    size(); addEventListener("resize", size);
    function loop(t) {
      const dt = Math.min(3, (t - last) / 16.67 || 1); last = t;
      ctx.clearRect(0, 0, w, h);
      parts = parts.filter(p => p.life > 0 && p.y < h + 60);
      for (const p of parts) {
        p.vy += p.g * dt; p.vx *= p.drag; p.vy *= p.drag;
        p.x += p.vx * dt; p.y += p.vy * dt; p.rot += p.vr * dt; p.life -= p.decay * dt;
        ctx.globalAlpha = Math.max(0, Math.min(1, p.life * 1.6));
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot);
        if (p.text) { ctx.font = `${p.size}px system-ui, sans-serif`; ctx.textAlign = "center"; ctx.fillText(p.text, 0, 0); }
        else if (p.kind === 0) { ctx.scale(1, Math.cos(p.rot * 2.5)); ctx.fillStyle = p.c; ctx.fillRect(-p.s / 2, -p.s, p.s, p.s * 2); }
        else if (p.kind === 1) { ctx.fillStyle = p.c; ctx.beginPath(); ctx.arc(0, 0, p.s / 2, 0, 6.283); ctx.fill(); }
        else { ctx.fillStyle = p.c; ctx.shadowColor = p.c; ctx.shadowBlur = 8; ctx.fillRect(-p.s / 2, -p.s / 2, p.s, p.s); }
        ctx.restore();
      }
      ctx.globalAlpha = 1;
      raf = parts.length ? requestAnimationFrame(loop) : 0;
    }
    const kick = () => { if (!raf) { last = performance.now(); raf = requestAnimationFrame(loop); } };
    const add = p => { if (parts.length < 700) parts.push(p); };
    return {
      burst(x, y, { count = 90, angle = -Math.PI / 2, spread = Math.PI * 2, speed = [4, 12], gravity = .22 } = {}) {
        if (RM) return;
        for (let i = 0; i < count; i++) {
          const a = angle + (Math.random() - .5) * spread, v = rand(speed[0], speed[1]);
          add({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, g: gravity, drag: .985, rot: rand(0, 6.28), vr: rand(-.25, .25),
            s: rand(5, 9), c: COLORS[(Math.random() * COLORS.length) | 0], kind: Math.random() < .7 ? 0 : 1, life: 1, decay: rand(.005, .009) });
        }
        kick();
      },
      rain(text, count = 26) {
        if (RM) return;
        for (let i = 0; i < count; i++) add({ text, x: rand(0, w), y: rand(-h * .6, -20), vx: rand(-.4, .4), vy: rand(1, 3), g: .05, drag: .995, rot: rand(-.4, .4), vr: rand(-.02, .02), size: rand(22, 38), life: 1, decay: .004 });
        kick();
      },
      sparkle(x, y) {
        add({ x, y, vx: rand(-1, 1), vy: rand(-1.5, .5), g: .03, drag: .96, rot: rand(0, 6.28), vr: .1, s: rand(2, 4), c: COLORS[(Math.random() * 4) | 0], kind: 2, life: 1, decay: .03 });
        kick();
      }
    };
  })();

  /* ---------- Tiny synthesized sounds (only on taps; no files needed) ---------- */
  let actx = null;
  function noise(duration, filterType, freq, gain) {
    if (RM) return;
    try {
      actx = actx || new (window.AudioContext || window.webkitAudioContext)();
      const len = Math.floor(actx.sampleRate * duration), buf = actx.createBuffer(1, len, actx.sampleRate), d = buf.getChannelData(0);
      for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3);
      const src = actx.createBufferSource(), f = actx.createBiquadFilter(), g = actx.createGain();
      src.buffer = buf; f.type = filterType; f.frequency.value = freq; g.gain.value = gain;
      src.connect(f).connect(g).connect(actx.destination); src.start();
    } catch { /* audio not available: stay silent */ }
  }
  const popSound = () => noise(.14, "bandpass", rand(800, 1400), .45);
  const blowSound = () => noise(.45, "lowpass", 700, .25);

  /* =========================================================
     1. Cake: blow out the candles
     ========================================================= */
  const cake = $("#cake"), stage = $("#cakeStage"), party = $("#party");
  const n = Math.max(1, Math.min(9, CONFIG.candles | 0));
  const stripe = ["#ff3fa4", "#37f3ff", "#ffd24a", "#9b6bff"];
  const candles = Array.from({ length: n }, (_, i) => {
    const el = document.createElement("button");
    el.type = "button"; el.className = "candle";
    el.setAttribute("aria-label", `სანთელი ${i + 1} — ჩაქრობა`);
    const x = n === 1 ? 50 : 34 + (32 * i) / (n - 1);
    el.style.cssText = `--x:${x}%;--h:${(15 + (i % 2) * 3 + Math.random() * 2).toFixed(1)}%;--c:${stripe[i % stripe.length]}`;
    el.innerHTML = `<span class="flame"></span><span class="smoke"><i></i><i></i><i></i></span>`;
    $("#candles").append(el);
    return { el, lit: true };
  });
  let lit = n, opened = false;
  const litCount = $("#litCount");
  litCount.textContent = lit;

  function blow(candle) {
    if (!candle || !candle.lit || opened) return;
    candle.lit = false;
    candle.el.classList.add("out");
    candle.el.disabled = true;
    lit--;
    litCount.textContent = lit;
    cake.style.setProperty("--lit", (.25 + .75 * lit / n).toFixed(2));
    cake.classList.remove("gust"); void cake.offsetWidth; cake.classList.add("gust");
    blowSound();
    if (!lit) celebrate();
  }
  function nearestLit(x) {
    let best = null, bestD = Infinity;
    candles.forEach(c => {
      if (!c.lit) return;
      const r = c.el.getBoundingClientRect(), d = Math.abs(r.left + r.width / 2 - x);
      if (d < bestD) { best = c; bestD = d; }
    });
    return best;
  }

  // Tap = blow one candle (the one tapped, or the closest). Swipe across = blow every candle you pass.
  let press = null;
  cake.addEventListener("pointerdown", e => {
    if (e.target.closest(".link-btn")) return;
    press = { x: e.clientX, y: e.clientY, lastX: e.clientX, moved: 0 };
  });
  cake.addEventListener("pointermove", e => {
    if (!press) return;
    const x0 = Math.min(press.lastX, e.clientX), x1 = Math.max(press.lastX, e.clientX);
    press.moved += Math.abs(e.clientX - press.lastX) + Math.abs(e.movementY || 0);
    press.lastX = e.clientX;
    if (press.moved < 24) return;
    const sr = stage.getBoundingClientRect();
    if (e.clientY < sr.top - 120 || e.clientY > sr.bottom + 60) return;
    candles.forEach(c => {
      if (!c.lit) return;
      const r = c.el.getBoundingClientRect(), cx = r.left + r.width / 2;
      if (cx >= x0 - 12 && cx <= x1 + 12) blow(c);
    });
  });
  cake.addEventListener("pointerup", e => {
    if (!press) return;
    const tap = press.moved < 24;
    press = null;
    if (!tap || e.target.closest(".link-btn")) return;
    const hit = candles.find(c => c.el === e.target.closest(".candle"));
    blow(hit && hit.lit ? hit : nearestLit(e.clientX));
  });
  cake.addEventListener("pointercancel", () => { press = null; });
  // keyboard: Enter / Space on a candle
  candles.forEach(c => c.el.addEventListener("click", e => { if (e.detail === 0) blow(c); }));
  $("#blowAll").addEventListener("click", async () => {
    for (const c of candles) { if (c.lit) { blow(c); await wait(RM ? 0 : 140); } }
  });

  async function celebrate() {
    opened = true;
    await wait(RM ? 100 : 650);
    cake.classList.add("dark");
    await wait(RM ? 100 : 550);
    cake.classList.add("sign-on");
    if (!RM) {
      const w = innerWidth, h = innerHeight;
      fx.burst(0, h, { angle: -Math.PI / 3, spread: .9, speed: [10, 20], count: 110 });
      fx.burst(w, h, { angle: -Math.PI * 2 / 3, spread: .9, speed: [10, 20], count: 110 });
      setTimeout(() => fx.burst(w / 2, h * .45, { count: 120, speed: [3, 13] }), 380);
    }
    await wait(RM ? 900 : 1900);
    openParty();
  }

  async function openParty(instant) {
    document.body.classList.add("is-open");
    party.removeAttribute("aria-hidden");
    if (!instant) {
      await cake.animate(RM ? [{ opacity: 1 }, { opacity: 0 }] : [{ transform: "none" }, { transform: "translateY(-100%)" }],
        { duration: RM ? 500 : 1000, easing: "cubic-bezier(.7,0,.2,1)", fill: "forwards" }).finished;
    }
    cake.hidden = true;
    document.body.classList.remove("is-locked");
    scrollTo(0, 0);
    if (!instant) $("#heroTitle").focus({ preventScroll: true });
    startBalloons();
  }
  if (new URLSearchParams(location.search).has("open")) { opened = true; queueMicrotask(() => openParty(true)); }   // ?open → skip the cake

  /* =========================================================
     2. Balloons you can pop
     ========================================================= */
  const BALLOON_COLORS = [["#ff7ac3", "#e0158a"], ["#7ff7ff", "#0fb5d6"], ["#ffe27a", "#f0a90c"], ["#c3a4ff", "#7446f0"], ["#ff9a8b", "#f0453a"]];
  const balloonSvg = (i, [a, b]) => `
    <svg viewBox="0 0 60 110" aria-hidden="true">
      <defs><radialGradient id="bl${i}" cx="35%" cy="30%" r="75%"><stop offset="0" stop-color="#fff" stop-opacity=".9"/><stop offset=".18" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></radialGradient></defs>
      <path d="M30 3C14 3 4 16 4 31c0 19 15 33 24 39h4c9-6 24-20 24-39C56 16 46 3 30 3z" fill="url(#bl${i})"/>
      <path d="M26 70h8l-2 4h-4z" fill="${b}"/>
      <path d="M30 74c-4 8 5 12 0 20s4 10 0 16" fill="none" stroke="rgba(255,255,255,.55)" stroke-width="1"/>
      <ellipse cx="19" cy="20" rx="5" ry="9" fill="#fff" opacity=".35" transform="rotate(-24 19 20)"/>
    </svg>`;
  let popped = 0, secretShown = false, balloonsStarted = false;
  const goal = CONFIG.balloons.goal;
  $("#popGoal").textContent = goal;

  function startBalloons() {
    if (balloonsStarted || RM) return;
    balloonsStarted = true;
    const box = $("#balloons");
    const count = innerWidth < 600 ? 7 : 11;
    for (let i = 0; i < count; i++) {
      const b = document.createElement("button");
      b.type = "button"; b.className = "balloon";
      b.setAttribute("aria-label", "ბუშტის გასკდომა");
      const t = rand(11, 19);
      b.style.cssText = `--x:${(i / count) * 92 + rand(0, 6)}%;--w:${rand(52, 78)}px;--t:${t}s;--delay:${-rand(0, t)}s`;
      b.innerHTML = balloonSvg(i, BALLOON_COLORS[i % BALLOON_COLORS.length]);
      b.addEventListener("pointerdown", () => pop(b));
      b.addEventListener("click", e => { if (e.detail === 0) pop(b); });
      b.addEventListener("animationiteration", e => { if (e.animationName === "rise") b.classList.remove("popped"); });   // comes back next round
      box.append(b);
    }
  }
  function pop(b) {
    if (b.classList.contains("popped")) return;
    const r = b.getBoundingClientRect(), x = r.left + r.width / 2, y = r.top + r.width * .55;
    b.classList.add("popped");
    popSound();
    fx.burst(x, y, { count: 36, speed: [2, 8], gravity: .18 });
    const t = document.createElement("span");
    t.className = "pop-text"; t.textContent = "POP!";
    t.style.left = `${x - 30}px`; t.style.top = `${y - 20}px`;
    document.body.append(t);
    t.animate([{ transform: "scale(.4)", opacity: 1 }, { transform: "scale(1.3) translateY(-30px)", opacity: 0 }], { duration: 700, easing: "cubic-bezier(.2,.8,.2,1)" }).finished.then(() => t.remove());
    popped++;
    $("#popCount").textContent = Math.min(popped, goal);
    $("#popCounter").classList.add("show");
    if (popped >= goal && !secretShown) {
      secretShown = true;
      toast(CONFIG.balloons.secret, 4200);
      fx.burst(innerWidth / 2, innerHeight * .4, { count: 140 });
    }
  }

  // sparkle trail behind the mouse (desktop only)
  if (FINE && !RM) {
    let lastS = 0;
    addEventListener("pointermove", e => {
      const now = performance.now();
      if (now - lastS < 28 || !document.body.classList.contains("is-open")) return;
      lastS = now; fx.sparkle(e.clientX, e.clientY);
    }, { passive: true });
  }

  /* =========================================================
     Countdown, ticket, calendar, gallery
     ========================================================= */
  const target = new Date(CONFIG.date).getTime();
  const nums = Object.fromEntries($$(".count__num").map(el => [el.dataset.unit, el]));
  function setNum(el, v) {
    if (el.dataset.v === v) return;
    const first = el.dataset.v === undefined;
    el.dataset.v = v;
    const s = el.firstElementChild; s.textContent = v;
    if (!first && !RM) s.animate([{ transform: "scale(1.35)", opacity: .2 }, { transform: "none", opacity: 1 }], { duration: 450, easing: "cubic-bezier(.34,1.56,.64,1)" });
  }
  function tick() {
    const diff = target - Date.now();
    if (!(diff > 0)) { $("#countGrid").hidden = true; $("#countDone").hidden = false; return clearInterval(timer); }
    const s = Math.floor(diff / 1000);
    setNum(nums.d, String(Math.floor(s / 86400)).padStart(2, "0"));
    setNum(nums.h, String(Math.floor(s / 3600) % 24).padStart(2, "0"));
    setNum(nums.m, String(Math.floor(s / 60) % 60).padStart(2, "0"));
    setNum(nums.s, String(s % 60).padStart(2, "0"));
  }
  const timer = setInterval(tick, 1000);
  tick();

  // Holographic ticket tilt (mouse / pen)
  const ticket = $("#ticket");
  if (FINE && !RM) {
    ticket.addEventListener("pointermove", e => {
      const r = ticket.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
      ticket.style.setProperty("--ry", `${((x - .5) * 10).toFixed(2)}deg`);
      ticket.style.setProperty("--rx", `${((.5 - y) * 8).toFixed(2)}deg`);
      ticket.style.setProperty("--mx", `${(x * 100).toFixed(1)}%`);
      ticket.style.setProperty("--my", `${(y * 100).toFixed(1)}%`);
    });
    ticket.addEventListener("pointerleave", () => { ticket.style.setProperty("--rx", "0deg"); ticket.style.setProperty("--ry", "0deg"); });
  }

  $("#calBtn").addEventListener("click", () => {
    const start = new Date(CONFIG.date), end = new Date(start.getTime() + CONFIG.durationHours * 3600e3);
    const d = x => x.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
    const t = s => String(s).replace(/[\\;,]/g, m => "\\" + m);
    const ics = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//MOMENTLY//Party//KA", "BEGIN:VEVENT",
      `UID:${start.getTime()}-party@momently`, `DTSTAMP:${d(new Date())}`, `DTSTART:${d(start)}`, `DTEND:${d(end)}`,
      `SUMMARY:${t(`${CONFIG.name} ${CONFIG.age} — წვეულება`)}`, `LOCATION:${t(`${CONFIG.place.name}, ${CONFIG.place.address}`)}`,
      "END:VEVENT", "END:VCALENDAR"].join("\r\n");
    const a = Object.assign(document.createElement("a"), { href: URL.createObjectURL(new Blob([ics], { type: "text/calendar" })), download: "party.ics" });
    document.body.append(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 2000);
  });

  $("#dress").innerHTML = CONFIG.theme.dress.map(d => `<li><i style="--c:${esc(d.color)}"></i>${esc(d.label)}</li>`).join("");

  const rot = [-4, 3, -2, 4, -3, 2];
  $("#vibesRow").innerHTML = CONFIG.vibes.map((v, i) => `
    <figure class="vibe pop-in" style="--r:${rot[i % rot.length]}deg;--d:${(i % 3) * .1}s">
      <div class="vibe__img"><img src="${esc(v.src)}" alt="${esc(v.caption)}" loading="lazy" decoding="async"></div>
      <figcaption>${esc(v.caption)}</figcaption>
    </figure>`).join("");
  $$("#vibesRow img").forEach(img => img.addEventListener("error", () => img.remove()));   // missing photo -> gradient stays

  /* ---------- Reveal on scroll ---------- */
  const io = new IntersectionObserver(entries => entries.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.classList.add("in"); io.unobserve(e.target);
  }), { threshold: .15 });
  $$(".rv, .pop-in").forEach(el => io.observe(el));

  /* =========================================================
     RSVP
     ========================================================= */
  /* ---------- BACKEND HOOK ----------
     Demo mode (CONFIG.rsvp.endpoint = ""): nothing leaves the browser.
     To collect answers set CONFIG.rsvp.endpoint (your API, Google Apps Script web app, Formspree…),
     or post to a Google Form:
       fetch("https://docs.google.com/forms/d/e/<FORM_ID>/formResponse", { method: "POST", mode: "no-cors",
         body: new URLSearchParams({ "entry.111": data.name, "entry.222": data.answer, "entry.333": data.song }) })
     Or skip a backend and open WhatsApp with the answer:
       location.href = "https://wa.me/9955XXXXXXXX?text=" + encodeURIComponent(`${data.name}: ${data.answer}`) */
  async function sendRsvp(data) {
    if (!CONFIG.rsvp.endpoint) return;
    await fetch(CONFIG.rsvp.endpoint, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
  }

  const nameInput = $("#guestName"), reply = $("#reply");
  nameInput.addEventListener("input", () => { nameInput.classList.remove("invalid"); $("#nameErr").textContent = ""; });
  $$(".answer").forEach(btn => btn.addEventListener("click", async () => {
    const name = nameInput.value.trim();
    if (name.length < 2) {
      nameInput.classList.remove("invalid"); void nameInput.offsetWidth; nameInput.classList.add("invalid");
      $("#nameErr").textContent = "ჯერ სახელი დაწერე 🙂";
      nameInput.focus();
      return;
    }
    const answer = btn.dataset.answer;
    nameInput.classList.remove("invalid"); $("#nameErr").textContent = "";
    $$(".answer").forEach(b => b.setAttribute("aria-pressed", String(b === btn)));
    reply.classList.remove("show"); void reply.offsetWidth;
    reply.textContent = CONFIG.rsvp[answer].replace("{name}", name);
    reply.classList.add("show");
    const r = btn.getBoundingClientRect(), x = r.left + r.width / 2, y = r.top + r.height / 2;
    if (answer === "yes") { fx.burst(x, y, { count: 130, speed: [6, 15], angle: -Math.PI / 2, spread: 1.6 }); popSound(); }
    if (answer === "maybe") { btn.classList.remove("wobble"); void btn.offsetWidth; btn.classList.add("wobble"); }
    if (answer === "no") fx.rain("😢", 18);
    try { await sendRsvp({ name, answer, song: $("#song").value.trim(), sentAt: new Date().toISOString() }); }
    catch (err) { console.error(err); toast("ვერ გაიგზავნა — სცადე თავიდან"); }
  }));

  /* ---------- Music (never autoplays) ---------- */
  const musicBtn = $("#musicBtn");
  let audio = null, playing = false;
  const setPlaying = on => {
    playing = on;
    musicBtn.setAttribute("aria-pressed", String(on));
    musicBtn.setAttribute("aria-label", on ? "მუსიკის გამორთვა" : "მუსიკის ჩართვა");
  };
  const unavailable = () => { if (playing) toast("მუსიკა ჯერ არ არის დამატებული"); setPlaying(false); };
  musicBtn.addEventListener("click", () => {
    if (!audio) {
      audio = new Audio(); audio.loop = true; audio.volume = .7;
      audio.addEventListener("error", unavailable);
      audio.src = CONFIG.music;
    }
    if (playing) { audio.pause(); setPlaying(false); return; }
    setPlaying(true);
    const p = audio.play();
    if (p) p.catch(unavailable);
  });

  /* ---------- Toast ---------- */
  let toastTimer = 0;
  function toast(msg, ms = 2600) {
    const t = $("#toast");
    t.textContent = msg; t.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove("show"), ms);
  }
})();
