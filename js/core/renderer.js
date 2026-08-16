/* ======================================
   RENDERER
====================================== */

function getRequiredElement(selector) {
  const element = document.querySelector(selector);

  if (!element) {
    throw new Error(
      `Elemento non trovato: ${selector}`
    );
  }

  return element;
}


export function getLayoutElements() {
  return {
    header: getRequiredElement("#siteHeader"),
    app: getRequiredElement("#app"),
    footer: getRequiredElement("#siteFooter")
  };
}


export function renderLayout({
  header = "",
  page = "",
  footer = ""
}) {
  const elements = getLayoutElements();

  elements.header.innerHTML = header;
  elements.app.innerHTML = page;
  elements.footer.innerHTML = footer;
}


export function renderPage(pageMarkup) {
  const { app } = getLayoutElements();

  app.innerHTML = pageMarkup;
}


export function renderHeader(headerMarkup) {
  const { header } = getLayoutElements();

  header.innerHTML = headerMarkup;
}


export function renderFooter(footerMarkup) {
  const { footer } = getLayoutElements();

  footer.innerHTML = footerMarkup;
}


export function clearPage() {
  const { app } = getLayoutElements();

  app.innerHTML = "";
}