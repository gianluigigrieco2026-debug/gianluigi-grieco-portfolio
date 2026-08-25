const STORAGE_KEY = "portfolio-color-theme";
const ORIGINAL_THEME = "original";
const ACID_THEME = "acid";

function readSavedTheme() {
  try {
    return window.localStorage.getItem(STORAGE_KEY) === ACID_THEME
      ? ACID_THEME
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
      theme === ACID_THEME ? "#07040d" : "#020307"
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
    const resolvedTheme = theme === ACID_THEME
      ? ACID_THEME
      : ORIGINAL_THEME;
    const isAcid = resolvedTheme === ACID_THEME;

    root.dataset.colorTheme = resolvedTheme;
    button.setAttribute("aria-pressed", String(isAcid));
    button.setAttribute(
      "aria-label",
      isAcid
        ? "Ripristina la palette originale"
        : "Attiva la palette Acid Pulse"
    );
    button.title = isAcid
      ? "Palette Acid Pulse attiva"
      : "Palette originale attiva";

    if (label) {
      label.textContent = isAcid
        ? "Palette Acid Pulse"
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
    const nextTheme = root.dataset.colorTheme === ACID_THEME
      ? ORIGINAL_THEME
      : ACID_THEME;

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
