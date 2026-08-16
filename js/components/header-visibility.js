/* ======================================
   AUTO-HIDING SITE HEADER
====================================== */

export function initializeHeaderVisibility() {
  const header = document.querySelector(
    ".site-header"
  );

  if (!header) {
    return () => {};
  }

  const body = document.body;
  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  let lastScrollY = Math.max(window.scrollY, 0);
  let frameId = null;
  let isHidden = false;
  let isDestroyed = false;

  function getHeaderHeight() {
    return Math.max(
      Math.round(header.getBoundingClientRect().height),
      0
    );
  }

  function announceState() {
    window.dispatchEvent(
      new CustomEvent("siteheaderchange", {
        detail: {
          hidden: isHidden,
          height: getHeaderHeight()
        }
      })
    );
  }

  function setHidden(nextHidden) {
    const menuIsOpen = body.classList.contains(
      "is-menu-open"
    );

    const resolvedHidden = menuIsOpen
      ? false
      : nextHidden;

    if (resolvedHidden === isHidden) {
      return;
    }

    isHidden = resolvedHidden;

    header.classList.toggle(
      "is-hidden",
      isHidden
    );

    body.classList.toggle(
      "is-header-hidden",
      isHidden
    );

    announceState();
  }

  function updateHeader() {
    frameId = null;

    if (isDestroyed) {
      return;
    }

    const currentScrollY = Math.max(
      window.scrollY,
      0
    );

    const scrollDifference =
      currentScrollY - lastScrollY;

    const headerHeight = getHeaderHeight();

    if (body.classList.contains("is-menu-open")) {
      setHidden(false);
    }
    else if (currentScrollY <= 16) {
      setHidden(false);
    }
    else if (
      scrollDifference > 4 &&
      currentScrollY > headerHeight + 28
    ) {
      setHidden(true);
    }
    else if (scrollDifference < -4) {
      setHidden(false);
    }

    lastScrollY = currentScrollY;
  }

  function requestHeaderUpdate() {
    if (frameId !== null) {
      return;
    }

    frameId = window.requestAnimationFrame(
      updateHeader
    );
  }

  function handleResize() {
    announceState();
    requestHeaderUpdate();
  }

  const bodyObserver = new MutationObserver(() => {
    if (body.classList.contains("is-menu-open")) {
      setHidden(false);
    }
  });

  if (reducedMotion) {
    header.classList.add(
      "has-reduced-header-motion"
    );
  }

  header.classList.remove("is-hidden");
  body.classList.remove("is-header-hidden");

  window.addEventListener(
    "scroll",
    requestHeaderUpdate,
    { passive: true }
  );

  window.addEventListener(
    "resize",
    handleResize
  );

  bodyObserver.observe(body, {
    attributes: true,
    attributeFilter: ["class"]
  });

  announceState();

  return function destroyHeaderVisibility() {
    isDestroyed = true;

    window.removeEventListener(
      "scroll",
      requestHeaderUpdate
    );

    window.removeEventListener(
      "resize",
      handleResize
    );

    bodyObserver.disconnect();

    if (frameId !== null) {
      window.cancelAnimationFrame(frameId);
    }

    header.classList.remove(
      "is-hidden",
      "has-reduced-header-motion"
    );

    body.classList.remove(
      "is-header-hidden"
    );
  };
}
