/* ======================================
   ROUTER
====================================== */

const DEFAULT_ROUTE = "home";

export function getCurrentRoute() {
  const hash = window.location.hash
    .replace(/^#/, "")
    .trim();

  if (!hash) {
    return {
      page: DEFAULT_ROUTE,
      parameter: null
    };
  }

  const [page, ...rest] = hash.split("/");

  return {
    page: page || DEFAULT_ROUTE,
    parameter: rest.length > 0
      ? rest.join("/")
      : null
  };
}


export function navigateTo(route) {
  const cleanRoute = String(route)
    .replace(/^#/, "")
    .trim();

  if (!cleanRoute) {
    window.location.hash = DEFAULT_ROUTE;
    return;
  }

  window.location.hash = cleanRoute;
}


export function initializeRouter(onRouteChange) {
  if (typeof onRouteChange !== "function") {
    throw new TypeError(
      "initializeRouter richiede una funzione."
    );
  }

  const handleRouteChange = () => {
    const route = getCurrentRoute();
    onRouteChange(route);
  };

  window.addEventListener(
    "hashchange",
    handleRouteChange
  );

  handleRouteChange();
}