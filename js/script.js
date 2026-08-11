document.addEventListener("DOMContentLoaded", () => {

  /* ---------- Header scroll state ---------- */
  const header = document.querySelector(".site-header");
  const setHeader = () => header && header.classList.toggle("is-scrolled", window.scrollY > 16);
  setHeader();
  window.addEventListener("scroll", setHeader, {passive:true});

  /* ---------- Mobile nav ---------- */
  const menuBtn = document.querySelector(".menu-btn");
  const mobilePanel = document.querySelector(".mobile-panel");
  const mobileClose = document.querySelector(".mobile-close");
  const closeMenu = () => {
    mobilePanel?.classList.remove("is-open");
    document.body.classList.remove("nav-open");
  };
  menuBtn?.addEventListener("click", () => {
    mobilePanel?.classList.add("is-open");
    document.body.classList.add("nav-open");
  });
  mobileClose?.addEventListener("click", closeMenu);
  mobilePanel?.querySelectorAll("a").forEach(a => a.addEventListener("click", closeMenu));

  /* ---------- Hero slider (image + auto-detected video) ---------- */
  const slides = [...document.querySelectorAll(".hero-slide")];
  const dots = [...document.querySelectorAll(".hero-progress button")];
  const counter = document.querySelector(".hero-counter");
  const next = document.querySelector("[data-hero-next]");
  const prev = document.querySelector("[data-hero-prev]");
  let heroIndex = 0;
  let heroTimer = null;

  const renderHero = (index) => {
    if (!slides.length) return;
    heroIndex = (index + slides.length) % slides.length;
    slides.forEach((s,i) => {
      const active = i === heroIndex;
      s.classList.toggle("is-active", active);
      const video = s.querySelector("video");
      if (video) { active ? video.play().catch(()=>{}) : video.pause(); }
    });
    dots.forEach((d,i) => d.classList.toggle("is-active", i === heroIndex));
    if (counter) counter.textContent = `${String(heroIndex+1).padStart(2,"0")} / ${String(slides.length).padStart(2,"0")}`;
  };
  const restartHero = () => {
    if (heroTimer) clearInterval(heroTimer);
    if (slides.length > 1) heroTimer = setInterval(() => renderHero(heroIndex+1), 9000);
  };
  if (slides.length) {
    renderHero(0);
    dots.forEach((d,i) => d.addEventListener("click", () => { renderHero(i); restartHero(); }));
    next?.addEventListener("click", () => { renderHero(heroIndex+1); restartHero(); });
    prev?.addEventListener("click", () => { renderHero(heroIndex-1); restartHero(); });
    restartHero();
  }

  // Auto-connect: if a real video file exists at the referenced path, fade it in over
  // the fallback image. If it 404s, quietly stay on the image — no code edits needed
  // once you drop qbd-construction-hero.mp4 (etc.) into assets/img/hero/.
  document.querySelectorAll(".hero-media__video").forEach(video => {
    video.addEventListener("loadeddata", () => video.classList.add("is-loaded"));
    video.addEventListener("error", () => { video.style.display = "none"; }, true);
    // If nothing loads within a few seconds, assume the file is missing and hide quietly.
    setTimeout(() => { if (video.readyState === 0) video.style.display = "none"; }, 4000);
  });

  /* ---------- Reveal on scroll ---------- */
  const revealItems = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, {threshold:.12, rootMargin:"0px 0px -40px 0px"});
    revealItems.forEach(el => observer.observe(el));
  } else {
    revealItems.forEach(el => el.classList.add("is-visible"));
  }

  /* ---------- Animated counters (trust strip + metric row) ---------- */
  const counters = document.querySelectorAll("[data-count-to]");
  const animateCount = (el) => {
    const target = parseFloat(el.dataset.countTo);
    const suffix = el.dataset.suffix || "";
    const decimals = el.dataset.decimals ? parseInt(el.dataset.decimals,10) : 0;
    const duration = 1400;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      const val = target * eased;
      el.textContent = (decimals ? val.toFixed(decimals) : Math.round(val).toLocaleString()) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  if (counters.length && "IntersectionObserver" in window) {
    const cObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          cObserver.unobserve(entry.target);
        }
      });
    }, {threshold:.6});
    counters.forEach(el => cObserver.observe(el));
  }

  /* ---------- Testimonial carousel ---------- */
  const track = document.querySelector("[data-testimonial-track]");
  const tSlides = [...document.querySelectorAll("[data-testimonial-slide]")];
  const tDots = [...document.querySelectorAll("[data-testimonial-dot]")];
  const tNext = document.querySelector("[data-testimonial-next]");
  const tPrev = document.querySelector("[data-testimonial-prev]");
  let tIndex = 0;
  let tTimer = null;
  const renderTestimonials = (index) => {
    if (!track || !tSlides.length) return;
    tIndex = (index + tSlides.length) % tSlides.length;
    track.style.transform = `translateX(-${tIndex * 100}%)`;
    tDots.forEach((d,i) => d.classList.toggle("is-active", i === tIndex));
  };
  const restartTestimonials = () => {
    if (tTimer) clearInterval(tTimer);
    if (tSlides.length > 1) tTimer = setInterval(() => renderTestimonials(tIndex+1), 6000);
  };
  if (track) {
    renderTestimonials(0);
    tNext?.addEventListener("click", () => {renderTestimonials(tIndex+1); restartTestimonials();});
    tPrev?.addEventListener("click", () => {renderTestimonials(tIndex-1); restartTestimonials();});
    tDots.forEach((d,i) => d.addEventListener("click", () => {renderTestimonials(i); restartTestimonials();}));
    const wrap = track.closest(".testimonial-wrap");
    wrap?.addEventListener("mouseenter", () => tTimer && clearInterval(tTimer));
    wrap?.addEventListener("mouseleave", restartTestimonials);
    restartTestimonials();
  }

  /* ---------- Back to top ---------- */
  const toTop = document.querySelector(".to-top");
  if (toTop) {
    window.addEventListener("scroll", () => {
      toTop.classList.toggle("is-visible", window.scrollY > 600);
    }, {passive:true});
    toTop.addEventListener("click", () => window.scrollTo({top:0, behavior:"smooth"}));
  }

  /* ---------- Contact form: prepares an email draft (static site, no backend) ---------- */
  const form = document.querySelector("#contactForm");
  const status = document.querySelector(".form-status");
  form?.addEventListener("submit", e => {
    e.preventDefault();
    const data = new FormData(form);
    const name = data.get("name") || "";
    const email = data.get("email") || "";
    const company = data.get("company") || "";
    const project = data.get("project") || "";
    const message = data.get("message") || "";
    const subject = encodeURIComponent(`Website enquiry${company ? " — " + company : ""}`);
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\nCompany: ${company}\nProject: ${project}\n\nMessage:\n${message}`
    );
    window.location.href = `mailto:qbdpower@gmail.com?subject=${subject}&body=${body}`;
    if (status) status.textContent = "✓ Your email application should now open with the enquiry prepared.";
  });
});
