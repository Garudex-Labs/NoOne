-- NoOne 0.1.0: migration 0001, verification component.
-- Applied once inside the owning database transaction.


-- Tables and relationships.

CREATE TABLE meta (
            key TEXT PRIMARY KEY,
            value TEXT NOT NULL
        );

CREATE TABLE verification_events (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            created_at TEXT NOT NULL,
            session_id TEXT NOT NULL,
            cwd TEXT NOT NULL,
            root TEXT NOT NULL,
            command TEXT NOT NULL,
            canonical_command TEXT NOT NULL,
            kind TEXT NOT NULL,
            scope TEXT NOT NULL,
            status TEXT NOT NULL,
            exit_code INTEGER NOT NULL,
            output_summary TEXT NOT NULL
        );

CREATE TABLE verification_state (
            session_id TEXT NOT NULL,
            root TEXT NOT NULL,
            last_event_id INTEGER,
            last_edit_at TEXT,
            changed_paths_json TEXT NOT NULL DEFAULT '[]',
            PRIMARY KEY (session_id, root)
        );

-- Indexes.

CREATE INDEX idx_verification_events_session_root
        ON verification_events(session_id, root, id DESC);

INSERT INTO meta(key,value) VALUES ('schema_version','1');
