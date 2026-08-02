# Waitlist Form → Email Integration — Design

**Date:** 2026-08-02
**Status:** Approved

## Problem

The waitlist form (`index.html`, S7 section) already has full client-side validation and submit handling in `assets/js/modules/waitlist.js`, but it `fetch()`s `/api/waitlist` — an endpoint that doesn't exist. The site is pure static HTML/CSS/JS hosted on GitHub Pages with no backend, so every submission currently fails silently against a 404.

## Goal

When a visitor submits the waitlist form, the submission should:
1. Be logged somewhere durable (not just an email in an inbox)
2. Trigger a notification email to `contacto@somoslatente.com`
3. Trigger an auto-confirmation email back to the visitor, in their site language (ES/EN)
4. Be resistant to basic bot spam

No new hosting or backend service should be required — the site stays static.

## Chosen Approach: Google Apps Script Web App

Google Apps Script deployed as a Web App, bound to a Google Sheet, running under the `contacto@somoslatente.com` Google Workspace account. This was chosen over Formspree-style form services and EmailJS because the user wants the flow fully owned within their existing Google Workspace account rather than a third-party SaaS intermediary.

Trade-off accepted: Apps Script deployment and doPost/CORS behavior is fiddlier to set up than a form-backend SaaS, and the Web App URL is necessarily exposed in the public JS bundle (unavoidable for a static site; acceptable since the endpoint can only run this one fixed action).

**Risk to verify before building:** if Workspace admin policy restricts Apps Script deployments from using "Anyone" access, the public site won't be able to call the script until that's allowed by the workspace admin.

## Components

### 1. Google Sheet — "Latente — Waitlist"
Columns: `Timestamp | First Name | Last Name | Email | Language`
One row appended per valid submission. Serves as the durable log/backup of all signups.

### 2. Apps Script (`Code.gs`), bound to the Sheet, deployed as a Web App
- `doPost(e)`:
  1. Parse the JSON body (sent as `text/plain` from the client — see Frontend section for why)
  2. If the honeypot field is non-empty → return `{ok: true}` immediately, do nothing else (silent bot trap)
  3. Server-side validate `firstName` (non-empty) and `email` (regex format check) — never trust client-side validation alone
  4. If invalid → return `{ok: false, error: "validation"}`
  5. Append a row to the Sheet: timestamp, firstName, lastName (may be empty), email, lang
  6. Send a notification email to `contacto@somoslatente.com` with the submission details
  7. Send a confirmation email to the visitor's email address, using the ES or EN template based on the `lang` field
  8. Return `{ok: true}`
  9. Wrap steps 5–7 in try/catch; on any exception, return `{ok: false, error: "server"}`
- Deployment settings: **Execute as: Me** (the Workspace account owner), **Who has access: Anyone** (required so the public site can call it without a Google login)

### 3. Email templates
Tone matches existing site copy (grounded, warm, no corporate/hustle language). Draft copy:

**Notification to `contacto@somoslatente.com`:**
> Subject: Nueva persona en la lista de espera — {firstName} {lastName}
> Body: Nombre: {firstName} {lastName}\nCorreo: {email}\nIdioma: {lang}\nFecha: {timestamp}

**Confirmation to visitor (ES):**
> Subject: Estás dentro.
> Body: Hola {firstName},\n\nYa quedó tu lugar en la lista de espera de Latente. Te vamos a escribir antes que a nadie cuando se abran los primeros espacios — no van a ser muchos.\n\nSin spam. Sin urgencia artificial. Solo lo que importa, cuando importa.\n\n— Latente

**Confirmation to visitor (EN):**
> Subject: You're in.
> Body: Hi {firstName},\n\nYour spot on the Latente waitlist is confirmed. We'll write to you before anyone else when the first spaces open — there won't be many.\n\nNo spam. No artificial urgency. Just what matters, when it matters.\n\n— Latente

Exact final copy can be refined during implementation; structure and tone above are fixed.

### 4. Frontend changes

**`index.html`** — add one hidden honeypot field inside `.waitlist__form`, e.g.:
```html
<input type="text" name="company" data-waitlist-honeypot tabindex="-1" autocomplete="off" style="position:absolute; left:-9999px;" aria-hidden="true">
```
(No visible label; real users never see or fill it.)

**`assets/js/modules/waitlist.js`**:
- Replace the `/api/waitlist` URL with the deployed Apps Script Web App URL (a constant at the top of the file)
- Change the request `Content-Type` to `text/plain;charset=utf-8` instead of `application/json` — Apps Script Web Apps don't handle CORS preflight `OPTIONS` requests, so a `Content-Type: application/json` request triggers a preflight that fails silently. Sending as `text/plain` avoids the preflight; the script still parses the body as JSON server-side.
- Include the honeypot field's value and `document.documentElement.lang` in the JSON payload
- Extend the response handling: treat both HTTP-level failure AND a `{ok: false}` JSON response as an error case (currently only checks `response.ok`)

## Data Flow

```
Visitor fills form
  → client-side validation (existing, unchanged)
  → POST (text/plain body containing JSON) to Apps Script Web App URL
  → doPost(e): honeypot check → validation → append row to Sheet
      → send notification email → send confirmation email → respond {ok: true}
  → waitlist.js shows existing success/error message based on {ok} field
```

## Error Handling

- Client-side validation stays as-is (required name, valid email format) as the first line of defense
- Server-side re-validates independently since client JS can be bypassed or disabled
- Any exception during Sheet append or email send is caught; the script still returns a JSON response (never lets the request hang or 500)
- Frontend already has a generic error message path (`form.error.server` translation key) — extended to also fire on `{ok: false}`, not just network/HTTP errors

## Testing Plan

Manual end-to-end verification (no automated test infra exists for this static site):
1. Submit the form with a real test email → confirm a new row appears in the Sheet, a notification arrives at `contacto@somoslatente.com`, and a confirmation arrives at the test address in the correct language (test both ES and EN via the language switcher)
2. Fill the honeypot field via browser devtools and submit → confirm no row is added and no emails are sent, while the frontend still shows a normal success state (bot never learns it was rejected)
3. Disable client-side JS validation (or submit a malformed email directly) → confirm the server-side validation still rejects it

## Roles & Responsibilities

**User (must be done manually, requires Google account access Claude does not have):**
- Create the Google Sheet under `contacto@somoslatente.com`
- Create the Apps Script project bound to that Sheet and paste in the code Claude provides
- Deploy the script as a Web App (Execute as: Me / Access: Anyone) and copy the resulting URL
- Confirm the Workspace admin allows "Anyone" access for Apps Script deployments (flagged risk above)
- Hand the deployed Web App URL back so it can be wired into the frontend

**Claude (code changes in this repo):**
- Write the full `Code.gs` script content for the user to paste in
- Add the honeypot field to `index.html`
- Update `assets/js/modules/waitlist.js` (endpoint URL, `text/plain` body, honeypot + lang fields, `{ok:false}` handling)
- Verify the translation keys used by the existing error/success messages still cover this flow

## Out of Scope

- Migrating hosting off GitHub Pages
- Any admin UI for viewing/managing the Sheet
- Automated tests (no test infra in this project)
- Rate limiting beyond the honeypot (Workspace Gmail send quota of ~1,500/day is assumed sufficient for a waitlist launch)
