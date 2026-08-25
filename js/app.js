import {
  initializeHomeStars
} from "./pages/home-stars.js";

import {
  initializeHomeWorlds
} from "./pages/home-worlds.js";

import {
  initializeRouter
} from "./core/router.js";

import {
  renderHeader,
  renderPage,
  renderFooter
} from "./core/renderer.js";

import {
  createNavbar
} from "./components/navbar.js";

import {
  initializeHeaderVisibility
} from "./components/header-visibility.js";

import {
  initializeThemeSwitcher
} from "./components/theme-switcher.js";

import {
  createMenuOverlay,
  initializeMenu
} from "./components/menu.js";

import {
  createFooter
} from "./components/footer.js";

import {
  createHomePage
} from "./pages/home.js";

import {
  initializeScrollReveals
} from "./utils/reveal.js";

import {
  createWorkPage,
  initializeWorkPage
} from "./pages/work.js";

import {
  createProjectPage,
  initializeProjectPage
} from "./pages/project.js";

import {
  createContactPage
} from "./pages/contact.js";

import {
  createAboutPage,
  initializeAboutPage
} from "./pages/about.js";


/* ======================================
   TEMPORARY PAGE
====================================== */

function createTemporaryPage(title) {
  return `
    <section class="section-large min-h-screen">

      <div class="container-content">

        <h1 class="heading-xl">
          ${title}
        </h1>

        <p class="body-lg text-secondary">
          Questa pagina verrà costruita nei prossimi passaggi.
        </p>

      </div>

    </section>
  `;
}


/* ======================================
   HOME EFFECTS
====================================== */

let destroyHomeStars = null;
let destroyHomeWorlds = null;
let destroyWorkPage = null;
let destroyProjectPage = null;
let destroyAboutPage = null;
let destroyScrollReveals = null;
let destroyMenu = null;
let destroyHeaderVisibility = null;
let destroyThemeSwitcher = null;


function destroyHomeEffects() {
  if (destroyHomeStars) {
    destroyHomeStars();
    destroyHomeStars = null;
  }

  if (destroyHomeWorlds) {
    destroyHomeWorlds();
    destroyHomeWorlds = null;
  }

}


function destroyGlobalInteractions() {
  if (destroyWorkPage) {
    destroyWorkPage();
    destroyWorkPage = null;
  }

  if (destroyProjectPage) {
    destroyProjectPage();
    destroyProjectPage = null;
  }

  if (destroyAboutPage) {
    destroyAboutPage();
    destroyAboutPage = null;
  }

  if (destroyScrollReveals) {
    destroyScrollReveals();
    destroyScrollReveals = null;
  }

  if (destroyMenu) {
    destroyMenu();
    destroyMenu = null;
  }

  if (destroyHeaderVisibility) {
    destroyHeaderVisibility();
    destroyHeaderVisibility = null;
  }

  if (destroyThemeSwitcher) {
    destroyThemeSwitcher();
    destroyThemeSwitcher = null;
  }
}


/* ======================================
   ROUTE CHANGE
====================================== */

function handleRouteChange(route) {
  destroyHomeEffects();
  destroyGlobalInteractions();

  const app = document.querySelector("#app");
  app?.classList.remove("is-page-ready");

  document.body.dataset.page = route.page;

  const activePage =
    route.page === "project"
      ? "work"
      : route.page;

  renderHeader(`
    ${createNavbar()}
    ${createMenuOverlay(activePage)}
  `);

  destroyMenu = initializeMenu();
  destroyThemeSwitcher = initializeThemeSwitcher();


  /* HOME */

  if (route.page === "home") {
    renderPage(
      createHomePage()
    );

    renderFooter("");

    requestAnimationFrame(() => {
      destroyHomeStars =
        initializeHomeStars();

      destroyHomeWorlds =
        initializeHomeWorlds();

    });
  }


  /* WORK */

  else if (route.page === "work") {
    renderPage(
      createWorkPage(route.parameter)
    );

    renderFooter(
      createFooter()
    );

    requestAnimationFrame(() => {
      destroyWorkPage =
        initializeWorkPage();
    });
  }


  /* ABOUT */

  else if (route.page === "about") {
    renderPage(
      createAboutPage()
    );

    renderFooter(
      createFooter()
    );

    requestAnimationFrame(() => {
      destroyAboutPage =
        initializeAboutPage();
    });
  }


  /* CONTACT */

  else if (route.page === "contact") {
    renderPage(
      createContactPage()
    );

    renderFooter("");
  }


  /* PROJECT */

  else if (
    route.page === "project" &&
    route.parameter
  ) {
    renderPage(
      createProjectPage(route.parameter)
    );

    renderFooter(
      createFooter()
    );

    requestAnimationFrame(() => {
      destroyProjectPage =
        initializeProjectPage();
    });
  }


  /* NOT FOUND */

  else {
    renderPage(
      createTemporaryPage(
        "Pagina non trovata"
      )
    );

    renderFooter(
      createFooter()
    );
  }


  window.scrollTo({
    top: 0,
    left: 0,
    behavior: "auto"
  });

  destroyHeaderVisibility =
    initializeHeaderVisibility();

  destroyScrollReveals =
    initializeScrollReveals();

  const pageTitles = {
    home: "Gianluigi Grieco — Graphic Designer, Fotografo e Shopify Partner",
    work: "Lavori — Gianluigi Grieco",
    about: "Chi sono — Gianluigi Grieco",
    contact: "Contatti — Gianluigi Grieco",
    project: "Progetto — Gianluigi Grieco"
  };

  if (route.page === "project") {
    const projectTitle = document.querySelector(
      ".project-hero__title"
    )?.textContent.trim();

    document.title = projectTitle
      ? `${projectTitle} — Gianluigi Grieco`
      : pageTitles.project;
  }
  else {
    document.title = pageTitles[route.page] || pageTitles.home;
  }

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      app?.classList.add("is-page-ready");
    });
  });
}


/* ======================================
   INITIALIZATION
====================================== */

function initializeApp() {
  const loader = document.querySelector("#siteLoader");
  const loaderStartedAt = performance.now();

  document.body.classList.add("is-loading");

  initializeRouter(
    handleRouteChange
  );

  const finishLoading = () => {
    const elapsed = performance.now() - loaderStartedAt;
    const remaining = Math.max(0, 2650 - elapsed);

    window.setTimeout(() => {
      document.body.classList.remove("is-loading");
      document.body.classList.add("is-loaded");

      window.setTimeout(() => {
        loader?.remove();
      }, 650);
    }, remaining);
  };

  if (document.readyState === "complete") {
    finishLoading();
  }
  else {
    window.addEventListener("load", finishLoading, { once: true });
  }
}


if (document.readyState === "loading") {
  document.addEventListener(
    "DOMContentLoaded",
    initializeApp
  );
}
else {
  initializeApp();
}
