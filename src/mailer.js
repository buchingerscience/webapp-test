// Email sending through any SMTP service (Brevo: smtp-relay.brevo.com:587).
// If SMTP is not configured, emails are only written to the email_log table
// (visible in the admin page) — handy for testing before Brevo is set up.
import nodemailer from 'nodemailer';
import { db } from './db.js';
import { practiceFor, minutesText } from '../shared/programme.js';

const { SMTP_HOST, SMTP_PORT = '587', SMTP_USER, SMTP_PASS } = process.env;
const MAIL_FROM = process.env.MAIL_FROM || 'Inner Calm Study <study@buchinger-science.com>';
// Where participants' replies go (e.g. a Gmail inbox the team reads)
const MAIL_REPLY_TO = process.env.MAIL_REPLY_TO || undefined;
export const APP_URL = (process.env.APP_URL || 'http://localhost:3000').replace(/\/$/, '');

const transport = SMTP_HOST
  ? nodemailer.createTransport({ host: SMTP_HOST, port: Number(SMTP_PORT), secure: Number(SMTP_PORT) === 465, auth: { user: SMTP_USER, pass: SMTP_PASS } })
  : null;
export const smtpConfigured = Boolean(transport);

const logStmt = db.prepare(`INSERT INTO email_log (user_id, to_email, type, subject, status, error, link) VALUES (?, ?, ?, ?, ?, ?, ?)`);

