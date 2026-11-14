"""Associate shared byte roots with their metadata owners and fence reclamation.

The root lock serializes owner registration/first writes with collection. Ordered
SQLite reservations also cover existing adjacent stores not yet initialized by
an attachment operation; current explicit-root owners register their real paths.
"""

import hashlib
import json
import os
import stat
from contextlib import ExitStack, closing, contextmanager
from pathlib import Path

from agent_cli.database_migrations import require_database_schema
from agent_cli.sqlite_safe_read import connect_tracked
from agent_dir_acl import make_user_dir
from pm.filesystem import durable_write_bytes, lock_path


@contextmanager
def blob_root_writer(root: Path):
    """An owner that cannot obtain admission must not publish blob bytes."""
    fd = lock_path(root / ".attachment-owners.lock", timeout=10)
    if fd is None:
        raise TimeoutError("Attachment byte store is busy; retry the operation")
    try:
        yield
    finally:
        os.close(fd)


def register_blob_owner(root: Path, db_path: Path) -> None:
    """Register under the root writer lock before the first byte publication."""
    directory = root / ".attachment-owners"
    make_user_dir(directory, parents=True, exist_ok=True, mode=0o700)
    database = str(db_path.resolve())
    name = hashlib.sha256(database.encode()).hexdigest()
    path = directory / f"{name}.json"
    payload = json.dumps({"database": database}, sort_keys=True).encode()
    if not path.is_file() or path.read_bytes() != payload:
        durable_write_bytes(path, payload)


def _owner_databases(db_path: Path, root: Path) -> list[Path]:
    paths = {db_path.resolve()}
    for path in db_path.parent.iterdir():
        if path.suffix not in {".db", ".sqlite", ".sqlite3"}:
            continue
        try:
            info = path.stat()
        except FileNotFoundError:
            continue
        if stat.S_ISREG(info.st_mode):
            paths.add(path.resolve())
    directory = root / ".attachment-owners"
    # glob()/exists() can hide inspection errors. A lost or unreadable owner
    # registry does not prove that the shared root has no other references.
    for record in directory.iterdir():
        if record.suffix != ".json":
            continue
        value = json.loads(record.read_text(encoding="utf-8-sig"))["database"]
        if not isinstance(value, str) or not Path(value).is_absolute():
            raise ValueError("Attachment owner registration is invalid")
        path = Path(value)
        try:
            path.stat()
        except FileNotFoundError:
            continue
        # An unreadable owner is not proof that its references are gone.
        paths.add(path.resolve())
    # A hard-linked alias is the same SQLite writer; reserving it twice would
    # deadlock this collector against itself.
    unique = {}
    for path in sorted(paths):
        info = path.stat()
        unique.setdefault((info.st_dev, info.st_ino), path)
    return sorted(unique.values())


@contextmanager
def locked_blob_references(db_path: Path, root: Path):
    """Yield live blob ids while holding root and ordered writer reservations.

    No owner tables are initialized and no journal modes are changed. Failure
    to inspect/reserve an owner means collection must defer, never assume empty.
    """
    with blob_root_writer(root), ExitStack() as stack:
        live = set()
        for path in _owner_databases(db_path, root):
            conn = stack.enter_context(closing(connect_tracked(
                path.as_uri() + "?mode=rw", uri=True, timeout=10, tracking_path=path,
            )))
            # Reserve before testing for tables: an uninitialized store may
            # acquire its attachment schema while another collector is active.
            conn.execute("BEGIN IMMEDIATE")
            stack.callback(conn.rollback)
            if conn.execute("SELECT 1 FROM sqlite_master WHERE name='hosted_room_attachment_blobs'").fetchone() is None:
                continue
            require_database_schema(conn, "hosted_room_attachments")
            live.update(row[0] for row in conn.execute("SELECT blob_id FROM hosted_room_attachment_blobs"))
        yield live
