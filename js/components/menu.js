import { siteData } from "../data/site.js";
import { createArrowIcon } from "../utils/icons.js";


function createNavigationLinks(activePage) {
  const links = [
    {
      label: "Lavori",
      route: "work",
      number: "01",
      detail: "Progetti selezionati"
    },
    {
      label: "Chi sono",
      route: "about",
      number: "02",
      detail: "Profilo e metodo"
    },
    {
      label: "Contatti",
      route: "contact",
      number: "03",
      detail: "Iniziamo un progetto"
    }
  ];

  return links
    .map(item => {
      const isActive = item.route === activePage;

      return `
        <a
          class="menu-overlay__link menu-overlay__link--${item.route} ${isActive ? "is-active" : ""}"
          href="#${item.route}"
          data-menu-link
          ${isActive ? 'aria-current="page"' : ""}
        >
          <span class="menu-overlay__link-number">
            ${item.number}
          </span>

          <span class="menu-overlay__link-content">
            <span class="menu-overlay__link-label">
              ${item.label}
            </span>
            <span class="menu-overlay__link-detail">
              ${item.detail}
            </span>
          </span>

          <span
            class="menu-overlay__link-arrow"
            aria-hidden="true"
          >
            ${createArrowIcon("north-east")}
          </span>
        </a>
      `;
    })
    .join("");
}


function createSocialIcon(label) {
  if (label.toLowerCase() === "instagram") {
    return `
      <svg
        class="menu-overlay__social-icon"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <rect
          x="3.5"
          y="3.5"
          width="17"
          height="17"
          rx="5"
        ></rect>
        <circle
          cx="12"
          cy="12"
          r="4"
        ></circle>
        <circle
          cx="17.4"
          cy="6.8"
          r="0.8"
          class="menu-overlay__social-icon-dot"
        ></circle>
      </svg>
    `;
  }

  return `
    <svg
      class="menu-overlay__social-icon"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <rect
        x="3"
        y="5"
        width="18"
        height="14"
        rx="2"
      ></rect>
      <path d="M4 7l8 6 8-6"></path>
    </svg>
  `;
}


function createSocialLinks() {
  return siteData.socialLinks
    .map(link => {
      const externalAttributes = link.external
        ? 'target="_blank" rel="noopener noreferrer"'
        : "";

      return `
        <a
          class="menu-overlay__meta-link"
          href="${link.url}"
          data-menu-link
          ${externalAttributes}
        >
          ${createSocialIcon(link.label)}

          <span>
            ${link.label}
          </span>
        </a>
      `;
    })
    .join("");
}


export function createMenuOverlay(activePage = "home") {
  return `
    <aside
      class="menu-overlay"
      id="siteMenu"
      data-menu-overlay
      aria-hidden="true"
      aria-label="Menu principale"
      role="dialog"
      aria-modal="true"
    >
      <div class="menu-overlay__panel">

        <div class="menu-overlay__header">
          <p class="menu-overlay__eyebrow">
            <span class="menu-overlay__status-dot" aria-hidden="true"></span>
            Navigazione
          </p>

          <p class="menu-overlay__count">
            03 pagine
          </p>
        </div>

        <nav
          class="menu-overlay__navigation"
          aria-label="Pagine del portfolio"
        >
          ${createNavigationLinks(activePage)}
        </nav>

        <div class="menu-overlay__footer">
          <div class="menu-overlay__meta-links">
            ${createSocialLinks()}
          </div>

          <p class="menu-overlay__copyright">
            ${siteData.copyright}
          </p>
        </div>

      </div>
    </aside>
  `;
}


export function initializeMenu() {
  const button = document.querySelector(
    "[data-menu-button]"
  );

  const overlay = document.querySelector(
    "[data-menu-overlay]"
  );

  if (!button || !overlay) {
    return () => {};
  }

  const label = button.querySelector(
    ".navbar__menu-label"
  );

  const symbol = button.querySelector(
    ".navbar__menu-symbol"
  );

  const links = overlay.querySelectorAll(
    "[data-menu-link]"
  );

  let isOpen = false;
  let previousFocusedElement = null;


  function setMenuState(nextState) {
    isOpen = nextState;

    button.setAttribute(
      "aria-expanded",
      String(isOpen)
    );

    button.setAttribute(
      "aria-label",
      isOpen
        ? "Chiudi il menu"
        : "Apri il menu"
    );

    overlay.setAttribute(
      "aria-hidden",
      String(!isOpen)
    );

    document.body.classList.toggle(
      "is-menu-open",
      isOpen
    );

    if (label) {
      label.textContent = isOpen
        ? "Chiudi"
        : "Menu";
    }

    if (symbol) {
      symbol.textContent = isOpen
        ? "×"
        : "+";
    }

    if (isOpen) {
      previousFocusedElement =
        document.activeElement;

      const firstLink = overlay.querySelector(
        ".menu-overlay__link"
      );

      window.setTimeout(() => {
        firstLink?.focus();
      }, 260);
    }
    else if (
      previousFocusedElement instanceof HTMLElement
    ) {
      previousFocusedElement.focus();
    }
  }


  function handleButtonClick() {
    setMenuState(!isOpen);
  }


  function handleOverlayClick(event) {
    if (event.target === overlay && isOpen) {
      setMenuState(false);
    }
  }


  function handleKeydown(event) {
    if (event.key === "Escape" && isOpen) {
      setMenuState(false);
    }
  }


  function handleLinkClick() {
    if (isOpen) {
      setMenuState(false);
    }
  }


  button.addEventListener(
    "click",
    handleButtonClick
  );

  overlay.addEventListener(
    "click",
    handleOverlayClick
  );

  window.addEventListener(
    "keydown",
    handleKeydown
  );

  links.forEach(link => {
    link.addEventListener(
      "click",
      handleLinkClick
    );
  });


  return function destroyMenu() {
    document.body.classList.remove(
      "is-menu-open"
    );

    button.removeEventListener(
      "click",
      handleButtonClick
    );

    overlay.removeEventListener(
      "click",
      handleOverlayClick
    );

    window.removeEventListener(
      "keydown",
      handleKeydown
    );

    links.forEach(link => {
      link.removeEventListener(
        "click",
        handleLinkClick
      );
    });
  };
}
