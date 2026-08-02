# Waitlist Form Email Integration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the existing waitlist form actually send a notification email to `contacto@somoslatente.com` and a confirmation email to the visitor, using a Google Apps Script Web App as the static site's "backend."

**Architecture:** The site stays fully static (GitHub Pages). `waitlist.js` POSTs form data to a Google Apps Script Web App URL, bound to a Google Sheet under the `contacto@somoslatente.com` Workspace account. The script logs a row, sends both emails, and returns JSON that the existing frontend success/error UI already knows how to render.

**Tech Stack:** Vanilla HTML/CSS/JS (no build tool), Google Apps Script (V8 runtime), Google Sheets, Gmail (via `MailApp`).

**Spec:** `docs/superpowers/specs/2026-08-02-waitlist-email-integration-design.md`

## Global Constraints

- No inline styles or inline scripts anywhere in `index.html` — ever (site rule)
- Site JS: `const`/`let` only, named functions, `try`/`catch` around async work, no `onclick` attributes in HTML (site rule)
- Server-side (Apps Script) must independently re-validate `firstName`/`email` — never trust client JS alone (spec)
- Apps Script Web App must be deployed with **Execute as: Me**, **Access: Anyone** (spec)
- Honeypot field must be invisible/unreachable to real users: no visible label styling, `tabindex="-1"`, `autocomplete="off"` (spec)
- Confirmation and notification email copy must match the `lang` field (`es` or `en`) sent from the frontend (spec)
- No new hosting or backend service — the site remains static (spec goal)

---

## Task 1: Write the Apps Script backend

**Files:**
- Create: `google-apps-script/Code.gs`

**Interfaces:**
- Produces: a `doPost(e)` entry point that accepts a JSON body (sent as `text/plain`) shaped `{firstName, lastName, email, lang, honeypot}` and returns `ContentService` JSON `{ok: true}` or `{ok: false, error: "validation"|"server"}`. Task 4 depends on this exact response shape.

This file is not executed in this repo — it is version-controlled reference text that gets pasted into the Apps Script editor in Task 2. There is no automated test runner for Apps Script here, so verification is a syntax check plus a manual read-through.

- [ ] **Step 1: Create the file with the full script**

Create `google-apps-script/Code.gs`:

```javascript
/**
 * Latente — Waitlist Apps Script backend.
 * Deployed as a Web App bound to the "Latente — Waitlist" Google Sheet,
 * running under the contacto@somoslatente.com Workspace account.
 */

const NOTIFY_EMAIL = 'contacto@somoslatente.com';

const TEMPLATES = {
  es: {
    notifySubjectPrefix: 'Nueva persona en la lista de espera — ',
    confirmSubject: 'Estás dentro.',
    confirmBody: (firstName) =>
      `Hola ${firstName},\n\n` +
      'Ya quedó tu lugar en la lista de espera de Latente. Te vamos a escribir ' +
      'antes que a nadie cuando se abran los primeros espacios — no van a ser muchos.\n\n' +
      'Sin spam. Sin urgencia artificial. Solo lo que importa, cuando importa.\n\n' +
      '— Latente',
  },
  en: {
    notifySubjectPrefix: 'New waitlist signup — ',
    confirmSubject: "You're in.",
    confirmBody: (firstName) =>
      `Hi ${firstName},\n\n` +
      "Your spot on the Latente waitlist is confirmed. We'll write to you before " +
      "anyone else when the first spaces open — there won't be many.\n\n" +
      'No spam. No artificial urgency. Just what matters, when it matters.\n\n' +
      '— Latente',
  },
};

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);

    // Bots fill hidden fields. Silently succeed without doing anything real.
    if (data.honeypot) {
      return jsonResponse({ ok: true });
    }

    const firstName = (data.firstName || '').trim();
    const lastName = (data.lastName || '').trim();
    const email = (data.email || '').trim();
    const lang = data.lang === 'en' ? 'en' : 'es';

    if (!firstName || !isValidEmail(email)) {
      return jsonResponse({ ok: false, error: 'validation' });
    }

    appendRow(firstName, lastName, email, lang);
    sendNotification(firstName, lastName, email, lang);
    sendConfirmation(firstName, email, lang);

    return jsonResponse({ ok: true });
  } catch (err) {
    return jsonResponse({ ok: false, error: 'server' });
  }
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function appendRow(firstName, lastName, email, lang) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  sheet.appendRow([new Date(), firstName, lastName, email, lang]);
}

function sendNotification(firstName, lastName, email, lang) {
  const t = TEMPLATES[lang];
  const subject = `${t.notifySubjectPrefix}${firstName} ${lastName}`;
  const body =
    `Nombre: ${firstName} ${lastName}\n` +
    `Correo: ${email}\n` +
    `Idioma: ${lang}\n` +
    `Fecha: ${new Date().toString()}`;
  MailApp.sendEmail(NOTIFY_EMAIL, subject, body);
}

function sendConfirmation(firstName, email, lang) {
  const t = TEMPLATES[lang];
  MailApp.sendEmail(email, t.confirmSubject, t.confirmBody(firstName));
}

function jsonResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
```

