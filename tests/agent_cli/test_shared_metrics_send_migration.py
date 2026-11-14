"""Tests for the additive send-state migration on ``package_outbox``.

The store schema version must NOT move when these columns are added: the
existing loader raises on any version it does not recognise, so bumping it
would hard-fail an older Hermes (a second profile on an older build, or a
rollback) against the same database file.
"""

from __future__ import annotations

import json
import sqlite3

import pytest

from agent_cli.observability.shared_metrics import SharedMetricsStore

SEND_COLUMNS = {
    "sent_at",
    "send_state",
    "send_attempts",
    "next_attempt_at",
    "last_error",
    "sent_install_id",
}


def _columns(db_path):
    connection = sqlite3.connect(db_path)
    try:
        return {row[1] for row in connection.execute("PRAGMA table_info(package_outbox)")}
    finally:
        connection.close()


def _schema_version(db_path):
    connection = sqlite3.connect(db_path)
    try:
        row = connection.execute(
            "SELECT value FROM telemetry_state WHERE key = 'schema_version'"
        ).fetchone()
        return row[0] if row else None
    finally:
        connection.close()


@pytest.fixture
def store(tmp_path):
    return SharedMetricsStore(
        database_path=tmp_path / "metrics.sqlite3",
        outbox_directory=tmp_path / "outbox",
    )


class TestFreshDatabase:


    def test_send_attempts_defaults_to_zero(self, store):
        connection = sqlite3.connect(store.database_path)
        try:
            connection.execute(
                """
                INSERT INTO package_outbox(
                    package_id, period_start, period_end, payload_json, created_at
                ) VALUES ('p', '2026-01-01', '2026-01-02', '{}', '2026-01-01T00:00:00Z')
                """
            )
            connection.commit()
            row = connection.execute(
                "SELECT send_attempts, send_state, sent_install_id FROM package_outbox"
            ).fetchone()
        finally:
            connection.close()
        assert row[0] == 0
        assert row[1] is None
        assert row[2] is None
