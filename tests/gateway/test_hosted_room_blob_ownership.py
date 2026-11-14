"""Attachment ownership survives standalone/gateway transfer and shared-root collection."""

import sqlite3
import os
import subprocess
import sys
import threading

import pytest

from agent_state import SessionDB
from gateway import hosted_rooms
from gateway.hosted_room_attachments import HostedRoomAttachmentStore
from gateway.hosted_rooms_gateway_import import import_standalone_rooms


def _upload(path, room, upload="upload", data=b"committed content", root=None):
    owner = hosted_rooms.local_authority_gateway_id()
    hosted_rooms.create_room(path, room_id=room, name=room, authority_gateway_id=owner,
        members=[{"member_id": "a", "profile": "default", "handle": "a"},
                 {"member_id": "b", "profile": "default", "handle": "b"}])
    store = HostedRoomAttachmentStore(path, root=root)
    attachment = store.put(room_id=room, upload_id=upload, kind="file", name="file.txt",
                           mime="text/plain", data=data)
    manifest = [{key: attachment[key] for key in ("attachment_id", "kind", "name", "size", "mime")}]
    store.commit_message(room_id=room, event_id=upload, manifest=manifest,
                         recipient_member_ids=["a", "b"], viewer_access=True, hold_until_event=True)
    hosted_rooms.append_event(path, room_id=room, event_id=upload, kind="message.user",
        actor={"kind": "user", "id": "owner"}, payload={"text": "file", "attachments": manifest},
        authority_gateway_id=owner, authority_epoch=1)
    return store, attachment


def _read(store, room, attachment):
    return store.read(room_id=room, attachment_id=attachment["attachment_id"],
                      recipient_member_id="a").data


def test_cold_gateway_attachment_store_preserves_source_bytes(tmp_path):
    source, target = tmp_path / "shared-state.db", tmp_path / "state.db"
    store, attachment = _upload(source, "source-room")
    with SessionDB(target):
        pass
    HostedRoomAttachmentStore(target)
    assert _read(store, "source-room", attachment) == b"committed content"


def test_attachment_handoff_retains_bytes_and_one_destination_blob(tmp_path):
    source, target = tmp_path / "shared-state.db", tmp_path / "state.db"
    with SessionDB(target):
        pass
    _, original = _upload(target, "existing-room")
    source_store, attachment = _upload(source, "moving-room")
    assert import_standalone_rooms(target) == 1
    assert import_standalone_rooms(target) == 0
    destination_store = HostedRoomAttachmentStore(target)
    assert _read(destination_store, "moving-room", attachment) == b"committed content"
    assert _read(destination_store, "existing-room", original) == b"committed content"
    assert _read(source_store, "moving-room", attachment) == b"committed content"
    with sqlite3.connect(target) as conn:
        assert conn.execute("PRAGMA foreign_key_check").fetchall() == []
        assert conn.execute("SELECT COUNT(*),SUM(ref_count) FROM hosted_room_attachment_blobs").fetchone() == (1, 2)


def test_expiring_one_owner_does_not_delete_other_owners_blob(tmp_path):
    source, target = tmp_path / "shared-state.db", tmp_path / "state.db"
    with SessionDB(target):
        pass
    source_store, attachment = _upload(source, "moving-room")
    assert import_standalone_rooms(target) == 1
    destination_store = HostedRoomAttachmentStore(target)
    source_store.mark_room_disbanded("moving-room")
    assert source_store.prune(now=float("inf")) == 1
    assert _read(destination_store, "moving-room", attachment) == b"committed content"


def test_shared_root_sweep_waits_for_another_owners_inflight_upload(tmp_path, monkeypatch):
    source, target = tmp_path / "shared-state.db", tmp_path / "state.db"
    source_store = HostedRoomAttachmentStore(source)
    target_store = HostedRoomAttachmentStore(target)
    bytes_written, release_writer = threading.Event(), threading.Event()
    reservation_attempt, collector_done = threading.Event(), threading.Event()
    errors, uploaded = [], []
    original_write = source_store._write_blob
    from gateway import hosted_room_blob_ownership as ownership
    original_lock = ownership.lock_path

    def held_write(path, data):
        original_write(path, data)
        bytes_written.set()
        assert release_writer.wait(10)

    def traced_lock(path, **kwargs):
        if threading.current_thread().name == "collector":
            reservation_attempt.set()
        return original_lock(path, **kwargs)

    monkeypatch.setattr(source_store, "_write_blob", held_write)
    monkeypatch.setattr(ownership, "lock_path", traced_lock)

    def write():
        try:
            uploaded.append(source_store.put(room_id="room", upload_id="upload", kind="file",
                name="file.txt", mime="text/plain", data=b"new content"))
        except Exception as exc:
            errors.append(exc)

    def collect():
        try:
            target_store._sweep_orphans()
        except Exception as exc:
            errors.append(exc)
        finally:
            collector_done.set()

    writer = threading.Thread(target=write, daemon=True)
    collector = threading.Thread(target=collect, name="collector", daemon=True)
    writer.start()
    try:
        assert bytes_written.wait(10)
        collector.start()
        assert reservation_attempt.wait(10)
        assert not collector_done.is_set()
    finally:
        release_writer.set()
        writer.join(10)
        if collector.ident is not None:
            collector.join(10)
    assert not errors
    assert collector_done.is_set()
    assert source_store.find_upload(room_id="room", upload_id="upload")["attachment_id"] == uploaded[0]["attachment_id"]


