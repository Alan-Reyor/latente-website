/* ============================================================
   LATENTE — carousel.js
   Focus carousel: center card expands, 3 cards per side.
   Bidirectional. Auto-advances right-to-left.
   ============================================================ */

function initCarousel() {
  const stage = document.querySelector('[data-carousel]');
  if (!stage) return;

  const cards = [...stage.querySelectorAll('[data-carousel-card]')];
  const N = cards.length;
  if (N < 3) return;

  const SIDES      = 3;                      // visible cards on each side of center
  const HIDDEN_POS = Math.floor(N / 2);      // off-screen-right slot (= 4 for N=8)

  let activeIndex = 0;
  let intervalId  = null;
  const INTERVAL  = 2500;

  function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  // Returns the visual position (-SIDES … HIDDEN_POS) for a given card index.
  function getPos(cardIndex) {
    let pos = (cardIndex - activeIndex + N) % N;
    if (pos > HIDDEN_POS) pos -= N;
    return pos;
  }

  // Commit every card's position via data attribute (CSS drives the visuals).
  function setPositions() {
    cards.forEach((card, i) => {
      card.dataset.carouselPos = String(getPos(i));
    });
  }

  // Instantly move a card to a position with no animation, then re-enable transitions.
  function teleport(card, pos) {
    card.classList.add('no-transition');
    card.dataset.carouselPos = String(pos);
    card.offsetHeight; // synchronous reflow — commits the jump before re-enabling
    card.classList.remove('no-transition');
  }

  // Move carousel one step forward (right-to-left).
  function advance() {
    // The leftmost visible card (pos -SIDES) must jump to the off-screen-right slot
    // before the other cards animate, so it never sweeps visibly across the stage.
    const leftmostIdx = (activeIndex - SIDES + N) % N;
    teleport(cards[leftmostIdx], HIDDEN_POS);

    activeIndex = (activeIndex + 1) % N;
    setPositions();
    updateDots();
  }

  // Move carousel one step backward (left-to-right).
  function retreat() {
    // The hidden card (currently off-screen right at HIDDEN_POS) must jump to an
    // off-screen-left slot before the other cards animate, so it enters from the left.
    const hiddenIdx = (activeIndex + HIDDEN_POS) % N;
    teleport(cards[hiddenIdx], -HIDDEN_POS);

    activeIndex = (activeIndex - 1 + N) % N;
    setPositions();
    updateDots();
  }

  function startAutoPlay() {
    if (prefersReducedMotion()) return;
    intervalId = setInterval(advance, INTERVAL);
  }

  function stopAutoPlay() {
    clearInterval(intervalId);
    intervalId = null;
  }

  // Position indicator dots
  const dotsContainer = document.querySelector('[data-carousel-dots]');
  let dots = [];

  if (dotsContainer) {
    cards.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'moments__dot';
      dot.setAttribute('aria-label', `Imagen ${i + 1}`);
      dot.addEventListener('click', () => {
        stopAutoPlay();
        activeIndex = i;
        setPositions();
        updateDots();
        startAutoPlay();
      });
      dotsContainer.appendChild(dot);
      dots.push(dot);
    });
  }

  function updateDots() {
    dots.forEach((dot, i) => {
      dot.classList.toggle('is-active', i === activeIndex);
    });
  }

  // Place all cards instantly (no transition yet), then unlock transitions next frame.
  setPositions();
  updateDots();
  requestAnimationFrame(() => {
    stage.classList.add('is-initialized');
    startAutoPlay();
  });

  // Prev / Next arrow buttons
  const prevBtn = stage.querySelector('[data-carousel-prev]');
  const nextBtn = stage.querySelector('[data-carousel-next]');

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      stopAutoPlay();
      retreat();
      startAutoPlay();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      stopAutoPlay();
      advance();
      startAutoPlay();
    });
  }

  // Clicking a side card brings it to center.
  cards.forEach((card, i) => {
    card.addEventListener('click', () => {
      if (parseInt(card.dataset.carouselPos, 10) === 0) return;
      stopAutoPlay();
      activeIndex = i;
      setPositions();
      updateDots();
      startAutoPlay();
    });
  });

  // Pause auto-play while the user hovers or touches the stage.
  stage.addEventListener('mouseenter', stopAutoPlay);
  stage.addEventListener('mouseleave', startAutoPlay);
  stage.addEventListener('touchstart', stopAutoPlay, { passive: true });
  stage.addEventListener('touchend',   startAutoPlay, { passive: true });
}
