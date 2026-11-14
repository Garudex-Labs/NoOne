-- NoOne 0.1.0: migration 0001, cron_incidents component.
-- Applied once inside the owning database transaction.


-- Tables and relationships.

CREATE TABLE cron_incidents (
             id            TEXT PRIMARY KEY,
             job_id        TEXT NOT NULL,
             error_sig     TEXT NOT NULL,
             state         TEXT NOT NULL,
             failure_type  TEXT NOT NULL DEFAULT 'unknown',
             first_seen_at TEXT NOT NULL,
             last_seen_at  TEXT NOT NULL,
             acked_at      TEXT,
             alerted_at    TEXT,
             closed_at     TEXT,
             error         TEXT NOT NULL,
             output_file   TEXT
           );

-- Indexes.

CREATE INDEX idx_cron_incidents_job ON cron_incidents(job_id);

CREATE INDEX idx_cron_incidents_state ON cron_incidents(state);
