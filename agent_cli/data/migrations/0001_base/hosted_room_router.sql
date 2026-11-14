-- NoOne 0.1.0: migration 0001, hosted_room_router component.

-- Tables and relationships.

CREATE TABLE hosted_room_router_claims (
    room_id TEXT NOT NULL, discussion_event_id TEXT NOT NULL, owner TEXT NOT NULL, expires_at REAL NOT NULL,
    PRIMARY KEY(room_id, discussion_event_id));
