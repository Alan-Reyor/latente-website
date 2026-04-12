/* ============================================================
   LATENTE — spotlight.js
   Lantern reveal effect on the waitlist section.
   A <canvas> overlays the background image. On mousemove:
     - A warm spotlight follows the cursor (~1s cinematic open)
     - A fading light trail decays behind it
   On mobile/touch: CSS breathing animation handles the section.
============================================================ */

function initSpotlight() {
  const section  = document.querySelector('#waitlist');
  const backdrop = section?.querySelector('.waitlist__backdrop');
  if (!section || !backdrop) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // Touch/mobile devices have no mouse — skip canvas so the CSS
  // breathing animation on .waitlist__backdrop-img runs unobstructed
  if (!window.matchMedia('(hover: hover)').matches) return;

  // ── Canvas setup ──────────────────────────────────────────
  const canvas = document.createElement('canvas');
  canvas.className = 'waitlist__canvas';
  backdrop.appendChild(canvas);
  const ctx = canvas.getContext('2d');

  // ── Config ────────────────────────────────────────────────
  // (declared before resizeCanvas/draw so they're initialised when draw() runs)
  const FILL         = '#1A1208'; // --color-obsidiana
  const MAX_RADIUS   = 320;       // px — lantern diameter at full open
  const LERP_IN      = 0.05;      // ~1s to reach full radius at 60fps
  const LERP_OUT     = 0.035;     // ~1.4s to close — warmth lingers
  const TRAIL_LENGTH = 14;        // trail points kept in history
  const TRAIL_SAMPLE = 3;         // sample one trail point every N frames

  // ── State ─────────────────────────────────────────────────
  let currentRadius = 0;
  let targetRadius  = 0;
  let cursor        = { x: 0, y: 0 };
  let trail         = [];
  let frameCount    = 0;
  let rafId         = null;
  let isInside      = false;

  // ── Draw ──────────────────────────────────────────────────
  function draw() {
    const W = canvas.width;
    const H = canvas.height;

    // 1. Fill entire canvas with solid obsidiana
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = FILL;
    ctx.fillRect(0, 0, W, H);

    if (currentRadius < 0.5) return; // nothing to reveal yet

    // 2. destination-out: drawing now erases the canvas,
    //    revealing the image layer beneath
    ctx.globalCompositeOperation = 'destination-out';

    // 3. Trail — oldest to newest, growing radius + alpha
    trail.forEach((pt, i) => {
      const progress = i / (trail.length - 1 || 1); // 0=oldest, 1=newest
      const r        = MAX_RADIUS * (0.18 + progress * 0.55);
      const alpha    = progress * 0.55;

      const g = ctx.createRadialGradient(pt.x, pt.y, 0, pt.x, pt.y, r);
      g.addColorStop(0,   `rgba(0,0,0,${alpha})`);
      g.addColorStop(0.4, `rgba(0,0,0,${(alpha * 0.6).toFixed(3)})`);
      g.addColorStop(1,   'rgba(0,0,0,0)');

      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);
    });

    // 4. Main spotlight — full erase with soft lantern feathering
    const sg = ctx.createRadialGradient(
      cursor.x, cursor.y, 0,
      cursor.x, cursor.y, currentRadius
    );
    sg.addColorStop(0,    'rgba(0,0,0,1)');
    sg.addColorStop(0.35, 'rgba(0,0,0,0.95)');
    sg.addColorStop(0.62, 'rgba(0,0,0,0.45)');
    sg.addColorStop(1,    'rgba(0,0,0,0)');

    ctx.fillStyle = sg;
    ctx.fillRect(0, 0, W, H);
  }

  // ── Canvas sizing ─────────────────────────────────────────
  // draw() is declared above, so it's safe to call here
  function resizeCanvas() {
    canvas.width  = section.offsetWidth;
    canvas.height = section.offsetHeight;
    draw(); // repaint immediately — keeps solid cover during resize too
  }
  resizeCanvas(); // initial paint: solid obsidiana, no spotlight

  const ro = new ResizeObserver(resizeCanvas);
  ro.observe(section);

  // ── Animation loop ────────────────────────────────────────
  function tick() {
    frameCount++;

    // Lerp radius toward target
    const factor = targetRadius > currentRadius ? LERP_IN : LERP_OUT;
    currentRadius += (targetRadius - currentRadius) * factor;
    if (Math.abs(targetRadius - currentRadius) < 0.2) currentRadius = targetRadius;

    // Sample trail while inside
    if (isInside && frameCount % TRAIL_SAMPLE === 0) {
      trail.push({ x: cursor.x, y: cursor.y });
      if (trail.length > TRAIL_LENGTH) trail.shift();
    }

    // Decay trail after leaving
    if (!isInside && trail.length > 0 && frameCount % TRAIL_SAMPLE === 0) {
      trail.shift();
    }

    draw();

    // Stop loop when fully settled — zero idle CPU
    if (currentRadius === 0 && trail.length === 0) {
      rafId = null;
      return;
    }

    rafId = requestAnimationFrame(tick);
  }

  function startLoop() {
    if (!rafId) rafId = requestAnimationFrame(tick);
  }

  // ── Event listeners ───────────────────────────────────────
  section.addEventListener('mousemove', (e) => {
    const rect = section.getBoundingClientRect();
    cursor.x = e.clientX - rect.left;
    cursor.y = e.clientY - rect.top;
  });

  section.addEventListener('mouseenter', (e) => {
    const rect = section.getBoundingClientRect();
    cursor.x     = e.clientX - rect.left;
    cursor.y     = e.clientY - rect.top;
    isInside     = true;
    targetRadius = MAX_RADIUS;
    startLoop();
  });

  section.addEventListener('mouseleave', () => {
    isInside     = false;
    targetRadius = 0;
    startLoop(); // keep running to animate close + trail decay
  });
}
