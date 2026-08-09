# Image Optimization Pipeline Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a repeatable Node+sharp image optimizer wired into a husky pre-commit hook, use it to shrink the existing 62MB `assets/images/` backlog into WebP, and bundle in the small code-side fixes (dead SVG removal, `width`/`height` attrs, hero preload) that address the same load-time problem.

**Architecture:** Raw photos live in gitignored `assets/images-raw/`. `scripts/optimize-images.js` reads that folder, resizes anything wider than 2000px (never upscales), re-encodes as WebP quality 80, and writes to committed `assets/images/`. A husky `pre-commit` hook runs the script and stages its output automatically, so committing a new raw photo is the only manual step going forward.

**Tech Stack:** Node.js (already installed, v24), `sharp` (image processing), `husky` v9 (git hooks). First `package.json` this repo has ever had — pure HTML/CSS/JS otherwise, no bundler.

## Global Constraints

- Max output width: **2000px**, no upscaling of smaller originals (`withoutEnlargement`) — named constant `MAX_WIDTH_PX` in the script.
- WebP quality: **80** — named constant `WEBP_QUALITY` in the script.
- Output format is WebP only, no JPG fallback — WebP has 97%+ browser support and keeps markup as plain `<img src>`.
- **Exception:** `og-preview.jpg` (Open Graph image) is out of scope entirely — it's a pre-existing, unrelated broken reference (file doesn't exist on disk). Do not touch it.
- `assets/images-raw/` is gitignored (staging only); `assets/images/` (the `.webp` output) is committed.
- Explicitly descoped, do not implement: responsive `srcset`, restructuring CSS `background-image` sections into `<img>`/`<picture>` elements.
- This repo lives on an external drive (`/Volumes/Backup Plus/...`); macOS scatters `._*` AppleDouble shadow files throughout it (visible in plain `git status`). **Never** run `git add -A` or `git add .`. Always stage explicit, named paths so these junk files can't slip into a commit.
- Keep `devDependencies` minimal: only `sharp` and `husky`.
- Nothing in this plan pushes to the remote — all commits stay local until the user explicitly asks to push.

---

## File Structure

```
package.json                    ← new — scripts + devDependencies (sharp, husky)
.gitignore                      ← modified — add node_modules/, assets/images-raw/
scripts/optimize-images.js      ← new — the optimizer
.husky/pre-commit                ← new — runs optimizer, stages output
assets/images-raw/               ← new, gitignored — staging folder for original photos
assets/images/                   ← existing, committed — becomes all-.webp after cleanup
index.html                       ← modified — .webp src swaps, width/height attrs, preload link
assets/css/layout.css            ← modified — .webp url() swaps
```

---

### Task 1: Project setup — package.json, dependencies, .gitignore

**Files:**
- Create: `package.json`
- Modify: `.gitignore`

**Interfaces:**
- Produces: `npm run optimize-images` script name (consumed by Task 2's manual runs and Task 3's hook).

- [ ] **Step 1: Initialize package.json**

```bash
npm init -y
```

- [ ] **Step 2: Edit package.json — set private, add the optimize-images script**

Open the generated `package.json` and set it to:

```json
{
  "name": "latente-website",
  "version": "1.0.0",
  "private": true,
  "description": "Latente website",
  "scripts": {
    "optimize-images": "node scripts/optimize-images.js"
  }
}
```

