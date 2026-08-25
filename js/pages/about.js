import { siteData } from "../data/site.js";
import { createArrowIcon } from "../utils/icons.js";

function createDisciplines() {
  return siteData.about.disciplines
    .map((discipline, index) => `
      <li class="about-discipline about-discipline--${index + 1}" data-reveal style="--reveal-delay: ${index * 90}ms">
        <div class="about-discipline__top">
          <span class="about-discipline__number">0${index + 1}</span>
          <span class="about-discipline__mark" aria-hidden="true">${createArrowIcon("north-east")}</span>
        </div>
        <div class="about-discipline__body">
          <h3>${discipline.title}</h3>
          <p>${discipline.scope}</p>
        </div>
        <span class="about-discipline__glow" aria-hidden="true"></span>
      </li>
    `)
    .join("");
}

function createProcess() {
  return siteData.about.approach
    .map((step, index) => `
      <li class="about-step${index === 0 ? " is-active" : ""}" data-method-step="${index}" tabindex="0">
        <div class="about-step__top">
          <span>0${index + 1}</span>
          <span aria-hidden="true">${index === siteData.about.approach.length - 1 ? "●" : createArrowIcon("south")}</span>
        </div>
        <div class="about-step__content">
          <h3>${step.title}</h3>
          <p>${step.description}</p>
        </div>
      </li>
    `)
    .join("");
}

export function createAboutPage() {
  return `
    <div class="about-page">
      <section class="about-hero" aria-labelledby="about-title">
        <div class="container about-hero__inner">
          <div class="about-hero__topline">
            <p>Chi sono / 02</p>
            <p>${siteData.about.eyebrow}</p>
          </div>

          <div class="about-hero__main">
            <div class="about-hero__copy">
              <h1 class="about-hero__title" id="about-title">
                Do forma<br><em>alle idee.</em>
              </h1>
              <p>${siteData.about.intro}</p>
            </div>

            <figure class="about-portrait">
              <div class="about-portrait__image">
                <img src="assets/images/about/gianluigi-shopify-led.svg" alt="Gianluigi Grieco — Graphic Designer e Shopify Partner" draggable="false">
                <span aria-hidden="true"></span>
              </div>
              <figcaption>
                <span>Profilo / Competenze</span>
              </figcaption>
            </figure>
          </div>

          <div class="about-hero__bottom">
            <p>Brand identity · Graphic design · Shopify</p>
            <button type="button" data-about-practice-link>
              Esplora la pratica <span aria-hidden="true">${createArrowIcon("south")}</span>
            </button>
          </div>
        </div>
      </section>

      <section class="about-practice" id="about-practice" aria-labelledby="about-practice-title">
        <div class="container">
          <div class="about-practice__topline" data-reveal>
            <p id="about-practice-title">Pratica / 01</p>
            <p>Ambiti selezionati</p>
          </div>

          <ul class="about-disciplines">
            ${createDisciplines()}
          </ul>
        </div>
      </section>

      <section class="about-method" aria-labelledby="about-method-title">
        <div class="container">
          <div class="about-method__layout">
            <div class="about-method__sticky">
              <p>Metodo / 02</p>
              <h2 id="about-method-title">Dal problema<br>alla forma.</h2>
              <p class="about-method__intro">Un processo chiaro, ma mai automatico. Ogni passaggio riduce il rumore e avvicina il progetto alla sua forma più precisa.</p>
              <div class="about-method__meter" aria-hidden="true">
                <span data-method-meter></span>
              </div>
              <p class="about-method__counter"><span data-method-current>01</span> / 04</p>
            </div>

            <ol class="about-process">
              ${createProcess()}
            </ol>
          </div>

          <div class="about-closing" data-reveal>
            <p class="about-closing__label">Il principio</p>
            <p class="about-closing__statement">Capire.<br>Ridurre.<br>Dare forma.</p>
            <a href="#contact">
              Iniziamo un progetto
              <span aria-hidden="true">${createArrowIcon("north-east")}</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  `;
}

export function initializeAboutPage() {
  const link = document.querySelector("[data-about-practice-link]");
  const practice = document.querySelector("#about-practice");
  if (!link || !practice) return () => {};
  const steps = [...document.querySelectorAll("[data-method-step]")];
  const meter = document.querySelector("[data-method-meter]");
  const current = document.querySelector("[data-method-current]");

  const handleClick = () => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    practice.scrollIntoView({
      behavior: reduceMotion ? "auto" : "smooth",
      block: "start"
    });
  };

  link.addEventListener("click", handleClick);

  const activateStep = (index) => {
    steps.forEach((step, stepIndex) => step.classList.toggle("is-active", stepIndex === index));
    if (meter) meter.style.transform = `scaleX(${(index + 1) / Math.max(steps.length, 1)})`;
    if (current) current.textContent = String(index + 1).padStart(2, "0");
  };

  const observer = new IntersectionObserver((entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (visible) activateStep(Number(visible.target.dataset.methodStep));
  }, { rootMargin: "-30% 0px -35%", threshold: [0, .25, .5, .75, 1] });

  steps.forEach((step, index) => {
    observer.observe(step);
    step.addEventListener("focus", () => activateStep(index));
  });

  return () => {
    link.removeEventListener("click", handleClick);
    observer.disconnect();
  };
}
