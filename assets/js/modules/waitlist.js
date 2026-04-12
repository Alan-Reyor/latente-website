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
  const emailInput = form.querySelector('[data-waitlist-email]');
  const submitBtn = form.querySelector('[data-waitlist-submit]');

  if (!emailInput || !validateEmail(emailInput.value)) {
    showFormMessage(form, getTranslation('form.error.email'), 'error');
    return;
  }

  setLoadingState(submitBtn, true);
  clearFormMessage(form);

  try {
    const response = await fetch('/api/waitlist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: emailInput.value.trim() }),
    });

    if (!response.ok) throw new Error(`Server error: ${response.status}`);

    showFormMessage(form, getTranslation('form.success'), 'success');
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
