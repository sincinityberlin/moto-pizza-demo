/* ==========================================================================
   MOTO PIZZA — Site behaviour
   Organized by feature. Each block is independent — safe to edit in isolation.
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  initScrollReveal(); // must run first: initPizzaSelector()/renderGallery() observe new nodes via revealObserver
  initPizzaSelector();
  renderGallery();
  renderProductGrid("snacksGrid", MOTO_SNACKS, "snack");
  renderProductGrid("drinksGrid", MOTO_DRINKS, "drink");
  initNavScroll();
  initMobileNav();
  initMagneticButtons();
  initHeroParallax();
  initHeroToppingsParallax();
  document.getElementById("year").textContent = new Date().getFullYear();
});

/* ---------- MOTO wordmark in data-driven copy ----------------------------
   Text coming out of data/menu.js is rendered as HTML in the few places it
   can contain the brand name, so "MOTO" gets drawn as the logotype there too
   (same <symbol> the static markup in index.html instances). The word
   boundary at the end is what keeps "MOTOR CITY" and "Motoren" as ordinary
   text — only the standalone brand word is swapped.
   ---------------------------------------------------------------------- */
const MOTO_MARK = '<svg class="moto-mark" role="img" aria-label="MOTO"><use href="#moto-wordmark"/></svg>';

/* menu data is authored in this repo, not user input, but these strings go
   through innerHTML — escape first so a stray & or < in a description can
   never become markup */
