/**
 * Latente — Waitlist Apps Script backend.
 * Deployed as a Web App bound to the "Latente — Waitlist" Google Sheet,
 * running under the contacto@somoslatente.com Workspace account.
 */

const NOTIFY_EMAIL = 'contacto@somoslatente.com';
const HEADER_IMAGE_URL = 'https://somoslatente.com/assets/images/Bah%C3%ADa.jpg';

function confirmHtmlBody(wordmarkLabel, greeting, paragraphs, signoff) {
  const paragraphHtml = paragraphs
    .map(
      (p, i) =>
        `<p style="margin:0 0 ${i === paragraphs.length - 1 ? '24' : '16'}px 0; color:${
          i === paragraphs.length - 1 ? '#7A4E28; font-size:14px' : '#1A1208'
        };">${p}</p>`,
    )
    .join('\n            ');

  return `
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#F0E6D3; padding:32px 16px;">
  <tr>
    <td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px; background-color:#FFFFFF; border:1px solid #C4935A; border-radius:8px; overflow:hidden;">
        <tr>
          <td>
            <img src="${HEADER_IMAGE_URL}" alt="Latente" width="560" style="display:block; width:100%; max-width:560px; height:auto; border:0;">
          </td>
        </tr>
        <tr>
          <td style="padding:32px 40px 8px 40px; text-align:center;">
            <p style="margin:0; font-family:Georgia, 'Times New Roman', serif; font-size:13px; letter-spacing:4px; text-transform:uppercase; color:#7A4E28;">${wordmarkLabel}</p>
          </td>
        </tr>
        <tr>
          <td style="padding:0 40px;">
            <hr style="border:none; border-top:1px solid #C4935A; margin:16px 0;">
          </td>
        </tr>
        <tr>
          <td style="padding:0 40px 40px 40px; font-family:Helvetica, Arial, sans-serif; font-size:16px; line-height:1.6;">
            <p style="margin:0 0 16px 0; color:#1A1208;">${greeting}</p>
            ${paragraphHtml}
            <p style="margin:0; font-weight:bold; color:#1A1208;">${signoff}</p>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
`;
}

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
    confirmHtmlBody: (firstName) =>
      confirmHtmlBody(
        'Latente',
        `Hola ${firstName},`,
        [
          'Ya quedó tu lugar en la lista de espera de Latente. Te vamos a escribir antes que a nadie cuando se abran los primeros espacios — no van a ser muchos.',
          'Sin spam. Sin urgencia artificial. Solo lo que importa, cuando importa.',
        ],
        '— Latente',
      ),
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
    confirmHtmlBody: (firstName) =>
      confirmHtmlBody(
        'Latente',
        `Hi ${firstName},`,
        [
          "Your spot on the Latente waitlist is confirmed. We'll write to you before anyone else when the first spaces open — there won't be many.",
          'No spam. No artificial urgency. Just what matters, when it matters.',
        ],
        '— Latente',
      ),
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
  GmailApp.sendEmail(NOTIFY_EMAIL, subject, body);
}

function sendConfirmation(firstName, email, lang) {
  const t = TEMPLATES[lang];
  GmailApp.sendEmail(email, t.confirmSubject, t.confirmBody(firstName), {
    htmlBody: t.confirmHtmlBody(firstName),
  });
}

function jsonResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function testConfirmationEmail() {
  const testEmail = 'alan.reyor@gmail.com';
  sendConfirmation('Test', testEmail, 'es');
  Logger.log('testConfirmationEmail finished');
}
