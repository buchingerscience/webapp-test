// Builds a participant's journey from their arrival/departure dates.
//
// Day numbering (see README → "Study timeline"):
//   D1 = arrival day … Dn = the day before departure  → one daily questionnaire (Q2) per night spent
//   Departure day                                    → closing questionnaire (Q1 'end')
// Each Q2 opens at OPEN_HOUR on its day and can be answered until the end of the stay (departure day).
// The closing Q1 opens on departure day and stays open for END_GRACE_DAYS more days.
import { db } from './db.js';
import { addDays, daysBetween, hasOpened, localNow } from './time.js';

export const END_GRACE_DAYS = 7;
export const MAX_STAY_DAYS = 35;

export function plannedSlots(arrival, departure) {
  const n = daysBetween(arrival, departure);
  const slots = [];
  for (let i = 0; i < n; i++) {
    slots.push({ kind: 'Q2', slot: `D${i + 1}`, day_number: i + 1, open_date: addDays(arrival, i), close_date: departure });
  }
  slots.push({ kind: 'Q1', slot: 'end', day_number: null, open_date: departure, close_date: addDays(departure, END_GRACE_DAYS) });
  return slots;
}

const insert = db.prepare(`INSERT OR IGNORE INTO instances (user_id, kind, slot, day_number, open_date, close_date, email_status)
                           VALUES (@user_id, @kind, @slot, @day_number, @open_date, @close_date, @email_status)`);

/**
 * (Re)create the unanswered part of a journey. Answered questionnaires are never touched.
 * Questionnaires that are already open at creation time get no email (the person is in the app now).
 */
export const rebuildSchedule = db.transaction((userId, arrival, departure) => {
  db.prepare(`DELETE FROM instances WHERE user_id = ? AND slot <> 'baseline' AND completed_at IS NULL`).run(userId);
  const now = localNow();
  for (const s of plannedSlots(arrival, departure)) {
    insert.run({ user_id: userId, ...s, email_status: hasOpened(s.open_date, now) ? 'skipped' : 'pending' });
  }
});