function escapeHtml(str) {
  return String(str).replace(
    /[&<>"]/g,
    (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[ch]
  );
}

function withMotoMark(str) {
  return escapeHtml(str).replace(/\bMOTO\b/g, MOTO_MARK);
}

/* ---------- Allergen / additive labelling --------------------------------
   Renders the small line that sits under every product's description. The
   codes themselves live in data/menu.js — see the labelling notes at the top
   of that file for the rule on when a code may be listed at all.

   The "noch zu bestätigen" note is deliberate and load-bearing: a partial
   allergen list is more dangerous than none, because someone with an allergy
   will read a list of codes as complete. While `allergensPending` is true the
   line always says so, whether or not any codes were confirmed.
   ---------------------------------------------------------------------- */
function allergenLine(item) {
  const codes = Array.isArray(item.allergens) ? item.allergens : [];
  const additives = Array.isArray(item.additives) ? item.additives : [];
  const pending = item.allergensPending !== false;

  if (!codes.length && !additives.length && !pending) return "";

  // one line per category, and no "Zusatzstoffe" line at all when there are none
  let html = "";
  if (codes.length) {
    html += `<span class="allergen__row"><span class="allergen__label">Allergene:</span> <span class="allergen__codes">${escapeHtml(codes.join(", "))}</span></span>`;
  }
  if (additives.length) {
    html += `<span class="allergen__row"><span class="allergen__label">Zusatzstoffe:</span> <span class="allergen__codes">${escapeHtml(additives.join(", "))}</span></span>`;
  }
  if (pending) {
    html += `<span class="allergen__row allergen__pending">${
      codes.length ? "weitere Angaben noch zu bestätigen" : "Allergenangaben noch zu bestätigen"
    }</span>`;
  }
  return `<p class="allergen">${html}</p>`;
}

/* ---------- Interactive pizza selector: semicircle swipe carousel ---------
   Pizzas sit on the upper half of a virtual circle: the active pizza is the
   circle's lowest/frontmost point (large, centered), and neighbours curve
   away up and back along the arc (smaller, higher, faded) the further their
   offset from the active slide. `pos` is a continuous (float) ring position;
   every slide's translateX/translateY/scale/rotate/opacity is derived from
   its distance to `pos` via simple trigonometry and redrawn every frame,
   both while dragging AND while the momentum/snap settle animation runs —
   there is no CSS transition here, the rAF loop *is* the motion. Pure 2D
   transforms only (no perspective/rotateY/translateZ) — deliberately, to
   stay cheap and avoid any 3D-compositing edge cases. Infinite wrap is done
   by rendering a few clone slides on each side of the real 10 and silently
   re-basing `pos` by one full lap once a settle lands past the real range
   (see normalizePos) — a clone looks identical to the real pizza it stands
   in for, so the jump is invisible.
   ---------------------------------------------------------------------- */
function initPizzaSelector() {
  const root = document.getElementById("pizzaSelector");
  const stage = document.getElementById("selStage");
  const track = document.getElementById("selTrack");
  const panel = document.getElementById("selPanel");
  if (!root || !stage || !track || !panel || typeof MOTO_MENU === "undefined") return;

  const els = {
    current: document.getElementById("selIndexCurrent"),
    total: document.getElementById("selIndexTotal"),
    category: document.getElementById("selCategory"),
    name: document.getElementById("selName"),
    short: document.getElementById("selShort"),
    ingredients: document.getElementById("selIngredients"),
    allergens: document.getElementById("selAllergens"),
    price: document.getElementById("selPrice"),
  };

  const count = MOTO_MENU.length;
  const CLONES = 3; // buffer slides per side — also the max steps one flick may cover
  const totalSlides = count + CLONES * 2;
  const dataIndexOf = (trackIdx) => (((trackIdx - CLONES) % count) + count) % count;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  track.innerHTML = Array.from({ length: totalSlides }, (_, trackIdx) => {
    const p = MOTO_MENU[dataIndexOf(trackIdx)];
    return `
    <div class="selector__slide">
      <div class="selector__frame">
        <span class="selector__ring" aria-hidden="true"></span>
        <img src="assets/images/pizza-${p.id}.png" alt="${p.name} – vollständige Detroit Style Pizza" loading="lazy" draggable="false" />
      </div>
    </div>`;
  }).join("");

  const slideEls = [...track.children];
  els.total.textContent = String(count).padStart(2, "0");

  let pos = CLONES; // continuous ring position, in slide units
  let slideUnit = 0; // px dragged per one ring step (drag sensitivity), remeasured on resize
  let radiusX = 0; // px — how far the arc spreads horizontally
  let radiusY = 0; // px — how far side slides rise up the arc
  let activeData = -1;
  let panelTimer = null;
  let settleFrame = null;
  let settleTarget = CLONES; // last commanded target — lets rapid arrow/key taps accumulate

  const ANGLE_STEP = 24; // degrees of arc per ring step
  const MAX_ANGLE = 78; // clamp — stay short of 90° so slides never fold back past the sides

  function measure() {
    const stageStyles = getComputedStyle(stage);
    const contentWidth = stage.clientWidth - parseFloat(stageStyles.paddingLeft) - parseFloat(stageStyles.paddingRight);
    const slidePercent = parseFloat(getComputedStyle(root).getPropertyValue("--slide-w")) || 60;
    const slideWidth = contentWidth * (slidePercent / 100);
    slideUnit = slideWidth + Math.max(contentWidth * 0.05, 16);

    // height/width ratio — matches the pizza photos' own ~0.605 aspect
    // (1100x664px, all 10 identically cropped) plus a little breathing
    // room. Previously 1 (mobile, square) / 5:4 (desktop, portrait) — both
    // far taller than a landscape pizza actually needs, which left large
    // empty top/bottom margins inside the frame and made the pizza itself
    // look small even though the card was big. A frame shaped like the
    // photo lets object-fit:contain fill it edge to edge instead.
    // 0.62 (was 0.68) hugs the photo aspect more tightly, so the now much
    // wider slide does not drag a band of dead pink along with it.
    const ratio = 0.62;
    const slideHeight = slideWidth * ratio;

    // wider slides need a wider arc, otherwise the neighbours creep in over
    // the active pizza instead of sitting clearly behind it
    radiusX = contentWidth * 0.62;
    radiusY = slideHeight * 0.5;

    // track needs room above the base slide height for the arc's rise, plus
    // the base slide sits flush at the bottom (the circle's front/lowest point)
    track.style.height = `${Math.round(slideHeight + radiusY + 20)}px`;
    slideEls.forEach((el) => {
      el.style.height = `${Math.round(slideHeight)}px`;
    });
  }

  function layout() {
    slideEls.forEach((el, trackIdx) => {
      const offset = trackIdx - pos;
      const abs = Math.abs(offset);
      if (abs > CLONES + 0.55) {
        el.style.opacity = "0";
        return;
      }
      const angleDeg = reducedMotion ? 0 : Math.max(-MAX_ANGLE, Math.min(MAX_ANGLE, offset * ANGLE_STEP));
      const rad = (angleDeg * Math.PI) / 180;
      const x = Math.sin(rad) * radiusX;
      const y = -(1 - Math.cos(rad)) * radiusY; // rises (negative/up) the further from center
      const rotate = reducedMotion ? 0 : Math.max(-16, Math.min(16, offset * -6));
      // steeper falloff than before (was 0.22 / min 0.4): the neighbours
      // give up more size per step, so the depth reads stronger without
      // scaling the active slide past 1 — upscaling it would only soften
      // the 1100px source photo.
      const scale = Math.max(1 - abs * 0.3, 0.34);
      el.style.transform = `translateX(${x}px) translateY(${y}px) rotate(${rotate}deg) scale(${scale})`;
      el.style.opacity = String(Math.max(1 - abs * 0.38, 0));
      el.style.zIndex = String(Math.round(1000 - abs * 10));
    });
  }

  function updatePanel(dataIdx, instant) {
    if (dataIdx === activeData) return;
    activeData = dataIdx;
    root.dataset.tone = dataIdx % 2 === 0 ? "pink" : "blue";
    clearTimeout(panelTimer);
    panel.classList.add("is-changing");
    panelTimer = setTimeout(
      () => {
        const p = MOTO_MENU[dataIdx];
        els.current.textContent = String(dataIdx + 1).padStart(2, "0");
        els.category.textContent = p.tag;
        els.name.innerHTML = withMotoMark(p.name);
        els.short.innerHTML = withMotoMark(p.short || p.desc);
        els.ingredients.innerHTML = withMotoMark(p.desc);
        if (els.allergens) els.allergens.innerHTML = allergenLine(p);
        els.price.textContent = `${p.price} €`;
        panel.classList.remove("is-changing");
      },
      instant ? 0 : 160
    );
  }

  // keep pos within one lap of the real range — clones are visually
  // identical to their real counterpart, so re-basing here is invisible
  function normalizePos() {
    while (pos >= CLONES + count) pos -= count;
    while (pos < CLONES) pos += count;
  }

  function cancelSettle() {
    if (settleFrame) cancelAnimationFrame(settleFrame);
    settleFrame = null;
  }

  function settleTo(target) {
    cancelSettle();
    settleTarget = target;
    const start = pos;
    const distance = target - start;
    if (Math.abs(distance) < 0.001) {
      normalizePos();
      layout();
      updatePanel(dataIndexOf(Math.round(pos)), false);
      return;
    }
    const duration = reducedMotion ? 1 : Math.min(700, 320 + Math.abs(distance) * 240);
    const startTime = performance.now();
    const tick = (now) => {
      const t = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3); // ease-out cubic — decelerating "snap"
      pos = start + distance * eased;
      layout();
      if (t < 1) {
        settleFrame = requestAnimationFrame(tick);
      } else {
        pos = target;
        normalizePos();
        layout();
        updatePanel(dataIndexOf(Math.round(pos)), false);
        settleFrame = null;
      }
    };
    settleFrame = requestAnimationFrame(tick);
  }

  function goTo(steps) {
    // base on the last commanded target (not the live, still-interpolating
    // pos) so rapid arrow/key taps accumulate instead of each one cancelling
    // the previous step before it visibly moved
    const base = settleFrame ? settleTarget : Math.round(pos);
    settleTo(base + steps);
  }

  document.getElementById("selPrev").addEventListener("click", () => goTo(-1));
  document.getElementById("selNext").addEventListener("click", () => goTo(1));

  stage.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") goTo(-1);
    if (e.key === "ArrowRight") goTo(1);
  });

  // ---- drag / swipe: unified mouse + touch via the Pointer Events API ----
  let dragging = false;
  let axis = null; // 'x' | 'y' | null (undecided, within the deadzone)
  let dragStartX = 0;
  let dragStartY = 0;
  let dragStartPos = 0;
  let lastX = 0;
  let lastT = 0;
  let velocity = 0; // px/ms

  track.addEventListener("pointerdown", (e) => {
    cancelSettle();
    dragging = true;
    axis = null;
    dragStartX = lastX = e.clientX;
    dragStartY = e.clientY;
    dragStartPos = pos;
    lastT = performance.now();
    velocity = 0;
    track.classList.add("is-dragging");
    track.setPointerCapture(e.pointerId);
  });

  track.addEventListener("pointermove", (e) => {
    if (!dragging) return;
    const dx = e.clientX - dragStartX;
    const dy = e.clientY - dragStartY;

    if (axis === null) {
      if (Math.abs(dx) < 6 && Math.abs(dy) < 6) return; // small deadzone before committing to an axis
      axis = Math.abs(dx) > Math.abs(dy) ? "x" : "y";
      if (axis === "y") {
        // vertical intent — hand the gesture back to the page (normal scroll)
        dragging = false;
        track.classList.remove("is-dragging");
        return;
      }
    }
    if (axis !== "x") return;

    e.preventDefault(); // committed to a horizontal drag — stop any scroll-chaining
    pos = dragStartPos - dx / slideUnit;
    layout();

    const now = performance.now();
    const dt = now - lastT;
    if (dt > 0) velocity = (e.clientX - lastX) / dt;
    lastX = e.clientX;
    lastT = now;
  });

  function endDrag() {
    if (!dragging) return;
    dragging = false;
    track.classList.remove("is-dragging");
    if (axis !== "x") return;

    // project the release velocity forward, then snap to the nearest ring
    // slot — a firm flick lands one slot further even if barely dragged
    const unitVelocity = velocity / slideUnit;
    const projected = pos - unitVelocity * 140;
    const clamped = Math.max(dragStartPos - CLONES, Math.min(dragStartPos + CLONES, projected));
    settleTo(Math.round(clamped));
  }
  track.addEventListener("pointerup", endDrag);
  track.addEventListener("pointercancel", endDrag);
  track.addEventListener("pointerleave", (e) => {
    if (dragging && e.buttons === 0) endDrag();
  });

  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      measure();
      layout();
    }, 120);
  });

  measure();
  layout();
  updatePanel(dataIndexOf(Math.round(pos)), true);
}

