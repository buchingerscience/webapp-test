import express from 'express';
import bcrypt from 'bcryptjs';
import crypto from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { db, nowIso, DB_PATH } from './src/db.js';
import { localNow, statusOf, isDate, daysBetween, OPEN_HOUR, STUDY_TZ } from './src/time.js';
import { rebuildSchedule, MAX_STAY_DAYS } from './src/schedule.js';
import { sendResetEmail, smtpConfigured, APP_URL } from './src/mailer.js';
import { startScheduler, tick } from './src/scheduler.js';
import { buildWorkbook } from './src/export.js';
import { validateAnswers, LANGS, CLINICS } from './shared/questionnaires.js';

const PORT = Number(process.env.PORT || 3000);
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '';
const SECURE_COOKIES = APP_URL.startsWith('https://');
const SESSION_DAYS = 60;

const app = express();
app.set('trust proxy', 1);
app.use(express.json({ limit: '100kb' }));
app.use((req, res, next) => {
  res.set('X-Content-Type-Options', 'nosniff');
  next();
});

// ---------- helpers ----------
const sha256 = (s) => crypto.createHash('sha256').update(s).digest('hex');
const token = () => crypto.randomBytes(32).toString('hex');
const lang = (l) => (LANGS.includes(l) ? l : 'en');
const fail = (res, status, error) => res.status(status).json({ error });

function cookies(req) {
  return Object.fromEntries((req.headers.cookie || '').split(';').filter(Boolean).map((c) => {
    const i = c.indexOf('=');
    return [c.slice(0, i).trim(), decodeURIComponent(c.slice(i + 1).trim())];
  }));
}
function setCookie(res, name, value, days) {
  const parts = [`${name}=${encodeURIComponent(value)}`, 'Path=/', 'HttpOnly', 'SameSite=Lax', `Max-Age=${Math.round(days * 86400)}`];
  if (SECURE_COOKIES) parts.push('Secure');
  res.append('Set-Cookie', parts.join('; '));
}

// Very small in-memory rate limiter for login / reset endpoints
const hits = new Map();
function limit(max, windowMs) {
  return (req, res, next) => {
    const key = `${req.path}|${req.ip}`;
    const now = Date.now();
    const arr = (hits.get(key) || []).filter((t) => now - t < windowMs);
    arr.push(now);
    hits.set(key, arr);
    if (arr.length > max) return fail(res, 429, 'too_many_attempts');
    next();
  };
}

function startSession(res, userId) {
  const t = token();
  const expires = new Date(Date.now() + SESSION_DAYS * 86400000).toISOString();
  db.prepare('INSERT INTO sessions (token, user_id, expires_at) VALUES (?, ?, ?)').run(sha256(t), userId, expires);
  setCookie(res, 'ic_session', t, SESSION_DAYS);
}

function requireUser(req, res, next) {
  const t = cookies(req).ic_session;
  if (!t) return fail(res, 401, 'not_logged_in');
  const row = db.prepare(`SELECT u.* FROM sessions s JOIN users u ON u.id = s.user_id WHERE s.token = ? AND s.expires_at > ?`).get(sha256(t), nowIso());
  if (!row) return fail(res, 401, 'not_logged_in');
  req.user = row;
  next();
}

// Admin sessions are kept in memory (log in again after a redeploy)
const adminTokens = new Map();
function requireAdmin(req, res, next) {
  const t = cookies(req).ic_admin;
  const exp = t && adminTokens.get(sha256(t));
  if (!exp || exp < Date.now()) return fail(res, 401, 'admin_required');
  next();
}

function journey(userId) {
  const now = localNow();
  const stay = db.prepare('SELECT clinic, arrival_date, departure_date FROM stays WHERE user_id = ?').get(userId) || null;
  const rows = db.prepare(`SELECT id, kind, slot, day_number, open_date, close_date, completed_at FROM instances
                           WHERE user_id = ? ORDER BY CASE slot WHEN 'baseline' THEN 0 WHEN 'end' THEN 2 ELSE 1 END, day_number`).all(userId);
  return { stay, timeline: rows.map((r) => ({ ...r, status: statusOf(r, now) })), today: now.date, openHour: OPEN_HOUR };
}

// ---------- auth ----------
app.post('/api/register', limit(10, 15 * 60000), (req, res) => {
  const { email, password, consent, language } = req.body || {};
  const e = String(email || '').trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)) return fail(res, 400, 'invalid_email');
  if (String(password || '').length < 8) return fail(res, 400, 'password_too_short');
  if (consent !== true) return fail(res, 400, 'consent_required');
  if (db.prepare('SELECT 1 FROM users WHERE email = ?').get(e)) return fail(res, 409, 'email_taken');

  const info = db.prepare('INSERT INTO users (email, password_hash, language, consent_at) VALUES (?, ?, ?, ?)')
    .run(e, bcrypt.hashSync(String(password), 10), lang(language), nowIso());
  const code = `IC-${String(info.lastInsertRowid).padStart(4, '0')}`;
  db.prepare('UPDATE users SET participant_code = ? WHERE id = ?').run(code, info.lastInsertRowid);
  startSession(res, info.lastInsertRowid);
  res.json({ ok: true });
});

