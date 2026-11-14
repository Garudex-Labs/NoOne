-- NoOne 0.1.0: migration 0001, projects component.
-- Applied once inside the owning database transaction.


-- Tables and relationships.

CREATE TABLE projects (
    id            TEXT PRIMARY KEY,
    slug          TEXT NOT NULL UNIQUE,
    name          TEXT NOT NULL,
    description   TEXT,
    icon          TEXT,
    color         TEXT,
    board_slug    TEXT,
    primary_path  TEXT,
    created_at    INTEGER NOT NULL,
    archived      INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE project_folders (
    project_id  TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    path        TEXT NOT NULL,
    label       TEXT,
    is_primary  INTEGER NOT NULL DEFAULT 0,
    added_at    INTEGER NOT NULL,
    PRIMARY KEY (project_id, path)
);

CREATE TABLE project_meta (
    key    TEXT PRIMARY KEY,
    value  TEXT
);

CREATE TABLE discovered_repos (
    root          TEXT PRIMARY KEY,
    label         TEXT,
    last_seen     INTEGER NOT NULL
);

-- Indexes.

CREATE INDEX idx_project_folders_path
    ON project_folders(path);
