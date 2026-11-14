"""Detached owners must not lose the checkout their session still uses."""
from pathlib import Path
import subprocess
import sys

import pytest


def _pending_turn(db_path, sid, status='queued'):
    """An accepted turn the gateway still owes this session: quitting the viewer keeps its tree (N8)."""
    import sqlite3
    conn = sqlite3.connect(db_path)
    try:
        conn.execute(
            "INSERT INTO session_admissions(admission_id,request_id,principal_id,target_session_id,lineage_json,"
            "payload_json,payload_digest,intent,status,outcome,owner_epoch,generation) "
            "VALUES(?,?,'p',?,'[]','{}','d','queue',?,NULL,1,1)", (f'adm-{sid}', f'req-{sid}', sid, status))
        conn.commit()
    finally:
        conn.close()


def _finish_turns(db_path):
    import sqlite3
    conn = sqlite3.connect(db_path)
    try:
        conn.execute("UPDATE session_admissions SET status='terminal', outcome='completed'")
        conn.commit()
    finally:
        conn.close()
