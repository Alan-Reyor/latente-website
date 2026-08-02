/* ============================================================
   LATENTE — waitlist.js
   Handles waitlist form submission and feedback states.
   ============================================================ */

const WAITLIST_ENDPOINT = 'https://script.google.com/macros/s/AKfycbxUeqcfvCSxohcl2x3wi8nvGag0DOakyHkWhfGNfhCgrJrNaOC3aQ0XGcyz9tMGwW_H/exec';

function initWaitlist() {
  const form = document.querySelector('[data-waitlist-form]');
  if (!form) return;

  form.addEventListener('submit', handleFormSubmit);
}

async function handleFormSubmit(event) {
  event.preventDefault();

  const form = event.currentTarget;
  const nameInput     = form.querySelector('[data-waitlist-name]');
  const lastnameInput = form.querySelector('[data-waitlist-lastname]');
  const emailInput    = form.querySelector('[data-waitlist-email]');
  const submitBtn     = form.querySelector('[data-waitlist-submit]');

  if (!nameInput || !nameInput.value.trim()) {
    nameInput?.setAttribute('aria-invalid', 'true');
    showFormMessage(form, getTranslation('form.error.name'), 'error');
    nameInput?.focus();
    return;
  } else {
    nameInput?.removeAttribute('aria-invalid');
  }

  if (!emailInput || !validateEmail(emailInput.value)) {
    emailInput?.setAttribute('aria-invalid', 'true');
    showFormMessage(form, getTranslation('form.error.email'), 'error');
    emailInput?.focus();
    return;
  } else {
    emailInput?.removeAttribute('aria-invalid');
  }

  setLoadingState(submitBtn, true);
  clearFormMessage(form);

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
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

function setLoadingState(button, isLoading) {
  if (!button) return;
  button.disabled = isLoading;
  button.setAttribute('aria-busy', isLoading ? 'true' : 'false');
  button.textContent = isLoading
    ? getTranslation('waitlist.cta.loading')
    : getTranslation('waitlist.cta');
}

function showFormMessage(form, message, type) {
  const messageEl = form.querySelector('[data-waitlist-message]');
  if (!messageEl) return;

  messageEl.textContent = message;
  messageEl.className = `form-message form-message--${type}`;
  messageEl.removeAttribute('hidden');
}

function clearFormMessage(form) {
  const messageEl = form.querySelector('[data-waitlist-message]');
  if (!messageEl) return;

  messageEl.textContent = '';
  messageEl.setAttribute('hidden', '');
}