app.post('/api/login', limit(10, 15 * 60000), (req, res) => {
  const { email, password } = req.body || {};
  const u = db.prepare('SELECT * FROM users WHERE email = ?').get(String(email || '').trim().toLowerCase());
  if (!u || !bcrypt.compareSync(String(password || ''), u.password_hash)) return fail(res, 401, 'wrong_credentials');
  startSession(res, u.id);
  res.json({ ok: true, language: u.language });
});

app.post('/api/logout', (req, res) => {
  const t = cookies(req).ic_session;
  if (t) db.prepare('DELETE FROM sessions WHERE token = ?').run(sha256(t));
  setCookie(res, 'ic_session', '', 0);
  res.json({ ok: true });
});

app.post('/api/forgot', limit(5, 15 * 60000), async (req, res) => {
  const u = db.prepare('SELECT * FROM users WHERE email = ?').get(String(req.body?.email || '').trim().toLowerCase());
  if (u) {
    const t = token();
    db.prepare('INSERT INTO password_resets (token_hash, user_id, expires_at) VALUES (?, ?, ?)').run(sha256(t), u.id, new Date(Date.now() + 3600000).toISOString());
    await sendResetEmail(u, t);
  }
  res.json({ ok: true }); // same answer whether or not the email exists
});

app.post('/api/reset', limit(10, 15 * 60000), (req, res) => {
  const { token: t, password } = req.body || {};
  if (String(password || '').length < 8) return fail(res, 400, 'password_too_short');
  const r = db.prepare('SELECT * FROM password_resets WHERE token_hash = ? AND used_at IS NULL AND expires_at > ?').get(sha256(String(t || '')), nowIso());
  if (!r) return fail(res, 400, 'invalid_or_expired_link');
  db.transaction(() => {
    db.prepare('UPDATE users SET password_hash = ? WHERE id = ?').run(bcrypt.hashSync(String(password), 10), r.user_id);
    db.prepare('UPDATE password_resets SET used_at = ? WHERE token_hash = ?').run(nowIso(), r.token_hash);
    db.prepare('DELETE FROM sessions WHERE user_id = ?').run(r.user_id);
  })();
  startSession(res, r.user_id);
  res.json({ ok: true });
});

// ---------- participant ----------
app.get('/api/me', requireUser, (req, res) => {
  const u = req.user;
  res.json({ user: { email: u.email, code: u.participant_code, language: u.language }, ...journey(u.id) });
});

app.post('/api/language', requireUser, (req, res) => {
  db.prepare('UPDATE users SET language = ? WHERE id = ?').run(lang(req.body?.language), req.user.id);
  res.json({ ok: true });
});

app.post('/api/baseline', requireUser, (req, res) => {
  const { clinic, arrival_date: a, departure_date: d, answers } = req.body || {};
  if (db.prepare(`SELECT 1 FROM instances WHERE user_id = ? AND slot = 'baseline'`).get(req.user.id)) return fail(res, 409, 'already_completed');
  if (!CLINICS.some((c) => c.id === clinic)) return fail(res, 400, 'invalid_clinic');
  if (!isDate(a) || !isDate(d)) return fail(res, 400, 'invalid_dates');
  const n = daysBetween(a, d);
  if (n < 1 || n > MAX_STAY_DAYS) return fail(res, 400, 'invalid_dates');
  const v = validateAnswers('Q1', answers);
  if (!v.ok) return res.status(400).json({ error: 'incomplete', missing: v.errors });

  const today = localNow().date;
  db.transaction(() => {
    db.prepare('INSERT INTO stays (user_id, clinic, arrival_date, departure_date) VALUES (?, ?, ?, ?)').run(req.user.id, clinic, a, d);
    db.prepare(`INSERT INTO instances (user_id, kind, slot, open_date, close_date, email_status, completed_at, answers_json)
                VALUES (?, 'Q1', 'baseline', ?, ?, 'skipped', ?, ?)`).run(req.user.id, today, today, nowIso(), JSON.stringify(v.clean));
    rebuildSchedule(req.user.id, a, d);
  })();
  res.json({ ok: true, ...journey(req.user.id) });
});

app.get('/api/instances/:id', requireUser, (req, res) => {
  const i = db.prepare('SELECT * FROM instances WHERE id = ? AND user_id = ?').get(req.params.id, req.user.id);
  if (!i) return fail(res, 404, 'not_found');
  const status = statusOf(i);
  res.json({
    id: i.id, kind: i.kind, slot: i.slot, day_number: i.day_number, open_date: i.open_date, close_date: i.close_date,
    status, completed_at: i.completed_at, answers: i.completed_at ? JSON.parse(i.answers_json) : null,
  });
});

