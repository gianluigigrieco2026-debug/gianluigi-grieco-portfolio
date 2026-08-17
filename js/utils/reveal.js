export function initializeScrollReveals() {
  const elements = Array.from(
    document.querySelectorAll("[data-reveal]")
  );

  if (elements.length === 0) {
    return () => {};
  }

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  elements.forEach(element => {
    element.classList.add("reveal-item");
  });

  if (reduceMotion || !("IntersectionObserver" in window)) {
    elements.forEach(element => {
      element.classList.add("is-revealed");
    });

    return () => {};
  }

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) {
          if (entry.target.hasAttribute("data-reveal-repeat")) {
            entry.target.classList.remove("is-revealed");
          }

          return;
        }

        entry.target.classList.add("is-revealed");

        if (!entry.target.hasAttribute("data-reveal-repeat")) {
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.08,
      rootMargin: "0px 0px -8% 0px"
    }
  );

  elements.forEach(element => {
    observer.observe(element);
  });

  return function destroyScrollReveals() {
    observer.disconnect();
  };
}