/* ---------- Infinite gallery strip ----------------------------------------
   Finished campaign photographs, not the cut-out product shots the menu
   uses: each frame already carries its own pizza, setting and MOTO
   branding, so the strip is driven by this list rather than by MOTO_MENU.
   `focus` becomes the CSS object-position — the default centre crop would
   push the brand element (the car, the shopfront sign) out of a landscape
   frame, so those two are anchored to the side that carries it. */
const MOTO_GALLERY = [
  { file: "lifestyle-01", alt: "MOTO PIZZA am Fensterplatz mit Blick auf das Kottbusser Tor", focus: "50% 50%" },
  { file: "lifestyle-02", alt: "MOTO PIZZA auf einer Dachbrüstung vor der Berliner Skyline im Sonnenuntergang", focus: "50% 55%" },
  { file: "lifestyle-03", alt: "MOTO PIZZA an der Spree vor der Oberbaumbrücke", focus: "50% 55%" },
  { file: "lifestyle-04", alt: "MOTO PIZZA auf einem Holztisch am Skatepark", focus: "50% 55%" },
  { file: "lifestyle-05", alt: "MOTO PIZZA im pinken Karton vor dem Neonschild des Stores", focus: "50% 45%" },
  { file: "lifestyle-06", alt: "MOTO PIZZA im pinken Karton vor dem Brandenburger Tor mit dem MOTO Lieferwagen", focus: "50% 50%" },
];

