-- NoOne 0.1.0: migration 0001, hosted_room_replicas component.
-- Applied once inside the owning database transaction.


-- Tables and relationships.

CREATE TABLE hosted_room_replicas (
            room_id TEXT PRIMARY KEY, name TEXT NOT NULL, members_json TEXT NOT NULL,
            authority_gateway_id TEXT NOT NULL,
            authority_epoch INTEGER NOT NULL CHECK (authority_epoch >= 1),
            last_seq INTEGER NOT NULL DEFAULT 0 CHECK (last_seq >= 0),
            latest_seq INTEGER NOT NULL DEFAULT 0, event_bytes INTEGER NOT NULL DEFAULT 0,
            created_at REAL NOT NULL, updated_at REAL NOT NULL
        );

CREATE TABLE hosted_room_replica_events (
            room_id TEXT NOT NULL, seq INTEGER NOT NULL CHECK (seq >= 1), event_id TEXT NOT NULL,
            kind TEXT NOT NULL, actor_json TEXT NOT NULL, authority_epoch INTEGER,
            payload_json TEXT NOT NULL, created_at REAL NOT NULL,
            PRIMARY KEY (room_id, seq)
        );
