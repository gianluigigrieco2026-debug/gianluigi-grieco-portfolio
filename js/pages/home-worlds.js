export function initializeHomeWorlds() {
  const page = document.querySelector("[data-home-journey]");
  if (!page) return () => {};

  const journeySessionKey = "portfolio-home-journey-entered";
  const gateway = page.querySelector("[data-home-gateway]");
  const enterButton = page.querySelector("[data-home-enter]");
  const gatewayStatus = page.querySelector("[data-home-gateway-status]");
  const journeyContent = page.querySelector(".home-journey");
  const panels = [...page.querySelectorAll("[data-glass-panel]")];
  const sections = [...page.querySelectorAll("[data-home-section]")];
  const progressBar = page.querySelector("[data-home-progress-bar]");
  const progressNumber = page.querySelector("[data-home-progress-number]");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let frame = null;
  let activeSection = 0;
  let journeyTimer = null;

  const isGatewayOpen = Boolean(gateway && !gateway.hidden);
  document.body.classList.toggle("is-home-gateway-open", isGatewayOpen);
  if (isGatewayOpen && journeyContent) {
    journeyContent.inert = true;
    journeyContent.setAttribute("aria-hidden", "true");
  }

  function completeJourney() {
    try {
      window.sessionStorage.setItem(journeySessionKey, "true");
    }
    catch {
      // The intro still works when browser storage is unavailable.
    }

    if (gateway) {
      gateway.hidden = true;
      gateway.classList.remove("is-launching");
    }

    page.classList.remove("is-awaiting-entry", "is-travelling");
    page.classList.add("is-home-entered");
    if (journeyContent) {
      journeyContent.inert = false;
      journeyContent.removeAttribute("aria-hidden");
    }
    document.body.classList.remove("is-home-gateway-open");
    window.dispatchEvent(new CustomEvent("homejourneycomplete"));
  }

  function startJourney() {
    if (!gateway || gateway.classList.contains("is-launching")) return;

    gateway.classList.add("is-launching");
    page.classList.add("is-travelling");
    enterButton?.setAttribute("disabled", "");
    if (gatewayStatus) gatewayStatus.textContent = "Coordinate temporali agganciate";
    window.dispatchEvent(new CustomEvent("homejourneystart"));

    journeyTimer = window.setTimeout(
      completeJourney,
      reducedMotion ? 320 : 1450
    );
  }

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add("is-visible");
    });
  }, { threshold: 0.22 });

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      activeSection = Number(entry.target.dataset.homeSection || 0);
      page.dataset.activeSection = String(activeSection);
      if (progressNumber) progressNumber.textContent = `0${activeSection + 1}`;
    });
  }, { rootMargin: "-42% 0px -42% 0px", threshold: 0 });

  panels.forEach((panel) => revealObserver.observe(panel));
  sections.forEach((section) => sectionObserver.observe(section));

  function updateScroll() {
    frame = null;
    const maximum = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
    const progress = Math.min(Math.max(window.scrollY / maximum, 0), 1);
    page.style.setProperty("--home-progress", progress.toFixed(4));
    page.style.setProperty("--nebula-y", `${progress * 22}%`);
    page.style.setProperty("--nebula-shift", `${progress * -5}rem`);
    page.style.setProperty("--nebula-scale", String(1 + progress * .08));
    if (progressBar) progressBar.style.transform = `scaleY(${progress})`;

    sections.forEach((section, index) => {
      const rect = section.getBoundingClientRect();
      const center = rect.top + rect.height / 2;
      const distance = Math.abs(center - window.innerHeight / 2) / window.innerHeight;
      section.style.setProperty("--section-focus", Math.max(0, 1 - distance).toFixed(3));
      section.classList.toggle("is-active", index === activeSection);
    });
  }

  function requestScrollUpdate() {
    if (frame) return;
    frame = window.requestAnimationFrame(updateScroll);
  }

  const pointerHandlers = panels.map((panel) => {
    const handleMove = (event) => {
      if (reducedMotion || window.innerWidth < 900) return;
      const bounds = panel.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width - 0.5;
      const y = (event.clientY - bounds.top) / bounds.height - 0.5;
      panel.style.setProperty("--glass-x", `${x * 100}%`);
      panel.style.setProperty("--glass-y", `${y * 100}%`);
      panel.style.setProperty("--glass-rotate-x", `${y * -1.25}deg`);
      panel.style.setProperty("--glass-rotate-y", `${x * 1.5}deg`);
    };

    const handleLeave = () => {
      panel.style.setProperty("--glass-x", "0%");
      panel.style.setProperty("--glass-y", "0%");
      panel.style.setProperty("--glass-rotate-x", "0deg");
      panel.style.setProperty("--glass-rotate-y", "0deg");
    };

    panel.addEventListener("pointermove", handleMove, { passive: true });
    panel.addEventListener("pointerleave", handleLeave);
    return { panel, handleMove, handleLeave };
  });

  window.addEventListener("scroll", requestScrollUpdate, { passive: true });
  window.addEventListener("resize", requestScrollUpdate);
  enterButton?.addEventListener("click", startJourney);
  updateScroll();

  return () => {
    revealObserver.disconnect();
    sectionObserver.disconnect();
    window.removeEventListener("scroll", requestScrollUpdate);
    window.removeEventListener("resize", requestScrollUpdate);
    enterButton?.removeEventListener("click", startJourney);
    window.clearTimeout(journeyTimer);
    document.body.classList.remove("is-home-gateway-open");
    if (journeyContent) {
      journeyContent.inert = false;
      journeyContent.removeAttribute("aria-hidden");
    }
    pointerHandlers.forEach(({ panel, handleMove, handleLeave }) => {
      panel.removeEventListener("pointermove", handleMove);
      panel.removeEventListener("pointerleave", handleLeave);
    });
    if (frame) window.cancelAnimationFrame(frame);
  };
}