- [ ] **Step 2: Syntax-check the file**

Run: `node --check google-apps-script/Code.gs`
Expected: no output, exit code 0. (This only checks JavaScript syntax — `SpreadsheetApp`, `MailApp`, and `ContentService` are Apps Script globals that don't exist in Node, so the file cannot actually be executed here. This step only catches typos before Task 2's copy-paste.)

If `node` isn't installed, skip this step — Task 2's deployment step will surface any real syntax error immediately when you try to save the script in the Apps Script editor.

- [ ] **Step 3: Commit**

```bash
git add google-apps-script/Code.gs
git commit -m "feat: add Apps Script backend for waitlist emails"
```

---

## Task 2: Deploy the Apps Script (user action — requires Google account access Claude does not have)

**Files:** none in this repo — this task happens entirely on script.google.com and sheets.google.com.

**Interfaces:**
- Produces: a deployed Web App URL ending in `/exec`. Task 5 needs this exact string.

- [ ] **Step 1: Create the Google Sheet**

While logged into `contacto@somoslatente.com`, go to https://sheet.new. Rename the spreadsheet "Latente — Waitlist". In row 1, add headers: `Timestamp`, `First Name`, `Last Name`, `Email`, `Language`.

- [ ] **Step 2: Open the Apps Script editor**

In the Sheet, go to **Extensions → Apps Script**. This opens a script project already bound to the Sheet.

- [ ] **Step 3: Paste in the backend code**

Delete the placeholder `function myFunction() {}` content in `Code.gs`, then paste in the entire contents of this repo's `google-apps-script/Code.gs` (from Task 1). Rename the project (top-left, "Untitled project") to "Latente Waitlist Backend". Save with Cmd+S / Ctrl+S.

- [ ] **Step 4: Deploy as a Web App**

Click **Deploy → New deployment**. Click the gear icon next to "Select type" and choose **Web app**. Set:
- Description: `Waitlist form handler`
- Execute as: **Me**
- Who has access: **Anyone**

