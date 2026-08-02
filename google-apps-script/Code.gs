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
    Logger.log('Incoming data: %s', JSON.stringify(data));

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

    Logger.log('Remaining daily email quota: %s', MailApp.getRemainingDailyQuota());

    appendRow(firstName, lastName, email, lang);
    sendNotification(firstName, lastName, email, lang);
    sendConfirmation(firstName, email, lang);

    return jsonResponse({ ok: true });
  } catch (err) {
    Logger.log('doPost error: %s', err.toString());
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
  Logger.log('Sending confirmation to: "%s" (lang=%s)', email, lang);
  MailApp.sendEmail(email, t.confirmSubject, t.confirmBody(firstName));
  Logger.log('Confirmation MailApp.sendEmail call returned without throwing for: "%s"', email);
}

function jsonResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
