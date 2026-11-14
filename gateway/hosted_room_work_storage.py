"""Producer-scoped passive evidence storage and durable older-writer guards."""

import json

from gateway.hosted_rooms_common import table_exists




def initialize(conn):
    if not conn.in_transaction:
        # Reserve the writer before schema reads. A deferred SAVEPOINT can lose
        # its write upgrade to another publisher without honoring busy_timeout.
        conn.execute("BEGIN IMMEDIATE")
        with conn:
            _initialize_locked(conn)
        return
    # Nested initialization must never commit or roll back caller-owned work.
    conn.execute("SAVEPOINT work_record_initialize")
    try:
        _initialize_locked(conn)
    except BaseException:
        conn.execute("ROLLBACK TO work_record_initialize")
        conn.execute("RELEASE work_record_initialize")
        raise
    conn.execute("RELEASE work_record_initialize")


def _initialize_locked(conn):
    from agent_cli.database_migrations import initialize_database
    initialize_database(conn, "hosted_room_work")
    # Ordinary initialization owns schema/guards only. Each consuming operation
    # validates its own row; authority/enrollment triggers freeze exact-room old
    # scopes. Legacy dispositions were resolved at insertion above.


def scope_disposition(conn, table, row):
    """Read-only authority projection, also used when inserting migrated rows."""
    from gateway import hosted_room_work_records as work
    if row["disposition"] != "current":
        return row["disposition"]
    current = None
    current = conn.execute("SELECT authority_gateway_id,authority_epoch FROM hosted_rooms WHERE room_id=?",
                           (row["room_id"],)).fetchone()
    if current is None or tuple(current) == (row["producer_gateway_id"], row["producer_epoch"]):
        return "current"
    return "superseded_authority" if table == work.PENDING_TABLE and row["status"] != "acked" else "historical"




def retained_fields(table):
    from gateway import hosted_room_work_records as work
    fields = ["room_id", "revision", "digest", "record_json"]
    fields += ["producer_gateway_id", "producer_epoch"]
    if table == work.PENDING_TABLE:
        fields += ["target_install_id", "route_generation", "status"]
    return fields


def row_size_sql(table, prefix=""):
    # Reserve the longest bounded disposition up front so freezing/cleanup can
    # still run at capacity. Every original variable column is charged as bytes.
    return "20+" + "+".join(f"COALESCE(length(CAST({prefix}{k} AS BLOB)),0)" for k in retained_fields(table))


def usage_sql(tables):
    return (" + ".join(f"(SELECT COALESCE(SUM({row_size_sql(t)}),0) FROM {t})" for t in tables),
            " + ".join(f"(SELECT COUNT(*) FROM {t})" for t in tables))


def validate_stored(row):
    from gateway import hosted_room_work_records as work
    try:
        record = work.validate(json.loads(row["record_json"]))
        if (row["disposition"] == "invalid"
                or scope(record) != (row["room_id"], row["producer_gateway_id"], row["producer_epoch"])
                or record["revision"] != row["revision"] or record["digest"] != row["digest"]):
            raise work.WorkRecordError("stored work metadata conflicts with record scope")
    except (ValueError, TypeError, KeyError, RecursionError) as exc:
        raise work.InvalidStoredWorkRecord("stored work evidence is invalid") from exc
    return record


def validate_stored_locked(conn, table, row):
    """Validate the consumed row; invalidate only its unchanged current version.

    The savepoint owns a standalone classification or joins the caller's write
    transaction. A caller catching InvalidStoredWorkRecord must commit that
    transaction before reporting controlled failure. Historical rows are never
    rewritten, and read-only projections use validate_stored instead.
    """
    from gateway import hosted_room_work_records as work
    try:
        return validate_stored(row)
    except work.InvalidStoredWorkRecord:
        if row["disposition"] == "current":
            # Match all examined values, not merely a key that may since have
            # been replaced. IS preserves NULL/BLOB distinctions in old stores.
            fields = list(row.keys())
            where = " AND ".join(f'"{k}" IS ?' for k in fields)
            conn.execute("SAVEPOINT work_record_invalidate")
            try:
                conn.execute(f"UPDATE {table} SET disposition='invalid' WHERE {where}", [row[k] for k in fields])
            except BaseException:
                conn.execute("ROLLBACK TO work_record_invalidate")
                conn.execute("RELEASE work_record_invalidate")
                raise
            conn.execute("RELEASE work_record_invalidate")
        raise


def scope(record):
    return record["room_id"], record["authority"]["gateway_id"], record["authority"]["epoch"]


def save_locked(conn, table, record, *, target_install_id=None, route_generation=None):
    from gateway import hosted_room_work_records as work
    data = work.encode(record)
    fields = ["room_id", "producer_gateway_id", "producer_epoch", "revision", "digest", "record_json", "disposition"]
    values = [*scope(record), record["revision"], record["digest"], data, "current"]
    keys = fields[:3]
    if target_install_id is not None:
        fields += ["target_install_id", "route_generation", "status"]
        values += [target_install_id, route_generation, "pending"]
        keys += ["target_install_id"]
    work._budget(conn, table, dict(zip(fields, values)))
    updates = ','.join(f'{k}=excluded.{k}' for k in fields if k not in keys)
    conn.execute(f"INSERT INTO {table} ({','.join(fields)}) VALUES ({','.join('?' for _ in fields)}) "
                 f"ON CONFLICT({','.join(keys)}) DO UPDATE SET {updates}", values)
