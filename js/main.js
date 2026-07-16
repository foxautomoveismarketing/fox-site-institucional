document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.querySelector(".nav__toggle");
  const links = document.querySelector(".nav__links");
  if (toggle && links) {
    toggle.addEventListener("click", () => {
      links.classList.toggle("is-open");
    });
  }

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
});
