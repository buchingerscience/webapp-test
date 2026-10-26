// Runs every minute. From OPEN_HOUR (06:00) onwards, sends one email for each
// questionnaire that opens today. Each email is recorded on the questionnaire
// (email_status), so a restart never sends the same email twice. If the server
// was down on a given day, that day's email is skipped rather than sent late.
import { db, nowIso } from './db.js';
import { localNow, OPEN_HOUR } from './time.js';
import { sendQuestionnaireEmail } from './mailer.js';

let running = false;

export async function tick() {
  if (running) return;
  running = true;
  try {
    const now = localNow();
    db.prepare(`UPDATE instances SET email_status = 'skipped' WHERE email_status = 'pending' AND open_date < ?`).run(now.date);
    if (now.hour < OPEN_HOUR) return;

    const due = db.prepare(`
      SELECT i.*, u.email, u.language, s.arm,
        (SELECT COUNT(*) FROM instances x WHERE x.user_id = i.user_id AND x.kind = 'Q2') AS total_days
      FROM instances i JOIN users u ON u.id = i.user_id LEFT JOIN stays s ON s.user_id = i.user_id
      WHERE i.email_status = 'pending' AND i.open_date = ? AND i.completed_at IS NULL`).all(now.date);

    for (const inst of due) {
      // Claim first so a concurrent run can never double-send
      const claimed = db.prepare(`UPDATE instances SET email_status = 'sending' WHERE id = ? AND email_status = 'pending'`).run(inst.id);
      if (!claimed.changes) continue;
      const result = await sendQuestionnaireEmail({ id: inst.user_id, email: inst.email, language: inst.language }, inst);
      db.prepare(`UPDATE instances SET email_status = ?, email_sent_at = ? WHERE id = ?`).run(result, nowIso(), inst.id);
    }
  } catch (err) {
    console.error('[scheduler]', err);
  } finally {
    running = false;
  }
}

export function startScheduler() {
  // Recover anything left mid-send by a crash
  db.prepare(`UPDATE instances SET email_status = 'pending' WHERE email_status = 'sending'`).run();
  tick();
  setInterval(tick, 60 * 1000);
}
