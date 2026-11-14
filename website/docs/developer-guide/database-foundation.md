---
title: Database foundation
---

# NoOne 0.1.0 database foundation

The first release starts at database migration **0001**. The application uses
SQLite directly, with dataclasses and row adapters rather than an ORM or an
ORM migration framework. The base migration is packaged under
`agent_cli/data/migrations/0001_base/`.

## Ownership and base components

The numbered migration has separate SQL components because the application
already has separate database files and transaction owners. These are not
successive historical migrations. Combining the files would change profile
isolation, crash recovery, and deployment behavior.

| Owner / file | Base components | Responsibilities |
| --- | --- | --- |
| Profile `state.db` | `state.sql` | Sessions, messages, content-addressed prompts, model/task usage, admissions, execution receipts, routing, generations, heartbeats, compression/turn leases, delegation and resumable children, Telegram topic state |
| Profile `state.db` | `delivery_ledger.sql` | Gateway delivery obligations and adapter/profile ownership |
| Board database | `kanban.sql` | Tasks, links, comments, events, runs, attachments, notification subscriptions, metadata |
| Profile `projects.db` | `projects.sql` | Projects, folder relationships, repository discovery |
| Profile `cron/executions.db` | `cron_executions.sql`, `cron_incidents.sql` | Execution audit, occurrence deduplication, incidents and alert status |
| Profile `cron/deliveries.db` | `cron_delivery.sql` | Durable delivery handoff and tombstones |
| Profile `cron/notepad.db` | `cron_notepad.sql` | Job-scoped notes |
| Profile `verification_evidence.db` | `verification.sql` | Verification events and current repository/session state |
| Profile metrics store | `metrics.sql` | Resource-keyed counters, package outbox, send claims/retry state, consent intervals |
| Profile API stores | `responses.sql`, `run_idempotency.sql` | Response chaining, immutable request identity, admissions, output order and run retention |
| Room service's existing database | `hosted_rooms.sql`, `hosted_room_tasks.sql`, `hosted_room_replicas.sql`, `hosted_room_policy.sql`, `hosted_room_work.sql`, `hosted_room_router.sql`, `hosted_room_handoff.sql` | Room log/identity, authority fencing, leases/tasks, replica/policy projections, bounded immutable work evidence, paid-call claims and standalone-to-gateway ownership handoff |
| Room attachment store | `hosted_room_attachments.sql` | Blob metadata, attachment/catalog identity, access and retention |

Standalone rooms use the root `shared-state.db`; the canonical gateway room
service uses its owning profile's `state.db`. Components coexist in the file
chosen by the service. That distinction is intentional.

Plugins own their persistence through the existing plugin boundary. Discord's
recovery ledger and the RetainDB pending queue already have current, single
initial schemas and no historical upgrade chains. Their initialization and
restart replay remain plugin-owned. Third-party providers, external plugin
databases and protocol schemas are not converted by the host migration.

## Initialization and version policy

`agent_cli.database_migrations.initialize_database(connection, component)` is
the shared core entry point. `schema_migrations` records one version per
component, allowing independently owned components to share a physical file.

- Migration 0001 creates the complete table, index and trigger definitions in
  a transaction. There is no later `ALTER TABLE` reconciliation.
- Caller-owned transactions are preserved with a savepoint; initialization
  does not commit unrelated work. A failed migration publishes neither a
  partial schema nor a version marker.
- Concurrent initialization is serialized with SQLite's writer lock and a
  version recheck under that lock.
- Reopening a current component validates its columns, foreign keys and
  stored table/index/trigger definitions. It does not rewrite rows or rerun
  old backfills.
- Read-only attachments use `require_database_schema`. Browsing never
  upgrades or repairs a database.
- Unversioned predecessor stores, incompatible schemas, and unknown versions
  are rejected. **Existing data is never deleted, recreated or silently
  adopted.** Use a fresh NoOne data directory for this release, or restore a
  compatible backup. Existing configuration/environment variable names and
  storage path resolution remain unchanged.

The inherited state-only `schema_version` table is no longer a second version
authority. Public recovery reports still expose a `schema_version` value,
derived from the state component's migration record.

## Search indexes and operational recovery

`state_fts.sql` and `state_fts_trigram.sql` declare the current optional derived
indexes in the same base migration. FTS5/trigram availability is a SQLite
capability, not an application-schema version. Unsupported capabilities retain
the existing LIKE fallback.

The word index reads a stable projection with bounded tool-result prefixes.
The trigram projection excludes the existing non-conversation/tool payload
classes. Canonical messages remain unchanged and explicit full-content search
remains available.

Missing or corrupt derived indexes still have their current repair path,
cross-process rebuild admission, stale-index marker and resumable backfill.
`noone sessions optimize-storage` completes a current-layout rebuild and
optional VACUUM; it no longer converts historical inline indexes or tears down
retired index families. An incompatible stored FTS definition is rejected.

These are **current operational behaviors**, not historical schema support:

- WAL/rollback-journal negotiation and SQLite safety/version capability gates;
- profile ownership, worker/admission fences, lease expiry and crash recovery;
- corruption quarantine, tracked file access, snapshots and explicit recovery
  into a newly initialized output database;
- current session lineage/route matching, import/export interfaces and display
  indexing for valid current rows;
- disconnected-client idempotency settlement and immutable delivery history;
- fenced standalone-room ownership transfer and external protocol formats.

Page-level salvage uses the physical column order of the base migration. It
does not enumerate predecessor layouts or guess an old positional schema.
Unrecognized evidence is reported instead of being mapped into unrelated fields.

## Schema changes after 0.1.0

Do not edit the released base to evolve an existing database. Add a numbered
incremental migration, extend the ordered dispatcher and advance the owning
component's record only after its transaction succeeds. Include both fresh-base
and supported-version upgrade tests. Keep physical database ownership and
runtime recovery separate from schema versioning.

The focused contracts live in
`tests/agent_cli/test_database_migrations.py`, alongside the existing session,
Kanban, cron, API, room, metrics and verification behavior suites. Run them with
`scripts/run_tests.sh`, using isolated homes and temporary database files.