app.post('/api/instances/:id', requireUser, (req, res) => {
  const i = db.prepare('SELECT * FROM instances WHERE id = ? AND user_id = ?').get(req.params.id, req.user.id);
  if (!i) return fail(res, 404, 'not_found');
  const status = statusOf(i);
  if (status !== 'open') return fail(res, 409, `not_open_${status}`);
  const v = validateAnswers(i.kind, req.body?.answers);
  if (!v.ok) return res.status(400).json({ error: 'incomplete', missing: v.errors });
  const r = db.prepare('UPDATE instances SET completed_at = ?, answers_json = ? WHERE id = ? AND completed_at IS NULL').run(nowIso(), JSON.stringify(v.clean), i.id);
  if (!r.changes) return fail(res, 409, 'not_open_done');
  res.json({ ok: true, ...journey(req.user.id) });
});

// ---------- admin ----------
app.post('/api/admin/login', limit(10, 15 * 60000), (req, res) => {
  const p = String(req.body?.password || '');
  const ok = ADMIN_PASSWORD.length >= 8 && p.length === ADMIN_PASSWORD.length && crypto.timingSafeEqual(Buffer.from(p), Buffer.from(ADMIN_PASSWORD));
  if (!ok) return fail(res, 401, 'wrong_password');
  const t = token();
  adminTokens.set(sha256(t), Date.now() + 12 * 3600000);
  setCookie(res, 'ic_admin', t, 0.5);
  res.json({ ok: true });
});

app.get('/api/admin/overview', requireAdmin, (req, res) => {
  const now = localNow();
  const users = db.prepare(`SELECT u.id, u.participant_code, u.email, u.language, u.created_at, s.clinic, s.arrival_date, s.departure_date
                            FROM users u LEFT JOIN stays s ON s.user_id = u.id ORDER BY u.id DESC`).all();
  const inst = db.prepare('SELECT user_id, open_date, close_date, completed_at FROM instances').all();
  const per = {};
  inst.forEach((i) => {
    const p = (per[i.user_id] ||= { done: 0, missed: 0, planned: 0 });
    p.planned++;
    const s = statusOf(i, now);
    if (s === 'done') p.done++;
    if (s === 'missed') p.missed++;
  });
  const emails = db.prepare('SELECT id, to_email, type, subject, status, error, link, created_at FROM email_log ORDER BY id DESC LIMIT 100').all();
  res.json({
    users: users.map((u) => ({ ...u, ...(per[u.id] || { done: 0, missed: 0, planned: 0 }) })),
    emails, smtpConfigured, now, openHour: OPEN_HOUR, timeZone: STUDY_TZ,
  });
});

app.put('/api/admin/users/:id/stay', requireAdmin, (req, res) => {
  const { arrival_date: a, departure_date: d, clinic } = req.body || {};
  const stay = db.prepare('SELECT * FROM stays WHERE user_id = ?').get(req.params.id);
  if (!stay) return fail(res, 404, 'no_stay');
  if (!isDate(a) || !isDate(d)) return fail(res, 400, 'invalid_dates');
  const n = daysBetween(a, d);
  if (n < 1 || n > MAX_STAY_DAYS) return fail(res, 400, 'invalid_dates');
  db.transaction(() => {
    db.prepare(`UPDATE stays SET arrival_date = ?, departure_date = ?, clinic = COALESCE(?, clinic), updated_at = datetime('now') WHERE user_id = ?`)
      .run(a, d, CLINICS.some((c) => c.id === clinic) ? clinic : null, req.params.id);
    rebuildSchedule(Number(req.params.id), a, d);
  })();
  res.json({ ok: true });
});

app.get('/api/admin/export.xlsx', requireAdmin, async (req, res) => {
  const wb = await buildWorkbook();
  res.set('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.set('Content-Disposition', `attachment; filename="innercalm-export-${localNow().date}.xlsx"`);
  await wb.xlsx.write(res);
  res.end();
});

app.get('/api/admin/database.sqlite', requireAdmin, async (req, res) => {
  // Consistent snapshot even while the app is writing
  const tmp = path.join(os.tmpdir(), `innercalm-${Date.now()}.sqlite`);
  await db.backup(tmp);
  res.download(tmp, `innercalm-${localNow().date}.sqlite`, () => fs.unlink(tmp, () => {}));
});

app.post('/api/admin/run-scheduler', requireAdmin, async (req, res) => {
  await tick();
  res.json({ ok: true });
});

// ---------- static ----------
app.get('/health', (req, res) => res.json({ status: 'ok' }));
app.use('/shared', express.static(path.resolve('shared'), { maxAge: 0 }));
app.use(express.static(path.resolve('public'), { maxAge: 0, extensions: ['html'] }));

app.listen(PORT, () => {
  console.log(`Inner Calm listening on ${PORT} · db ${DB_PATH} · SMTP ${smtpConfigured ? 'on' : 'OFF (emails only logged)'} · ${STUDY_TZ} ${OPEN_HOUR}:00`);
  if (!ADMIN_PASSWORD) console.warn('ADMIN_PASSWORD is not set — the admin page is disabled.');
  startScheduler();
});
