-- NoOne 0.1.0: migration 0001, cron_executions component.
-- Applied once inside the owning database transaction.


-- Tables and relationships.

CREATE TABLE executions (
             id TEXT PRIMARY KEY,
             job_id TEXT NOT NULL,
             source TEXT NOT NULL,
             process_id TEXT NOT NULL,
             pid INTEGER NOT NULL,
             process_started_at INTEGER,
             status TEXT NOT NULL CHECK(status IN
               ('claimed','running','completed','failed','unknown','cancelled','missed')),
             handoff_pending INTEGER NOT NULL DEFAULT 0,
             handoff_started_at REAL,
             claimed_at TEXT NOT NULL,
             started_at TEXT,
             finished_at TEXT,
             error TEXT
           , delivery_outcome TEXT, scheduled_instant TEXT, progress_at TEXT);

-- Indexes.

CREATE INDEX idx_executions_job_claimed ON executions(job_id, claimed_at DESC, id DESC);

CREATE INDEX idx_executions_status_claimed ON executions(status, claimed_at DESC, id DESC);

CREATE INDEX idx_executions_occurrence ON executions(job_id, scheduled_instant) WHERE status='completed';
