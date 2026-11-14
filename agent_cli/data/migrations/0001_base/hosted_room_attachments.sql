-- NoOne 0.1.0: migration 0001, hosted_room_attachments component.

-- Tables and relationships.

CREATE TABLE hosted_room_attachment_blobs (
                blob_id TEXT PRIMARY KEY,
                sha256 TEXT NOT NULL UNIQUE,
                size INTEGER NOT NULL CHECK (size > 0),
                ref_count INTEGER NOT NULL CHECK (ref_count > 0),
                created_at REAL NOT NULL
            );

CREATE TABLE hosted_room_attachments (
                attachment_id TEXT PRIMARY KEY,
                upload_id TEXT NOT NULL,
                room_id TEXT NOT NULL,
                event_id TEXT,
                kind TEXT NOT NULL,
                name TEXT NOT NULL,
                size INTEGER NOT NULL CHECK (size > 0),
                mime TEXT NOT NULL,
                sha256 TEXT NOT NULL,
                blob_id TEXT NOT NULL,
                recipient_member_ids_json TEXT NOT NULL DEFAULT '[]',
                viewer_access INTEGER NOT NULL DEFAULT 0 CHECK (viewer_access IN (0, 1)),
                state TEXT NOT NULL CHECK (state IN ('uploaded', 'committed', 'disbanded')),
                created_at REAL NOT NULL,
                updated_at REAL NOT NULL,
                expires_at REAL, catalog_name TEXT,
                UNIQUE (room_id, upload_id),
                FOREIGN KEY (blob_id) REFERENCES hosted_room_attachment_blobs(blob_id)
            );

-- Indexes.

CREATE INDEX idx_hosted_room_attachments_room_state
               ON hosted_room_attachments(room_id, state, created_at);

CREATE INDEX idx_hosted_room_attachments_expiry
               ON hosted_room_attachments(expires_at);

CREATE INDEX idx_hosted_room_attachments_event
               ON hosted_room_attachments(room_id, event_id);
