// Email sending through any SMTP service (Brevo: smtp-relay.brevo.com:587).
// If SMTP is not configured, emails are only written to the email_log table
// (visible in the admin page) — handy for testing before Brevo is set up.
import nodemailer from 'nodemailer';
import { db } from './db.js';

const { SMTP_HOST, SMTP_PORT = '587', SMTP_USER, SMTP_PASS } = process.env;
const MAIL_FROM = process.env.MAIL_FROM || 'Inner Calm Study <study@buchinger-science.com>';
export const APP_URL = (process.env.APP_URL || 'http://localhost:3000').replace(/\/$/, '');

const transport = SMTP_HOST
  ? nodemailer.createTransport({ host: SMTP_HOST, port: Number(SMTP_PORT), secure: Number(SMTP_PORT) === 465, auth: { user: SMTP_USER, pass: SMTP_PASS } })
  : null;
export const smtpConfigured = Boolean(transport);

const logStmt = db.prepare(`INSERT INTO email_log (user_id, to_email, type, subject, status, error, link) VALUES (?, ?, ?, ?, ?, ?, ?)`);

// ---------- texts ----------
const T = {
  en: {
    dailySubject: (n) => `Inner Calm · Day ${n}: your daily journal is open`,
    dailyBody: (n) => `Good morning,<br><br>Your journal for <b>day ${n}</b> is now open. Take 90 seconds this evening to answer it — thinking about how your day went.`,
    endSubject: 'Inner Calm · Your closing questionnaire',
    endBody: 'Your stay is coming to an end. Thank you for taking part! One last, slightly longer questionnaire is waiting for you — it helps us understand how your experience has changed.',
    button: 'Open my journey',
    resetSubject: 'Inner Calm · Reset your password',
    resetBody: 'Someone (hopefully you) asked to reset the password of your Inner Calm account. This link is valid for one hour. If you did not ask for it, simply ignore this email.',
    resetButton: 'Choose a new password',
    footer: 'Inner Calm study · Buchinger Wilhelmi',
  },
  de: {
    dailySubject: (n) => `Inner Calm · Tag ${n}: Ihr Tagesjournal ist geöffnet`,
    dailyBody: (n) => `Guten Morgen,<br><br>Ihr Journal für <b>Tag ${n}</b> ist jetzt geöffnet. Nehmen Sie sich heute Abend 90 Sekunden Zeit und denken Sie dabei an Ihren Tag.`,
    endSubject: 'Inner Calm · Ihr Abschlussfragebogen',
    endBody: 'Ihr Aufenthalt geht zu Ende. Vielen Dank für Ihre Teilnahme! Ein letzter, etwas längerer Fragebogen wartet auf Sie – er hilft uns zu verstehen, wie sich Ihr Erleben verändert hat.',
    button: 'Meine Reise öffnen',
    resetSubject: 'Inner Calm · Passwort zurücksetzen',
    resetBody: 'Es wurde angefragt, das Passwort Ihres Inner-Calm-Kontos zurückzusetzen. Dieser Link ist eine Stunde gültig. Falls Sie das nicht waren, ignorieren Sie diese E-Mail einfach.',
    resetButton: 'Neues Passwort wählen',
    footer: 'Inner-Calm-Studie · Buchinger Wilhelmi',
  },
  fr: {
    dailySubject: (n) => `Inner Calm · Jour ${n} : votre journal du jour est ouvert`,
    dailyBody: (n) => `Bonjour,<br><br>Votre journal du <b>jour ${n}</b> est maintenant ouvert. Prenez 90 secondes ce soir pour y répondre, en pensant à votre journée.`,
    endSubject: 'Inner Calm · Votre questionnaire de clôture',
    endBody: 'Votre séjour touche à sa fin. Merci pour votre participation ! Un dernier questionnaire, un peu plus long, vous attend – il nous aide à comprendre comment votre expérience a évolué.',
    button: 'Ouvrir mon parcours',
    resetSubject: 'Inner Calm · Réinitialiser votre mot de passe',
    resetBody: "Une demande de réinitialisation du mot de passe de votre compte Inner Calm a été faite. Ce lien est valable une heure. Si vous n'êtes pas à l'origine de cette demande, ignorez simplement cet e-mail.",
    resetButton: 'Choisir un nouveau mot de passe',
    footer: 'Étude Inner Calm · Buchinger Wilhelmi',
  },
  es: {
    dailySubject: (n) => `Inner Calm · Día ${n}: su diario de hoy está abierto`,
    dailyBody: (n) => `Buenos días:<br><br>Su diario del <b>día ${n}</b> ya está abierto. Dedique 90 segundos esta noche a responderlo, pensando en cómo ha ido su día.`,
    endSubject: 'Inner Calm · Su cuestionario final',
    endBody: 'Su estancia llega a su fin. ¡Gracias por participar! Le espera un último cuestionario, algo más largo, que nos ayuda a entender cómo ha cambiado su experiencia.',
    button: 'Abrir mi recorrido',
    resetSubject: 'Inner Calm · Restablecer su contraseña',
    resetBody: 'Se ha solicitado restablecer la contraseña de su cuenta Inner Calm. Este enlace es válido durante una hora. Si no lo ha solicitado usted, ignore este correo.',
    resetButton: 'Elegir una nueva contraseña',
    footer: 'Estudio Inner Calm · Buchinger Wilhelmi',
  },
};
const t = (lang) => T[lang] || T.en;