(Drop whatever `main`, `keywords`, `author`, `license` fields `npm init -y` generated — this isn't a published package.)

- [ ] **Step 3: Install sharp and husky as devDependencies**

```bash
npm install --save-dev sharp husky
```

- [ ] **Step 4: Add node_modules/ and assets/images-raw/ to .gitignore**

Current `.gitignore` contents:
```
.claude/worktrees/
.claude/._worktrees
.claude/settings.local.json
```

Append:
```

node_modules/
assets/images-raw/
```

- [ ] **Step 5: Verify install**

Run: `ls node_modules/sharp node_modules/husky`
Expected: both directories listed, no "No such file" errors.

- [ ] **Step 6: Commit**

```bash
git add package.json package-lock.json .gitignore
git status
git commit -m "chore: add package.json with sharp/husky for image optimization"
```

Check the `git status` output before committing — it should show only `package.json`, `package-lock.json`, and `.gitignore` staged. If any `._*` file appears, do not add it.

---

### Task 2: Optimizer script

**Files:**
- Create: `scripts/optimize-images.js`

**Interfaces:**
- Consumes: `sharp` (npm package, installed in Task 1).
- Produces: reads `assets/images-raw/*`, writes `assets/images/<basename>.webp`. CLI flag `--force` reprocesses existing output. Invoked via `npm run optimize-images` (Task 1) and later by `.husky/pre-commit` (Task 3).

- [ ] **Step 1: Write the script**

```js
#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const MAX_WIDTH_PX = 2000;
const WEBP_QUALITY = 80;

const RAW_DIR = path.join(__dirname, '..', 'assets', 'images-raw');
const OUT_DIR = path.join(__dirname, '..', 'assets', 'images');

const force = process.argv.includes('--force');

function formatBytes(bytes) {
  return `${(bytes / 1024).toFixed(0)}KB`;
}

async function optimizeImage(filename) {
  const inputPath = path.join(RAW_DIR, filename);
  const basename = path.parse(filename).name;
  const outputPath = path.join(OUT_DIR, `${basename}.webp`);

  if (!force && fs.existsSync(outputPath)) {
    console.log(`skip  ${filename} (already optimized)`);
    return;
  }

  let inputStats;
  try {
    inputStats = fs.statSync(inputPath);
  } catch (err) {
    console.error(`error ${filename}: cannot read file (${err.message})`);
    return;
  }

  try {
    await sharp(inputPath)
      .resize({ width: MAX_WIDTH_PX, withoutEnlargement: true })
      .webp({ quality: WEBP_QUALITY })
      .toFile(outputPath);
  } catch (err) {
    console.error(`error ${filename}: ${err.message}`);
    return;
  }

  const outputStats = fs.statSync(outputPath);
  console.log(
    `done  ${filename} -> ${basename}.webp  ${formatBytes(inputStats.size)} -> ${formatBytes(outputStats.size)}`,
  );
}

async function main() {
  fs.mkdirSync(RAW_DIR, { recursive: true });
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const files = fs.readdirSync(RAW_DIR).filter((f) => !f.startsWith('.'));

  if (files.length === 0) {
    console.log('No files in assets/images-raw/. Nothing to do.');
    return;
  }

  for (const file of files) {
    await optimizeImage(file);
  }
}

main();
```

The `!f.startsWith('.')` filter is required, not cosmetic: this repo's external drive causes macOS to litter every directory with `._*` AppleDouble shadow files (you'll see them in `ls -la assets/images/`), and without the filter `sharp` would try to decode them as images and log spurious errors.

- [ ] **Step 2: Functional test — two real sample files**

```bash
mkdir -p assets/images-raw
cp "assets/images/Untitled.jpg" assets/images-raw/
cp "assets/images/elemento letras.png" assets/images-raw/
npm run optimize-images
```

Expected output: two `done` lines, each showing a before/after size where the after size is meaningfully smaller, e.g.:
```
done  Untitled.jpg -> Untitled.webp  2738KB -> ...KB
done  elemento letras.png -> elemento letras.webp  293KB -> ...KB
```

Confirm the files exist: `ls assets/images/Untitled.webp "assets/images/elemento letras.webp"`

- [ ] **Step 3: Idempotency test — re-run without --force**

```bash
npm run optimize-images
```

Expected output: both files show `skip  ... (already optimized)`, and neither `.webp` file's mtime changes (`ls -la assets/images/Untitled.webp` timestamp unchanged from Step 2).

- [ ] **Step 4: --force test**

```bash
npm run optimize-images -- --force
```

Expected output: both files show `done` again (reprocessed), not `skip`.

- [ ] **Step 5: Corrupt-file test**

```bash
echo "not a real image" > assets/images-raw/corrupt-test.jpg
npm run optimize-images
```

Expected output: one `error corrupt-test.jpg: ...` line (from sharp failing to parse it), script exits 0 (not a crash), and the two already-optimized files still show `skip`. Confirm no `assets/images/corrupt-test.webp` was created:

