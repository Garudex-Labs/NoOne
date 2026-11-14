"""Copy current room data during the fenced standalone-to-gateway handoff.

This is an ownership transfer, not an importer for historical database layouts.
Ephemeral process leases and paid-call claims never survive the transfer.
"""

from __future__ import annotations

import sqlite3
from collections import Counter
from contextlib import closing
from pathlib import Path

from agent_cli.database_migrations import initialize_database, require_database_schema
from agent_cli.sqlite_safe_read import connect_tracked


_SKIP_TABLES = frozenset({"hosted_room_driver_leases", "hosted_room_router_claims"})


def _copy_attachment_blobs(target, origin, columns, rows):
    """Transfer only referenced blobs, preserving destination deduplication.

    Both metadata owners use the same existing byte root. Source references are
    retained until its normal reclamation; destination counts cover copied rows
    only, not other source rooms that have not moved.
    """
    blob_index = columns.index("blob_id")
    mapping = {}
    for blob_id, count in Counter(row[blob_index] for row in rows).items():
        blob = origin.execute(
            "SELECT sha256,size,created_at FROM hosted_room_attachment_blobs WHERE blob_id=?", (blob_id,),
        ).fetchone()
        if blob is None:
            raise sqlite3.IntegrityError("Attachment handoff references missing blob metadata")
        sha256, size, created_at = blob
        existing = target.execute(
            "SELECT blob_id,size FROM hosted_room_attachment_blobs WHERE sha256=?", (sha256,),
        ).fetchone()
        if existing is not None:
            if existing[1] != size:
                raise sqlite3.IntegrityError("Attachment handoff blob size conflicts with its digest")
            mapping[blob_id] = existing[0]
            target.execute("UPDATE hosted_room_attachment_blobs SET ref_count=ref_count+? WHERE blob_id=?",
                           (count, existing[0]))
        else:
            mapping[blob_id] = blob_id
            target.execute("INSERT INTO hosted_room_attachment_blobs VALUES(?,?,?,?,?)",
                           (blob_id, sha256, size, count, created_at))
    copied = [list(row) for row in rows]
    for row in copied:
        row[blob_index] = mapping[row[blob_index]]
    return copied


def copy_room_rows(target: sqlite3.Connection, source: Path, *, only: frozenset[str]) -> int:
    """Copy absent, fenced room identities with their current schema and constraints."""
    copied_rooms = 0
    existing = {str(row[0]) for row in target.execute("SELECT room_id FROM hosted_rooms")}
    with closing(connect_tracked(source.resolve().as_uri() + "?mode=ro", uri=True,
                                 timeout=10, tracking_path=source)) as origin:
        origin.execute("BEGIN")
        components = origin.execute(
            "SELECT component,version FROM schema_migrations WHERE component GLOB 'hosted_room*'"
        ).fetchall()
        for component, _version in components:
            require_database_schema(origin, component)
            initialize_database(target, component)
        names = [row[0] for row in origin.execute(
            "SELECT name FROM sqlite_master WHERE type='table' AND name GLOB 'hosted_room*'"
        )]
        for name in sorted(names, key=lambda table: (table != "hosted_rooms", table)):
            if name in _SKIP_TABLES:
                continue
            columns = [row[1] for row in origin.execute(f'PRAGMA table_info("{name}")')]
            if "room_id" not in columns:
                continue
            room_index = columns.index("room_id")
            selected = ", ".join(f'"{column}"' for column in columns)
            rows = [row for row in origin.execute(f'SELECT {selected} FROM "{name}"')
                    if str(row[room_index]) in only and str(row[room_index]) not in existing]
            if name == "hosted_room_attachments":
                rows = _copy_attachment_blobs(target, origin, columns, rows)
            if name == "hosted_rooms":
                copied_rooms = len(rows)
            target.executemany(
                f'INSERT INTO "{name}" ({selected}) VALUES ({",".join("?" for _ in columns)})', rows,
            )
    return copied_rooms
