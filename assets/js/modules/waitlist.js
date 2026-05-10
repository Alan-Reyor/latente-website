/* ============================================================
   LATENTE — waitlist.js
   Handles waitlist form submission and feedback states.
   ============================================================ */

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
