-- NoOne migration 0001: permanent standalone-to-gateway ownership handoff.
CREATE TABLE hosted_room_gateway_handoffs (
    room_id TEXT PRIMARY KEY,
    handed_at REAL NOT NULL
);
