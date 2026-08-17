import { siteData } from "../data/site.js";


export function createFooter() {
  const socialLinks = siteData.socialLinks
    .map(link => {
      const externalAttributes = link.external
        ? 'target="_blank" rel="noopener noreferrer"'
        : "";

      return `
        <a
          class="footer__link"
          href="${link.url}"
          ${externalAttributes}
        >
          ${link.label}
        </a>
      `;
    })
    .join("");

  return `
    <div class="footer container">
      <div class="footer__bottom">

        <p class="footer__copyright caption">
          ${siteData.copyright}
        </p>

        <div class="footer__socials">
          ${socialLinks}
        </div>

      </div>

    </div>
  `;
}
