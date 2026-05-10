/* ============================================================
   LATENTE — navigation.js
   Handles nav behavior: hero-visibility, mobile menu, scroll state.
   ============================================================ */

function initNavigation() {
  const nav = document.querySelector('[data-nav]');
  if (!nav) return;

  handleHeroVisibility(nav);
  handleScrollState(nav);
  handleMobileMenu(nav);
}

function handleHeroVisibility(nav) {
  const hero = document.querySelector('[data-hero]');
  if (!hero) return;

  // Start hidden — hero is visible
  nav.classList.add('nav--hidden');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          nav.classList.add('nav--hidden');
        } else {
          nav.classList.remove('nav--hidden');
        }
      });
    },
    { threshold: 0.1 }
  );

  observer.observe(hero);
}

function handleScrollState(nav) {
  const onScroll = () => {
    if (window.scrollY > 40) {
      nav.classList.add('nav--scrolled');
    } else {
      nav.classList.remove('nav--scrolled');
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

function handleMobileMenu(nav) {
  const toggle = nav.querySelector('[data-nav-toggle]');
  const menu = nav.querySelector('[data-nav-menu]');

  if (!toggle || !menu) return;

  function closeMenu() {
    menu.setAttribute('aria-hidden', 'true');
    toggle.setAttribute('aria-expanded', 'false');
    nav.classList.remove('nav--open');
  }

  toggle.addEventListener('click', () => {
    const isOpen = menu.getAttribute('aria-hidden') === 'false';
    if (isOpen) {
      closeMenu();
    } else {
      menu.setAttribute('aria-hidden', 'false');
      toggle.setAttribute('aria-expanded', 'true');
      nav.classList.add('nav--open');
    }
  });

  // Close on outside click
  document.addEventListener('click', (event) => {
    if (!nav.contains(event.target)) closeMenu();
  });

  // Close on Escape key
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && menu.getAttribute('aria-hidden') === 'false') {
      closeMenu();
      toggle.focus();
    }
  });

  // Close when a nav link is clicked
  menu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });
}