Click **Deploy**. When prompted to authorize, click through the consent screen (it will warn "Google hasn't verified this app" because it's your own unpublished script — click **Advanced → Go to Latente Waitlist Backend (unsafe)** to proceed, then **Allow**).

- [ ] **Step 5: Copy the Web App URL**

After deploying, copy the URL shown (it ends in `/exec`). This is the value Task 5 needs.

- [ ] **Step 6: Verify access is actually public**

Open the copied `/exec` URL directly in a **private/incognito browser window** (logged out of any Google account). Expected: a page saying something like "Script function not found: doGet" or similar Apps Script error page — that confirms the deployment is publicly reachable. If instead you see a Google **sign-in page** or a **permission/access-denied page**, your Workspace admin is restricting "Anyone" access for Apps Script deployments — this needs to be resolved with the admin before continuing to Task 5.

- [ ] **Step 7: Hand off the URL**

Give Claude the copied `/exec` URL so it can be wired into `waitlist.js` in Task 5.

---

## Task 3: Add the honeypot field to the form

**Files:**
- Modify: `index.html:541-547`
- Modify: `assets/css/components.css` (new rule after the `.form-message--success` block, around line 197)

**Interfaces:**
- Produces: an input matching `[data-waitlist-honeypot]` inside `.waitlist__form`. Task 4 reads this selector.

- [ ] **Step 1: Add the honeypot markup**

In `index.html`, the form currently opens like this:

```html
        <form
          class="waitlist__form"
          data-waitlist-form
          novalidate
          aria-label="Formulario de lista de espera"
          data-reveal
        >
          <div class="waitlist__form-row">
```

Change it to insert the honeypot field right after the opening `<form>` tag:

```html
        <form
          class="waitlist__form"
          data-waitlist-form
          novalidate
          aria-label="Formulario de lista de espera"
          data-reveal
        >
          <div class="form-honeypot" aria-hidden="true">
            <label for="waitlist-company">Company</label>
            <input
              type="text"
              id="waitlist-company"
              name="company"
              data-waitlist-honeypot
              tabindex="-1"
              autocomplete="off"
            >
          </div>

          <div class="waitlist__form-row">
```

- [ ] **Step 2: Add the CSS to visually hide it**

In `assets/css/components.css`, after the `.form-message--success` rule (around line 197), add:

```css
.form-honeypot {
  position: absolute;
  left: -9999px;
  width: 1px;
  height: 1px;
  overflow: hidden;
}
```

- [ ] **Step 3: Verify visually and structurally**

Run a local static server from the project root:

```bash
python3 -m http.server 8000
```

Open `http://localhost:8000` in a browser. Confirm:
- The waitlist form (S7 section) looks unchanged — no visible "Company" field
- Pressing Tab through the form's fields skips directly from the surrounding page to "Nombre" (the honeypot is unreachable via keyboard)

Then confirm no inline styles were introduced:

```bash
grep -n 'style="' index.html
```

Expected: no output (or only pre-existing matches unrelated to this change — there should be none from this edit).

- [ ] **Step 4: Commit**

```bash
git add index.html assets/css/components.css
git commit -m "feat: add honeypot field to waitlist form"
```

---

## Task 4: Update waitlist.js to call the Apps Script backend

**Files:**
- Modify: `assets/js/modules/waitlist.js`

**Interfaces:**
- Consumes: `[data-waitlist-honeypot]` from Task 3; the `{ok, error}` JSON response shape produced by `doPost` in Task 1.
- Produces: a `WAITLIST_ENDPOINT` constant that Task 5 updates with the real deployed URL.

This task intentionally ships with a placeholder URL value that cannot be known until Task 2 is complete. Task 5 replaces it with the real one — this is not a stray TODO, it's the one value that genuinely does not exist until a human deploys the script.

- [ ] **Step 1: Add the endpoint constant**

At the top of `assets/js/modules/waitlist.js`, after the file header comment, add:

```javascript
const WAITLIST_ENDPOINT = 'REPLACE_WITH_YOUR_DEPLOYED_APPS_SCRIPT_URL';
```

- [ ] **Step 2: Update the submit handler**

Replace the current `try`/`catch` block inside `handleFormSubmit` (currently lines 43–65):

```javascript
  try {
    const response = await fetch('/api/waitlist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        firstName: nameInput.value.trim(),
        lastName:  lastnameInput ? lastnameInput.value.trim() : '',
        email:     emailInput.value.trim(),
      }),
    });

    if (!response.ok) throw new Error(`Server error: ${response.status}`);

    showFormMessage(form, getTranslation('form.success'), 'success');
    nameInput?.removeAttribute('aria-invalid');
    emailInput?.removeAttribute('aria-invalid');
    form.reset();
  } catch (error) {
    console.error('Waitlist submission failed:', error);
    showFormMessage(form, getTranslation('form.error.server'), 'error');
  } finally {
    setLoadingState(submitBtn, false);
  }
```

with:

```javascript
  const honeypotInput = form.querySelector('[data-waitlist-honeypot]');

  try {
    const response = await fetch(WAITLIST_ENDPOINT, {
      method: 'POST',
      // Apps Script Web Apps don't handle CORS preflight OPTIONS requests.
      // text/plain avoids triggering a preflight; the script still parses the body as JSON.
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({
        firstName: nameInput.value.trim(),
        lastName:  lastnameInput ? lastnameInput.value.trim() : '',
        email:     emailInput.value.trim(),
        lang:      document.documentElement.lang || 'es',
        honeypot:  honeypotInput ? honeypotInput.value.trim() : '',
      }),
    });

    if (!response.ok) throw new Error(`Server error: ${response.status}`);

    const result = await response.json();
    if (!result.ok) throw new Error(`Submission rejected: ${result.error}`);

    showFormMessage(form, getTranslation('form.success'), 'success');
    nameInput?.removeAttribute('aria-invalid');
    emailInput?.removeAttribute('aria-invalid');
    form.reset();
  } catch (error) {
    console.error('Waitlist submission failed:', error);
    showFormMessage(form, getTranslation('form.error.server'), 'error');
  } finally {
    setLoadingState(submitBtn, false);
  }
```

- [ ] **Step 3: Verify the error path works with the placeholder URL**

Run `python3 -m http.server 8000` from the project root, open `http://localhost:8000`, open the browser devtools console, and submit the waitlist form with a valid name and email.

Expected: the request fails (since `WAITLIST_ENDPOINT` is still a placeholder string, not a real URL), the console logs `Waitlist submission failed: ...`, and the form shows its existing red error message — confirming the `catch` block and error UI still work correctly with the new code path.

- [ ] **Step 4: Commit**

```bash
git add assets/js/modules/waitlist.js
git commit -m "feat: wire waitlist form to Apps Script endpoint"
```

---

## Task 5: Wire in the real deployed URL and verify end-to-end

**Files:**
- Modify: `assets/js/modules/waitlist.js:<line with WAITLIST_ENDPOINT>`

**Interfaces:**
- Consumes: the `/exec` URL produced in Task 2, Step 5.

- [ ] **Step 1: Replace the placeholder with the real URL**

In `assets/js/modules/waitlist.js`, change:

```javascript
const WAITLIST_ENDPOINT = 'REPLACE_WITH_YOUR_DEPLOYED_APPS_SCRIPT_URL';
```

to the actual deployed URL from Task 2, e.g.:

```javascript
const WAITLIST_ENDPOINT = 'https://script.google.com/macros/s/AKfycb.../exec';
```

- [ ] **Step 2: End-to-end test — happy path (ES)**

With the site's language set to Spanish, run `python3 -m http.server 8000`, open `http://localhost:8000`, and submit the form with a real test name and an email address you can check.

Expected: the form shows the success message; within a minute, a row appears in the "Latente — Waitlist" Sheet; a notification email arrives at `contacto@somoslatente.com`; a Spanish confirmation email ("Estás dentro.") arrives at the test address.

- [ ] **Step 3: End-to-end test — happy path (EN)**

Switch the site's language to English (via the language switcher) and repeat Step 2 with a different test email.

Expected: same as Step 2, but the confirmation email subject is "You're in." and the body is in English.

- [ ] **Step 4: End-to-end test — honeypot rejection**

Open devtools, find the hidden input matching `[data-waitlist-honeypot]`, and set its value to any non-empty string (e.g. via the Elements panel or `document.querySelector('[data-waitlist-honeypot]').value = 'bot'` in the console). Submit the form with a valid name/email.

Expected: the form still shows the normal success message (bots shouldn't learn they were caught), but **no new row appears in the Sheet and no emails are sent**.

- [ ] **Step 5: End-to-end test — server-side validation**

In the browser console, bypass the client-side check by calling the endpoint directly with a malformed email:

```javascript
fetch('PASTE_THE_SAME_WAITLIST_ENDPOINT_URL_HERE', {
  method: 'POST',
  headers: { 'Content-Type': 'text/plain;charset=utf-8' },
  body: JSON.stringify({ firstName: 'Test', lastName: '', email: 'not-an-email', lang: 'es', honeypot: '' }),
}).then(r => r.json()).then(console.log);
```

Expected: logs `{ok: false, error: "validation"}`, and no row/email is created — confirming the server doesn't trust client-side validation alone.

- [ ] **Step 6: Commit**

```bash
git add assets/js/modules/waitlist.js
git commit -m "feat: connect waitlist form to live Apps Script deployment"
```

---

## Self-Review Notes

- **Spec coverage:** Sheet logging (Task 1/2), notification email (Task 1), confirmation email in ES/EN (Task 1), honeypot (Tasks 1, 3, 4, verified in Task 5), server-side validation (Task 1, verified in Task 5), frontend endpoint + `text/plain` + `{ok:false}` handling (Task 4), deployment settings and admin-restriction risk check (Task 2) — all covered.
- **Placeholder scan:** The only placeholder string (`WAITLIST_ENDPOINT`'s initial value) is intentional and resolved by name in Task 5, not a deferred TODO.
- **Type/name consistency:** `WAITLIST_ENDPOINT`, `[data-waitlist-honeypot]`, and the `{ok, error}` response shape are used identically across Tasks 1, 3, 4, and 5.