function layout(bodyHtml, buttonLabel, link, footer) {
  return `<!doctype html><html><body style="margin:0;background:#f5f1ea;font-family:Helvetica,Arial,sans-serif;color:#2b2a28">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:32px 16px">
  <table role="presentation" width="100%" style="max-width:520px;background:#ffffff;border-radius:14px" cellpadding="0" cellspacing="0">
  <tr><td style="padding:32px 32px 8px;font-size:13px;letter-spacing:.14em;text-transform:uppercase;color:#4f6b58">Inner Calm</td></tr>
  <tr><td style="padding:8px 32px 8px;font-size:16px;line-height:1.6">${bodyHtml}</td></tr>
  <tr><td style="padding:24px 32px 32px"><a href="${link}" style="display:inline-block;background:#3f5a48;color:#ffffff;text-decoration:none;padding:13px 22px;border-radius:999px;font-size:15px">${buttonLabel}</a></td></tr>
  </table>
  <p style="font-size:12px;color:#8a857c;margin:16px 0 0">${footer}</p>
  </td></tr></table></body></html>`;
}

async function send({ userId, to, type, subject, html, link }) {
  if (!transport) {
    logStmt.run(userId, to, type, subject, 'logged', null, link);
    console.log(`[mail:not-sent] ${to} · ${subject} · ${link}`);
    return 'logged';
  }
  try {
    await transport.sendMail({ from: MAIL_FROM, to, subject, html });
    logStmt.run(userId, to, type, subject, 'sent', null, link);
    return 'sent';
  } catch (err) {
    logStmt.run(userId, to, type, subject, 'failed', String(err.message || err), link);
    console.error('[mail:failed]', to, err.message);
    return 'failed';
  }
}

export function sendQuestionnaireEmail(user, inst) {
  const L = t(user.language);
  const link = `${APP_URL}/#/journey`;
  const isEnd = inst.slot === 'end';
  const subject = isEnd ? L.endSubject : L.dailySubject(inst.day_number);
  const body = isEnd ? L.endBody : L.dailyBody(inst.day_number);
  return send({ userId: user.id, to: user.email, type: 'questionnaire', subject, html: layout(body, L.button, link, L.footer), link });
}

export function sendResetEmail(user, token) {
  const L = t(user.language);
  const link = `${APP_URL}/#/reset/${token}`;
  return send({ userId: user.id, to: user.email, type: 'password_reset', subject: L.resetSubject, html: layout(L.resetBody, L.resetButton, link, L.footer), link });
}
