/* ============================================================
   LATENTE — main.js
   Entry point. Initializes all feature modules.
   ============================================================ */

function init() {
  initI18n();
  initNavigation();
  initWaitlist();
  initAnimations();
  initCarousel();
}

document.addEventListener('DOMContentLoaded', init);
