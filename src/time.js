// All study dates are clinic-local calendar dates (YYYY-MM-DD) in STUDY_TZ.
// Using Intl keeps this correct across summer/winter time changes.
export const STUDY_TZ = process.env.STUDY_TZ || 'Europe/Berlin';
export const OPEN_HOUR = Number(process.env.OPEN_HOUR ?? 6);

const fmt = new Intl.DateTimeFormat('en-CA', {
  timeZone: STUDY_TZ, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', hourCycle: 'h23',
});

/** { date: 'YYYY-MM-DD', hour: 0..23 } in the study time zone. */
export function localNow(d = new Date()) {
  const p = Object.fromEntries(fmt.formatToParts(d).map((x) => [x.type, x.value]));
  return { date: `${p.year}-${p.month}-${p.day}`, hour: Number(p.hour) };
}

export function addDays(dateStr, n) {
  const d = new Date(`${dateStr}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}

export function daysBetween(a, b) {
  return Math.round((new Date(`${b}T00:00:00Z`) - new Date(`${a}T00:00:00Z`)) / 86400000);
}

export const isDate = (s) => typeof s === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(s) && !Number.isNaN(new Date(`${s}T00:00:00Z`).getTime());

/** Has a questionnaire with this open_date opened yet? */
export function hasOpened(openDate, now = localNow()) {
  return openDate < now.date || (openDate === now.date && now.hour >= OPEN_HOUR);
}

export function statusOf(inst, now = localNow()) {
  if (inst.completed_at) return 'done';
  if (!hasOpened(inst.open_date, now)) return 'locked';
  if (now.date <= inst.close_date) return 'open';
  return 'missed';
}
