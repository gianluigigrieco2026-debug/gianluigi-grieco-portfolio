import { siteData } from "../data/site.js";
import { projects } from "../data/projects.js";
import { createArrowIcon } from "../utils/icons.js";

const disciplines = ["Brand identity", "Graphic design", "Fotografia", "Shopify Partner"];
const featuredProjects = projects.filter((project) => project.featured).slice(0, 8);
const HOME_JOURNEY_SESSION_KEY = "portfolio-home-journey-entered";

function shouldShowJourneyIntro() {
  try {
    if (typeof window === "undefined") return true;
    return window.sessionStorage.getItem(HOME_JOURNEY_SESSION_KEY) !== "true";
  }
  catch {
    return true;
  }
}

function escapeHTML(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function createProjectSet(duplicate = false) {
  return `
    <div class="home-work-set" ${duplicate ? 'aria-hidden="true"' : ""}>
      ${featuredProjects.map((project, index) => `
        <a
          class="home-work-card"
          href="#project/${encodeURIComponent(project.slug)}"
          aria-label="Apri il progetto ${escapeHTML(project.title)}"
          data-cover-ratio="${escapeHTML(project.coverRatio || "landscape")}"
          ${duplicate ? 'tabindex="-1"' : ""}
        >
          <img src="${escapeHTML(project.cover)}" alt="" loading="${index < 3 && !duplicate ? "eager" : "lazy"}">
          <span class="home-work-card__shade" aria-hidden="true"></span>
          <span class="home-work-card__meta">
            <small>${escapeHTML(project.category)}</small>
            <strong>${escapeHTML(project.title)}</strong>
          </span>
          <i aria-hidden="true">${createArrowIcon("north-east")}</i>
        </a>
      `).join("")}
    </div>`;
}

export function createHomePage() {
  const showJourneyIntro = shouldShowJourneyIntro();

  return `
    <div class="home-page home-page--journey ${showJourneyIntro ? "is-awaiting-entry" : "is-home-entered"}" data-home-journey>
      <canvas class="home-stars" data-home-stars aria-hidden="true"></canvas>
      <div class="home-nebula" aria-hidden="true"></div>
      <div class="home-grain" aria-hidden="true"></div>

      <section
        class="home-gateway"
        data-home-gateway
        aria-label="Ingresso al portfolio"
        ${showJourneyIntro ? "" : "hidden"}
      >
        <div class="home-gateway__topline" aria-hidden="true">
          <span>Sessione creativa / 2026</span>
          <span>40.4637° N &nbsp; 15.2108° E</span>
        </div>

        <div class="home-gateway__center">
          <span class="home-gateway__signal" aria-hidden="true"></span>
          <p>Una direzione visiva comincia da un gesto.</p>
          <button class="home-gateway__button" type="button" data-home-enter>
            <span class="home-gateway__button-mark" aria-hidden="true"></span>
            <span>Attiva il viaggio</span>
            <small>00:00:01</small>
          </button>
        </div>

        <div class="home-gateway__fragments" aria-hidden="true">
          <span>IDENTITÀ</span><span>IMMAGINI</span><span>DIREZIONE</span><span>TRACCIA</span>
        </div>

        <div class="home-gateway__status" aria-live="polite" data-home-gateway-status>
          Pronto al decollo
        </div>
      </section>

      <aside class="home-progress" aria-label="Avanzamento nella Home">
        <span data-home-progress-number>01</span>
        <i><b data-home-progress-bar></b></i>
        <span>04</span>
      </aside>

      <main class="home-journey">
        <section class="home-section home-hero container" data-home-section="0">
          <div class="home-hero__coordinates" aria-hidden="true">
            <span>40.4637° N</span><span>15.2108° E</span>
          </div>

          <div class="home-hero__stage">
            <div class="home-hero__eyebrow">
              <span>Portfolio creativo / 2026</span>
              <span>${siteData.owner.location}</span>
            </div>

            <div class="home-hero__timecode" aria-hidden="true">T+00:00:01</div>

            <h1 class="home-hero__title" aria-label="Do forma alle idee">
              <span><i>Do forma</i></span>
              <span><i>alle idee.</i></span>
            </h1>

            <div class="home-hero__footer">
              <p>${siteData.owner.fullName}<br>${siteData.owner.role}</p>
              <p>Identità, immagini e direzioni visive<br>pensate per lasciare una traccia.</p>
            </div>

            <span class="home-hero__axis" aria-hidden="true"></span>
          </div>

          <a class="home-scroll-cue" href="#home-transition" aria-label="Scorri per continuare nello spazio">
            <span>Scorri nello spazio</span><i aria-hidden="true">${createArrowIcon("south")}</i>
          </a>
        </section>

        <section class="home-space-flight" id="home-transition" data-home-flight aria-hidden="true"></section>

        <section class="home-section home-about container" id="home-about" data-home-section="1">
          <div class="home-glass home-about__panel" data-glass-panel>
            <div class="home-glass__shine" aria-hidden="true"></div>

            <header class="home-section__header">
              <p><span class="home-dot home-dot--red"></span> 02 / Chi sono</p>
              <p>Creativo indipendente / Italia</p>
            </header>

            <div class="home-about__content">
              <h2>Do forma a ciò<br>che ti <em>distingue.</em></h2>
              <div class="home-about__copy">
                <p>Sono Gianluigi Grieco. Unisco strategia, grafica e fotografia per trasformare un’idea in un’identità riconoscibile.</p>
                <div class="home-about__disciplines" aria-label="Le mie discipline">
                  ${disciplines.map((item, index) => `<span><i>0${index + 1}</i>${item}</span>`).join("")}
                </div>
              </div>
            </div>

            <a class="home-about__cta" href="#about"><span>Scopri profilo e metodo</span><i aria-hidden="true">${createArrowIcon("north-east")}</i></a>
          </div>
        </section>

        <section class="home-section home-work container" data-home-section="2">
          <div class="home-glass home-work__panel" data-glass-panel>
            <div class="home-glass__shine" aria-hidden="true"></div>

            <header class="home-section__header">
              <p><span class="home-dot home-dot--blue"></span> 03 / Lavori</p>
              <p>Progetti selezionati / 2026</p>
            </header>

            <div class="home-work__intro">
              <h2>Progetti in<br><em>movimento.</em></h2>
              <p>Identità, poster e fotografia. Una selezione di lavori reali da esplorare.</p>
            </div>

            <div class="home-work-marquee" aria-label="Selezione di progetti">
              <div class="home-work-track">
                ${createProjectSet(false)}
                ${createProjectSet(true)}
              </div>
            </div>

            <a class="home-work__cta" href="#work"><span>Vedi tutti i lavori</span><i aria-hidden="true">${createArrowIcon("north-east")}</i></a>
          </div>
        </section>

        <section class="home-section home-contact container" data-home-section="3">
          <div class="home-glass home-contact__panel" data-glass-panel>
            <div class="home-glass__shine" aria-hidden="true"></div>

            <header class="home-section__header">
              <p><span class="home-dot home-dot--yellow"></span> 04 / Contatti</p>
              <p>${siteData.contact.availability}</p>
            </header>

            <div class="home-contact__content">
              <p>Hai un’idea da trasformare?</p>
              <h2>Costruiamola<br><em>insieme.</em></h2>
            </div>

            <a class="home-contact__cta" href="#contact">
              <span>Inizia una conversazione</span>
              <i aria-hidden="true">${createArrowIcon("north-east")}</i>
            </a>

            <footer class="home-contact__footer">
              <span>${siteData.owner.fullName}</span>
              <span>${siteData.copyright}</span>
            </footer>
          </div>
        </section>
      </main>
    </div>`;
}
