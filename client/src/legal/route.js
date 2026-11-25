// Which legal page (if any) the current address is. Kept tiny: main.jsx imports it, the pages themselves load on demand.
// (public/preloader.js has the same two paths: it skips the loading animation on them.)
export const LEGAL_ROUTES = { '/privacy-policy': 'privacy', '/terms-and-conditions': 'terms' };
export const legalPage = (path = window.location.pathname) => LEGAL_ROUTES[path.replace(/\/+$/, '')] || null;
