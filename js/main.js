document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.querySelector(".nav__toggle");
  const links = document.querySelector(".nav__links");
  if (toggle && links) {
    toggle.addEventListener("click", () => {
      links.classList.toggle("is-open");
    });
  }

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ---------- Vitrine de serviços: rolagem automática e contínua ----------
  document.querySelectorAll(".services-track").forEach((track) => {
    const items = Array.from(track.children);
    if (items.length < 2) return;
    const inner = document.createElement("div");
    inner.className = "services-track__inner";
    items.forEach((item) => {
      item.removeAttribute("data-animate");
      item.removeAttribute("data-delay");
      inner.appendChild(item);
    });
    items.forEach((item) => inner.appendChild(item.cloneNode(true)));
    track.innerHTML = "";
    track.appendChild(inner);
    track.classList.add("services-track--auto");

    if (reduceMotion) return;

    const setDuration = () => {
      const speed = 40; // px/s
      const width = inner.scrollWidth / 2;
      inner.style.animationDuration = `${Math.max(8, width / speed)}s`;
    };
    setDuration();
    window.addEventListener("resize", setDuration);

    track.addEventListener("touchstart", () => track.classList.add("is-paused"), { passive: true });
    track.addEventListener("touchend", () => track.classList.remove("is-paused"), { passive: true });
  });

  const animatedEls = document.querySelectorAll("[data-animate]");
  if (animatedEls.length && "IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const delay = entry.target.getAttribute("data-delay") || 0;
            setTimeout(() => entry.target.classList.add("is-visible"), delay);
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    animatedEls.forEach((el) => observer.observe(el));
  } else {
    animatedEls.forEach((el) => el.classList.add("is-visible"));
  }

  // ---------- Header: solidifica ao rolar (transparente sobre o hero) ----------
  const header = document.querySelector(".site-header");
  if (header) {
    const onHeaderScroll = () => {
      header.classList.toggle("is-scrolled", window.scrollY > 40);
    };
    window.addEventListener("scroll", onHeaderScroll, { passive: true });
    onHeaderScroll();
  }

  // ---------- Cursor personalizado (tema escuro, mouse fino) ----------
  const hasFinePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  if (document.body.classList.contains("theme-dark") && hasFinePointer && !reduceMotion) {
    document.body.classList.add("has-custom-cursor");
    const dot = document.createElement("div");
    dot.className = "cursor-dot";
    const ring = document.createElement("div");
    ring.className = "cursor-ring";
    document.body.append(dot, ring);

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;

    window.addEventListener("mousemove", (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
    });

    function cursorLoop() {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      ring.style.transform = `translate(${ringX}px, ${ringY}px)`;
      requestAnimationFrame(cursorLoop);
    }
    cursorLoop();

    document.querySelectorAll("a, button, .card-glass").forEach((el) => {
      el.addEventListener("mouseenter", () => ring.classList.add("is-active"));
      el.addEventListener("mouseleave", () => ring.classList.remove("is-active"));
    });
  }

  // ---------- CTA de WhatsApp flutuante e discreta (só home e Fox Automóveis) ----------
  if (document.body.classList.contains("show-whatsapp-fab")) {
    const fab = document.createElement("a");
    fab.className = "whatsapp-fab";
    fab.href = `https://wa.me/5519996774677?text=${encodeURIComponent("Olá! Vim pelo site da Fox e gostaria de mais informações.")}`;
    fab.target = "_blank";
    fab.rel = "noopener";
    fab.setAttribute("aria-label", "Falar no WhatsApp");
    fab.innerHTML =
      '<svg class="icon" viewBox="0 0 24 24"><path d="M20.5 3.5A11 11 0 0 0 3.3 17L2 22l5.2-1.3A11 11 0 1 0 20.5 3.5Z"/><path d="M8.5 8.7c.2-.6.5-.6.8-.6h.6c.2 0 .5 0 .7.5.3.7 1 2.2 1 2.4s0 .3-.2.5c-.2.3-.4.4-.6.6-.2.2-.4.4-.2.8.2.4 1 1.6 2.1 2.5 1.4 1.2 2 1.3 2.4 1.3.4 0 .6-.2.8-.5.2-.3.9-1 1.1-1.4.2-.3.5-.3.8-.2.3.1 1.9.9 2.2 1 .3.2.5.2.6.4.1.2.1 1-.3 1.9-.4.9-2 1.7-2.8 1.8-.7.1-1.6.2-5.2-1.1-4.4-1.7-7.1-6.1-7.3-6.4-.2-.3-1.7-2.3-1.7-4.3 0-2.1 1.1-3.1 1.5-3.5Z" fill="#0a0a0c" stroke="none"/></svg>' +
      '<span class="whatsapp-fab__label"><span>Falar no WhatsApp</span><small>Fox Automóveis</small></span>';
    document.body.appendChild(fab);
    const revealFab = () => {
      fab.classList.toggle("is-visible", window.scrollY > 200);
    };
    window.addEventListener("scroll", revealFab, { passive: true });
    revealFab();
  }

  // ---------- Contadores animados (estatísticas) ----------
  const counters = document.querySelectorAll("[data-count-to]");
  if (counters.length && "IntersectionObserver" in window) {
    const counterObserver = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          const target = parseFloat(el.getAttribute("data-count-to"));
          const suffix = el.getAttribute("data-count-suffix") || "";
          const decimals = parseInt(el.getAttribute("data-count-decimals") || "0", 10);
          const duration = reduceMotion ? 1 : 1600;
          const start = performance.now();
          function tick(now) {
            const p = Math.min(1, (now - start) / duration);
            const eased = 1 - Math.pow(1 - p, 3);
            el.textContent = (target * eased).toFixed(decimals).replace(".", ",") + suffix;
            if (p < 1) requestAnimationFrame(tick);
          }
          requestAnimationFrame(tick);
          obs.unobserve(el);
        });
      },
      { threshold: 0.5 }
    );
    counters.forEach((el) => counterObserver.observe(el));
  }

  // ---------- Parallax leve (fundos de hero) ----------
  const parallaxEls = document.querySelectorAll("[data-parallax]");
  if (parallaxEls.length && !reduceMotion) {
    let ticking = false;
    function updateParallax() {
      parallaxEls.forEach((el) => {
        const speed = parseFloat(el.getAttribute("data-parallax")) || 0.15;
        const rect = el.getBoundingClientRect();
        const offset = (rect.top + rect.height / 2 - window.innerHeight / 2) * speed;
        el.style.transform = `translateY(${offset}px)`;
      });
      ticking = false;
    }
    window.addEventListener(
      "scroll",
      () => {
        if (!ticking) {
          requestAnimationFrame(updateParallax);
          ticking = true;
        }
      },
      { passive: true }
    );
    updateParallax();
  }

  // ---------- Linha do tempo animada ----------
  const timeline = document.querySelector(".timeline");
  if (timeline) {
    const progress = document.createElement("div");
    progress.className = "timeline__progress";
    timeline.appendChild(progress);
    function updateTimeline() {
      const rect = timeline.getBoundingClientRect();
      const total = rect.height;
      const visible = Math.min(total, Math.max(0, window.innerHeight * 0.75 - rect.top));
      const pct = total > 0 ? Math.max(0, Math.min(1, visible / total)) : 0;
      progress.style.height = pct * 100 + "%";
    }
    window.addEventListener("scroll", updateTimeline, { passive: true });
    window.addEventListener("resize", updateTimeline);
    updateTimeline();
  }
});
