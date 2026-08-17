import { createArrowIcon } from "../utils/icons.js";

function escapeHTML(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}


export function createProjectCard(
  project,
  index,
  { visible = true } = {}
) {
  const services = Array.isArray(project.services)
    ? project.services.slice(0, 2).join(" · ")
    : "";

  return `
    <article
      class="project-card project-card--layout-${(index % 3) + 1}"
      data-project-card
      data-project-category="${escapeHTML(project.category)}"
      data-reveal
      style="--reveal-delay: ${(index % 3) * 70}ms"
      ${visible ? "" : "hidden"}
    >
      <a
        class="project-card__link"
        href="#project/${encodeURIComponent(project.slug)}"
        aria-label="Apri il progetto ${escapeHTML(project.title)}"
      >
        <div class="project-card__media">
          <img
            class="project-card__image"
            src="${escapeHTML(project.cover)}"
            alt="Copertina del progetto ${escapeHTML(project.title)}"
            loading="${index < 2 ? "eager" : "lazy"}"
          >

          <span class="project-card__view" aria-hidden="true">
            Vedi progetto
            <span>${createArrowIcon("north-east")}</span>
          </span>
        </div>

        <div class="project-card__content">
          <h2 class="project-card__title">
            ${escapeHTML(project.title)}
          </h2>

          <div class="project-card__meta">
            <div class="project-card__meta-primary">
              <p>${escapeHTML(project.category)}</p>
              ${services ? `<p>${escapeHTML(services)}</p>` : ""}
            </div>

            ${project.year ? `<p class="project-card__year">${escapeHTML(project.year)}</p>` : ""}
          </div>
        </div>
      </a>
    </article>
  `;
}
