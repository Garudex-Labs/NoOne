-- NoOne 0.1.0: migration 0001, responses component.

-- Tables and relationships.

CREATE TABLE responses (response_id TEXT PRIMARY KEY, data TEXT NOT NULL, accessed_at REAL NOT NULL);

CREATE TABLE conversations (name TEXT PRIMARY KEY, response_id TEXT NOT NULL);

CREATE TABLE response_keys (request_key TEXT PRIMARY KEY, fingerprint TEXT NOT NULL, created_at INTEGER NOT NULL, model_json TEXT, settled_at REAL, response_id TEXT);

CREATE TABLE response_admissions (request_key TEXT PRIMARY KEY, admission_id TEXT NOT NULL);

CREATE TABLE response_output_order (request_key TEXT NOT NULL, item_id TEXT NOT NULL, output_index INTEGER NOT NULL, PRIMARY KEY(request_key,item_id), UNIQUE(request_key,output_index));

-- Indexes.

CREATE INDEX response_keys_settled ON response_keys(settled_at);

CREATE INDEX response_keys_response ON response_keys(response_id);