```bash
ls assets/images/corrupt-test.webp
```
Expected: "No such file or directory".

Clean up the fake file so it doesn't linger:

```bash
rm assets/images-raw/corrupt-test.jpg
```

- [ ] **Step 6: Commit**

```bash
git add scripts/optimize-images.js
git status
git commit -m "feat: add image optimizer script (sharp, capped width + WebP)"
```

`assets/images-raw/*` and the two new `assets/images/*.webp` files stay uncommitted here — the raw ones are gitignored, and the two webp outputs get folded into Task 4's backlog-cleanup commit along with the rest.

---

### Task 3: Pre-commit hook

**Files:**
- Create: `.husky/pre-commit`
- Modify: `package.json` (husky adds a `prepare` script)

**Interfaces:**
- Consumes: `npm run optimize-images` (Task 2).
- Produces: automatic optimization + staging on every `git commit`.

- [ ] **Step 1: Initialize husky**

```bash
npx husky init
```

This creates `.husky/pre-commit` (with placeholder content `npm test`) and adds `"prepare": "husky"` to `package.json`'s `scripts`.

- [ ] **Step 2: Replace the pre-commit hook content**

Overwrite `.husky/pre-commit` with:

```sh
npm run optimize-images
git add assets/images/
```

- [ ] **Step 3: Confirm it's executable**

```bash
ls -la .husky/pre-commit
```
Expected: `x` permission bits present (husky sets this on init; if not, run `chmod +x .husky/pre-commit`).

- [ ] **Step 4: Test the hook end-to-end with a new raw image**

```bash
cp "assets/images/cabo san lucas.jpg" assets/images-raw/
git commit --allow-empty -m "test: verify pre-commit hook processes new raw image"
```

Expected: commit output includes the optimizer's `done  cabo san lucas.jpg -> ...` line before the commit finalizes.

