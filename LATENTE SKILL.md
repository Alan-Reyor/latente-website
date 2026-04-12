# Latente — Project Brief & Engineering Standards

## What is Latente?
Latente is a holistic experiences brand based in Monterrey, México, founded by Arely & Alan.
It creates deliberate spaces for identity reclamation — retreats, workshops, and nature experiences
for high-functioning individuals who have mastered the external game but feel internally adrift.

**Brand Purpose:** To help people remember who they are — before the world told them who to be.
**Brand Promise:** "You will leave knowing something about yourself that you didn't walk in with."

---

## Target Audience
- **Hiram (30–35)** — Entrepreneur, Monterrey. High-performer craving depth. Wants to operate from a grounded place, not hustle harder.
- **Hanna (40–45)** — Executive/Mom, urban MX. High-performer externally, invisible to herself. Needs permission to just be.

Both are high-functioning people experiencing low-grade identity loss. Not broken — buried.

---

## Tone of Voice
- Grounded · Direct & honest · Quietly confident · Poetic but precise · Human, imperfect
- **Never:** generic wellness language, hustle culture, toxic positivity, corporate speak, mixing languages within the same version
- **Always:** earned authenticity, depth, embodied language, nature references
- **Language:** The site has two complete, separate versions — ES and EN — controlled by the language switcher. Each version is written independently for its language's natural rhythm. Never mix languages within a single version of the site.

---

## Color Palette

### TIERRA · EARTH (Primary)
| Name      | Hex       | Use                      |
|-----------|-----------|--------------------------|
| Obsidiana | `#1A1208` | Core dark / primary text |
| Tierra    | `#3D2510` | Rich ground              |
| Barro     | `#7A4E28` | Clay warmth              |
| Arena     | `#C4935A` | Accents / highlights     |
| Hueso     | `#F0E6D3` | Backgrounds              |

### BOSQUE · FOREST (Secondary — retreats, immersive)
| Name   | Hex       | Use              |
|--------|-----------|------------------|
| Bosque | `#0E1C0C` | Dark backgrounds |
| Selva  | `#2A4A20` | Jungle floor     |
| Musgo  | `#4E7A3A` | Moss & fern      |
| Brote  | `#8AB870` | New growth       |
| Niebla | `#E8F2DC` | Morning mist     |

### AGUA · WATER (Accent — CTAs, water experiences)
| Name      | Hex       |
|-----------|-----------|
| Profundo  | `#0A2A30` |
| Mar       | `#0D5C6A` |
| Corriente | `#3A9EAA` |
| Espuma    | `#C2E8EE` |

### MONTAÑA · MOUNTAIN (Accent — meditation, altitude)
| Name    | Hex       |
|---------|-----------|
| Cumbre  | `#1C1A28` |
| Roca    | `#5A5272` |
| Neblina | `#B8B0D4` |
| Alba    | `#EDE8F8` |

### Color Usage Rules
- **Default:** Hueso bg · Obsidiana text · Arena accents
- **Immersive sections:** Bosque bg · Niebla/Brote text
- **CTAs:** Mar or Corriente — sparingly, never dominant
- **All colors must be defined as CSS custom properties — never hardcoded inline**

---

## Typography
Fonts sourced from **fontshare.com** (Cabinet Grotesk + Satoshi). Always load via `@font-face` in a dedicated CSS file.

| Role         | Font             | Weight | Tracking        |
|--------------|------------------|--------|-----------------|
| Display/Hero | Cabinet Grotesk  | 800    | −2px to −3px    |
| Hero sub     | Cabinet Grotesk  | 300    | −1px            |
| Headings     | Cabinet Grotesk  | 500    | −0.3px          |
| Body         | Satoshi          | 400    | 0px             |
| Labels/UI    | Satoshi          | 500    | +2.5px all-caps |
| Accent stamp | Cabinet Grotesk  | 200    | +4px to +6px    |

---

## The Four Elemental Worlds
| Element     | Spanish  | Experience Type      | Color Family |
|-------------|----------|----------------------|--------------|
| 🌍 Earth    | Tierra   | Workshops, urban     | Tierra       |
| 🌿 Forest   | Bosque   | Overnight retreats   | Bosque       |
| 💧 Water    | Agua     | Half-day experiences | Agua         |
| ⛰️ Mountain | Montaña  | Altitude, silence    | Montaña      |

---

## Website Goals
1. Tell the Latente story and brand positioning
2. Showcase experience types (retreats, workshops, nature)
3. Capture waitlist signups
4. Feel nothing like a generic wellness site

---

## 🌐 Internationalization (i18n)

The site is fully bilingual: **Spanish (ES)** and **English (EN)**.

### Language Switcher
- A language toggle must appear in the top navigation bar
- Default language: **Spanish (ES)**
- The switcher displays as a simple text toggle: `ES · EN` — the active language is visually emphasized
- Switching languages updates all visible text on the page without a page reload (JS-driven)
- The selected language is persisted in `localStorage` so it survives page refreshes

