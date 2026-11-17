/* ================= ULTIMATE Wheels2U – script ================= */
(function () {
  "use strict";

  /* ---------- Hero slider ---------- */
  const slides   = Array.from(document.querySelectorAll(".slide"));
  const dotsWrap = document.getElementById("dots");
  const caption  = document.getElementById("slideCaption");
  const counter  = document.getElementById("slideCount");
  const hero     = document.getElementById("home");
  const INTERVAL = 5000;
  let current = 0, timer = null;

  slides.forEach((s, i) => {
    const b = document.createElement("button");
    b.setAttribute("role", "tab");
    b.setAttribute("aria-label", "Show " + s.querySelector("img").alt);
    b.addEventListener("click", () => { go(i); restart(); });
    dotsWrap.appendChild(b);
  });
  const dots = Array.from(dotsWrap.children);

  function go(i) {
    slides[current].classList.remove("is-active");
    dots[current].classList.remove("active");
    current = (i + slides.length) % slides.length;
    slides[current].classList.add("is-active");
    dots[current].classList.add("active");
    caption.textContent = slides[current].querySelector("figcaption").textContent;
    counter.textContent = (current + 1) + " / " + slides.length;
  }
  const next = () => go(current + 1);
  const prev = () => go(current - 1);
  function start()   { if (!timer) timer = setInterval(next, INTERVAL); }
  function stop()    { clearInterval(timer); timer = null; }
  function restart() { stop(); start(); }

  document.getElementById("nextSlide").addEventListener("click", () => { next(); restart(); });
  document.getElementById("prevSlide").addEventListener("click", () => { prev(); restart(); });
  hero.addEventListener("mouseenter", stop);
  hero.addEventListener("mouseleave", start);
  document.addEventListener("keydown", e => {
    if (e.key === "ArrowRight") { next(); restart(); }
    if (e.key === "ArrowLeft")  { prev(); restart(); }
  });

  // touch swipe
  let x0 = null;
  hero.addEventListener("touchstart", e => { x0 = e.touches[0].clientX; }, { passive: true });
  hero.addEventListener("touchend", e => {
    if (x0 === null) return;
    const dx = e.changedTouches[0].clientX - x0;
    if (Math.abs(dx) > 40) { dx < 0 ? next() : prev(); restart(); }
    x0 = null;
  });

  go(0);
  if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) start();

  /* ---------- Mobile menu ---------- */
  const toggle = document.getElementById("navToggle");
  const nav    = document.getElementById("mainNav");
  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", open);
  });
  nav.querySelectorAll("a").forEach(a => a.addEventListener("click", () => {
    nav.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
  }));

  /* ---------- Scroll-spy: highlight active menu item ---------- */
  const links = Array.from(document.querySelectorAll(".nav-link"));
  const map = new Map(links.map(l => [l.getAttribute("href").slice(1), l]));
  const spy = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (en.isIntersecting) {
        links.forEach(l => l.classList.remove("active"));
        const l = map.get(en.target.id);
        if (l) l.classList.add("active");
      }
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  document.querySelectorAll("main section[id]").forEach(s => spy.observe(s));

  /* ---------- Testimonials slider ----------
     Add Google reviews by adding objects to this array. */
  const testimonials = [
    { quote: "Honest and professional. Every vehicle I've bought through Abe has been hassle free. Extremely satisfied.", name: "Robert Riley", date: "01/19", stars: 5 },
    { quote: "[Paste a Google review here]", name: "Reviewer name", date: "", stars: 0, empty: true },
    { quote: "[Paste a Google review here]", name: "Reviewer name", date: "", stars: 0, empty: true }
  ];
  const tTrack = document.getElementById("tTrack");
  const tDots  = document.getElementById("tDots");
  let tIdx = 0, tTimer = null;
  testimonials.forEach((t, i) => {
    const card = document.createElement("figure");
    card.className = "t-card" + (t.empty ? " empty" : "");
    card.innerHTML =
      (t.stars ? '<div class="t-stars" aria-label="' + t.stars + ' out of 5 stars">' + "★".repeat(t.stars) + '</div>' : "") +
      '<blockquote class="t-quote"></blockquote><figcaption><div class="t-name"></div><div class="t-date"></div></figcaption>';
    card.querySelector(".t-quote").textContent = t.quote;
    card.querySelector(".t-name").textContent = t.name;
    card.querySelector(".t-date").textContent = t.date;
    tTrack.appendChild(card);
    const d = document.createElement("button");
    d.setAttribute("aria-label", "Show testimonial " + (i + 1));
    d.addEventListener("click", () => { tGo(i); tRestart(); });
    tDots.appendChild(d);
  });
  function tGo(i) {
    tIdx = (i + testimonials.length) % testimonials.length;
    tTrack.style.transform = "translateX(-" + (tIdx * 100) + "%)";
    Array.from(tDots.children).forEach((d, j) => d.classList.toggle("active", j === tIdx));
  }
  function tRestart() { clearInterval(tTimer); tTimer = setInterval(() => tGo(tIdx + 1), 7000); }
  document.getElementById("tNext").addEventListener("click", () => { tGo(tIdx + 1); tRestart(); });
  document.getElementById("tPrev").addEventListener("click", () => { tGo(tIdx - 1); tRestart(); });
  const tSlider = document.getElementById("tSlider");
  tSlider.addEventListener("mouseenter", () => clearInterval(tTimer));
  tSlider.addEventListener("mouseleave", tRestart);
  let tx0 = null;
  tSlider.addEventListener("touchstart", e => { tx0 = e.touches[0].clientX; }, { passive: true });
  tSlider.addEventListener("touchend", e => {
    if (tx0 === null) return;
    const dx = e.changedTouches[0].clientX - tx0;
    if (Math.abs(dx) > 40) { tGo(tIdx + (dx < 0 ? 1 : -1)); tRestart(); }
    tx0 = null;
  });
  tGo(0); tRestart();

  /* ---------- Deal / career buttons pre-select the contact topic ---------- */
  const topic = document.getElementById("topic");
  document.querySelectorAll("[data-vehicle]").forEach(btn =>
    btn.addEventListener("click", () => { topic.value = btn.dataset.vehicle; })
  );

  /* ---------- Contact form ----------
     No backend yet: validates, then opens the visitor's email app
     with the message pre-filled to info@ultimatewheels2u.com. */
  const form = document.getElementById("contactForm");
  const status = document.getElementById("formStatus");
  form.addEventListener("submit", e => {
    e.preventDefault();
    let ok = true;
    form.querySelectorAll("[required]").forEach(f => {
      const bad = !f.value.trim() || (f.type === "email" && !/^\S+@\S+\.\S+$/.test(f.value));
      f.classList.toggle("invalid", bad);
      if (bad) ok = false;
    });
    if (!ok) { status.textContent = "Please fill in your name, a valid email and a message."; return; }
    const d = new FormData(form);
    const subject = "Website enquiry" + (d.get("topic") ? ": " + d.get("topic") : "");
    const body = "Name: " + d.get("name") + "\nEmail: " + d.get("email") + "\nPhone: " + (d.get("phone") || "-") +
                 "\nInterested in: " + (d.get("topic") || "-") + "\n\n" + d.get("message");
    window.location.href = "mailto:info@ultimatewheels2u.com?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
    status.textContent = "Thanks! Your email app should open with your message ready to send.";
    form.reset();
  });

  document.getElementById("year").textContent = new Date().getFullYear();
})();