function renderGallery() {
  const track = document.getElementById("galleryTrack");
  if (!track) return;

  const items = MOTO_GALLERY.map(
    (g) =>
      `<div class="gallery__item"><img src="assets/images/${g.file}.jpg" alt="${g.alt}" style="object-position:${g.focus}" loading="lazy" /></div>`
  ).join("");

  // duplicate content once so the CSS -50% loop is seamless
  track.innerHTML = items + items;
}

/* ---------- Snacks / Getränke product grids ------------------------------
   Shared renderer for both simple product sections (Snacks, Getränke) —
   image + name + tag/flavor + description + price, image filename prefix
   distinguishes the two (snack-<id>.png / drink-<id>.png).
   The deposit line is data-driven: only items carrying a `deposit` field
   render it, so the canned drinks get it while snacks and the bottled
   Sprudel stay exactly as they were — no per-section branching needed. */
function renderProductGrid(gridId, items, imgPrefix) {
  const grid = document.getElementById(gridId);
  if (!grid || !items) return;

  grid.innerHTML = items
    .map(
      (p) => `
    <article class="product-card reveal" data-reveal>
      <div class="product-card__media">
        <img src="assets/images/${imgPrefix}-${p.id}.png" alt="${p.name}${p.tag ? " – " + p.tag : ""}" loading="lazy" />
      </div>
      <div class="product-card__body">
        <h3 class="product-card__name">${p.name}</h3>
        <p class="product-card__tag">${p.tag}</p>
        <p class="product-card__desc">${p.desc}</p>
        ${allergenLine(p)}
        <p class="product-card__price${p.price ? "" : " product-card__price--soon"}">${p.price ? p.price + "&nbsp;€" : "Preis folgt"}</p>
        ${p.deposit ? `<p class="product-card__deposit">zzgl. ${p.deposit}&nbsp;€ Pfand</p>` : ""}
      </div>
    </article>`
    )
    .join("");

  observeReveal(grid.querySelectorAll("[data-reveal]"));
}

