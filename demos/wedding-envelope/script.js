/* =========================================================
   MOMENTLY demo — Wedding "3D envelope"
   ---------------------------------------------------------
   EDIT EVERYTHING HERE. All texts, names, dates, places,
   photos and music come from this one CONFIG object.
   ========================================================= */
const CONFIG = {
  couple: {
    one: "ლევანი",
    two: "ნინო",
    monogram: ["ლ", "ნ"]                       // initials on the wax seal
  },

  // Wedding start, ISO format with the Tbilisi time zone (+04:00).
  // Drives the countdown and the "add to calendar" button.
  date: "2027-06-19T16:00:00+04:00",
  durationHours: 9,
  dateLabel: "19 · 06 · 2027",
  dateLong: "შაბათი, 19 ივნისი 2027",
  city: "თბილისი",

  envelope: {
    eyebrow: "პირადი მოსაწვევი",
    toLabel: "ადრესატი",
    // Shown on the envelope. Personalise per guest with a link like:
    //   index.html?to=გიორგის%20და%20ანას
    defaultRecipient: "ჩვენს ძვირფას სტუმარს",
    hint: "შეეხე გასახსნელად",
    letterLine: "გიწვევთ ჩვენს ქორწილში"
  },

  hero: { eyebrow: "ჩვენ ვქორწინდებით" },

  invitation: {
    eyebrow: "ძვირფასო სტუმარო",
    text: "ორი ოჯახის სიხარულითა და გულწრფელი სიყვარულით გიწვევთ ჩვენი ცხოვრების ყველაზე მნიშვნელოვანი დღის აღსანიშნავად. ეს დღე თქვენს გარეშე სრული ვერ იქნება.",
    signLabel: "სიყვარულით,",
    families: "ბერიძეებისა და კაპანაძეების ოჯახები"
  },

  countdown: {
    eyebrow: "უკუთვლა",
    title: "ჩვენს დღემდე დარჩა",
    done: "დღეს ჩვენი დღეა! ♥"
  },

  timelineTitle: "როგორ გავატარებთ ამ დღეს",
  // icon: church | glass | dinner | music | rings   · map: optional Google Maps link
  timeline: [
    { time: "16:00", icon: "church", title: "ჯვრისწერა", place: "წმინდა სამების საკათედრო ტაძარი", note: "ცერემონია დაახლოებით ერთ საათს გაგრძელდება.", map: "https://www.google.com/maps/search/?api=1&query=Holy+Trinity+Cathedral+Tbilisi" },
    { time: "17:30", icon: "glass", title: "შამპანური და ფოტოები", place: "სასახლის ბაღი, წავკისი", note: "ცოცხალი ჯაზი, მზის ჩასვლა და პირველი სადღეგრძელო." },
    { time: "19:00", icon: "dinner", title: "საქორწილო ვახშამი", place: "სასახლე „ოქროს ვაზი“", note: "ქართული სუფრა, თამადა და ბევრი სიყვარული." },
    { time: "21:30", icon: "music", title: "პირველი ცეკვა და წვეულება", place: "ბაღის ტერასა", note: "ცეკვა დილამდე — კომფორტული ფეხსაცმელი არ დაგავიწყდეთ." }
  ],

  venue: {
    name: "სასახლე „ოქროს ვაზი“",
    address: "წავკისი, თბილისიდან 20 წუთის სავალზე",
    text: "ბაღი ქალაქის ხედით, სადაც მზის ჩასვლას ერთად შევხვდებით. ადგილზე უფასო ავტოსადგომია.",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Tsavkisi+Tbilisi",
    // PHOTO: replace with a real photo, e.g. "assets/venue.jpg"
    image: "assets/venue.svg"
  },

  galleryTitle: "ჩვენი მომენტები",
  // PHOTOS: replace the files in assets/ (jpg/webp recommended, ~1600px wide).
  // size: "tall" | "wide" | "" — the layout is tuned for 6 photos.
  gallery: [
    { src: "assets/photo-1.svg", alt: "ლევანი და ნინო მზის ჩასვლისას", size: "tall" },
    { src: "assets/photo-2.svg", alt: "ნიშნობის ბეჭედი", size: "" },
    { src: "assets/photo-3.svg", alt: "ყვავილების თაიგული", size: "" },
    { src: "assets/photo-4.svg", alt: "ძველი თბილისის აივნები", size: "wide" },
    { src: "assets/photo-5.svg", alt: "სანთლების შუქი", size: "" },
    { src: "assets/photo-6.svg", alt: "შამპანურის ჭიქები", size: "" }
  ],

  dressCode: {
    title: "დრესკოდი",
    value: "საღამოს ელეგანტური",
    text: "ქალბატონებს — გრძელი ან მიდი კაბა, ბატონებს — კოსტიუმი. სიამოვნებით ვნახავთ ჩვენს პალიტრას თქვენს სამოსში.",
    colors: [
      { name: "სპილოსძვალი", hex: "#efe6d6" },
      { name: "შამპანური", hex: "#d9c29a" },
      { name: "ზეთისხილი", hex: "#8a9a7b" },
      { name: "ღვინისფერი", hex: "#6b1d2b" }
    ],
    avoid: "გთხოვთ, თეთრი ფერი პატარძალს დაუტოვოთ"
  },

  // icon: car | child | camera | gift | rings
  notes: [
    { icon: "car", title: "ტრანსფერი", text: "ავტობუსი ტაძრიდან 17:15-ზე გავა და ღამით ქალაქში დაგაბრუნებთ." },
    { icon: "child", title: "ბავშვები", text: "პატარებისთვის ცალკე კუთხე და ძიძა იქნება — თამამად წამოიყვანეთ." },
    { icon: "camera", title: "ფოტოები", text: "გაგვიზიარეთ თქვენი კადრები ჰეშთეგით #ლევანიდანინო" }
  ],

  gift: {
    title: "საჩუქარი",
    text: "თქვენი იქ ყოფნა ჩვენთვის უდიდესი საჩუქარია. თუ მაინც გსურთ რამე გვაჩუქოთ, ყველაზე მეტად ჩვენს პირველ საერთო მოგზაურობას გავუხარდებით.",
    accountLabel: "ანგარიში · ნ. კაპანაძე",
    account: "GE00 TB00 0000 0000 0000 00"          // leave "" to hide the account box
  },

  rsvp: {
    title: "დაგვიდასტურეთ დასწრება",
    deadline: "გთხოვთ, გვიპასუხოთ 1 მაისამდე",
    maxGuests: 6,
    // Where answers are sent. Empty = demo mode (nothing is sent). See sendRsvp() below.
    endpoint: "",
    yesTitle: "მადლობა, {name}!",
    yesText: "თქვენი პასუხი მიღებულია. 19 ივნისს გელოდებით — ეს დღე თქვენთან ერთად უფრო ლამაზი იქნება.",
    noTitle: "მადლობა, {name}",
    noText: "ძალიან მოგვაკლდებით. გმადლობთ, რომ გვაცნობეთ — თქვენი თბილი სიტყვები ჩვენთან იქნება."
  },

  // MUSIC: put an mp3 at this path. If the file is missing, the button just says so.
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
  const RM = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const get = path => path.split(".").reduce((o, k) => (o == null ? o : o[k]), CONFIG);
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  /* ---------- Fill texts from CONFIG ---------- */
  $$("[data-c]").forEach(el => { const v = get(el.dataset.c); if (v != null) el.textContent = v; });
  document.title = `${CONFIG.couple.one} & ${CONFIG.couple.two} — საქორწილო მოსაწვევი`;
  $("#madeBy").href = CONFIG.momentlyUrl;

  // Recipient on the envelope (?to=...)
  const to = new URLSearchParams(location.search).get("to");
  $("#recipient").textContent = (to && to.trim().slice(0, 60)) || CONFIG.envelope.defaultRecipient;

  /* ---------- Wax seal: organic outline + monogram ---------- */
  (function sealShape() {
    const N = 30, pts = [];
    for (let i = 0; i < N; i++) {
      const a = (i / N) * Math.PI * 2;
      const r = 52 + 2.4 * Math.sin(a * 5 + .7) + 1.6 * Math.sin(a * 9 + 2.1) + 1.1 * Math.sin(a * 14);
      pts.push([60 + r * Math.cos(a), 60 + r * Math.sin(a)]);
    }
    const mid = (p, q) => `${((p[0] + q[0]) / 2).toFixed(2)} ${((p[1] + q[1]) / 2).toFixed(2)}`;
    let d = `M${mid(pts[N - 1], pts[0])}`;
    pts.forEach((p, i) => { d += ` Q${p[0].toFixed(2)} ${p[1].toFixed(2)} ${mid(p, pts[(i + 1) % N])}`; });
    $("#sealBlob").setAttribute("d", d + "Z");
    const mono = CONFIG.couple.monogram.join("·");
    $("#sealText").textContent = mono;
    $("#sealTextLight").textContent = mono;
  })();

  /* =========================================================
     Particle fields (gold dust, petals) — canvas, paused off-screen
     ========================================================= */
  function sprite(size, draw) {
    const c = document.createElement("canvas");
    c.width = c.height = size;
    draw(c.getContext("2d"), size);
    return c;
  }
  const dustSprite = sprite(32, (g, s) => {
    const gr = g.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
    gr.addColorStop(0, "rgba(255,240,200,1)"); gr.addColorStop(.25, "rgba(236,208,140,.8)"); gr.addColorStop(1, "rgba(236,208,140,0)");
    g.fillStyle = gr; g.fillRect(0, 0, s, s);
  });
  const petalSprites = [["#f6d3d2", "#e3a3a8"], ["#fbeee6", "#ecc9bf"], ["#f3e2c4", "#d8b57e"], ["#e7b6b9", "#b86a74"]].map(([a, b]) =>
    sprite(48, (g, s) => {
      g.translate(s / 2, s / 2);
      const r = s * .42, gr = g.createLinearGradient(0, -r, 0, r);
      gr.addColorStop(0, a); gr.addColorStop(1, b);
      g.fillStyle = gr;
      g.beginPath();
      g.moveTo(0, r);
      g.bezierCurveTo(-r * 1.05, r * .2, -r * .8, -r * .95, -r * .12, -r * .82);
      g.quadraticCurveTo(0, -r * .62, r * .12, -r * .82);
      g.bezierCurveTo(r * .8, -r * .95, r * 1.05, r * .2, 0, r);
      g.fill();
      g.strokeStyle = "rgba(255,255,255,.35)"; g.lineWidth = 1;
      g.beginPath(); g.moveTo(0, r * .85); g.quadraticCurveTo(r * .1, 0, 0, -r * .55); g.stroke();
    })
  );

  function field(canvas, { area, max, make, step }) {
    const ctx = canvas.getContext("2d");
    let w = 0, h = 0, parts = [], raf = 0, last = 0, active = false, inView = true;
    const resize = () => {
      const r = canvas.getBoundingClientRect(), dpr = Math.min(devicePixelRatio || 1, 2);
      w = r.width; h = r.height;
      canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = Math.round(Math.min(max, (w * h) / area));
      while (parts.length < n) parts.push(make(w, h, true));
      parts.length = n;
    };
    const frame = t => {
      raf = requestAnimationFrame(frame);
      const dt = Math.min(3, (t - (last || t)) / 16.67); last = t;
      ctx.clearRect(0, 0, w, h);
      for (const p of parts) step(ctx, p, dt, w, h, make);
    };
    const run = () => { if (active && inView && !document.hidden && !raf) { last = 0; raf = requestAnimationFrame(frame); } };
    const halt = () => { cancelAnimationFrame(raf); raf = 0; };
    new ResizeObserver(resize).observe(canvas);
    new IntersectionObserver(([e]) => { inView = e.isIntersecting; inView ? run() : halt(); }).observe(canvas);
    document.addEventListener("visibilitychange", () => (document.hidden ? halt() : run()));
    resize();
    return { start() { active = true; run(); }, stop() { active = false; halt(); ctx.clearRect(0, 0, w, h); } };
  }

  // Gold dust rising behind the envelope
  const introFx = field($("#introFx"), {
    area: 5200, max: 90,
    make: (w, h, first) => ({
      x: Math.random() * w, y: first ? Math.random() * h : h + 10,
      r: 2 + Math.random() * 5, vy: -(.12 + Math.random() * .35), vx: (Math.random() - .5) * .15,
      tw: Math.random() * 6.28, ts: .02 + Math.random() * .04
    }),
    step(ctx, p, dt, w, h, make) {
      p.x += p.vx * dt; p.y += p.vy * dt; p.tw += p.ts * dt;
      if (p.y < -12) Object.assign(p, make(w, h, false));
      ctx.globalAlpha = .25 + .55 * (0.5 + 0.5 * Math.sin(p.tw));
      ctx.drawImage(dustSprite, p.x - p.r, p.y - p.r, p.r * 2, p.r * 2);
      ctx.globalAlpha = 1;
    }
  });

  // Falling petals + gold dust over the hero
  const heroFx = field($("#heroFx"), {
    area: 16000, max: 42,
    make: (w, h, first) => {
      const dust = Math.random() < .35;
      return {
        dust, x: Math.random() * w, y: first ? Math.random() * h - h * .3 : -30,
        s: dust ? 2 + Math.random() * 3.5 : 10 + Math.random() * 12,
        vy: dust ? .25 + Math.random() * .3 : .45 + Math.random() * .6,
        sway: 18 + Math.random() * 40, ph: Math.random() * 6.28, sp: .008 + Math.random() * .014,
        rot: Math.random() * 6.28, vr: (Math.random() - .5) * .03, flip: Math.random() * 6.28,
        img: petalSprites[(Math.random() * petalSprites.length) | 0], a: .55 + Math.random() * .4
      };
    },
    step(ctx, p, dt, w, h, make) {
      p.y += p.vy * dt; p.ph += p.sp * dt; p.rot += p.vr * dt; p.flip += .03 * dt;
      const x = p.x + Math.sin(p.ph) * p.sway;
      if (p.y > h + 30) Object.assign(p, make(w, h, false));
      if (p.dust) {
        ctx.globalAlpha = .35 + .5 * Math.abs(Math.sin(p.ph * 3));
        ctx.drawImage(dustSprite, x - p.s, p.y - p.s, p.s * 2, p.s * 2);
      } else {
        ctx.globalAlpha = p.a;
        ctx.save(); ctx.translate(x, p.y); ctx.rotate(p.rot); ctx.scale(1, .35 + .65 * Math.abs(Math.cos(p.flip)));
        ctx.drawImage(p.img, -p.s, -p.s, p.s * 2, p.s * 2);
        ctx.restore();
      }
      ctx.globalAlpha = 1;
    }
  });

  /* =========================================================
     The envelope
     ========================================================= */
  const intro = $("#intro"), invite = $("#invite"), stage = $("#stage");
  const envelope = $("#envelope"), envDrop = $("#envDrop"), envFloat = $("#envFloat");
  const flap = $("#flap"), letter = $("#letter"), pocket = $("#pocket"), seal = $("#seal");
  const state = { ready: false, opened: false };

  if (!RM) introFx.start();

  const skipIntro = new URLSearchParams(location.search).has("open");
  if (skipIntro) { queueMicrotask(() => finishOpening(true)); }   // ?open → straight to the invitation
  else if (RM) { state.ready = true; }
  else {
    // drop in from above and settle with a soft bounce
    envDrop.animate([
      { transform: "translateY(-115vh) rotate(-14deg)" },
      { transform: "translateY(14px) rotate(1.6deg)", offset: .7 },
      { transform: "translateY(-5px) rotate(-.5deg)", offset: .86 },
      { transform: "none" }
    ], { duration: 1700, delay: 300, easing: "cubic-bezier(.33,.8,.35,1)", fill: "backwards" })
      .finished.then(() => { state.ready = true; });
  }

  // Gentle 3D tilt that follows the pointer (mouse / pen only)
  if (!RM && matchMedia("(hover: hover) and (pointer: fine)").matches) {
    intro.addEventListener("pointermove", e => {
      if (state.opened) return;
      const x = e.clientX / innerWidth - .5, y = e.clientY / innerHeight - .5;
      envelope.style.setProperty("--ry", `${(x * 16).toFixed(2)}deg`);
      envelope.style.setProperty("--rx", `${(-y * 12).toFixed(2)}deg`);
    });
    intro.addEventListener("pointerleave", () => { envelope.style.setProperty("--ry", "0deg"); envelope.style.setProperty("--rx", "0deg"); });
  }

  envelope.addEventListener("click", () => { if (state.ready) openEnvelope(); });

  // Freeze a CSS animation where it is and ease back to rest
  function settle(el, ms) {
    const current = getComputedStyle(el).transform;
    el.style.animation = "none";
    el.animate([{ transform: current === "none" ? "none" : current }, { transform: "none" }], { duration: ms, easing: "ease-out" });
  }

  async function openEnvelope() {
    if (state.opened) return;
    state.opened = true;
    envelope.setAttribute("aria-disabled", "true");
    $("#introHint").animate([{ opacity: 1 }, { opacity: 0 }], { duration: 400, fill: "forwards" });

    if (RM) {
      await intro.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 600, fill: "forwards" }).finished;
      return finishOpening();
    }

    settle(envFloat, 500);
    envelope.style.setProperty("--rx", "0deg");
    envelope.style.setProperty("--ry", "0deg");
    $(".env-shadow").style.animation = "none";
    $("#sheen").remove();
    $(".seal__glow", seal).remove();

    // 1 — the seal cracks
    const crack = $("#crack");
    crack.animate([{ strokeDashoffset: 140 }, { strokeDashoffset: 0 }], { duration: 380, easing: "ease-in", fill: "forwards" });
    seal.animate([
      { transform: "none" }, { transform: "translateX(-1.5px) rotate(-2deg)" }, { transform: "translateX(1.5px) rotate(2deg)" },
      { transform: "translateX(-1px) rotate(-1deg)" }, { transform: "none" }
    ], { duration: 380 });
    await wait(400);
    crack.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 200, fill: "forwards" });
    const fall = dir => [
      { transform: "none", opacity: 1 },
      { transform: `translate(${dir * 22}%, -10%) rotate(${dir * 16}deg)`, opacity: 1, offset: .28 },
      { transform: `translate(${dir * 70}%, 190%) rotate(${dir * 55}deg)`, opacity: 0 }
    ];
    $("#sealL").animate(fall(-1), { duration: 1150, easing: "cubic-bezier(.35,0,.75,.5)", fill: "forwards" });
    $("#sealR").animate(fall(1), { duration: 1150, easing: "cubic-bezier(.35,0,.75,.5)", fill: "forwards" });
    await wait(280);

    // 2 — the flap opens in 3D; halfway (edge-on) it moves behind the letter
    await flap.animate([{ transform: "rotateX(0deg)" }, { transform: "rotateX(90deg)" }],
      { duration: 520, easing: "cubic-bezier(.55,0,.85,.45)", fill: "forwards" }).finished;
    flap.style.zIndex = "1";
    flap.animate([{ transform: "rotateX(90deg)" }, { transform: "rotateX(180deg)" }],
      { duration: 640, easing: "cubic-bezier(.15,.55,.3,1)", fill: "forwards" });
    await wait(260);

    // 3 — the letter slides out
    await letter.animate([{ transform: "translateY(0)" }, { transform: "translateY(-56%)" }],
      { duration: 1250, easing: "cubic-bezier(.3,.1,.15,1)", fill: "forwards" }).finished;
    await wait(180);

    // 4 — the camera flies into the letter
    const lr = letter.getBoundingClientRect(), sr = stage.getBoundingClientRect();
    const cx = lr.left + lr.width / 2, cy = lr.top + lr.height / 2;
    const scale = Math.max(innerWidth / lr.width, innerHeight / lr.height) * 1.15;
    stage.style.transformOrigin = `${cx - sr.left}px ${cy - sr.top}px`;
    const zoomMs = 1750;
    const zoom = stage.animate([
      { transform: "none" },
      { transform: `translate(${innerWidth / 2 - cx}px, ${innerHeight / 2 - cy}px) scale(${scale})` }
    ], { duration: zoomMs, easing: "cubic-bezier(.66,0,.2,1)", fill: "forwards" });

    const fadeOut = (el, delay, dur) => el.animate([{ opacity: 1 }, { opacity: 0 }], { duration: dur, delay, easing: "ease-in", fill: "forwards" });
    [pocket, flap, $(".env__back"), $(".env-shadow")].forEach(el => fadeOut(el, 120, 650));
    $$(".letter > span:not(.letter__frame)").forEach(el => fadeOut(el, 380, 600));
    fadeOut($(".letter__frame"), 700, 500);
    fadeOut($(".intro__top"), 0, 500);
    letter.animate([{ boxShadow: "0 1px 3px rgba(40,15,10,.25)" }, { boxShadow: "none" }], { duration: 600, fill: "forwards" });

    await wait(zoomMs - 520);
    document.body.classList.add("is-open");                 // hero starts its entrance underneath
    intro.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 750, easing: "ease-out", fill: "forwards" });
    await zoom.finished;
    await wait(260);
    finishOpening();
  }

  function finishOpening(instant) {
    state.opened = true;
    introFx.stop();
    intro.hidden = true;
    document.body.classList.remove("is-locked");
    document.body.classList.add("is-open");
    invite.removeAttribute("aria-hidden");
    if (!RM) heroFx.start();
    if (!instant) $("#heroTitle").focus({ preventScroll: true });
    scrollTo(0, 0);
    onScroll();
  }

  /* =========================================================
     Invitation content
     ========================================================= */
  const icon = name => `<svg class="i" aria-hidden="true"><use href="#i-${esc(name)}"/></svg>`;

  // Timeline
  $("#tl").insertAdjacentHTML("beforeend", CONFIG.timeline.map((t, i) => `
    <article class="tl__item rv" style="--d:${(i % 2) * .08}s">
      <span class="tl__icon">${icon(t.icon)}</span>
      <p class="tl__time">${esc(t.time)}</p>
      <h3 class="tl__title">${esc(t.title)}</h3>
      <p class="tl__place">${esc(t.place)}</p>
      ${t.note ? `<p class="tl__note">${esc(t.note)}</p>` : ""}
      ${t.map ? `<a class="tl__map" href="${esc(t.map)}" target="_blank" rel="noopener">რუკაზე ნახვა ${icon("arrow")}</a>` : ""}
    </article>`).join(""));

  // Venue
  const venueImg = $("#venueImg");
  venueImg.addEventListener("error", () => venueImg.remove());
  venueImg.alt = CONFIG.venue.name;
  venueImg.src = CONFIG.venue.image;
  $("#mapBtn").href = CONFIG.venue.mapsUrl;

  // Gallery
  const gallery = $("#galleryGrid");
  gallery.innerHTML = CONFIG.gallery.map((g, i) => `
    <button type="button" class="gallery__item ${g.size ? "gallery__item--" + esc(g.size) : ""}" style="--d:${(i % 3) * .12}s" data-i="${i}" aria-label="${esc(g.alt)} — გადიდება">
      <img src="${esc(g.src)}" alt="${esc(g.alt)}" loading="lazy" decoding="async">
    </button>`).join("");
  $$("img", gallery).forEach(img => img.addEventListener("error", () => img.remove()));   // missing photo -> gradient stays

  // Dress code + notes
  $("#swatches").innerHTML = CONFIG.dressCode.colors.map(c => `<li class="swatch"><i style="--c:${esc(c.hex)}"></i>${esc(c.name)}</li>`).join("");
  $("#notes").innerHTML = CONFIG.notes.map((n, i) => `
    <article class="note rv" style="--d:${i * .1}s">${icon(n.icon)}<h3>${esc(n.title)}</h3><p>${esc(n.text)}</p></article>`).join("");

  // Gift account
  if (!CONFIG.gift.account) $("#iban").remove();
  else $("#copyIban").addEventListener("click", async () => {
    try { await navigator.clipboard.writeText(CONFIG.gift.account.replace(/\s/g, "")); toast("ანგარიშის ნომერი დაკოპირდა"); }
    catch { toast(CONFIG.gift.account); }
  });

  /* ---------- Countdown ---------- */
  const target = new Date(CONFIG.date).getTime();
  const nums = Object.fromEntries($$(".count__num").map(el => [el.dataset.unit, el]));
  function setNum(el, v) {
    if (el.dataset.v === v) return;
    const first = el.dataset.v === undefined;
    el.dataset.v = v;
    const s = el.firstElementChild;
    s.textContent = v;
    if (!first && !RM) s.animate([{ transform: "translateY(70%)", opacity: 0 }, { transform: "none", opacity: 1 }], { duration: 550, easing: "cubic-bezier(.16,1,.3,1)" });
  }
  function tick() {
    const diff = target - Date.now();
    if (!(diff > 0)) {
      $("#countGrid").hidden = true; $("#countDone").hidden = false;
      return clearInterval(timer);
    }
    const s = Math.floor(diff / 1000);
    setNum(nums.d, String(Math.floor(s / 86400)).padStart(2, "0"));
    setNum(nums.h, String(Math.floor(s / 3600) % 24).padStart(2, "0"));
    setNum(nums.m, String(Math.floor(s / 60) % 60).padStart(2, "0"));
    setNum(nums.s, String(s % 60).padStart(2, "0"));
  }
  const timer = setInterval(tick, 1000);
  tick();

  /* ---------- Add to calendar (.ics) ---------- */
  $("#calBtn").addEventListener("click", () => {
    const start = new Date(CONFIG.date), end = new Date(start.getTime() + CONFIG.durationHours * 3600e3);
    const d = x => x.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
    const t = s => String(s).replace(/[\\;,]/g, m => "\\" + m).replace(/\n/g, "\\n");
    const ics = [
      "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//MOMENTLY//Wedding//KA", "CALSCALE:GREGORIAN", "BEGIN:VEVENT",
      `UID:${start.getTime()}-wedding@momently`, `DTSTAMP:${d(new Date())}`, `DTSTART:${d(start)}`, `DTEND:${d(end)}`,
      `SUMMARY:${t(`${CONFIG.couple.one} & ${CONFIG.couple.two} — ქორწილი`)}`,
      `LOCATION:${t(`${CONFIG.venue.name}, ${CONFIG.venue.address}`)}`,
      `DESCRIPTION:${t(location.href.split("?")[0])}`, "END:VEVENT", "END:VCALENDAR"
    ].join("\r\n");
    const a = Object.assign(document.createElement("a"), { href: URL.createObjectURL(new Blob([ics], { type: "text/calendar" })), download: "wedding.ics" });
    document.body.append(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 2000);
  });

  /* =========================================================
     Scroll: reveals, parallax, timeline line, floating RSVP
     ========================================================= */
  const reveal = new IntersectionObserver(entries => entries.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.classList.add("in");
    reveal.unobserve(e.target);
  }), { threshold: .15, rootMargin: "0px 0px -6% 0px" });
  $$(".rv, .gallery__item").forEach(el => reveal.observe(el));

  const parallax = RM ? [] : $$("[data-parallax]");
  const tlEl = $("#tl"), tlFill = $("#tlFill"), fab = $("#fab"), rsvpSec = $("#rsvp"), hero = $("#hero");
  let ticking = false;
  function onScroll() {
    ticking = false;
    const vh = innerHeight;
    parallax.forEach(el => {
      const r = el.getBoundingClientRect();
      if (r.bottom < -100 || r.top > vh + 100) return;
      el.style.translate = `0 ${(-(r.top + r.height / 2 - vh / 2) * +el.dataset.parallax).toFixed(1)}px`;
    });
    const t = tlEl.getBoundingClientRect();
    tlFill.style.transform = `scaleY(${Math.min(1, Math.max(0, (vh * .7 - t.top) / t.height)).toFixed(3)})`;
    const pastHero = hero.getBoundingClientRect().bottom < vh * .4;
    const r = rsvpSec.getBoundingClientRect();
    fab.classList.toggle("show", document.body.classList.contains("is-open") && pastHero && (r.top > vh || r.bottom < 0));
  }
  addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  addEventListener("resize", onScroll);

  /* ---------- Lightbox ---------- */
  const lb = $("#lightbox"), lbImg = $("#lbImg");
  let lbIndex = 0, lastFocus = null;
  function showPhoto(i) {
    lbIndex = (i + CONFIG.gallery.length) % CONFIG.gallery.length;
    const g = CONFIG.gallery[lbIndex];
    lbImg.src = g.src; lbImg.alt = g.alt;
  }
  function openLb(i) {
    lastFocus = document.activeElement;
    showPhoto(i);
    lb.classList.add("open"); lb.setAttribute("aria-hidden", "false");
    $("#lbClose").focus();
  }
  function closeLb() {
    lb.classList.remove("open"); lb.setAttribute("aria-hidden", "true");
    if (lastFocus) lastFocus.focus();
  }
  gallery.addEventListener("click", e => { const b = e.target.closest(".gallery__item"); if (b) openLb(+b.dataset.i); });
  $("#lbClose").addEventListener("click", closeLb);
  $("#lbPrev").addEventListener("click", () => showPhoto(lbIndex - 1));
  $("#lbNext").addEventListener("click", () => showPhoto(lbIndex + 1));
  lb.addEventListener("click", e => { if (e.target === lb) closeLb(); });
  addEventListener("keydown", e => {
    if (!lb.classList.contains("open")) return;
    if (e.key === "Escape") closeLb();
    if (e.key === "ArrowLeft") showPhoto(lbIndex - 1);
    if (e.key === "ArrowRight") showPhoto(lbIndex + 1);
  });
  let sx = null;
  lb.addEventListener("pointerdown", e => { sx = e.clientX; });
  lb.addEventListener("pointerup", e => {
    if (sx == null) return;
    const dx = e.clientX - sx; sx = null;
    if (Math.abs(dx) > 50) showPhoto(lbIndex + (dx < 0 ? 1 : -1));
  });

  /* =========================================================
     RSVP
     ========================================================= */
  const form = $("#rsvpForm"), success = $("#rsvpSuccess"), guestsOut = $("#guests");
  let guests = 1;
  const setGuests = n => {
    guests = Math.max(1, Math.min(CONFIG.rsvp.maxGuests, n));
    guestsOut.textContent = guests;
    $('[data-step="-1"]').disabled = guests <= 1;
    $('[data-step="1"]').disabled = guests >= CONFIG.rsvp.maxGuests;
  };
  setGuests(1);
  $$("[data-step]").forEach(b => b.addEventListener("click", () => setGuests(guests + +b.dataset.step)));
  form.addEventListener("change", e => {
    if (e.target.name === "attending") $("#guestsField").hidden = e.target.value === "no";
  });
  form.addEventListener("input", e => {
    e.target.classList.remove("invalid");
    const err = $(`[data-err="${e.target.name}"]`); if (err) err.textContent = "";
  });

  function validate() {
    const f = form.elements;
    let ok = true;
    const fail = (name, msg, el) => {
      ok = false;
      $(`[data-err="${name}"]`).textContent = msg;
      if (el) { el.classList.remove("invalid"); void el.offsetWidth; el.classList.add("invalid"); }
    };
    if (f.name.value.trim().length < 2) fail("name", "გთხოვთ, მიუთითოთ სახელი", f.name);
    if (!form.querySelector('[name="attending"]:checked')) fail("attending", "აირჩიეთ ერთ-ერთი პასუხი", $(".choice"));
    if (!ok) (f.name.value.trim().length < 2 ? f.name : $('[name="attending"]')).focus();
    return ok;
  }

  /* ---------- BACKEND HOOK ----------
     Demo mode (CONFIG.rsvp.endpoint = ""): nothing leaves the browser.
     To collect real answers, set CONFIG.rsvp.endpoint and adapt this function:

     A) Your own API / a MOMENTLY endpoint (JSON):
          fetch(CONFIG.rsvp.endpoint, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) })

     B) Google Forms: create the form, use "Get pre-filled link" to find the entry IDs, then
          fetch("https://docs.google.com/forms/d/e/<FORM_ID>/formResponse", {
            method: "POST", mode: "no-cors",
            body: new URLSearchParams({ "entry.111": data.name, "entry.222": data.attending, "entry.333": data.guests, "entry.444": data.message })
          })

     C) Google Sheets via an Apps Script web app, Formspree, etc. — same idea as A. */
  async function sendRsvp(data) {
    if (!CONFIG.rsvp.endpoint) return wait(900);
    const res = await fetch(CONFIG.rsvp.endpoint, {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error(`RSVP endpoint answered ${res.status}`);
  }

  form.addEventListener("submit", async e => {
    e.preventDefault();
    if (!validate()) return;
    const f = form.elements;
    const attending = form.querySelector('[name="attending"]:checked').value;
    const data = {
      name: f.name.value.trim(), attending,
      guests: attending === "yes" ? guests : 0,
      message: f.message.value.trim(), sentAt: new Date().toISOString()
    };
    const btn = $("#rsvpSubmit");
    btn.disabled = true; btn.textContent = "იგზავნება…";
    try {
      await sendRsvp(data);
      showSuccess(data);
    } catch (err) {
      console.error(err);
      toast("ვერ გაიგზავნა — სცადეთ თავიდან");
    } finally {
      btn.disabled = false; btn.textContent = "პასუხის გაგზავნა";
    }
  });

  function showSuccess(data) {
    const first = data.name.split(/\s+/)[0];
    const yes = data.attending === "yes";
    $("#successTitle").textContent = (yes ? CONFIG.rsvp.yesTitle : CONFIG.rsvp.noTitle).replace("{name}", first);
    $("#successText").textContent = yes ? CONFIG.rsvp.yesText : CONFIG.rsvp.noText;
    form.animate([{ opacity: 1, transform: "none" }, { opacity: 0, transform: "scale(.97)" }], { duration: RM ? 1 : 350, fill: "forwards" })
      .finished.then(() => {
        form.hidden = true;
        form.getAnimations().forEach(a => a.cancel());
        success.hidden = false;
        success.classList.remove("play"); void success.offsetWidth; success.classList.add("play");
        $(".rsvp-card").scrollIntoView({ block: "center", behavior: RM ? "auto" : "smooth" });
        if (yes) setTimeout(() => {
          const r = $("svg", success).getBoundingClientRect();
          burst(r.left + r.width / 2, r.top + r.height / 2);
        }, RM ? 0 : 650);
      });
  }
  $("#rsvpAgain").addEventListener("click", () => {
    success.hidden = true; success.classList.remove("play");
    form.hidden = false;
    form.elements.name.focus();
  });

  /* ---------- Gold confetti burst ---------- */
  function burst(x, y) {
    if (RM) return;
    const c = document.createElement("canvas");
    c.className = "burst"; document.body.append(c);
    const ctx = c.getContext("2d"), dpr = Math.min(devicePixelRatio || 1, 2);
    c.width = innerWidth * dpr; c.height = innerHeight * dpr; ctx.scale(dpr, dpr);
    const colors = ["#e8d29f", "#b08d57", "#f6e7bd", "#6b1d2b", "#fbf7f0", "#d9a0a8"];
    const parts = Array.from({ length: 110 }, () => {
      const a = Math.random() * Math.PI * 2, v = 3 + Math.random() * 7;
      return { x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 4, w: 4 + Math.random() * 5, h: 7 + Math.random() * 8,
        r: Math.random() * 6.28, vr: (Math.random() - .5) * .3, c: colors[(Math.random() * colors.length) | 0], life: 1 };
    });
    let last = performance.now();
    (function frame(t) {
      const dt = Math.min(3, (t - last) / 16.67); last = t;
      ctx.clearRect(0, 0, innerWidth, innerHeight);
      let alive = 0;
      for (const p of parts) {
        if (p.life <= 0) continue;
        alive++;
        p.vy += .2 * dt; p.vx *= .985; p.vy *= .985;
        p.x += p.vx * dt; p.y += p.vy * dt; p.r += p.vr * dt; p.life -= .007 * dt;
        ctx.globalAlpha = Math.max(0, Math.min(1, p.life * 1.6));
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.r); ctx.scale(1, Math.cos(p.r * 2));
        ctx.fillStyle = p.c; ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      }
      if (alive) requestAnimationFrame(frame); else c.remove();
    })(last);
  }

  /* ---------- Music (never autoplays) ---------- */
  const musicBtn = $("#musicBtn");
  let audio = null, playing = false, fadeTimer = 0;
  function fadeTo(vol, done) {
    clearInterval(fadeTimer);
    fadeTimer = setInterval(() => {
      const next = audio.volume + (vol > audio.volume ? .05 : -.05);
      if (Math.abs(vol - audio.volume) <= .05) { audio.volume = vol; clearInterval(fadeTimer); if (done) done(); }
      else audio.volume = Math.max(0, Math.min(1, next));
    }, 60);
  }
  function musicUnavailable() {
    playing = false;
    musicBtn.setAttribute("aria-pressed", "false");
    toast("მუსიკა ჯერ არ არის დამატებული");
  }
  musicBtn.addEventListener("click", () => {
    if (!audio) {
      audio = new Audio();
      audio.loop = true; audio.preload = "auto"; audio.volume = 0;
      audio.addEventListener("error", musicUnavailable);
      audio.src = CONFIG.music;
    }
    if (playing) {
      playing = false;
      musicBtn.setAttribute("aria-pressed", "false"); musicBtn.setAttribute("aria-label", "მუსიკის ჩართვა");
      fadeTo(0, () => audio.pause());
      return;
    }
    playing = true;
    musicBtn.setAttribute("aria-pressed", "true"); musicBtn.setAttribute("aria-label", "მუსიკის გამორთვა");
    const p = audio.play();
    if (p) p.then(() => fadeTo(.7)).catch(musicUnavailable);
  });

  /* ---------- Toast ---------- */
  let toastTimer = 0;
  function toast(msg) {
    const t = $("#toast");
    t.textContent = msg; t.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove("show"), 2600);
  }
})();
