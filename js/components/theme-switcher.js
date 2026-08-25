const STORAGE_KEY = "portfolio-color-theme";
const ORIGINAL_THEME = "original";
const SIGNAL_THEME = "signal";

function readSavedTheme() {
  try {
    const savedTheme = window.localStorage.getItem(STORAGE_KEY);
    return savedTheme === SIGNAL_THEME || savedTheme === "acid"
      ? SIGNAL_THEME
      : ORIGINAL_THEME;
  }
  catch {
    return ORIGINAL_THEME;
  }
}

function saveTheme(theme) {
  try {
    window.localStorage.setItem(STORAGE_KEY, theme);
  }
  catch {
    // The theme still works when storage is unavailable.
  }
}

function updateThemeColor(theme) {
  const metaThemeColor = document.querySelector(
    'meta[name="theme-color"]'
  );

  if (metaThemeColor) {
    metaThemeColor.setAttribute(
      "content",
      theme === SIGNAL_THEME ? "#05070a" : "#020307"
    );
  }
}

export function initializeThemeSwitcher() {
  const root = document.documentElement;
  const button = document.querySelector("[data-theme-toggle]");

  if (!button) {
    return () => {};
  }

  const label = button.querySelector("[data-theme-label]");
  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  let transitionTimer = null;

  function applyTheme(theme, options = {}) {
    const resolvedTheme = theme === SIGNAL_THEME || theme === "acid"
      ? SIGNAL_THEME
      : ORIGINAL_THEME;
    const isSignal = resolvedTheme === SIGNAL_THEME;

    root.dataset.colorTheme = resolvedTheme;
    button.setAttribute("aria-pressed", String(isSignal));
    button.setAttribute(
      "aria-label",
      isSignal
        ? "Ripristina la palette originale"
        : "Attiva la palette Signal Shift"
    );
    button.title = isSignal
      ? "Palette Signal Shift attiva"
      : "Palette originale attiva";

    if (label) {
      label.textContent = isSignal
        ? "Palette Signal Shift"
        : "Palette originale";
    }

    updateThemeColor(resolvedTheme);

    if (options.persist) {
      saveTheme(resolvedTheme);
    }

    if (options.animate && !reducedMotion) {
      root.classList.remove("is-theme-changing");
      void root.offsetWidth;
      root.classList.add("is-theme-changing");

      window.clearTimeout(transitionTimer);
      transitionTimer = window.setTimeout(() => {
        root.classList.remove("is-theme-changing");
      }, 760);
    }

    window.dispatchEvent(
      new CustomEvent("colorthemechange", {
        detail: { theme: resolvedTheme }
      })
    );
  }

  function handleThemeToggle() {
    const nextTheme = root.dataset.colorTheme === SIGNAL_THEME
      ? ORIGINAL_THEME
      : SIGNAL_THEME;

    applyTheme(nextTheme, {
      persist: true,
      animate: true
    });
  }

  applyTheme(
    root.dataset.colorTheme || readSavedTheme()
  );

  button.addEventListener("click", handleThemeToggle);

  return function destroyThemeSwitcher() {
    button.removeEventListener("click", handleThemeToggle);
    window.clearTimeout(transitionTimer);
    root.classList.remove("is-theme-changing");
  };
}
