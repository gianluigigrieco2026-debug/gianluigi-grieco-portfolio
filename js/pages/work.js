import { projects } from "../data/projects.js";
import { createProjectCard } from "../components/project-card.js";


const WORK_CATEGORIES = [
  "All",
  "Brand Identity",
  "Graphic Design",
  "Photography",
  "Shopify"
];

const CATEGORY_LABELS = {
  All: "Tutti",
  "Brand Identity": "Brand Identity",
  "Graphic Design": "Graphic Design",
  Photography: "Fotografia",
  Shopify: "Web Design / Shopify"
};


function decodeRouteParameter(parameter) {
  if (!parameter) {
    return "All";
  }

  try {
    return decodeURIComponent(parameter);
  }
  catch {
    return parameter;
  }
}


function normalizeCategory(parameter) {
  const decodedCategory = decodeRouteParameter(parameter);

  return WORK_CATEGORIES.includes(decodedCategory)
    ? decodedCategory
    : "All";
}


function createFilterMarkup(activeCategory) {
  return WORK_CATEGORIES
    .map(category => {
      const isActive = category === activeCategory;
      const count = category === "All"
        ? projects.length
        : projects.filter(
            project => project.category === category
          ).length;

      return `
        <button
          class="work-filter ${isActive ? "is-active" : ""}"
          type="button"
          data-work-filter="${category}"
          aria-pressed="${String(isActive)}"
        >
          <span>${CATEGORY_LABELS[category] || category}</span>
          <span class="work-filter__count">
            ${String(count).padStart(2, "0")}
          </span>
        </button>
      `;
    })
    .join("");
}


function createProjectMarkup(activeCategory) {
  return projects
    .map((project, index) => {
      const isVisible =
        activeCategory === "All" ||
        project.category === activeCategory;

      return createProjectCard(
        project,
        index,
        { visible: isVisible }
      );
    })
    .join("");
}


export function createWorkPage(routeParameter = null) {
  const activeCategory = normalizeCategory(
    routeParameter
  );

  const initialVisibleCount = activeCategory === "All"
    ? projects.length
    : projects.filter(
        project => project.category === activeCategory
      ).length;

  return `
    <div
      class="work-page"
      data-work-page
      data-initial-filter="${activeCategory}"
    >

      <section
        class="work-hero"
        aria-labelledby="work-title"
      >
        <div class="container work-hero__inner">

          <div class="work-hero__topline">
            <p>Lavori selezionati / 01</p>
            <p>2026</p>
          </div>

          <h1
            class="work-hero__title"
            id="work-title"
          >
            Lavori
          </h1>

          <div class="work-hero__bottom">
            <p class="work-hero__intro">
              Una selezione curata di identità, sistemi grafici e progetti fotografici sviluppati attraverso concept, direzione e immagine.
            </p>

            <p class="work-hero__count">
              <span data-visible-project-count>
                ${String(initialVisibleCount).padStart(2, "0")}
              </span>
              <span>progetti</span>
            </p>
          </div>

        </div>
      </section>


      <section
        class="work-index"
        aria-labelledby="work-index-title"
      >
        <div class="work-index__filter-bar">
          <div class="container work-index__header">
            <p
              class="work-index__label"
              id="work-index-title"
            >
              Filtra i progetti
            </p>

            <div
              class="work-filters"
              aria-label="Filtra i progetti per categoria"
            >
              ${createFilterMarkup(activeCategory)}
            </div>
          </div>
        </div>

        <div class="container work-index__projects">
          <div
            class="work-grid"
            id="work-grid"
            data-work-grid
            data-visible-count="${initialVisibleCount}"
          >
            ${createProjectMarkup(activeCategory)}
          </div>

          <p
            class="work-empty-state"
            data-work-empty-state
            hidden
          >
            Non ci sono ancora progetti disponibili in questa categoria.
          </p>
        </div>
      </section>

    </div>
  `;
}


export function initializeWorkPage() {
  const page = document.querySelector(
    "[data-work-page]"
  );

  if (!page) {
    return () => {};
  }

  const filters = Array.from(
    page.querySelectorAll("[data-work-filter]")
  );

  const cards = Array.from(
    page.querySelectorAll("[data-project-card]")
  );

  const counter = page.querySelector(
    "[data-visible-project-count]"
  );

  const grid = page.querySelector(
    "[data-work-grid]"
  );

  const emptyState = page.querySelector(
    "[data-work-empty-state]"
  );

  let activeCategory =
    page.dataset.initialFilter || "All";

  function updateURL(category) {
    const nextHash = category === "All"
      ? "#work"
      : `#work/${encodeURIComponent(category)}`;

    window.history.replaceState(
      null,
      "",
      nextHash
    );
  }


  function updateVisibleCardLayouts(visibleCards) {
    cards.forEach(card => {
      card.classList.remove(
        "project-card--layout-1",
        "project-card--layout-2",
        "project-card--layout-3"
      );
    });

    visibleCards.forEach((card, visibleIndex) => {
      const layoutNumber =
        (visibleIndex % 3) + 1;

      card.classList.add(
        `project-card--layout-${layoutNumber}`
      );
    });
  }


  function applyFilter(category, updateHistory = true) {
    activeCategory = category;

    const visibleCards = [];

    filters.forEach(filter => {
      const isActive =
        filter.dataset.workFilter === category;

      filter.classList.toggle(
        "is-active",
        isActive
      );

      filter.setAttribute(
        "aria-pressed",
        String(isActive)
      );
    });

    cards.forEach(card => {
      const isVisible =
        category === "All" ||
        card.dataset.projectCategory === category;

      card.hidden = !isVisible;
      card.classList.toggle(
        "is-visible",
        isVisible
      );

      if (isVisible) {
        visibleCards.push(card);
      }
    });

    updateVisibleCardLayouts(visibleCards);

    const visibleCount = visibleCards.length;

    counter.textContent = String(
      visibleCount
    ).padStart(2, "0");

    grid.dataset.visibleCount = String(
      visibleCount
    );

    emptyState.hidden = visibleCount !== 0;

    if (updateHistory) {
      updateURL(category);
    }

  }


  function handleFilterClick(event) {
    const button = event.currentTarget;
    const category = button.dataset.workFilter;

    if (!category || category === activeCategory) {
      return;
    }

    applyFilter(category);
  }


  filters.forEach(filter => {
    filter.addEventListener(
      "click",
      handleFilterClick
    );
  });

  applyFilter(activeCategory, false);


  return function destroyWorkPage() {
    filters.forEach(filter => {
      filter.removeEventListener(
        "click",
        handleFilterClick
      );
    });

  };
}
