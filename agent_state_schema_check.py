"""Read-only schema diagnostics. Browsing never upgrades a database."""

from contextlib import closing
from pathlib import Path

from agent_cli.database_migrations import UnsupportedDatabaseSchema, require_database_schema
from agent_cli.sqlite_safe_read import connect_tracked


def schema_drift_reason(path: Path) -> str | None:
    with closing(connect_tracked(path.resolve().as_uri() + "?mode=ro", uri=True, tracking_path=path)) as conn:
        try:
            require_database_schema(conn, "state")
        except UnsupportedDatabaseSchema as exc:
            return str(exc)
    return None
