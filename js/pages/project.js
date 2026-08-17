import { projects } from "../data/projects.js";
import { createArrowIcon } from "../utils/icons.js";

const CATEGORY_LABELS = {
  "Brand Identity": "Brand Identity",
  "Graphic Design": "Graphic Design",
  Photography: "Fotografia",
  Shopify: "Web Design / Shopify"
};

function getCategoryLabel(category) {
  return CATEGORY_LABELS[category] || category;
}


function escapeHTML(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}


function decodeRouteValue(value) {
  try {
    return decodeURIComponent(String(value ?? ""));
  }
  catch {
    return String(value ?? "");
  }
}


function getProjectBySlug(slug) {
  const decodedSlug = decodeRouteValue(slug);

  return projects.find(
    project => project.slug === decodedSlug
  ) || null;
}


function getNextProject(project) {
  const currentIndex = projects.findIndex(
    item => item.slug === project.slug
  );

  if (currentIndex === -1 || projects.length < 2) {
    return null;
  }

  return projects[
    (currentIndex + 1) % projects.length
  ];
}


function createServicesMarkup(project) {
  if (!Array.isArray(project.services) || project.services.length === 0) {
    return "";
  }

  return project.services
    .map(service => `
      <li>${escapeHTML(service)}</li>
    `)
    .join("");
}


function normalizeGalleryImage(image, project, index) {
  const galleryLayouts = [
    "feature",
    "half-left",
    "half-right",
    "inset-left",
    "feature-right"
  ];

  if (typeof image === "string") {
    return {
      src: image,
      alt: `${project.title} — immagine ${index + 1}`,
      layout: galleryLayouts[index % galleryLayouts.length]
    };
  }

  return {
    src: image?.src || "",
    alt: image?.alt || `${project.title} — immagine ${index + 1}`,
    layout: image?.layout || galleryLayouts[index % galleryLayouts.length]
  };
}


function createGalleryMarkup(project) {
  if (!Array.isArray(project.gallery) || project.gallery.length === 0) {
    return "";
  }

  const usesUniformGallery = true;

  const images = project.gallery
    .map((image, index) => {
      const galleryImage = normalizeGalleryImage(
        image,
        project,
        index
      );

      if (!galleryImage.src) {
        return "";
      }

      return `
        <figure
          class="project-gallery__item ${usesUniformGallery
            ? "project-gallery__item--uniform"
            : `project-gallery__item--${escapeHTML(galleryImage.layout)}`}"
          data-project-gallery-item
          data-reveal
          style="--reveal-delay: ${(index % 3) * 80}ms"
        >
          <img
            class="project-gallery__image"
            src="${escapeHTML(galleryImage.src)}"
            alt="${escapeHTML(galleryImage.alt)}"
            loading="lazy"
            decoding="async"
          >
        </figure>
      `;
    })
    .join("");

  return `
    <section class="project-gallery${usesUniformGallery
      ? " project-gallery--uniform"
      : ""} container" aria-label="Galleria del progetto">
      <div class="project-section-heading">
        <span>Immagini selezionate</span>
        <span>02</span>
      </div>

      <div class="project-gallery__grid">
        ${images}
      </div>
    </section>
  `;
}


function createPdfLinkMarkup(project) {
  if (!project.pdf) {
    return "";
  }

  const pdfPath = escapeHTML(project.pdf);

  return `
    <div class="project-overview__meta-row project-overview__meta-row--document">
      <dt>Brand book</dt>
      <dd>
        <a
          class="project-overview__document-link"
          href="${pdfPath}"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span class="project-overview__document-type">PDF</span>
          <span>Apri il brand book</span>
          <span class="project-overview__document-icon" aria-hidden="true">${createArrowIcon("north-east")}</span>
        </a>
      </dd>
    </div>
  `;
}


function createNextProjectMarkup(project) {
  const nextProject = getNextProject(project);

  if (!nextProject) {
    return "";
  }

  return `
    <section class="project-next">
      <a
        class="project-next__link container"
        href="#project/${encodeURIComponent(nextProject.slug)}"
        aria-label="Vedi il progetto successivo: ${escapeHTML(nextProject.title)}"
      >
        <div class="project-next__eyebrow">
          <span>Progetto successivo</span>
          <span>${createArrowIcon("north-east")}</span>
        </div>

        <div class="project-next__grid" data-reveal>
          <div class="project-next__copy">
            <p class="project-next__category">
              ${escapeHTML(getCategoryLabel(nextProject.category))}
            </p>

            <h2 class="project-next__title">
              ${escapeHTML(nextProject.title)}
            </h2>
          </div>

          <div class="project-next__media">
            <img
              src="${escapeHTML(nextProject.cover)}"
              alt="Copertina del progetto ${escapeHTML(nextProject.title)}"
              loading="lazy"
            >
          </div>
        </div>
      </a>
    </section>
  `;
}


