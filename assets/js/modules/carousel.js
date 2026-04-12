/* ============================================================
   LATENTE — Hero Carousel
   Auto-advances every 6s with crossfade + Ken Burns.
   Dots are clickable to jump to any slide.
============================================================ */

function initCarousel() {
  const hero = document.querySelector('[data-hero-carousel]');
  if (!hero) return;

  const slides = hero.querySelectorAll('.hero__slide');
  const dots   = hero.querySelectorAll('.hero__dot');
  let current  = 0;
  let timer    = null;

  function goTo(index) {
    slides[current].classList.remove('hero__slide--active');
    dots[current].classList.remove('hero__dot--active');
    dots[current].setAttribute('aria-selected', 'false');

    current = index;

    slides[current].classList.add('hero__slide--active');
    dots[current].classList.add('hero__dot--active');
    dots[current].setAttribute('aria-selected', 'true');
  }

  function next() {
    goTo((current + 1) % slides.length);
  }

  function startTimer() {
    timer = setInterval(next, 6000);
  }

  function resetTimer() {
    clearInterval(timer);
    startTimer();
  }

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      goTo(i);
      resetTimer();
    });
  });

  startTimer();
}
