import ExcelJS from 'exceljs';
import { db } from './db.js';
import { itemsOf } from '../shared/questionnaires.js';
import { statusOf, localNow } from './time.js';

const mean = (vals) => {
  const v = vals.filter((x) => typeof x === 'number');
  return v.length === vals.length && v.length ? +(v.reduce((a, b) => a + b, 0) / v.length).toFixed(3) : null;
};
const sum = (vals) => (vals.every((x) => typeof x === 'number') ? vals.reduce((a, b) => a + b, 0) : null);

function sheet(wb, name, columns, rows) {
  const ws = wb.addWorksheet(name);
  ws.columns = columns.map((c) => ({ header: c, key: c, width: Math.max(12, c.length + 2) }));
  rows.forEach((r) => ws.addRow(r));
  ws.getRow(1).font = { bold: true };
  ws.views = [{ state: 'frozen', ySplit: 1 }];
}

export async function buildWorkbook() {
  const wb = new ExcelJS.Workbook();
  wb.created = new Date();
  const now = localNow();

  const users = db.prepare(`
    SELECT u.id, u.participant_code, u.email, u.language, u.created_at, u.consent_at, s.clinic, s.arrival_date, s.departure_date
    FROM users u LEFT JOIN stays s ON s.user_id = u.id ORDER BY u.id`).all();
  const codeOf = Object.fromEntries(users.map((u) => [u.id, u.participant_code]));
  const instances = db.prepare(`SELECT * FROM instances ORDER BY user_id, open_date, id`).all();
  const doneCount = {};
  instances.forEach((i) => { if (i.completed_at) doneCount[i.user_id] = (doneCount[i.user_id] || 0) + 1; });

  // 1. Participants — the only sheet with email addresses
  sheet(wb, 'participants',
    ['participant_code', 'email', 'language', 'clinic', 'arrival_date', 'departure_date', 'registered_at', 'consent_at', 'questionnaires_completed', 'questionnaires_planned'],
    users.map((u) => ({
      ...u, registered_at: u.created_at,
      questionnaires_completed: doneCount[u.id] || 0,
      questionnaires_planned: instances.filter((i) => i.user_id === u.id).length,
    })));

  // 2. Q1 — baseline and end of stay (pseudonymised)
  const q1Items = itemsOf('Q1').map((i) => i.id);
  sheet(wb, 'Q1_baseline_end',
    ['participant_code', 'timepoint', 'completed_at', ...q1Items, 'who5_raw_0_25', 'who5_percent_0_100', 'meaning_purpose_sum_0_20', 'growth_mean_0_5'],
    instances.filter((i) => i.kind === 'Q1' && i.completed_at).map((i) => {
      const a = JSON.parse(i.answers_json);
      const who = sum(['who5_1', 'who5_2', 'who5_3', 'who5_4', 'who5_5'].map((k) => a[k]));
      return {
        participant_code: codeOf[i.user_id], timepoint: i.slot, completed_at: i.completed_at,
        ...Object.fromEntries(q1Items.map((k) => [k, a[k]])),
        who5_raw_0_25: who, who5_percent_0_100: who === null ? null : who * 4,
        meaning_purpose_sum_0_20: sum(['mp_1', 'mp_2', 'mp_3', 'mp_4'].map((k) => a[k])),
        growth_mean_0_5: mean(['growth_1', 'growth_2', 'growth_3'].map((k) => a[k])),
      };
    }));

  // 3. Q2 — daily pulse
  const q2Items = itemsOf('Q2').map((i) => i.id);
  sheet(wb, 'Q2_daily',
    ['participant_code', 'day', 'date', 'completed_at', ...q2Items, 'clarity_mean_0_5', 'positive_mean_0_10'],
    instances.filter((i) => i.kind === 'Q2' && i.completed_at).map((i) => {
      const a = JSON.parse(i.answers_json);
      return {
        participant_code: codeOf[i.user_id], day: i.day_number, date: i.open_date, completed_at: i.completed_at,
        ...Object.fromEntries(q2Items.map((k) => [k, a[k]])),
        clarity_mean_0_5: mean(['clarity_1', 'clarity_2', 'clarity_3'].map((k) => a[k])),
        positive_mean_0_10: mean(['perma_1', 'perma_2', 'perma_3'].map((k) => a[k])),
      };
    }));

  // 4. Schedule — every planned questionnaire, with status (for completion / feasibility analysis)
  sheet(wb, 'schedule',
    ['participant_code', 'kind', 'slot', 'day', 'open_date', 'close_date', 'status', 'email_status', 'email_sent_at', 'completed_at'],
    instances.map((i) => ({
      participant_code: codeOf[i.user_id], kind: i.kind, slot: i.slot, day: i.day_number, open_date: i.open_date,
      close_date: i.close_date, status: statusOf(i, now), email_status: i.email_status, email_sent_at: i.email_sent_at, completed_at: i.completed_at,
    })));

  return wb;
}