function createNotFoundProjectPage() {
  return `
    <main class="project-page project-page--not-found">
      <section class="project-not-found container">
        <p class="project-not-found__label">Progetto / 404</p>
        <h1 class="project-not-found__title">Progetto non trovato.</h1>
        <a class="project-not-found__link" href="#work">Torna ai lavori ${createArrowIcon("north-east")}</a>
      </section>
    </main>
  `;
}


export function createProjectPage(slug) {
  const project = getProjectBySlug(slug);

  if (!project) {
    return createNotFoundProjectPage();
  }

  const servicesMarkup = createServicesMarkup(project);
  const galleryMarkup = createGalleryMarkup(project);
  const pdfLinkMarkup = createPdfLinkMarkup(project);
  const nextProjectMarkup = createNextProjectMarkup(project);
  const coverRatio = ["portrait", "square", "landscape"]
    .includes(project.coverRatio)
      ? project.coverRatio
      : "landscape";

  return `
    <main class="project-page" data-project-slug="${escapeHTML(project.slug)}">

      <section class="project-hero">
        <div class="project-hero__inner container">

          <div class="project-hero__eyebrow">
            <a href="#work">Lavori</a>
            <span>/</span>
            <span>${escapeHTML(getCategoryLabel(project.category))}</span>
          </div>

          <div class="project-hero__grid">
            <div class="project-hero__copy">
              <p class="project-hero__category">
                ${escapeHTML(getCategoryLabel(project.category))} / ${escapeHTML(project.year || "")}
              </p>

              <h1 class="project-hero__title">
                ${escapeHTML(project.title)}
              </h1>
            </div>

            <div class="project-hero__media project-hero__media--${coverRatio}">
              <img
                src="${escapeHTML(project.cover)}"
                alt="Copertina del progetto ${escapeHTML(project.title)}"
                fetchpriority="high"
                decoding="async"
              >
            </div>
          </div>

        </div>
      </section>

      <section class="project-overview container">
        <div class="project-section-heading">
          <span>Panoramica</span>
          <span>01</span>
        </div>

        <div class="project-overview__content" data-reveal>
          <div class="project-overview__copy">
            <p class="project-overview__description">
              ${escapeHTML(project.description?.full || project.description?.short || "")}
            </p>
          </div>

          <dl class="project-overview__meta">
            ${project.client ? `
              <div class="project-overview__meta-row">
                <dt>Cliente</dt>
                <dd>${escapeHTML(project.client)}</dd>
              </div>
            ` : ""}

            ${project.year ? `
              <div class="project-overview__meta-row">
                <dt>Anno</dt>
                <dd>${escapeHTML(project.year)}</dd>
              </div>
            ` : ""}

            ${servicesMarkup ? `
              <div class="project-overview__meta-row project-overview__meta-row--services">
                <dt>Servizi</dt>
                <dd>
                  <ul>
                    ${servicesMarkup}
                  </ul>
                </dd>
              </div>
            ` : ""}

            ${pdfLinkMarkup}
          </dl>
        </div>
      </section>

      ${galleryMarkup}

      ${nextProjectMarkup}

    </main>
  `;
}


export function initializeProjectPage() {
  const galleryImages = document.querySelectorAll(
    ".project-gallery__image"
  );

  const errorHandlers = [];

  function classifyGalleryImage(image) {
    if (!image.naturalWidth || !image.naturalHeight) {
      return;
    }

    const item = image.closest("[data-project-gallery-item]");
    const ratio = image.naturalWidth / image.naturalHeight;

    if (!item) {
      return;
    }

    item.style.setProperty("--gallery-media-ratio", ratio.toFixed(4));

    if (ratio <= 1.08) {
      item.classList.add("project-gallery__item--contained");
    }
  }

  function removeBrokenGalleryItem(image) {
    const item = image.closest(
      "[data-project-gallery-item]"
    );

    const gallery = image.closest(
      ".project-gallery"
    );

    if (item) {
      item.remove();
    }

    if (
      gallery &&
      !gallery.querySelector(
        "[data-project-gallery-item]"
      )
    ) {
      gallery.remove();
    }
  }

  galleryImages.forEach(image => {
    const handleError = () => {
      removeBrokenGalleryItem(image);
    };

    const handleLoad = () => {
      classifyGalleryImage(image);
    };

    image.addEventListener("error", handleError);
    image.addEventListener("load", handleLoad);
    errorHandlers.push([image, "error", handleError]);
    errorHandlers.push([image, "load", handleLoad]);

    if (image.complete && image.naturalWidth === 0) {
      removeBrokenGalleryItem(image);
    } else if (image.complete) {
      classifyGalleryImage(image);
    }
  });

  return function destroyProjectPage() {
    errorHandlers.forEach(([image, eventName, handler]) => {
      image.removeEventListener(eventName, handler);
    });
  };
}
