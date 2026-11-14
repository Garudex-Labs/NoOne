-- NoOne 0.1.0: migration 0001, cron_delivery component.
-- Applied once inside the owning database transaction.


-- Tables and relationships.

CREATE TABLE deliveries (
             execution_id TEXT PRIMARY KEY,
             job_json TEXT NOT NULL,
             content TEXT NOT NULL,
             for_failure INTEGER NOT NULL DEFAULT 0,
             status TEXT NOT NULL CHECK(status IN
               ('pending','delivering','delivered','failed','unknown','suppressed')),
             owner_process_id TEXT,
             owner_pid INTEGER,
             owner_started_at INTEGER,
             created_at TEXT NOT NULL,
             finished_at TEXT,
             error TEXT
           );

CREATE TABLE delivery_tombstones (
             execution_id TEXT PRIMARY KEY,
             terminal_status TEXT NOT NULL CHECK(terminal_status IN
               ('delivered','failed','unknown','suppressed')),
             finished_at TEXT
           );
