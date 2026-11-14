-- NoOne migration 0001: optional state_fts_trigram derived index.

CREATE VIEW IF NOT EXISTS messages_fts_trigram_src AS
    SELECT m.id, m.role, m.content, m.tool_name
    FROM messages AS m
    JOIN sessions AS s ON s.id = m.session_id
    WHERE m.role <> 'tool' AND s.source NOT IN ('cron', 'subagent') AND json_extract((CASE WHEN json_valid(s.model_config) THEN s.model_config ELSE json_object() END), '$._delegate_from') IS NULL;

CREATE VIRTUAL TABLE IF NOT EXISTS messages_fts_trigram USING fts5(
    content,
    tool_name,
    content='messages_fts_trigram_src',
    content_rowid='id',
    tokenize='trigram'
);

CREATE TRIGGER IF NOT EXISTS messages_fts_trigram_insert AFTER INSERT ON messages
WHEN new.role <> 'tool'
   AND EXISTS (SELECT 1 FROM sessions
               WHERE id = new.session_id AND source NOT IN ('cron', 'subagent') AND json_extract((CASE WHEN json_valid(model_config) THEN model_config ELSE json_object() END), '$._delegate_from') IS NULL)
   AND (new.id > COALESCE((SELECT CAST(value AS INTEGER) FROM state_meta
                           WHERE key = 'fts_rebuild_high_water'), -1)
     OR new.id <= COALESCE((SELECT CAST(value AS INTEGER) FROM state_meta
                            WHERE key = 'fts_rebuild_progress'), -1))
BEGIN
    INSERT INTO messages_fts_trigram(rowid, content, tool_name)
    VALUES (new.id, new.content, new.tool_name);
END;

CREATE TRIGGER IF NOT EXISTS messages_fts_trigram_delete AFTER DELETE ON messages
WHEN old.role <> 'tool'
   AND EXISTS (SELECT 1 FROM sessions
               WHERE id = old.session_id AND source NOT IN ('cron', 'subagent') AND json_extract((CASE WHEN json_valid(model_config) THEN model_config ELSE json_object() END), '$._delegate_from') IS NULL)
   AND (old.id > COALESCE((SELECT CAST(value AS INTEGER) FROM state_meta
                           WHERE key = 'fts_rebuild_high_water'), -1)
     OR old.id <= COALESCE((SELECT CAST(value AS INTEGER) FROM state_meta
                            WHERE key = 'fts_rebuild_progress'), -1))
BEGIN
    INSERT INTO messages_fts_trigram(messages_fts_trigram, rowid, content, tool_name)
    VALUES ('delete', old.id, old.content, old.tool_name);
END;

CREATE TRIGGER IF NOT EXISTS messages_fts_trigram_update
AFTER UPDATE OF content, tool_name, role ON messages
WHEN (old.content IS NOT new.content
    OR old.tool_name IS NOT new.tool_name
    OR old.role IS NOT new.role)
   AND (old.id > COALESCE((SELECT CAST(value AS INTEGER) FROM state_meta
                           WHERE key = 'fts_rebuild_high_water'), -1)
     OR old.id <= COALESCE((SELECT CAST(value AS INTEGER) FROM state_meta
                            WHERE key = 'fts_rebuild_progress'), -1))
BEGIN
    INSERT INTO messages_fts_trigram(messages_fts_trigram, rowid, content, tool_name)
    SELECT 'delete', old.id, old.content, old.tool_name
    WHERE old.role <> 'tool'
      AND EXISTS (SELECT 1 FROM sessions
                  WHERE id = old.session_id AND source NOT IN ('cron', 'subagent') AND json_extract((CASE WHEN json_valid(model_config) THEN model_config ELSE json_object() END), '$._delegate_from') IS NULL);
    INSERT INTO messages_fts_trigram(rowid, content, tool_name)
    SELECT new.id, new.content, new.tool_name
    WHERE new.role <> 'tool'
      AND EXISTS (SELECT 1 FROM sessions
                  WHERE id = new.session_id AND source NOT IN ('cron', 'subagent') AND json_extract((CASE WHEN json_valid(model_config) THEN model_config ELSE json_object() END), '$._delegate_from') IS NULL);
END;
