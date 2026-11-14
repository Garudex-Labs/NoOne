-- NoOne 0.1.0: migration 0001, hosted_room_tasks component.
-- Applied once inside the owning database transaction.


-- Tables and relationships.

CREATE TABLE hosted_room_driver_leases (
            room_id TEXT PRIMARY KEY, gateway_id TEXT NOT NULL,
            authority_epoch INTEGER NOT NULL CHECK (authority_epoch >= 1), process_generation TEXT NOT NULL,
            lease_generation INTEGER NOT NULL CHECK (lease_generation >= 1),
            expires_at REAL NOT NULL, acquired_at REAL NOT NULL, updated_at REAL NOT NULL, released_at REAL,
            FOREIGN KEY (room_id) REFERENCES hosted_rooms(room_id));

CREATE TABLE hosted_room_driver_tasks (
            room_id TEXT NOT NULL, task_id TEXT NOT NULL, thread_id TEXT NOT NULL, turn_id TEXT NOT NULL,
            source_event_seq INTEGER NOT NULL CHECK (source_event_seq >= 1),
            payload_json TEXT NOT NULL, payload_digest TEXT NOT NULL,
            status TEXT NOT NULL CHECK (status IN (
                'queued', 'running', 'settled', 'failed', 'cancelled', 'indeterminate', 'deferred', 'stopping')),
            execution_generation INTEGER NOT NULL DEFAULT 0 CHECK (execution_generation >= 0),
            cancel_generation INTEGER NOT NULL DEFAULT 0 CHECK (cancel_generation >= 0),
            run_gateway_id TEXT, run_process_generation TEXT, run_lease_generation INTEGER, cancel_id TEXT,
            settlement_id TEXT, settlement_status TEXT, result_json TEXT, created_at REAL NOT NULL,
            updated_at REAL NOT NULL, started_at REAL, terminal_at REAL, indeterminate_at REAL,
            PRIMARY KEY (room_id, task_id), UNIQUE (room_id, thread_id, turn_id),
            FOREIGN KEY (room_id) REFERENCES hosted_rooms(room_id));

-- Indexes.

CREATE INDEX idx_hosted_room_driver_tasks_status
           ON hosted_room_driver_tasks(room_id, status, source_event_seq, created_at, task_id);