/* ---------- Nav background on scroll -------------------------------------- */
function initNavScroll() {
  const nav = document.querySelector(".nav");
  if (!nav) return;
  const onScroll = () => nav.classList.toggle("is-scrolled", window.scrollY > 40);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
}

/* ---------- Mobile nav toggle ---------------------------------------------- */
function initMobileNav() {
  const btn = document.getElementById("burgerBtn");
  const menu = document.getElementById("mobileMenu");
  if (!btn || !menu) return;

  const close = () => {
    btn.setAttribute("aria-expanded", "false");
    menu.classList.remove("is-open");
  };

  btn.addEventListener("click", () => {
    const open = btn.getAttribute("aria-expanded") === "true";
    btn.setAttribute("aria-expanded", String(!open));
    menu.classList.toggle("is-open", !open);
  });

  menu.querySelectorAll("a").forEach((a) => a.addEventListener("click", close));
}

/* ---------- Scroll reveal (IntersectionObserver) --------------------------- */
let revealObserver;
function initScrollReveal() {
  revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
  );
  observeReveal(document.querySelectorAll("[data-reveal]"));
}

function observeReveal(nodes) {
  nodes.forEach((el) => {
    const delay = el.getAttribute("data-delay");
    if (delay) el.style.setProperty("--d", delay);
    revealObserver.observe(el);
  });
}

/* ---------- Magnetic button hover ------------------------------------------ */
function initMagneticButtons() {
  const isFinePointer = window.matchMedia("(pointer: fine)").matches;
  if (!isFinePointer) return;

  document.querySelectorAll(".magnetic").forEach((btn) => {
    btn.addEventListener("mousemove", (e) => {
      const r = btn.getBoundingClientRect();
      const x = e.clientX - r.left - r.width / 2;
      const y = e.clientY - r.top - r.height / 2;
      btn.style.transform = `translate(${x * 0.28}px, ${y * 0.35}px)`;
    });
    btn.addEventListener("mouseleave", () => {
      btn.style.transform = "translate(0, 0)";
    });
  });
}