def test_partial_room_handoff_counts_only_destination_references(tmp_path):
    source, target = tmp_path / "shared-state.db", tmp_path / "state.db"
    with SessionDB(target):
        pass
    _upload(target, "known-room")
    _upload(source, "known-room")
    _, attachment = _upload(source, "moving-room", upload="moving")
    assert import_standalone_rooms(target) == 1
    assert _read(HostedRoomAttachmentStore(target), "moving-room", attachment) == b"committed content"
    with sqlite3.connect(target) as conn:
        assert conn.execute("SELECT COUNT(*),SUM(ref_count) FROM hosted_room_attachment_blobs").fetchone() == (1, 2)


def test_nonadjacent_owners_of_an_explicit_root_keep_committed_bytes(tmp_path):
    first, second = tmp_path / "first/state.db", tmp_path / "second/state.db"
    root = tmp_path / "configured-bytes"
    store, attachment = _upload(first, "room", root=root)
    HostedRoomAttachmentStore(second, root=root)
    assert _read(store, "room", attachment) == b"committed content"


@pytest.mark.platforms("linux", "macos")
def test_inaccessible_registered_owner_defers_collection(tmp_path):
    first, second = tmp_path / "first/state.db", tmp_path / "second/state.db"
    root = tmp_path / "configured-bytes"
    store, attachment = _upload(first, "room", root=root)
    collector = HostedRoomAttachmentStore(second, root=root)
    permissions = first.parent.stat().st_mode & 0o777
    first.parent.chmod(0)
    try:
        if os.access(first.parent, os.X_OK):
            pytest.skip("the executing account bypasses directory traversal permissions")
        collector._sweep_orphans()
    finally:
        first.parent.chmod(permissions)
    assert _read(store, "room", attachment) == b"committed content"


@pytest.mark.platforms("linux", "macos")
def test_unreadable_owner_registry_does_not_mean_no_owners(tmp_path):
    first, second = tmp_path / "first/state.db", tmp_path / "second/state.db"
    root = tmp_path / "configured-bytes"
    store, attachment = _upload(first, "room", root=root)
    collector = HostedRoomAttachmentStore(second, root=root)
    registry = root / ".attachment-owners"
    permissions = registry.stat().st_mode & 0o777
    registry.chmod(0)
    try:
        if os.access(registry, os.R_OK):
            pytest.skip("the executing account bypasses directory read permissions")
        collector._sweep_orphans()
    finally:
        registry.chmod(permissions)
    assert _read(store, "room", attachment) == b"committed content"


@pytest.mark.parametrize("existing_database", [False, True])
def test_new_owner_process_cannot_publish_during_collection(tmp_path, monkeypatch, existing_database):
    from tests.waiting import wait_until
    source, target = tmp_path / "first/state.db", tmp_path / "second/state.db"
    root = tmp_path / "configured-bytes"
    store, attachment = _upload(source, "room", root=root)
    if existing_database:
        with SessionDB(target):
            pass
    collecting, release_collector = threading.Event(), threading.Event()
    original_iterdir = type(root).iterdir

    def held_iterator(path):
        if path == store.blob_root and threading.current_thread().name == "collector":
            collecting.set()
            assert release_collector.wait(10)
        return original_iterdir(path)

    monkeypatch.setattr(type(root), "iterdir", held_iterator)
    collector = threading.Thread(target=store._sweep_orphans, name="collector", daemon=True)
    ready = tmp_path / "owner-attempted"
    script = """
import sys
from pathlib import Path
from gateway import hosted_room_blob_ownership as ownership
from gateway.hosted_room_attachments import HostedRoomAttachmentStore
target, root, ready = map(Path, sys.argv[1:])
original = ownership.lock_path
def announced(*args, **kwargs):
    ready.write_text('attempted')
    return original(*args, **kwargs)
ownership.lock_path = announced
store = HostedRoomAttachmentStore(target, root=root)
store.put(room_id='new-room', upload_id='new-upload', kind='file',
          name='new.txt', mime='text/plain', data=b'new owner bytes')
assert store.find_upload(room_id='new-room', upload_id='new-upload') is not None
print('complete')
"""
    env = dict(os.environ, HERMES_HOME=str(tmp_path), HERMES_RUNTIME_DIR=str(tmp_path / "runtime"))
    process = None
    collector.start()
    try:
        assert collecting.wait(10)
        process = subprocess.Popen([sys.executable, "-c", script, str(target), str(root), str(ready)],
                                   env=env, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
        assert wait_until(ready.exists, timeout=10)
        if existing_database:
            with sqlite3.connect(target) as conn:
                assert conn.execute("SELECT 1 FROM sqlite_master WHERE name='hosted_room_attachments'").fetchone() is None
        else:
            assert not target.exists()
        release_collector.set()
        output, error = process.communicate(timeout=20)
        assert process.returncode == 0, error
        assert "complete" in output
    finally:
        release_collector.set()
        collector.join(10)
        if process is not None and process.poll() is None:
            process.kill()
            process.communicate(timeout=5)
    assert _read(store, "room", attachment) == b"committed content"
