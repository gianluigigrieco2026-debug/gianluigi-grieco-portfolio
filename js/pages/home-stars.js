/* ======================================
   HOME — SCROLL-DRIVEN DEEP STAR FIELD
====================================== */

function createStar(width, height) {
  const depth = Math.random();
  const accent = depth > 0.978;
  return {
    x: Math.random() * width,
    y: Math.random() * height,
    depth,
    accent,
    radius: accent ? Math.random() * .75 + .9 : Math.random() * .55 + .16,
    opacity: accent ? Math.random() * .3 + .55 : Math.random() * .28 + .08,
    phase: Math.random() * Math.PI * 2,
    drift: Math.random() * .00017 + .000035
  };
}

function wrap(value, maximum) {
  return ((value % maximum) + maximum) % maximum;
}

export function initializeHomeStars() {
  const canvas = document.querySelector("[data-home-stars]");
  const homePage = document.querySelector(".home-page");
  const portal = document.querySelector("[data-home-portal]");
  if (!canvas || !homePage) return () => {};

  const context = canvas.getContext("2d");
  if (!context) return () => {};

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let width = 1;
  let height = 1;
  let stars = [];
  let frameId = null;
  let destroyed = false;
  let currentScroll = window.scrollY;
  let targetScroll = window.scrollY;
  let velocity = 0;
  let targetVelocity = 0;
  let lastScroll = window.scrollY;
  let pointerX = 0;
  let pointerY = 0;
  let targetPointerX = 0;
  let targetPointerY = 0;

  function getStarCount() {
    if (window.innerWidth <= 600) return 105;
    if (window.innerWidth <= 1024) return 155;
    return 245;
  }

  function resizeCanvas() {
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    width = Math.max(window.innerWidth, 1);
    height = Math.max(window.innerHeight, 1);
    canvas.width = Math.round(width * pixelRatio);
    canvas.height = Math.round(height * pixelRatio);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    stars = Array.from({ length: getStarCount() }, () => createStar(width, height));
  }

  function getPortalState(scrollPosition) {
    if (!portal || reducedMotion) return { progress: 0, intensity: 0 };
    const start = portal.offsetTop;
    const distance = Math.max(portal.offsetHeight - height, 1);
    const progress = Math.min(Math.max((scrollPosition - start) / distance, 0), 1);
    const isInside = scrollPosition >= start && scrollPosition <= start + distance;
    return {
      progress,
      intensity: isInside ? Math.pow(Math.sin(progress * Math.PI), .72) : 0
    };
  }

  function drawStar(star, time, portalProgress = 0, portalIntensity = 0) {
    const journey = currentScroll / Math.max(height, 1);
    const scale = 1 + journey * (.045 + star.depth * .2) + portalIntensity * (.24 + star.depth * 1.15);
    const centerX = width / 2;
    const centerY = height / 2;
    const driftX = Math.sin(time * star.drift + star.phase) * (1 + star.depth * 2.2);
    const driftY = Math.cos(time * star.drift * .78 + star.phase) * (1 + star.depth * 1.7);

    const rawX = centerX + (star.x - centerX) * scale + driftX + pointerX * (2 + star.depth * 8);
    const rawY = centerY + (star.y - centerY) * scale + driftY + pointerY * (1.5 + star.depth * 6);
    const x = wrap(rawX, width);
    const y = wrap(rawY, height);
    const twinkle = .87 + Math.sin(time * star.drift * 1.5 + star.phase) * .13;
    const opacity = star.opacity * twinkle;
    const radius = star.radius * (1 + journey * star.depth * .22);

    const dx = x - centerX;
    const dy = y - centerY;
    const distance = Math.max(Math.hypot(dx, dy), 1);
    const streak = Math.min(Math.max(Math.abs(velocity) * (.45 + star.depth * 1.9), portalIntensity * (10 + star.depth * 38)), 48);

    if (streak > 1.2 && !reducedMotion) {
      context.beginPath();
      context.moveTo(x, y);
      context.lineTo(x - (dx / distance) * streak, y - (dy / distance) * streak);
      const redMix = Math.round(227 - portalProgress * 35);
      const greenMix = Math.round(234 - portalProgress * 98);
      context.strokeStyle = `rgba(${redMix}, ${greenMix}, 249, ${opacity * (.42 + portalIntensity * .3)})`;
      context.lineWidth = Math.max(.35, radius * .65);
      context.stroke();
    }

    context.beginPath();
    context.arc(x, y, radius, 0, Math.PI * 2);
    context.fillStyle = `rgba(227, 234, 247, ${opacity})`;
    context.fill();

    if (star.accent) {
      context.beginPath();
      context.moveTo(x - radius * 3.2, y);
      context.lineTo(x + radius * 3.2, y);
      context.moveTo(x, y - radius * 3.2);
      context.lineTo(x, y + radius * 3.2);
      context.strokeStyle = `rgba(240, 244, 252, ${opacity * .48})`;
      context.lineWidth = .55;
      context.stroke();
    }
  }

  function render(time = 0) {
    if (destroyed) return;
    currentScroll += (targetScroll - currentScroll) * .085;
    velocity += (targetVelocity - velocity) * .14;
    targetVelocity *= .84;
    pointerX += (targetPointerX - pointerX) * .045;
    pointerY += (targetPointerY - pointerY) * .045;
    context.clearRect(0, 0, width, height);
    const portalState = getPortalState(currentScroll);
    stars.forEach((star) => drawStar(star, time, portalState.progress, portalState.intensity));
    frameId = window.requestAnimationFrame(render);
  }

  function handleScroll() {
    const nextScroll = window.scrollY;
    targetVelocity = nextScroll - lastScroll;
    lastScroll = nextScroll;
    targetScroll = nextScroll;
  }

  function handlePointerMove(event) {
    targetPointerX = event.clientX / Math.max(width, 1) - .5;
    targetPointerY = event.clientY / Math.max(height, 1) - .5;
  }

  function handleResize() {
    resizeCanvas();
    if (reducedMotion) {
      context.clearRect(0, 0, width, height);
      stars.forEach((star) => drawStar(star, 0, 0, 0));
    }
  }

  resizeCanvas();

  if (reducedMotion) {
    stars.forEach((star) => drawStar(star, 0, 0, 0));
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }

  window.addEventListener("scroll", handleScroll, { passive: true });
  window.addEventListener("resize", handleResize);
  window.addEventListener("pointermove", handlePointerMove, { passive: true });
  frameId = window.requestAnimationFrame(render);

  return () => {
    destroyed = true;
    window.removeEventListener("scroll", handleScroll);
    window.removeEventListener("resize", handleResize);
    window.removeEventListener("pointermove", handlePointerMove);
    if (frameId !== null) window.cancelAnimationFrame(frameId);
  };
}
