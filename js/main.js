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

  // ---------- Barra de progresso de leitura (topo) ----------
  const progressBar = document.createElement("div");
  progressBar.className = "scroll-progress";
  document.body.appendChild(progressBar);
  const updateProgressBar = () => {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const pct = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
    progressBar.style.width = pct + "%";
  };
  window.addEventListener("scroll", updateProgressBar, { passive: true });
  window.addEventListener("resize", updateProgressBar);
  updateProgressBar();

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

  // ---------- Hero da home: texto reage sutilmente ao mouse (profundidade) ----------
  const premiumHero = document.querySelector(".hero-banner--premium");
  if (premiumHero && hasFinePointer && !reduceMotion) {
    const heroContent = premiumHero.querySelector(".hero-banner__content");
    heroContent.classList.add("hero-banner__content--tilt");
    premiumHero.addEventListener("mousemove", (e) => {
      const rect = premiumHero.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      heroContent.style.transform = `translate(${px * -14}px, ${py * -10}px)`;
    });
    premiumHero.addEventListener("mouseleave", () => {
      heroContent.style.transform = "translate(0, 0)";
    });
  }

  // ---------- CTA flutuante "Fale conosco" (só home e Fox Automóveis) ----------
  if (document.body.classList.contains("show-whatsapp-fab")) {
    const contactIcon =
      '<svg class="icon" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413"/></svg>';

    const stack = document.createElement("div");
    stack.className = "whatsapp-fab-stack";
    const fab = document.createElement("a");
    fab.className = "whatsapp-fab";
    fab.href = "https://linktr.ee/foxautomoveisofc";
    fab.target = "_blank";
    fab.rel = "noopener";
    fab.setAttribute("aria-label", "Fale conosco");
    fab.innerHTML = contactIcon + '<span class="whatsapp-fab__label"><span>Fale conosco</span></span>';
    stack.appendChild(fab);
    document.body.appendChild(stack);
    setTimeout(() => stack.classList.add("is-visible"), 50);
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

  // ---------- Parallax leve (fundos de hero, desativado no mobile: sem margem extra, foto melhor enquadrada) ----------
  const parallaxEls = document.querySelectorAll("[data-parallax]");
  if (parallaxEls.length && !reduceMotion && window.matchMedia("(min-width: 701px)").matches) {
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