### Implementation Rules
- All translatable strings must live in a dedicated JS file: `assets/js/modules/i18n.js`
- The file exports a `translations` object with `es` and `en` keys, each containing all strings keyed by a consistent ID
- HTML elements that need translation must carry a `data-i18n="key"` attribute — no text content hardcoded in HTML
- Never use a third-party i18n library — keep it lightweight and custom
- The language switcher button must have `aria-label` updated dynamically to reflect the active language

### Translation Philosophy
- Spanish and English versions are not word-for-word translations — each is written for its language's natural rhythm
- Brand voice must be maintained in both languages: grounded, direct, poetic
- Never use robotic or literal translations — rewrite for feel, not just meaning

### Example pattern
```html
<!-- HTML -->
<h1 data-i18n="hero.headline"></h1>
<button data-lang-toggle aria-label="Cambiar idioma">ES · EN</button>
```

```js
// assets/js/modules/i18n.js
export const translations = {
  es: {
    'hero.headline': 'Aquí empieza el regreso.',
    'hero.sub': 'Algunas cosas no se optimizan. Se sienten.',
  },
  en: {
    'hero.headline': 'This is where you return to yourself.',
    'hero.sub': 'Some things can\'t be optimized. They have to be felt.',
  }
};
```

---

## ⚙️ ENGINEERING STANDARDS

These rules apply to every file, every feature, every session. No exceptions.

### 1. File & Folder Structure
Always maintain this structure:

```
latente-website/
├── index.html
├── CLAUDE.md
├── assets/
│   ├── css/
│   │   ├── variables.css      ← all CSS custom properties (colors, fonts, spacing)
│   │   ├── base.css           ← reset, typography, global styles
│   │   ├── components.css     ← reusable UI components (buttons, cards, forms)
│   │   └── layout.css         ← page-level layout and sections
│   ├── js/
│   │   ├── main.js            ← entry point, initializes all modules
│   │   └── modules/           ← one file per feature
│   │       ├── waitlist.js
│   │       ├── navigation.js
│   │       └── animations.js
│   ├── images/                ← raster images (WebP + JPG only)
│   └── icons/                 ← SVG icons and illustrations
├── components/                ← reusable HTML partials
└── pages/                     ← additional pages beyond index
```

### 2. No Inline Styles or Scripts — Ever
- **Never** write `style=""` attributes directly in HTML elements
- **Never** write `<script>` blocks inside HTML files
- All styles belong in `.css` files
- All scripts belong in `.js` files
- CSS is linked in `<head>` · JS loaded at end of `<body>` with `defer`

### 3. CSS Custom Properties — Mandatory
All design tokens defined as variables in `variables.css`. Never hardcode values anywhere else.

```css
/* ✅ Correct — define once, use everywhere */
:root {
  /* Colors */
  --color-hueso: #F0E6D3;
  --color-obsidiana: #1A1208;
  --color-tierra: #3D2510;
  --color-arena: #C4935A;
  --color-bosque: #0E1C0C;
  --color-mar: #0D5C6A;

  /* Typography */
  --font-display: 'Cabinet Grotesk', sans-serif;
  --font-body: 'Satoshi', sans-serif;

  /* Spacing scale */
  --space-xs: 4px;
  --space-sm: 8px;
  --space-md: 16px;
  --space-lg: 32px;
  --space-xl: 64px;
  --space-2xl: 128px;

  /* Radius */
  --radius-sm: 4px;
  --radius-md: 8px;

  /* Transitions */
  --transition-base: 0.25s ease;
}

/* ❌ Never hardcode */
.hero { background-color: #F0E6D3; padding: 64px; }
```

### 4. DRY — Don't Repeat Yourself
- Any repeated UI pattern becomes a reusable CSS class or JS function
- If the same style appears twice, extract it into a shared component class
- If the same JS logic appears twice, extract it into a named function
- Build a component library in `components.css` from the start

```css
/* ✅ Reusable button system */
.btn { display: inline-flex; align-items: center; padding: var(--space-sm) var(--space-lg); border-radius: var(--radius-sm); font-family: var(--font-body); transition: var(--transition-base); }
.btn--primary { background: var(--color-arena); color: var(--color-obsidiana); }
.btn--ghost { background: transparent; border: 1px solid var(--color-arena); color: var(--color-arena); }

/* ❌ Never repeat button styles per section */
.hero-cta { background: #C4935A; padding: 12px 32px; ... }
.footer-cta { background: #C4935A; padding: 12px 32px; ... }
```

### 5. SVG for Icons & Illustrations
- All icons, logos, elemental marks, and UI graphics must be **SVG format**
- SVGs must be optimized — no unnecessary metadata, editor comments, or bloat
- Use `<img src="icon.svg">` by default
- Inline SVG only when JS interaction or CSS animation is required
- **Never** use PNG or JPG for icons, logos, or decorative graphics
- Photography = WebP format with JPG fallback only