// ---------- texts ----------
const T = {
  en: {
    reinforcement: 'Reinforcement',
    dailySubject: (n, title) => title ? `Inner Calm · Day ${n} — ${title}` : `Inner Calm · Day ${n}: your daily journal is open`,
    dailyBody: (n, title, min) => title
      ? `Good morning,<br><br>Your moment of stillness for <b>day ${n}</b> is ready: <b>${title}</b>, ${min}. Return to it as often as you can today: every wait is an opportunity.<br><br>This evening, take 2 minutes for your journal.`
      : `Good morning,<br><br>Your journal for <b>day ${n}</b> is now open. Take 2 minutes this evening to answer it — thinking about how your day went.`,
    endSubject: 'Inner Calm · Your closing questionnaire',
    endBody: 'Your stay is coming to an end. Thank you for taking part! A slightly longer questionnaire is waiting for you — it helps us understand how your experience has changed.',
    followSubject: "Inner Calm · One week later: how are you?",
    followBody: "Hello,<br><br>It is now one week since you left the clinic. We hope your return home went well.<br><br>One last questionnaire is waiting for you: the same questions as at the start and at the end of your stay, so we can see how you are doing now. It takes a few minutes and can be answered over the next seven days.<br><br>Thank you for taking part in Inner Calm.",
    button: 'Open my journey',
    resetSubject: 'Inner Calm · Reset your password',
    resetBody: 'Someone (hopefully you) asked to reset the password of your Inner Calm account. This link is valid for one hour. If you did not ask for it, simply ignore this email.',
    resetButton: 'Choose a new password',
    footer: 'Inner Calm study · Buchinger',
  },
  de: {
    reinforcement: 'Festigung',
    dailySubject: (n, title) => title ? `Inner Calm · Tag ${n} — ${title}` : `Inner Calm · Tag ${n}: Ihr Tagesjournal ist geöffnet`,
    dailyBody: (n, title, min) => title
      ? `Guten Morgen,<br><br>Ihr Moment der Stille für <b>Tag ${n}</b> ist bereit: <b>${title}</b>, ${min}. Kehren Sie heute so oft wie möglich dazu zurück: Jedes Warten ist eine Gelegenheit.<br><br>Heute Abend nehmen Sie sich 2 Minuten für Ihr Journal.`
      : `Guten Morgen,<br><br>Ihr Journal für <b>Tag ${n}</b> ist jetzt geöffnet. Nehmen Sie sich heute Abend 2 Minuten Zeit und denken Sie dabei an Ihren Tag.`,
    endSubject: 'Inner Calm · Ihr Abschlussfragebogen',
    endBody: 'Ihr Aufenthalt geht zu Ende. Vielen Dank für Ihre Teilnahme! Ein etwas längerer Fragebogen wartet auf Sie – er hilft uns zu verstehen, wie sich Ihr Erleben verändert hat.',
    followSubject: "Inner Calm · Eine Woche später: Wie geht es Ihnen?",
    followBody: "Guten Tag,<br><br>Seit Ihrer Abreise ist nun eine Woche vergangen. Wir hoffen, Sie sind gut wieder zu Hause angekommen.<br><br>Ein letzter Fragebogen wartet auf Sie: dieselben Fragen wie zu Beginn und am Ende Ihres Aufenthalts, damit wir sehen können, wie es Ihnen jetzt geht. Er dauert nur wenige Minuten und kann in den nächsten sieben Tagen beantwortet werden.<br><br>Vielen Dank für Ihre Teilnahme an Inner Calm.",
    button: 'Meine Reise öffnen',
    resetSubject: 'Inner Calm · Passwort zurücksetzen',
    resetBody: 'Es wurde angefragt, das Passwort Ihres Inner-Calm-Kontos zurückzusetzen. Dieser Link ist eine Stunde gültig. Falls Sie das nicht waren, ignorieren Sie diese E-Mail einfach.',
    resetButton: 'Neues Passwort wählen',
    footer: 'Inner-Calm-Studie · Buchinger',
  },
  fr: {
    reinforcement: 'Consolidation',
    dailySubject: (n, title) => title ? `Inner Calm · Jour ${n} — ${title}` : `Inner Calm · Jour ${n} : votre journal du jour est ouvert`,
    dailyBody: (n, title, min) => title
      ? `Bonjour,<br><br>Votre instant de quiétude du <b>jour ${n}</b> est prêt : <b>${title}</b>, ${min}. Revenez-y aussi souvent que possible aujourd’hui : chaque attente est une occasion.<br><br>Ce soir, prenez 2 minutes pour votre journal.`
      : `Bonjour,<br><br>Votre journal du <b>jour ${n}</b> est maintenant ouvert. Prenez 2 minutes ce soir pour y répondre, en pensant à votre journée.`,
    endSubject: 'Inner Calm · Votre questionnaire de clôture',
    endBody: 'Votre séjour touche à sa fin. Merci pour votre participation ! Un questionnaire un peu plus long vous attend – il nous aide à comprendre comment votre expérience a évolué.',
    followSubject: "Inner Calm · Une semaine plus tard : comment allez-vous ?",
    followBody: "Bonjour,<br><br>Cela fait maintenant une semaine que vous avez quitté la clinique. Nous espérons que votre retour s’est bien passé.<br><br>Un dernier questionnaire vous attend : les mêmes questions qu’au début et à la fin de votre séjour, pour voir comment vous allez aujourd’hui. Il ne prend que quelques minutes et peut être rempli au cours des sept prochains jours.<br><br>Merci de votre participation à Inner Calm.",
    button: 'Ouvrir mon parcours',
    resetSubject: 'Inner Calm · Réinitialiser votre mot de passe',
    resetBody: "Une demande de réinitialisation du mot de passe de votre compte Inner Calm a été faite. Ce lien est valable une heure. Si vous n'êtes pas à l'origine de cette demande, ignorez simplement cet e-mail.",
    resetButton: 'Choisir un nouveau mot de passe',
    footer: 'Étude Inner Calm · Buchinger',
  },
  es: {
    reinforcement: 'Refuerzo',
    dailySubject: (n, title) => title ? `Inner Calm · Día ${n} — ${title}` : `Inner Calm · Día ${n}: su diario de hoy está abierto`,
    dailyBody: (n, title, min) => title
      ? `Buenos días:<br><br>Su momento de quietud del <b>día ${n}</b> está listo: <b>${title}</b>, ${min}. Vuelva a él hoy tantas veces como pueda: cada espera es una oportunidad.<br><br>Esta noche, dedique 2 minutos a su diario.`
      : `Buenos días:<br><br>Su diario del <b>día ${n}</b> ya está abierto. Dedique 2 minutos esta noche a responderlo, pensando en cómo ha ido su día.`,
    endSubject: 'Inner Calm · Su cuestionario final',
    endBody: 'Su estancia llega a su fin. ¡Gracias por participar! Le espera un cuestionario algo más largo, que nos ayuda a entender cómo ha cambiado su experiencia.',
    followSubject: "Inner Calm · Una semana después: ¿cómo se encuentra?",
    followBody: "Hola:<br><br>Ya ha pasado una semana desde que dejó la clínica. Esperamos que su regreso a casa haya ido bien.<br><br>Le espera un último cuestionario: las mismas preguntas que al principio y al final de su estancia, para ver cómo se encuentra ahora. Solo le llevará unos minutos y puede responderlo en los próximos siete días.<br><br>Gracias por participar en Inner Calm.",
    button: 'Abrir mi recorrido',
    resetSubject: 'Inner Calm · Restablecer su contraseña',
    resetBody: 'Se ha solicitado restablecer la contraseña de su cuenta Inner Calm. Este enlace es válido durante una hora. Si no lo ha solicitado usted, ignore este correo.',
    resetButton: 'Elegir una nueva contraseña',
    footer: 'Estudio Inner Calm · Buchinger',
  },
};
const t = (lang) => T[lang] || T.en;

