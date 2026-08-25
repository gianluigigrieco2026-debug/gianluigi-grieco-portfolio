import { siteData } from "../data/site.js";

export function createNavbar() {
  return `
    <div class="navbar container">

      <a
        class="navbar__logo"
        href="#home"
        aria-label="Vai alla Home di ${siteData.owner.fullName}"
      >
        <span
          class="navbar__logo-mark"
          aria-hidden="true"
        ></span>
      </a>

      <div class="navbar__actions">

        <button
          class="navbar__theme-button"
          type="button"
          aria-label="Attiva la palette Acid Pulse"
          aria-pressed="false"
          data-theme-toggle
        >
          <svg
            class="navbar__theme-icon"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="8.5"></circle>
            <path d="M12 3.5a8.5 8.5 0 0 1 0 17z"></path>
          </svg>

          <span class="sr-only" data-theme-label>
            Palette originale
          </span>
        </button>

        <button
          class="navbar__menu-button"
          type="button"
          aria-label="Apri il menu"
          aria-expanded="false"
          data-menu-button
        >
          <span class="navbar__menu-label">
            Menu
          </span>

          <span
            class="navbar__menu-symbol"
            aria-hidden="true"
          >
            +
          </span>
        </button>

      </div>

    </div>
  `;
}
