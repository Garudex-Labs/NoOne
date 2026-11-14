-- NoOne 0.1.0: migration 0001, metrics component.

-- Tables and relationships.

CREATE TABLE telemetry_state (
                key TEXT PRIMARY KEY,
                value TEXT NOT NULL
            );

CREATE TABLE counter_aggregates (
                period_start TEXT NOT NULL,
                metric_name TEXT NOT NULL,
                hermes_version TEXT NOT NULL,
                os_family TEXT NOT NULL,
                architecture TEXT NOT NULL,
                install_method TEXT NOT NULL,
                dimensions_json TEXT NOT NULL,
                value INTEGER NOT NULL,
                packaged_value INTEGER NOT NULL DEFAULT 0,
                PRIMARY KEY (
                    period_start, metric_name, hermes_version, os_family, architecture,
                    install_method, dimensions_json
                )
            );

CREATE TABLE package_outbox (
                package_id TEXT PRIMARY KEY,
                period_start TEXT NOT NULL,
                period_end TEXT NOT NULL,
                payload_json TEXT NOT NULL,
                created_at TEXT NOT NULL,
                exported_at TEXT
            , sent_at TEXT, send_state TEXT, send_attempts INTEGER NOT NULL DEFAULT 0, next_attempt_at TEXT, last_error TEXT, sent_install_id TEXT, claim_token TEXT);

CREATE TABLE send_consent_windows (
                opened_at TEXT NOT NULL,
                last_confirmed_at TEXT NOT NULL,
                closed_at TEXT
            );

CREATE TABLE consent_marks (
                name TEXT PRIMARY KEY CHECK (name IN ('obs', 'data')),
                stamp TEXT NOT NULL
            );

INSERT INTO telemetry_state(key,value) VALUES ('schema_version','1');
