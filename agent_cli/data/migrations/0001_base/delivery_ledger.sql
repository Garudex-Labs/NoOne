-- NoOne 0.1.0: migration 0001, delivery_ledger component.
-- Applied once inside the owning database transaction.


-- Tables and relationships.

CREATE TABLE delivery_obligations (
            obligation_id TEXT PRIMARY KEY,
            session_key TEXT NOT NULL,
            platform TEXT NOT NULL,
            chat_id TEXT NOT NULL,
            thread_id TEXT,
            content TEXT NOT NULL,
            state TEXT NOT NULL,
            attempts INTEGER NOT NULL DEFAULT 0,
            created_at REAL NOT NULL,
            updated_at REAL NOT NULL,
            owner_pid INTEGER,
            owner_started_at INTEGER,
            last_error TEXT,
            adapter_profile TEXT
        );
