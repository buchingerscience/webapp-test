// Random allocation to the two study arms.
//
//   meditation — daily practice (theme, excerpt, 15–20 min seated meditation) + evening journal
//   control    — evening journal only (no meditation guidance)
//
// Permuted blocks of random size (2 or 4), stratified by clinic, so the arms stay balanced
// within each clinic and the next allocation cannot be predicted. Allocation happens on the
// server, after the baseline questionnaire, and every allocation is kept in
// allocation_sequence for auditing.
import crypto from 'node:crypto';
import { db, nowIso } from './db.js';

export const ARMS = ['meditation', 'control'];

function shuffled(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = crypto.randomInt(i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Must be called inside a transaction. Returns 'meditation' | 'control'. */
export function allocate(userId, clinic) {
  let row = db.prepare('SELECT * FROM allocation_sequence WHERE clinic = ? AND user_id IS NULL ORDER BY id LIMIT 1').get(clinic);
  if (!row) {
    const block = (db.prepare('SELECT MAX(block) AS b FROM allocation_sequence WHERE clinic = ?').get(clinic).b || 0) + 1;
    const size = crypto.randomInt(2) === 0 ? 2 : 4;
    const arms = shuffled(Array.from({ length: size }, (_, i) => ARMS[i % 2]));
    const ins = db.prepare('INSERT INTO allocation_sequence (clinic, block, position, arm) VALUES (?, ?, ?, ?)');
    arms.forEach((arm, i) => ins.run(clinic, block, i + 1, arm));
    row = db.prepare('SELECT * FROM allocation_sequence WHERE clinic = ? AND user_id IS NULL ORDER BY id LIMIT 1').get(clinic);
  }
  db.prepare('UPDATE allocation_sequence SET user_id = ?, used_at = ? WHERE id = ?').run(userId, nowIso(), row.id);
  return row.arm;
}
