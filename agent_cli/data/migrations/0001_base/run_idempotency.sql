-- NoOne 0.1.0: migration 0001, run_idempotency component.

-- Tables and relationships.

CREATE TABLE run_idempotency (
                scope TEXT NOT NULL,
                idempotency_key TEXT NOT NULL,
                fingerprint TEXT NOT NULL,
                run_id TEXT NOT NULL,
                status_json TEXT NOT NULL,
                owner_pid INTEGER NOT NULL DEFAULT 0,
                owner_started INTEGER NOT NULL DEFAULT 0,
                retention_until REAL NOT NULL DEFAULT 0,
                acknowledged_at REAL,
                created_at REAL NOT NULL,
                updated_at REAL NOT NULL,
                PRIMARY KEY (scope, idempotency_key)
            );

-- Indexes.

CREATE UNIQUE INDEX run_idempotency_run_id ON run_idempotency(run_id);