Verify the result:
```bash
git show --stat HEAD
```
Expected: `assets/images/cabo san lucas.webp` listed as added in that commit. `assets/images-raw/cabo san lucas.jpg` must NOT appear (it's gitignored — confirm with `git status`, which should show it as untracked-but-ignored, i.e. not listed at all unless you pass `--ignored`).

- [ ] **Step 5: Commit the hook setup itself**

The test commit in Step 4 already happened as its own commit (that's fine — it's a real, working verification, not a throwaway to discard). Now commit the husky scaffolding:

```bash
git add .husky/pre-commit package.json
git status
git commit -m "chore: wire up husky pre-commit hook to run image optimizer"
```

---

### Task 4: Backlog cleanup — convert existing 62MB to WebP

**Files:**
- Modify: `assets/images/` (contents replaced with `.webp`)
- Modify: `assets/images-raw/` (receives the moved originals)

**Interfaces:**
- Consumes: `scripts/optimize-images.js` (Task 2), `.husky/pre-commit` is bypassed here (this is a direct `npm run` batch, not a commit-triggered single file).

- [ ] **Step 1: Delete the unused SVG**

Confirmed unreferenced anywhere in `index.html` or `assets/css/*.css`:

```bash
rm "assets/images/double exposure headshot.svg"
```

- [ ] **Step 2: Move all remaining raw originals into assets/images-raw/**

```bash
find assets/images -maxdepth 1 -type f \( -iname "*.jpg" -o -iname "*.jpeg" -o -iname "*.png" \) -exec mv {} assets/images-raw/ \;
```

Using `-exec ... \;` (not a glob) is required — several filenames contain spaces (`cabo amplio.jpg`, `Para ti si... (1).png`, etc.) and a glob would mis-split them.

- [ ] **Step 3: Run the optimizer on the full backlog**

```bash
npm run optimize-images
```

Expected: `skip` lines for the 3 files already converted in Tasks 2–3 (`Untitled.jpg`, `elemento letras.png`, `cabo san lucas.jpg`), `done` lines for the remaining ~26 files, no `error` lines (all are real, valid images).

- [ ] **Step 4: Verify the backlog is fully converted**

```bash
find assets/images -maxdepth 1 -type f \( -iname "*.jpg" -o -iname "*.jpeg" -o -iname "*.png" \)
```
Expected: empty output — no raster originals left directly in `assets/images/`.

```bash
ls assets/images/*.webp | wc -l
```
Expected: `29` (30 original raster/svg files minus the 1 deleted SVG).

```bash
du -sh assets/images/
```
Expected: well under the original 62MB (spot-check a few `done` log lines from Step 3 for the size drop per file).

- [ ] **Step 5: Commit**

```bash
git add assets/images/*.webp
git add -u assets/images/
git status
```

Review the status output carefully before committing: it should show the new `.webp` files as added, the old `.jpg`/`.png` files and the SVG as deleted, and nothing from `assets/images-raw/` (gitignored). If any `._*` file appears, do not add it — investigate separately, it's unrelated repo cruft.

```bash
git commit -m "chore: convert assets/images/ backlog to WebP (62MB -> WebP, drop unused SVG)"
```

---

### Task 5: Update HTML/CSS references and bundled fixes

**Files:**
- Modify: `index.html`
- Modify: `assets/css/layout.css`

**Interfaces:**
- Consumes: the `.webp` files produced in Task 4 (exact basenames match the pre-`.webp` originals, since the optimizer preserves basenames).

- [ ] **Step 1: Update index.html — hero background + preload link**

Change (around line 99):
```html
        style="background-image: url('assets/images/montañas capas.jpg')"
```
to:
```html
        style="background-image: url('assets/images/montañas capas.webp')"
```

Add a preload link in `<head>`, grouped with the existing font preloads (after the two `<link rel="preload" ... as="font" ...>` lines, before the `<!-- Styles -->` comment):
```html
  <link rel="preload" href="assets/images/montañas capas.webp" as="image">
```

- [ ] **Step 2: Update index.html — the 8 `.moments__img` tags**

Each currently looks like:
```html
<img class="moments__img" src="assets/images/cabo amplio.jpg" alt="Horizonte abierto al atardecer" loading="lazy">
```

Update `src` to `.webp` and add `width`/`height` on all 8, using these exact values (computed from each source image's real dimensions, capped at 2000px wide per the optimizer's `withoutEnlargement` rule):

| Line | File | width | height |
|---|---|---|---|
| 166 | `cabo amplio.jpg` | 2000 | 1333 |
| 174 | `boque con niebla.jpg` | 2000 | 1333 |
| 182 | `Cascada Salto.jpg` | 1365 | 2048 |
| 190 | `atardecer playa.jpg` | 2000 | 1333 |
| 198 | `agave victoria.jpg` | 2000 | 1333 |
| 206 | `chipinque.jpg` | 2000 | 1333 |
| 214 | `playa diagonal.jpg` | 2000 | 1333 |
| 222 | `montaña con bosque.jpg` | 1365 | 2048 |

Example for line 166:
```html
<img class="moments__img" src="assets/images/cabo amplio.webp" alt="Horizonte abierto al atardecer" loading="lazy" width="2000" height="1333">
```

Apply the same pattern (swap `.jpg`→`.webp` in `src`, append `width`/`height` from the table) to the other 7 lines, keeping each tag's existing `alt` text and `data-i18n`/caption siblings untouched.

- [ ] **Step 3: Update index.html — duality circle image (line ~316)**

Current:
```html
              <img
                src="assets/images/ombligo del mundo.jpg"
                alt=""
                loading="lazy"
              >
```
Update to:
```html
              <img
                src="assets/images/ombligo del mundo.webp"
                alt=""
                loading="lazy"
                width="1365"
                height="2048"
              >
```

- [ ] **Step 4: Update index.html — para-ti headshot (line ~493)**

Current:
```html
          <img
            class="para-ti__headshot"
            src="assets/images/para-ti-headshot.png"
            alt=""
            loading="lazy"
          >
```
Update to:
```html
          <img
            class="para-ti__headshot"
            src="assets/images/para-ti-headshot.webp"
            alt=""
            loading="lazy"
            width="1920"
            height="1080"
          >
```

- [ ] **Step 5: Update assets/css/layout.css — 4 background-image url() references**

| Line | Current | New |
|---|---|---|
| 51 | `url('../images/tronco humedo.jpg')` | `url('../images/tronco humedo.webp')` |
| 869 | `url('../images/boque%20con%20niebla.jpg')` | `url('../images/boque%20con%20niebla.webp')` |
| 1075 | `url('../images/Bah%C3%ADa.jpg')` | `url('../images/Bah%C3%ADa.webp')` |
| 1549 | `url('../images/mountains-outline.jpg')` | `url('../images/mountains-outline.webp')` |

Keep the existing percent-encoding as-is on lines 869 and 1075 — only the extension changes.

- [ ] **Step 6: Verify dimensions against actual sharp output**

The width/height table in Step 2–4 was computed from the source JPGs' known dimensions and the optimizer's documented resize rule, but confirm it against the real files before committing:

```bash
node -e "
const sharp = require('sharp');
const files = ['cabo amplio', 'boque con niebla', 'Cascada Salto', 'atardecer playa', 'agave victoria', 'chipinque', 'playa diagonal', 'montaña con bosque', 'ombligo del mundo', 'para-ti-headshot'];
Promise.all(files.map((f) => sharp(\`assets/images/\${f}.webp\`).metadata().then((m) => console.log(f, m.width, m.height))));
"
```

Expected output matches the table exactly:
```
cabo amplio 2000 1333
boque con niebla 2000 1333
Cascada Salto 1365 2048
atardecer playa 2000 1333
agave victoria 2000 1333
chipinque 2000 1333
playa diagonal 2000 1333
montaña con bosque 1365 2048
ombligo del mundo 1365 2048
para-ti-headshot 1920 1080
```

If any value differs, fix the corresponding `width`/`height` attribute in `index.html` to match the real number before proceeding.

- [ ] **Step 7: Visual check**

Open `index.html` directly in a browser (`open index.html` on macOS) and confirm: hero background loads, all 8 moments images load, the duality circle image loads, the para-ti headshot loads, the closing section background loads, nothing shows a broken-image icon.

- [ ] **Step 8: Commit**

```bash
git add index.html assets/css/layout.css
git status
git commit -m "fix: point image references at WebP output, add width/height, preload hero"
```

---

### Task 6: Final verification

**Files:** none (verification only)

- [ ] **Step 1: Confirm no old-extension references remain**

```bash
grep -n 'images/[^"'"'"')]*\.\(jpg\|jpeg\|png\|svg\)' index.html assets/css/layout.css
```
Expected: only the two pre-existing `og-preview.jpg` lines (out of scope, left untouched) — no other matches.

- [ ] **Step 2: Confirm total size reduction**

```bash
du -sh assets/images/
```
Expected: substantially under the original 62MB.

- [ ] **Step 3: Confirm git status is clean**

```bash
git status
git log --oneline -7
```
Expected: working tree clean, and the last several commits show the package.json/husky setup, optimizer script, hook wiring, backlog conversion, and reference updates in order. Nothing pushed — that's a separate, explicit step if the user wants it.

---

## Self-Review Notes

- **Spec coverage:** optimizer behavior (skip-if-exists, `--force`, resize+WebP, corrupt-file handling, auto-create dirs) → Task 2. Pre-commit hook + auto-staging → Task 3. Backlog cleanup (move to raw, regenerate, update refs, remove old originals from git) → Tasks 4–5. Bundled fixes (delete dead SVG, width/height attrs, hero preload) → Tasks 4 Step 1, 5 Steps 1–4. Testing/verification section → Task 6 plus inline checks throughout. Format decision (WebP only, `og-preview.jpg` exception) → Global Constraints. Nothing in the spec is unaddressed.
- **Placeholder scan:** no TBD/TODO markers; the one runtime-dependent value (image `width`/`height`) is pre-computed from real source file dimensions (verified via `sips` during planning) and given as an exact table, with a verification step to catch any discrepancy against actual sharp output.
- **Type/name consistency:** `MAX_WIDTH_PX` / `WEBP_QUALITY` constants, `npm run optimize-images` script name, and `.husky/pre-commit` contents are identical across Tasks 1–3.
