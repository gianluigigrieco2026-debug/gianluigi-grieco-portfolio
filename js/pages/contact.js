import { siteData } from "../data/site.js";
import { createArrowIcon } from "../utils/icons.js";


function createServiceList() {
  return siteData.services
    .map(service => `<li>${service}</li>`)
    .join("");
}


function createContactAction({ label, value, href, external = false }) {
  const attributes = external
    ? 'target="_blank" rel="noopener noreferrer"'
    : "";

  return `
    <a
      class="contact-action"
      href="${href}"
      ${attributes}
    >
      <span class="contact-action__label">
        ${label}
      </span>

      <span class="contact-action__value">
        ${value}
      </span>

      <span
        class="contact-action__arrow"
        aria-hidden="true"
      >
        ${createArrowIcon("north-east")}
      </span>
    </a>
  `;
}


export function createContactPage() {
  const instagram = siteData.socialLinks.find(
    link => link.label === "Instagram"
  );

  return `
    <div class="contact-page">

      <section
        class="contact-hero"
        aria-labelledby="contact-title"
      >
        <div class="container contact-hero__inner">

          <div class="contact-hero__topline">
            <p>Contatti / 03</p>

            <p class="contact-availability">
              <span aria-hidden="true"></span>
              ${siteData.contact.availability}
            </p>
          </div>


          <div class="contact-hero__main">

            <h1
              class="contact-hero__title"
              id="contact-title"
            >
              Creiamo<br>
              qualcosa di<br>
              <em>inconfondibile.</em>
            </h1>

            <div class="contact-conversation" data-reveal>
              <p class="contact-conversation__eyebrow">
                Parlami del tuo progetto
              </p>

              <p class="contact-conversation__intro">
                Raccontami la tua idea, cosa vuoi ottenere e le tempistiche che hai in mente. Scegli il modo più semplice per iniziare.
              </p>

              <div class="contact-actions">
                ${createContactAction({
                  label: "Email",
                  value: siteData.contact.email,
                  href: `mailto:${siteData.contact.email}`
                })}

                ${createContactAction({
                  label: "WhatsApp",
                  value: siteData.contact.whatsappDisplay,
                  href: siteData.contact.whatsappUrl,
                  external: true
                })}
              </div>
            </div>

          </div>


          <div class="contact-meta">

            <div class="contact-meta__item" data-reveal>
              <p class="contact-meta__label">Dove mi trovo</p>
              <p class="contact-meta__value">
                Italia<br>
                Lavoro in tutto il mondo
              </p>
            </div>

            <div class="contact-meta__item" data-reveal style="--reveal-delay: 70ms">
              <p class="contact-meta__label">Servizi</p>
              <ul class="contact-meta__value">
                ${createServiceList()}
              </ul>
            </div>

            <div class="contact-meta__item" data-reveal style="--reveal-delay: 140ms">
              <p class="contact-meta__label">Seguimi</p>
              <a
                class="contact-meta__social"
                href="${instagram?.url || "#"}"
                target="_blank"
                rel="noopener noreferrer"
              >
                Instagram
                <span aria-hidden="true">${createArrowIcon("north-east")}</span>
              </a>
            </div>

          </div>


          <div class="contact-bottom">
            <p>${siteData.copyright}</p>
            <a href="#home">Torna alla home ${createArrowIcon("north")}</a>
          </div>

        </div>
      </section>

    </div>
  `;
}
