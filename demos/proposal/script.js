/* =========================================================
   MOMENTLY demo — Proposal "Our film"
   ---------------------------------------------------------
   EDIT EVERYTHING HERE. Every text and photo comes from CONFIG.

   Joke-gift version: CONFIG.jokeVersion holds replacement texts.
   Preview it with  index.html?v=joke  — or set useJokeVersion: true
   to make it the default. Only the keys you list there are replaced.
   ========================================================= */
const CONFIG = {
  useJokeVersion: false,

  names: { to: "მარიამ", from: "გიორგი" },

  intro: {
    pre: "{to}, ეს ფილმი შენზეა",
    title: "ჩვენი ისტორია",
    credits: "მთავარ როლებში — შენ და მე",
    start: "დაწყება",
    soundHint: "🎧 ხმით უკეთესია — მუსიკა ქვედა ღილაკით ირთვება"
  },

  // One full screen per chapter. photo is optional ("" = no photo).
  // PHOTOS: replace the files in assets/ with your own (jpg/webp, portrait works best on phones).
  chapters: [
    { kicker: "2019 · შემოდგომა · თბილისი", line: "პირველი შეხვედრა…", sub: "ყავა დაგეღვარა, ორივემ გავიცინეთ — და ყველაფერი ზუსტად იქ დაიწყო.", photo: "assets/scene-1.svg" },
    { kicker: "2021 · ყაზბეგი", line: "პირველი მოგზაურობა", sub: "ღრუბლებს ზემოთ მივხვდი, რომ შენთან ერთად ყველგან სახლში ვარ.", photo: "assets/scene-2.svg" },
    { kicker: "ყოველ დღე", line: "ჩვეულებრივი დღეები, რომლებიც შენთან არაჩვეულებრივია", sub: "დილის ყავა, საუბრები შუაღამემდე და შენი სიცილი — ჩემი საყვარელი მელოდია.", photo: "assets/scene-3.svg" },
    { kicker: "ახლა", line: "და მინდა, რომ ეს ისტორია არასდროს დასრულდეს…", sub: "ამიტომ ერთი კითხვა მაქვს.", photo: "" }
  ],

  question: {
    pre: "{to}, გინდა ჩემთან ერთად?",
    title: "ცოლად გამომყვები?",
    yes: "დიახ",
    no: "დაფიქრება",
    // what the running-away button says after each escape
    noTexts: ["დარწმუნებული ხარ?", "კარგად დაფიქრდი 🙂", "ვერ დამიჭერ!", "ეს ღილაკი არ მუშაობს", "„დიახ“ უფრო ლამაზია ✨", "კარგი, ბოლოჯერ…", "„დიახ“-ს დააჭირე ❤"]
  },

  yes: {
    title: "ვიცოდი!",
    text: "ახლა ჩვენი ცხოვრების ყველაზე ლამაზი თავი იწყება. გპირდები, ყოველ დღეს ისე შევხვდები, როგორც ჩვენს პირველ შეხვედრას — გაკვირვებით და მადლიერებით.",
    sign: "სამუდამოდ შენი, {from}",
    date: "26 · 09 · 2026",
    replay: "თავიდან ნახვა"
  },

  // MUSIC: put an mp3 at this path. If it's missing the button just says so.
  music: "assets/music.mp3",
  momentlyUrl: "../../index.html",

  /* ---------- Joke-gift version (?v=joke) ---------- */
  jokeVersion: {
    names: { to: "ლუკა", from: "ნიკა" },
    intro: { title: "ჩვენი მეგობრობა", credits: "მთავარ როლებში — შენ, მე და ჩვენი მადა" },
    chapters: [
      { kicker: "2015 · სკოლა", line: "პირველი შეხვედრა…", sub: "შენ ჩემი სენდვიჩი შეჭამე. მე გაპატიე. ასე დაიწყო ყველაფერი.", photo: "assets/scene-1.svg" },
      { kicker: "2018 · ბათუმი", line: "პირველი მოგზაურობა", sub: "ორი დღე, ერთი ქოლგა და უსასრულო აჭარული ხაჭაპური.", photo: "assets/scene-2.svg" },
      { kicker: "ყოველ პარასკევს", line: "ჩვენ ერთად ვჭამთ", sub: "ეს უკვე ტრადიციაა. ტრადიციებს კი არ ვარღვევთ.", photo: "assets/scene-3.svg" },
      { kicker: "ახლა", line: "და მინდა, ძალიან სერიოზული რამ გკითხო…", sub: "მზად ხარ?", photo: "" }
    ],
    question: { pre: "{to}, წამოხვალ ჩემთან ერთად", title: "ხინკალზე ამ შაბათს?" },
    yes: {
      title: "ვიცოდი! 🥟",
      text: "შაბათს, 20:00-ზე, ჩვენს ძველ სახინკლეში. მაგიდა უკვე დაჯავშნილია. ანგარიშს შენ იხდი — ეს ჩემი საჩუქარია შენთვის 😄",
      sign: "შენი მშიერი მეგობარი, {from}"
    }
  }
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
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  /* ---------- Pick the version and fill texts ---------- */
  const merge = (a, b) => {
    const out = { ...a };
    for (const k in b) out[k] = b[k] && typeof b[k] === "object" && !Array.isArray(b[k]) ? merge(a[k] || {}, b[k]) : b[k];
    return out;
  };
  const params = new URLSearchParams(location.search);
  const C = CONFIG.useJokeVersion || params.get("v") === "joke" ? merge(CONFIG, CONFIG.jokeVersion) : CONFIG;
  const fill = s => String(s).replace(/\{to\}/g, C.names.to).replace(/\{from\}/g, C.names.from);
  const get = path => path.split(".").reduce((o, k) => (o == null ? o : o[k]), C);

  $$("[data-c]").forEach(el => { const v = get(el.dataset.c); if (v != null) el.textContent = fill(v); });
  $("#tcPre").textContent = fill(C.intro.pre);
  document.title = C.intro.title;
  $("#madeBy").href = C.momentlyUrl;

  /* ---------- Chapters ---------- */
  const pad = n => String(n).padStart(2, "0");
  const total = C.chapters.length + 1;
  const words = (text, start) => fill(text).split(/\s+/).map((w, i) => `<span class="w" style="--d:${(start + i * .14).toFixed(2)}s">${esc(w)}</span>`).join(" ");
  $("#scenes").innerHTML = C.chapters.map((ch, i) => {
    const count = fill(ch.line).split(/\s+/).length;
    return `
    <section class="scene" id="scene-${i + 1}" aria-label="${esc(fill(ch.kicker))}">
      ${ch.photo ? `<div class="scene__photo" aria-hidden="true"><img src="${esc(ch.photo)}" alt="" loading="lazy" decoding="async"></div>` : ""}
      <div class="scene__inner">
        <p class="scene__no fade">${pad(i + 1)} / ${pad(total)}</p>
        <p class="scene__kicker fade" style="--d:.35s">${esc(fill(ch.kicker))}</p>
        <h2 class="scene__line">${words(ch.line, .8)}</h2>
        ${ch.sub ? `<p class="scene__sub fade" style="--d:${(1.4 + count * .14).toFixed(2)}s">${esc(fill(ch.sub))}</p>` : ""}
      </div>
      ${i === 0 ? `<p class="scroll-hint fade" style="--d:3.2s" aria-hidden="true"><i></i>გადაახვიე ქვემოთ</p>` : ""}
    </section>`;
  }).join("");
  $$(".scene__photo img").forEach(img => img.addEventListener("error", () => img.parentElement.remove()));   // missing photo -> just the night sky

  const scenes = $$(".scene");
  const progress = $("#progress");
  progress.innerHTML = scenes.map(() => "<i></i>").join("");
  const dots = $$("i", progress);
  const seen = new IntersectionObserver(entries => entries.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.classList.add("in");
    dots.forEach((d, i) => d.classList.toggle("on", scenes[i] === e.target));
  }), { threshold: .45 });

  /* =========================================================
     Night sky: twinkling stars + slowly rising hearts
     ========================================================= */
  const heartSprite = (() => {
    const c = document.createElement("canvas"), s = 64; c.width = c.height = s;
    const g = c.getContext("2d");
    g.shadowColor = "rgba(233,163,173,.9)"; g.shadowBlur = 14;
    g.fillStyle = "#f0b3bc";
    g.translate(s / 2, s / 2 + 2); g.scale(1.25, 1.25);
    g.beginPath(); g.moveTo(0, 12); g.bezierCurveTo(-18, 0, -14, -16, 0, -8); g.bezierCurveTo(14, -16, 18, 0, 0, 12); g.fill();
    return c;
  })();
  (function sky() {
    const c = $("#sky"), ctx = c.getContext("2d");
    let w, h, stars = [], hearts = [], raf = 0;
    const size = () => {
      const dpr = Math.min(devicePixelRatio || 1, 2);
      w = innerWidth; h = innerHeight; c.width = w * dpr; c.height = h * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      stars = Array.from({ length: Math.min(170, Math.round(w * h / 4200)) }, () => ({ x: rand(0, w), y: rand(0, h), r: rand(.3, 1.4), tw: rand(0, 6.28), sp: rand(.01, .04), depth: rand(.02, .12) }));
      hearts = Array.from({ length: w < 600 ? 9 : 14 }, () => newHeart(true));
    };
    const newHeart = first => ({ x: rand(0, w), y: first ? rand(0, h) : h + 30, s: rand(10, 26), vy: rand(.18, .45), ph: rand(0, 6.28), a: rand(.12, .4) });
    const frame = () => {
      raf = requestAnimationFrame(frame);
      ctx.clearRect(0, 0, w, h);
      const sy = scrollY;
      for (const s of stars) {
        s.tw += s.sp;
        const y = ((s.y - sy * s.depth) % h + h) % h;
        ctx.globalAlpha = .25 + .75 * Math.abs(Math.sin(s.tw));
        ctx.fillStyle = "#fff6ee";
        ctx.fillRect(s.x, y, s.r, s.r);
      }
      for (const p of hearts) {
        p.y -= p.vy; p.ph += .012;
        if (p.y < -40) Object.assign(p, newHeart(false));
        ctx.globalAlpha = p.a * Math.min(1, (h - p.y) / 200);
        ctx.drawImage(heartSprite, p.x + Math.sin(p.ph) * 22 - p.s, p.y - p.s, p.s * 2, p.s * 2);
      }
      ctx.globalAlpha = 1;
    };
    size(); addEventListener("resize", size);
    if (RM) { frame(); cancelAnimationFrame(raf); return; }        // a still night sky
    frame();
    document.addEventListener("visibilitychange", () => { if (document.hidden) { cancelAnimationFrame(raf); raf = 0; } else if (!raf) frame(); });
  })();

  /* =========================================================
     Title card -> story
     ========================================================= */
  const titleCard = $("#titleCard"), story = $("#story");
  async function start() {
    document.body.classList.add("is-playing");
    story.removeAttribute("aria-hidden");
    scenes.forEach(s => seen.observe(s));
    await titleCard.animate([{ opacity: 1, transform: "none" }, { opacity: 0, transform: "scale(1.06)" }],
      { duration: RM ? 400 : 1600, easing: "cubic-bezier(.45,0,.15,1)", fill: "forwards" }).finished;
    titleCard.hidden = true;
    document.body.classList.remove("is-locked");
    scrollTo(0, 0);
    $("#scene-1 .scene__line").setAttribute("tabindex", "-1");
    $("#scene-1 .scene__line").focus({ preventScroll: true });
  }
  $("#playBtn").addEventListener("click", start, { once: true });
  if (params.has("open")) start();

  /* =========================================================
     The question: "yes" grows, "think about it" runs away
     ========================================================= */
  const arena = $("#arena"), yesBtn = $("#yesBtn"), noBtn = $("#noBtn"), qButtons = $(".q__buttons");
  let tries = 0, lastEscape = 0;

  function escape(px, py) {
    const now = performance.now();
    if (now - lastEscape < 180) return;
    lastEscape = now;
    tries++;
    noBtn.textContent = fill(C.question.noTexts[Math.min(tries, C.question.noTexts.length) - 1] || C.question.no);
    yesBtn.style.setProperty("--grow", Math.min(1 + tries * .07, 1.5).toFixed(2));

    // First escape: take "think about it" out of the layout so "yes" can glide to the centre
    if (!qButtons.classList.contains("fled")) {
      const yesBefore = yesBtn.getBoundingClientRect(), noBefore = noBtn.getBoundingClientRect();
      qButtons.classList.add("fled");
      const q0 = qButtons.getBoundingClientRect(), yesAfter = yesBtn.getBoundingClientRect();
      noBtn.style.transition = "none";
      noBtn.style.setProperty("--nx", `${noBefore.left - q0.left}px`);
      noBtn.style.setProperty("--ny", `${noBefore.top - q0.top}px`);
      void noBtn.offsetWidth;
      noBtn.style.transition = "";
      if (!RM) yesBtn.animate([{ translate: `${yesBefore.left - yesAfter.left}px 0` }, { translate: "0 0" }], { duration: 600, easing: "cubic-bezier(.34,1.56,.64,1)" });
    }
    const a = arena.getBoundingClientRect(), qb = qButtons.getBoundingClientRect();
    const yes = yesBtn.getBoundingClientRect(), title = $(".q__title").getBoundingClientRect();
    const w = noBtn.offsetWidth, h = noBtn.offsetHeight;
    const baseL = qb.left + noBtn.offsetLeft, baseT = qb.top + noBtn.offsetTop;
    const minX = Math.max(a.left, 0) + 12, maxX = Math.min(a.right, innerWidth) - w - 12;
    const minY = Math.max(a.top, 0) + 70, maxY = Math.min(a.bottom, innerHeight) - h - 70;
    const hits = (x, t, r, m) => x < r.right + m && x + w > r.left - m && t < r.bottom + m && t + h > r.top - m;
    let best = null;
    for (let i = 0; i < 50; i++) {
      const x = rand(minX, Math.max(minX, maxX)), t = rand(minY, Math.max(minY, maxY));
      if (hits(x, t, yes, 16)) continue;                                   // never cover "yes"
      const farFromFinger = px == null || Math.hypot(x + w / 2 - px, t + h / 2 - py) > 150;
      if (farFromFinger && !hits(x, t, title, 4)) { best = [x, t]; break; }
      if (!best) best = [x, t];
    }
    if (!best) best = [minX, minY];
    noBtn.style.setProperty("--nx", `${(best[0] - baseL).toFixed(0)}px`);
    noBtn.style.setProperty("--ny", `${(best[1] - baseT).toFixed(0)}px`);
    noBtn.style.setProperty("--nr", `${rand(-9, 9).toFixed(1)}deg`);
    noBtn.style.setProperty("--ns", Math.max(.72, 1 - tries * .035).toFixed(2));
  }
  // mouse: it flees before you even get there
  arena.addEventListener("pointermove", e => {
    if (e.pointerType !== "mouse") return;
    const r = noBtn.getBoundingClientRect();
    if (Math.hypot(e.clientX - (r.left + r.width / 2), e.clientY - (r.top + r.height / 2)) < Math.max(r.width, r.height) * .75) escape(e.clientX, e.clientY);
  });
  // touch / pen: it jumps away the moment a finger lands on it
  noBtn.addEventListener("pointerdown", e => { e.preventDefault(); escape(e.clientX, e.clientY); });
  noBtn.addEventListener("click", e => { e.preventDefault(); escape(); });      // keyboard, or a click that slipped through

  /* =========================================================
     Celebration: fireworks + the personal message
     ========================================================= */
  const celebrateEl = $("#celebrate");
  const fw = (() => {
    const c = $("#fireworks"), ctx = c.getContext("2d");
    const COLORS = ["#f4dfb0", "#dcbb7c", "#e9a3ad", "#ff7a93", "#ffffff", "#c9a7ff"];
    let w, h, rockets = [], sparks = [], raf = 0, timer = 0, on = false;
    const size = () => { const dpr = Math.min(devicePixelRatio || 1, 2); w = innerWidth; h = innerHeight; c.width = w * dpr; c.height = h * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); };
    addEventListener("resize", size);
    function explode(x, y, heart) {
      const color = COLORS[(Math.random() * COLORS.length) | 0], n = heart ? 90 : 70, s = rand(.22, .32);
      for (let i = 0; i < n; i++) {
        let vx, vy;
        if (heart) {
          const t = (i / n) * Math.PI * 2;
          vx = 16 * Math.sin(t) ** 3 * s; vy = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)) * s;
        } else {
          const a = rand(0, 6.28), v = rand(1, 5.5); vx = Math.cos(a) * v; vy = Math.sin(a) * v;
        }
        sparks.push({ x, y, vx, vy, life: 1, decay: rand(.008, .016), c: Math.random() < .2 ? "#fff" : color, r: rand(1.2, 2.4) });
      }
    }
    function launch() {
      rockets.push({ x: rand(w * .15, w * .85), y: h + 10, vy: -rand(9, 13) * Math.min(1, h / 800 + .25), vx: rand(-1, 1), ty: rand(h * .15, h * .45), heart: Math.random() < .4 });
    }
    function frame() {
      raf = requestAnimationFrame(frame);
      ctx.globalCompositeOperation = "destination-out";
      ctx.fillStyle = "rgba(0,0,0,.22)"; ctx.fillRect(0, 0, w, h);          // fading trails
      ctx.globalCompositeOperation = "lighter";
      rockets = rockets.filter(r => {
        r.x += r.vx; r.y += r.vy; r.vy += .12;
        ctx.fillStyle = "#fff3d6"; ctx.fillRect(r.x - 1, r.y - 1, 2.4, 6);
        if (r.y <= r.ty || r.vy >= -1) { explode(r.x, r.y, r.heart); return false; }
        return true;
      });
      sparks = sparks.filter(p => {
        p.vx *= .985; p.vy = p.vy * .985 + .045; p.x += p.vx; p.y += p.vy; p.life -= p.decay;
        if (p.life <= 0) return false;
        ctx.globalAlpha = p.life; ctx.fillStyle = p.c;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.283); ctx.fill();
        return true;
      });
      ctx.globalAlpha = 1;
      if (!on && !rockets.length && !sparks.length) { cancelAnimationFrame(raf); raf = 0; }
    }
    return {
      start(x, y) {
        if (RM) return;
        size(); on = true;
        explode(x, y, true);
        let shots = 0;
        const loop = () => { if (!on) return; launch(); if (Math.random() < .35) launch(); shots++; timer = setTimeout(loop, shots < 12 ? rand(280, 600) : rand(900, 1600)); };
        loop();
        if (!raf) frame();
      },
      stop() { on = false; clearTimeout(timer); }
    };
  })();

  yesBtn.addEventListener("click", () => {
    const r = yesBtn.getBoundingClientRect();
    celebrateEl.classList.add("show");
    celebrateEl.setAttribute("aria-hidden", "false");
    document.body.classList.add("is-locked");
    fw.start(r.left + r.width / 2, r.top + r.height / 2);
    setTimeout(() => $("#cTitle").focus({ preventScroll: true }), 900);
  });
  $("#replay").addEventListener("click", () => {
    fw.stop();
    celebrateEl.classList.remove("show");
    celebrateEl.setAttribute("aria-hidden", "true");
    document.body.classList.remove("is-locked");
    tries = 0;
    noBtn.textContent = fill(C.question.no);
    ["--nx", "--ny", "--nr", "--ns"].forEach(p => noBtn.style.removeProperty(p));
    qButtons.classList.remove("fled");
    yesBtn.style.removeProperty("--grow");
    scenes.forEach(s => s.classList.remove("in"));
    scrollTo({ top: 0, behavior: RM ? "auto" : "smooth" });
  });
  addEventListener("keydown", e => { if (e.key === "Escape" && celebrateEl.classList.contains("show")) $("#replay").click(); });

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
      audio = new Audio(); audio.loop = true; audio.volume = .75;
      audio.addEventListener("error", unavailable);
      audio.src = C.music;
    }
    if (playing) { audio.pause(); setPlaying(false); return; }
    setPlaying(true);
    const p = audio.play();
    if (p) p.catch(unavailable);
  });

  let toastTimer = 0;
  function toast(msg) {
    const t = $("#toast");
    t.textContent = msg; t.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove("show"), 2600);
  }
})();
