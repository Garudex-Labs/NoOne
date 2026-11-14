-- NoOne 0.1.0: migration 0001, cron_notepad component.
-- Applied once inside the owning database transaction.


-- Tables and relationships.

CREATE TABLE cron_notepad (
             job_id TEXT NOT NULL,
             key TEXT NOT NULL,
             value TEXT NOT NULL,
             updated_at TEXT NOT NULL,
             PRIMARY KEY (job_id, key)
           );
