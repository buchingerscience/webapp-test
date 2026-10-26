import Database from 'better-sqlite3';
import fs from 'node:fs';
import path from 'node:path';

export const DATA_DIR = process.env.DATA_DIR || path.resolve('data');
fs.mkdirSync(DATA_DIR, { recursive: true });
export const DB_PATH = path.join(DATA_DIR, 'innercalm.sqlite');

export const db = new Database(DB_PATH);
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

db.exec(`
CREATE TABLE IF NOT EXISTS users (
  id               INTEGER PRIMARY KEY AUTOINCREMENT,
  participant_code TEXT UNIQUE,
  email            TEXT NOT NULL UNIQUE COLLATE NOCASE,
  password_hash    TEXT NOT NULL,
  language         TEXT NOT NULL DEFAULT 'en',
  consent_at       TEXT NOT NULL,
  created_at       TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS sessions (
  token      TEXT PRIMARY KEY,
  user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS password_resets (
  token_hash TEXT PRIMARY KEY,
  user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires_at TEXT NOT NULL,
  used_at    TEXT
);

-- One stay per participant (dates entered in the baseline questionnaire)
CREATE TABLE IF NOT EXISTS stays (
  user_id        INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  clinic         TEXT NOT NULL,
  arrival_date   TEXT NOT NULL,   -- YYYY-MM-DD (clinic local date)
  departure_date TEXT NOT NULL,
  updated_at     TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Every questionnaire a participant will see on their journey
CREATE TABLE IF NOT EXISTS instances (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id       INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  kind          TEXT NOT NULL,          -- 'Q1' | 'Q2'
  slot          TEXT NOT NULL,          -- 'baseline' | 'D1'..'Dn' | 'end'
  day_number    INTEGER,                -- 1..n for Q2
  open_date     TEXT NOT NULL,          -- opens at OPEN_HOUR local time on this date
  close_date    TEXT NOT NULL,          -- can be answered until the end of this date
  email_status  TEXT NOT NULL DEFAULT 'pending',  -- pending | sent | logged | skipped | failed
  email_sent_at TEXT,
  completed_at  TEXT,
  answers_json  TEXT,
  UNIQUE (user_id, slot)
);

CREATE TABLE IF NOT EXISTS email_log (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id    INTEGER,
  to_email   TEXT NOT NULL,
  type       TEXT NOT NULL,     -- questionnaire | password_reset
  subject    TEXT NOT NULL,
  status     TEXT NOT NULL,     -- sent | logged (no SMTP configured) | failed
  error      TEXT,
  link       TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
`);

// Randomisation (added later — migrate existing databases in place)
db.exec(`
CREATE TABLE IF NOT EXISTS allocation_sequence (
  id       INTEGER PRIMARY KEY AUTOINCREMENT,
  clinic   TEXT NOT NULL,
  block    INTEGER NOT NULL,
  position INTEGER NOT NULL,
  arm      TEXT NOT NULL,          -- 'meditation' | 'control'
  user_id  INTEGER UNIQUE,         -- filled when allocated
  used_at  TEXT
);
`);
const stayCols = db.prepare('PRAGMA table_info(stays)').all().map((c) => c.name);
if (!stayCols.includes('arm')) db.exec('ALTER TABLE stays ADD COLUMN arm TEXT');
if (!stayCols.includes('allocated_at')) db.exec('ALTER TABLE stays ADD COLUMN allocated_at TEXT');

export const nowIso = () => new Date().toISOString();
