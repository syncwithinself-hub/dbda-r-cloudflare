-- DBDA-R candidate submissions table (Cloudflare D1 / SQLite)
CREATE TABLE IF NOT EXISTS dbda_responses (
  id                INTEGER PRIMARY KEY AUTOINCREMENT,
  created_at        TEXT NOT NULL DEFAULT (datetime('now')),
  attempt_id        TEXT NOT NULL UNIQUE,
  session_id        TEXT,
  session_code      TEXT,
  candidate_name    TEXT,
  candidate_id      TEXT,
  candidate_age     TEXT,
  candidate_sex     TEXT,
  candidate_occupation TEXT,
  candidate_email   TEXT,      -- as typed into the form
  verified_email    TEXT,      -- from Cloudflare Access (authoritative identity)
  candidate_mobile  TEXT,
  examination_date  TEXT,
  norm_group        TEXT,
  norm_class        TEXT,
  norm_sex          TEXT,
  status            TEXT,
  submitted_at      TEXT,
  tab_focus_loss    INTEGER,
  app_version       TEXT,
  scores_json       TEXT,      -- {CA:{raw,sten,band,flag,note}, CL:{...}, ...}
  responses_json    TEXT,
  manual_raw_json   TEXT,
  validity_flags_json TEXT,
  examiner_notes_json TEXT
);

CREATE INDEX IF NOT EXISTS idx_dbda_responses_email ON dbda_responses(verified_email);
CREATE INDEX IF NOT EXISTS idx_dbda_responses_created ON dbda_responses(created_at);
