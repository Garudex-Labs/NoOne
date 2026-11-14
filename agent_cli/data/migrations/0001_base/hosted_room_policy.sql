-- NoOne 0.1.0: migration 0001, hosted_room_policy component.

-- Tables and relationships.

CREATE TABLE hosted_room_policy_capacity (
        singleton INTEGER PRIMARY KEY CHECK(singleton=1), max_active_events INTEGER NOT NULL);

CREATE TABLE hosted_room_policy_cursors (
        room_id TEXT PRIMARY KEY, through_seq INTEGER NOT NULL DEFAULT 0,
        stopped_through_seq INTEGER NOT NULL DEFAULT 0, updated_at REAL NOT NULL DEFAULT 0);

CREATE TABLE hosted_room_policy_threads (
        room_id TEXT NOT NULL, thread_id TEXT NOT NULL, discussion_event_id TEXT NOT NULL,
        latest_user_seq INTEGER NOT NULL, completed INTEGER NOT NULL DEFAULT 0,
        PRIMARY KEY(room_id, thread_id));

CREATE TABLE hosted_room_policy_events (
        room_id TEXT NOT NULL, thread_id TEXT NOT NULL, discussion_event_id TEXT NOT NULL,
        seq INTEGER NOT NULL, event_json TEXT NOT NULL, PRIMARY KEY(room_id, seq));

CREATE TABLE hosted_room_policy_watermarks (
        room_id TEXT NOT NULL, thread_id TEXT NOT NULL, member_id TEXT NOT NULL,
        seen_through_seq INTEGER NOT NULL, PRIMARY KEY(room_id, thread_id, member_id));

CREATE TABLE hosted_room_policy_publications (
        room_id TEXT NOT NULL, task_id TEXT NOT NULL, kind TEXT NOT NULL,
        execution_generation INTEGER NOT NULL DEFAULT 0, seq INTEGER NOT NULL,
        PRIMARY KEY(room_id, task_id, kind, execution_generation));

CREATE TABLE hosted_room_policy_transcript (
        room_id TEXT NOT NULL, thread_id TEXT NOT NULL, seq INTEGER NOT NULL,
        kind TEXT NOT NULL, settled_seq INTEGER, PRIMARY KEY(room_id, thread_id, seq));

CREATE TABLE hosted_room_policy_transcript_state (
        room_id TEXT PRIMARY KEY, schema_version INTEGER NOT NULL);

-- Indexes.

CREATE INDEX idx_hosted_room_policy_pending
        ON hosted_room_policy_threads(room_id, completed, latest_user_seq, thread_id);

CREATE INDEX idx_hosted_room_policy_events_active
        ON hosted_room_policy_events(room_id, discussion_event_id, seq);

CREATE INDEX idx_hosted_room_user_thread
       ON hosted_room_events(room_id, json_extract(payload_json, '$.thread_id'), seq)
       WHERE kind='message.user';