/* ---------- Hero image subtle parallax -------------------------------------- */
function initHeroParallax() {
  const img = document.getElementById("heroImg");
  const hero = document.querySelector(".hero");
  if (!img || !hero) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  // gentle drift only — the product image is object-fit:contain now, not a
  // full-bleed cover photo, so no scale-up is needed to avoid edge gaps
  window.addEventListener(
    "scroll",
    () => {
      const p = Math.min(window.scrollY / hero.offsetHeight, 1);
      img.style.transform = `translateY(${p * 36}px)`;
    },
    { passive: true }
  );
}

/* ---------- Floating hero toppings: scroll-linked depth/parallax ----------
   Each .hero__topping carries its own data-speed/-drift/-rotate/-tilt/-scale,
   read once on init. `progress` is a direct, un-normalized function of
   window.scrollY (not divided by the hero's own height) — that's the fix
   over the first version, which divided by ~950px of hero height and made
   the motion barely perceptible until the section had nearly scrolled past.
   Tying it straight to scrollY means a normal scroll gesture (a few hundred
   px) already produces a clearly visible shift. It's a pure function of
   scroll position, so it runs forwards AND backwards in exact lockstep with
   the scrollbar — never fixed/pinned, never "stuck". Each element gets its
   own translateY(speed) / translateX(drift) / rotate / scale off that same
   progress, so they drift apart at different rates (some faster, some
   slower, some barely) for the layered floating look, plus a fixed
   data-tilt base rotation so they read as loosely scattered stickers even
   at rest. rAF-throttled so the scroll handler itself stays cheap. */
function initHeroToppingsParallax() {
  const toppings = document.querySelectorAll(".hero__topping");
  if (!toppings.length) return;

  const items = Array.from(toppings).map((el) => ({
    el,
    speed: parseFloat(el.dataset.speed) || 100,
    drift: parseFloat(el.dataset.drift) || 20,
    rotate: parseFloat(el.dataset.rotate) || 16,
    tilt: parseFloat(el.dataset.tilt) || 0,
    scale: parseFloat(el.dataset.scale) || 0.15,
  }));

  // the CSS entrance animation (heroToppingIn, see style.css) owns each
  // element's transform first and — while it's running — wins over any
  // inline style we set below (CSS animations outrank plain inline styles
  // in the cascade). Once it finishes we clear it so the scroll-driven
  // inline transform underneath (already being kept up to date the whole
  // time) becomes visible — its 0%/100% keyframe ends exactly at this
  // topping's resting transform, so the handoff has no visible snap.
  // Opacity must be set explicitly too: the base rule that declares the
  // animation also sets opacity:0 as its static (non-animated) value, so
  // clearing the animation alone would make the topping fall straight
  // back to invisible the instant its entrance finishes.
  items.forEach(({ el }) => {
    el.addEventListener("animationend", () => {
      el.style.animation = "none";
      el.style.opacity = "1";
    }, { once: true });
  });

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    items.forEach(({ el, tilt }) => {
      el.style.animation = "none";
      el.style.opacity = "1";
      el.style.transform = `rotate(${tilt}deg)`;
    });
    return;
  }

  let ticking = false;

  function apply() {
    ticking = false;
    const mobile = window.innerWidth < 640;
    const intensity = mobile ? 0.55 : 1; // smaller travel distance on mobile, per spec
    // 560px of scroll = one full "unit" of motion — reached well within the
    // hero's own height, so the float is visible throughout a normal scroll,
    // not just in the last few px before the section leaves the viewport.
    const progress = Math.max(-0.4, Math.min(window.scrollY / 560, 2.4));

    items.forEach(({ el, speed, drift, rotate, tilt, scale }) => {
      const y = progress * speed * intensity;
      const x = progress * drift * intensity;
      const r = tilt + progress * rotate * intensity;
      const s = 1 + progress * scale * intensity;
      el.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(${r}deg) scale(${s})`;
    });
  }

  function onScrollOrResize() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(apply);
  }

  window.addEventListener("scroll", onScrollOrResize, { passive: true });
  window.addEventListener("resize", onScrollOrResize);
  apply();
}
