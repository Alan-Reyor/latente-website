# Image Optimization Pipeline — Design

**Status:** Design approved by user, not yet implemented. Next step: `writing-plans` skill → implementation plan.

## Problem

Site performance testing this week showed images loading very slowly on some
connections. Root cause: `assets/images/` is 62MB of full-resolution,
un-resized, un-compressed camera JPGs/PNGs served as-is (individual files
1.3–4MB). No responsive sizing, no modern format, a few CSS
`background-image`s that can't lazy-load, and one 2.8MB "SVG" that's
actually a base64-embedded raster image and isn't even referenced anywhere.

Site is pure HTML/CSS/JS (no framework, no build tool), hosted on GitHub
Pages at somoslatente.com. No `package.json` exists yet.

## Goals

1. A repeatable pipeline so every future image upload gets optimized
   automatically, without the user having to remember a manual step.
2. A one-time cleanup of the existing 62MB backlog using the same tool.
3. A couple of small, low-risk code-side fixes bundled in since they touch
   the same files and address the same load-time problem.

## Non-goals

- Responsive `srcset`/multiple widths per image (explicitly deferred —
  single capped-width output is judged sufficient for this site's scale)
- Restructuring CSS `background-image` sections into lazy-loadable
  `<img>`/`<picture>` elements (descoped as a separate, riskier visual
  change — WebP conversion alone already shrinks these substantially)
- Fixing the broken `og-preview.jpg` Open Graph reference (pre-existing,
  unrelated bug, noted but out of scope)

## Architecture

```
assets/images-raw/          ← gitignored staging folder for original photos
assets/images/               ← committed, optimized .webp output (what ships)
scripts/optimize-images.js   ← the optimizer (Node + sharp)
.husky/pre-commit            ← runs optimizer, re-stages generated output
package.json                 ← new file; devDependencies: sharp, husky
```

**Workflow going forward:** drop a raw photo into `assets/images-raw/`
(including images the user pastes/attaches in a Claude Code chat — those
get saved there too, not directly into `assets/images/`), then commit as
normal. The pre-commit hook optimizes anything new and folds the result
into that same commit automatically.

## Components

### `scripts/optimize-images.js`

For each file in `assets/images-raw/`:

- Skip if `assets/images/<basename>.webp` already exists — idempotent, so
  re-running the hook doesn't reprocess unchanged files every commit.
  Reprocessing is opt-in via a `--force` flag.
- Resize to a capped max width of **2000px** (no upscaling of smaller
  originals) and re-encode as **WebP at quality 80**.
- Write to `assets/images/<basename>.webp`, log a one-line
  before/after file-size summary per file.
- A corrupt/unreadable raw file logs an error and is skipped rather than
  crashing the whole batch and blocking the commit.
- `assets/images-raw/` is auto-created by the script if missing.

Both the max-width and quality values are named constants at the top of
the script, easy to tune later.

### `.husky/pre-commit`

Runs `npm run optimize-images`, then `git add assets/images/` so any newly
generated `.webp` files ride along in the commit already in progress.
Installed automatically by husky's `prepare` script on `npm install` — the
only manual setup step (once, after cloning) is running `npm install`.

### Format decision

WebP only, no JPG fallback — WebP has 97%+ browser support today, and a
single format keeps both the pipeline and the HTML markup simple (plain
`<img src>`, no `<picture>` needed).

**Exception:** `og-preview.jpg` (Open Graph / Twitter meta image) should
stay JPG if/when it's added — social link-preview crawlers don't reliably
render WebP.

## Backlog cleanup (one-time)

1. Move everything currently in `assets/images/` into `assets/images-raw/`.
2. Run the optimizer once to regenerate everything as `.webp`.
3. Update every reference in `index.html` and `assets/css/layout.css` from
   the old filename/extension to the new `.webp` one (includes a few
   URL-encoded CSS references, e.g. `Bah%C3%ADa.jpg`).
4. Remove the old JPG/PNG originals from git tracking.

## Bundled code-side fixes

- Delete `assets/images/double exposure headshot.svg` — 2.8MB, confirmed
  unused anywhere in HTML/CSS.
- Add explicit `width`/`height` attributes to existing `<img>` tags, using
  the real output dimensions from the optimized files, to prevent layout
  shift.
- Preload the hero image: currently set via an inline
  `background-image: url('assets/images/montañas capas.jpg')` style and is
  the page's largest-contentful-paint element. Add
  `<link rel="preload" as="image">` in `<head>` pointing at the new
  `.webp` version.

## Testing / verification

- Run the optimizer against a few sample raw images; confirm visual
  quality holds up and check the size reduction.
- Open `index.html` locally after the backlog cleanup + reference swap;
  confirm nothing is visually broken.
- Make a test commit with a new raw image; confirm the hook fires and the
  `.webp` output shows up staged automatically.
- Compare `assets/images/` total size before vs. after (currently 62MB).

## Open defaults (adjustable, not blocking)

- Max width: 2000px
- WebP quality: 80

## Next step

Resume with the `writing-plans` skill to turn this into a step-by-step
implementation plan, then execute.
