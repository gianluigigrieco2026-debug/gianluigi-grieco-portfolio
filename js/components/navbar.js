import { siteData } from "../data/site.js";

export function createNavbar() {
  return `
    <div class="navbar container">

      <a
        class="navbar__logo"
        href="#home"
        aria-label="Vai alla Home di ${siteData.owner.fullName}"
      >
        <img
          class="navbar__logo-image"
          src="assets/icons/gianluigi-logo.svg"
          alt=""
          aria-hidden="true"
        >
      </a>

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
  `;
}
