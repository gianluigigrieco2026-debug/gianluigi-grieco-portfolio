import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const modules = new Map();
const context = vm.createContext({
  console,
  document: {
    readyState: "loading",
    addEventListener() {}
  }
});

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function loadModule(filePath) {
  const absolutePath = path.resolve(filePath);

  if (modules.has(absolutePath)) return modules.get(absolutePath);

  const module = new vm.SourceTextModule(
    fs.readFileSync(absolutePath, "utf8"),
    {
      context,
      identifier: absolutePath
    }
  );

  modules.set(absolutePath, module);

  await module.link(specifier => {
    assert(specifier.startsWith("."), `Import non relativo: ${specifier}`);
    return loadModule(path.resolve(path.dirname(absolutePath), specifier));
  });

  return module;
}

function namespace(relativePath) {
  return modules.get(path.join(root, relativePath)).namespace;
}

const appModule = await loadModule(path.join(root, "js/app.js"));
await appModule.evaluate();

const { createHomePage } = namespace("js/pages/home.js");
const { createWorkPage } = namespace("js/pages/work.js");
const { createAboutPage } = namespace("js/pages/about.js");
const { createContactPage } = namespace("js/pages/contact.js");
const { createProjectPage } = namespace("js/pages/project.js");
const { getAvailableWorkCategories } = namespace("js/data/categories.js");
const { projects } = namespace("js/data/projects.js");

const pages = {
  home: createHomePage(),
  work: createWorkPage(),
  about: createAboutPage(),
  contact: createContactPage(),
  project: createProjectPage(projects[0].slug)
};

Object.entries(pages).forEach(([name, markup]) => {
  assert(typeof markup === "string" && markup.length > 500, `Markup ${name} non valido`);
});

assert(pages.home.includes("data-home-about-link"), "CTA Home senza handler interno");
assert(!pages.home.includes('href="#home-about"'), "La CTA Home interferisce ancora con il router");
assert(pages.home.includes("Graphic Designer & Web Designer"), "Ruolo Home non aggiornato");
assert(!pages.work.includes('data-work-filter="Web Design"'), "Filtro Web Design vuoto ancora visibile");
assert(pages.about.includes("Web Design"), "Disciplina Web Design assente dalla pagina Chi sono");
assert(pages.contact.includes("+39 333 7889874"), "Numero WhatsApp mostrato non corretto");
assert(pages.contact.includes("wa.me/393337889874"), "Link WhatsApp non corretto");

const futureCategories = getAvailableWorkCategories([
  ...projects,
  { category: "Web Design" }
]);
assert(futureCategories.includes("Web Design"), "Il filtro Web Design non si riattiva automaticamente");

for (const project of projects) {
  const assetPaths = [project.cover, project.thumbnail, ...(project.gallery || [])]
    .map(asset => typeof asset === "string" ? asset : asset?.src)
    .filter(Boolean);

  assetPaths.forEach(assetPath => {
    assert(fs.existsSync(path.join(root, assetPath)), `Asset progetto mancante: ${assetPath}`);
  });
}

const index = fs.readFileSync(path.join(root, "index.html"), "utf8");
assert(index.includes('rel="canonical"'), "Canonical URL assente");
assert(index.includes('property="og:image"'), "Open Graph image assente");
assert(index.includes('name="twitter:card" content="summary_large_image"'), "Twitter card non completa");
assert(fs.existsSync(path.join(root, "robots.txt")), "robots.txt assente");
assert(fs.existsSync(path.join(root, "sitemap.xml")), "sitemap.xml assente");

console.log("Verifica completata: moduli, pagine, filtri, contatti, asset e metadata validi.");
