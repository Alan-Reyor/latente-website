/* ============================================================
   LATENTE — animations.js
   Intersection Observer–based reveal animations.
   Respects prefers-reduced-motion: if the user has that
   preference, the CSS already forces elements visible —
   we skip the observer but do NOT hide elements.
   ============================================================ */

const REVEAL_CLASS     = 'is-revealed';
const OBSERVE_SELECTOR = '[data-reveal]';
const STAGGER_SELECTOR = '[data-reveal-stagger]';

function initAnimations() {
  assignStaggerIndices();
  initManifestoGraphic();

  if (prefersReducedMotion()) return;

  const elements = document.querySelectorAll(OBSERVE_SELECTOR);
  if (!elements.length) return;

  const observer = createRevealObserver();
  elements.forEach((el) => observer.observe(el));
}

/* Walk every stagger container and stamp each direct [data-reveal]
   child with a --stagger-index CSS custom property. The CSS then
   converts that index into a transition-delay automatically. */
function assignStaggerIndices() {
  document.querySelectorAll(STAGGER_SELECTOR).forEach((container) => {
    const children = container.querySelectorAll(':scope > [data-reveal]');
    children.forEach((child, index) => {
      child.style.setProperty('--stagger-index', index);
    });
  });
}

function createRevealObserver() {
  return new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add(REVEAL_CLASS);
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px',
    }
  );
}

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/* ============================================================
   MANIFESTO GRAPHIC
   Measures each SVG path length, sets the initial dashoffset
   to hide the line, then watches for viewport entry to trigger
   the CSS animation sequence.
   ============================================================ */
function initManifestoGraphic() {
  const graphic = document.querySelector('[data-manifesto-graphic]');
  if (!graphic) return;

  // Initialize each path: offset = full length → line invisible
  graphic.querySelectorAll('.manifesto__line').forEach((path) => {
    const len = Math.ceil(path.getTotalLength());
    path.style.strokeDashoffset = len;
  });

  if (prefersReducedMotion()) {
    // Skip animation — show everything at once
    graphic.classList.add('is-animated');
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-animated');
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  observer.observe(graphic);
}
