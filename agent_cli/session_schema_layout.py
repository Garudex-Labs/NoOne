"""Physical columns of NoOne's base schema for page-level corruption salvage."""
from agent_cli.database_migrations import base_table_shapes

RECOVERY_TABLES = ("sessions", "messages", "session_model_usage")


def current_declared_columns(table: str) -> tuple[str, ...]:
    return tuple(column[1] for column in base_table_shapes("state")[table][0])