function layout(bodyHtml, buttonLabel, link, footer) {
  // Email clients can't load the brand fonts, so the CI system fonts stand in: Helvetica for Neuf, Palatino for Arizona Flare.
  const neuf = 'Helvetica,Arial,sans-serif', arizona = "Palatino,'Palatino Linotype','Book Antiqua',Georgia,serif";
  return `<!doctype html><html><body style="margin:0;background:#fcfaf2;font-family:${arizona};color:#000051">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:32px 16px">
  <img src="${APP_URL}/logo-email.png" width="170" alt="BUCHINGER" style="display:block;margin:0 auto 24px;border:0;width:170px;height:auto">
  <table role="presentation" width="100%" style="max-width:520px;background:#ffffff;border-radius:14px" cellpadding="0" cellspacing="0">
  <tr><td style="padding:32px 32px 8px;font-family:${neuf};font-size:11px;font-weight:bold;letter-spacing:.26em;text-transform:uppercase;color:#3859b3">Inner Calm</td></tr>
  <tr><td style="padding:8px 32px 8px;font-size:17px;line-height:1.6">${bodyHtml}</td></tr>
  <tr><td style="padding:24px 32px 32px"><a href="${link}" style="display:inline-block;background:#000051;color:#fcfaf2;text-decoration:none;padding:13px 22px;border-radius:999px;font-family:${neuf};font-size:13px;letter-spacing:.14em;text-transform:uppercase">${buttonLabel}</a></td></tr>
  </table>
  <p style="font-size:12px;color:#5d5d82;margin:16px 0 0">${footer}</p>
  </td></tr></table></body></html>`;
}

async function send({ userId, to, type, subject, html, link }) {
  if (!transport) {
    logStmt.run(userId, to, type, subject, 'logged', null, link);
    console.log(`[mail:not-sent] ${to} · ${subject} · ${link}`);
    return 'logged';
  }
  try {
    await transport.sendMail({ from: MAIL_FROM, replyTo: MAIL_REPLY_TO, to, subject, html });
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
  if (inst.slot === 'followup') {
    return send({ userId: user.id, to: user.email, type: 'questionnaire', subject: L.followSubject, html: layout(L.followBody, L.button, link, L.footer), link });
  }
  const p = isEnd ? null : practiceFor(inst.day_number, inst.total_days || 0);
  const base = p ? (p.title[user.language] || p.title.en) : '';
  const title = p?.reinforcement ? `${L.reinforcement} · ${base}` : base;
  const subject = isEnd ? L.endSubject : L.dailySubject(inst.day_number, title);
  const body = isEnd ? L.endBody : L.dailyBody(inst.day_number, title, p ? minutesText(T[user.language] ? user.language : 'en', p.minutes) : '');
  return send({ userId: user.id, to: user.email, type: 'questionnaire', subject, html: layout(body, L.button, link, L.footer), link });
}

export function sendResetEmail(user, token) {
  const L = t(user.language);
  const link = `${APP_URL}/#/reset/${token}`;
  return send({ userId: user.id, to: user.email, type: 'password_reset', subject: L.resetSubject, html: layout(L.resetBody, L.resetButton, link, L.footer), link });
}