### 6. Image Optimization
- Use `<picture>` element with WebP + JPG fallback for all photography
- Always include `width` and `height` attributes (prevents layout shift)
- Use `loading="lazy"` for below-the-fold images
- Hero/above-fold images use `loading="eager"`, pre-optimized to max 200kb
- Every image must have descriptive `alt` text

```html
<!-- ✅ Correct image pattern -->
<picture>
  <source srcset="assets/images/retiro-bosque.webp" type="image/webp">
  <img
    src="assets/images/retiro-bosque.jpg"
    alt="Retiro en Sierra Madre — tres noches en el bosque"
    width="1200"
    height="800"
    loading="lazy"
  >
</picture>
```

### 7. JavaScript — Functions & Modules
- All logic lives inside named functions — no loose code outside functions
- One module file per feature area (waitlist, navigation, animations)
- Use `const` and `let` only — `var` is forbidden
- Always use `try/catch` for async operations
- Event listeners attached via JS only — no `onclick=""` in HTML

```js
// ✅ Correct pattern
async function submitWaitlist(email) {
  try {
    const response = await fetch('/api/waitlist', {
      method: 'POST',
      body: JSON.stringify({ email }),
      headers: { 'Content-Type': 'application/json' }
    });
    return await response.json();
  } catch (error) {
    console.error('Waitlist submission failed:', error);
    showErrorMessage();
  }
}

document.querySelector('#waitlist-form')
  .addEventListener('submit', handleFormSubmit);

// ❌ Never
<button onclick="submitForm()">Unirse</button>
```

### 8. Performance Standards
- Target **Lighthouse score 90+** on mobile
- No render-blocking resources — CSS in `<head>`, JS deferred
- Fonts loaded with `font-display: swap`
- Minimize third-party scripts — evaluate every external dependency
- Combine CSS files in production · Avoid redundant HTTP requests

### 9. Security Basics
- **Never** expose API keys, tokens, or credentials in any frontend file
- Sanitize and validate all user inputs (forms, query params)
- Use `https://` for all external resources — never `http://`
- All external links must include `rel="noopener noreferrer"`
- Validate forms on both client side (UX) and server side (security)

```html
<!-- ✅ Secure external link -->
<a href="https://instagram.com/latente" target="_blank" rel="noopener noreferrer">
  Instagram
</a>
```

### 10. Accessibility (A11y)
- Semantic HTML always — `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`
- Every form input paired with a `<label>`
- All interactive elements keyboard-navigable
- Color contrast meets WCAG AA minimum
- Never use `outline: none` without providing a visible focus replacement
- `aria-label` on icon-only buttons

### 11. Mobile-First Responsive Design
- Write base styles for mobile, scale up with `min-width` media queries
- Breakpoints: `480px · 768px · 1024px · 1280px`
- Minimum test width: 375px (iPhone SE)
- Minimum touch target size: 44×44px

### 12. HTML Page Template
Every page must follow this structure:

```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="Latente — Espacios y experiencias holísticas. Monterrey, México.">
  <title>Latente</title>
  <!-- Fonts -->
  <link rel="preload" href="assets/fonts/CabinetGrotesk.woff2" as="font" crossorigin>
  <!-- Styles -->
  <link rel="stylesheet" href="assets/css/variables.css">
  <link rel="stylesheet" href="assets/css/base.css">
  <link rel="stylesheet" href="assets/css/components.css">
  <link rel="stylesheet" href="assets/css/layout.css">
</head>
<body>
  <!-- content -->
  <script src="assets/js/main.js" defer></script>
</body>
</html>
```

---

## What to Avoid
- Inline styles or inline scripts — ever
- Hardcoded color, font, or spacing values in CSS
- Generic wellness aesthetics (lotus flowers, pastel gradients, stock yoga photos)
- System fonts — always Cabinet Grotesk + Satoshi
- PNG for icons or logos — always SVG
- JPG without WebP fallback for photography
- `var` in JavaScript
- `onclick` or any event handler attributes in HTML
- Skipping accessibility attributes
- Repeating code instead of creating reusable components
- Unoptimized images over 200kb in hero positions

---

## Project Owner
Alan Reynoso is the Co-Founder of Latente. He has a diverse background with strong knowledge in
business and entrepreneurship, followed by product management and marketing, and is inclined
towards creative disciplines such as photography, branding, and video editing. He understands
basic code structure and relational databases but does not strictly come from a technical background.

When communicating with Alan:
- Use business and product framing first — connect technical decisions to outcomes and tradeoffs
- Avoid jargon without explanation — if a technical term is necessary, define it briefly in plain language
- When multiple approaches exist, present them as a PM would: option A vs option B, with pros, cons, and a clear recommendation
- Leverage his creative and visual sensibility — he will care deeply about how things look and feel, not just how they work
- Trust his product instincts — he thinks in systems, user experience, and business logic naturally
- Default to simplicity — build the simplest thing that works well and scales
- Prioritize clean, readable code over clever one-liners — he may need to read and understand it later
