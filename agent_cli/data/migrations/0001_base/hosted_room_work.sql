-- NoOne migration 0001: scoped room work evidence.
-- Invalid current records remain quarantined by disposition; obsolete import-only evidence storage is absent.

CREATE TABLE hosted_room_work_records_source (
            room_id TEXT NOT NULL, revision INTEGER NOT NULL, digest TEXT NOT NULL, record_json TEXT NOT NULL,
            producer_gateway_id TEXT NOT NULL, producer_epoch INTEGER NOT NULL,
            disposition TEXT NOT NULL CHECK(disposition IN ('current','superseded_authority','historical','invalid')),
             PRIMARY KEY(room_id,producer_gateway_id,producer_epoch),
            FOREIGN KEY(room_id) REFERENCES hosted_rooms(room_id) ON DELETE CASCADE);

CREATE TABLE hosted_room_work_records_pending (
            room_id TEXT NOT NULL, revision INTEGER NOT NULL, digest TEXT NOT NULL, record_json TEXT NOT NULL,
            producer_gateway_id TEXT NOT NULL, producer_epoch INTEGER NOT NULL,
            disposition TEXT NOT NULL CHECK(disposition IN ('current','superseded_authority','historical','invalid')),
            target_install_id TEXT NOT NULL, route_generation TEXT NOT NULL, status TEXT NOT NULL, PRIMARY KEY(room_id,producer_gateway_id,producer_epoch,target_install_id),
            FOREIGN KEY(room_id) REFERENCES hosted_rooms(room_id) ON DELETE CASCADE);

CREATE TRIGGER trg_hosted_room_work_records_source_budget_v4_insert
                BEFORE INSERT ON hosted_room_work_records_source WHEN (
                    ((20+COALESCE(length(CAST(NEW.room_id AS BLOB)),0)+COALESCE(length(CAST(NEW.revision AS BLOB)),0)+COALESCE(length(CAST(NEW.digest AS BLOB)),0)+COALESCE(length(CAST(NEW.record_json AS BLOB)),0)+COALESCE(length(CAST(NEW.producer_gateway_id AS BLOB)),0)+COALESCE(length(CAST(NEW.producer_epoch AS BLOB)),0))>(COALESCE((SELECT 20+COALESCE(length(CAST(room_id AS BLOB)),0)+COALESCE(length(CAST(revision AS BLOB)),0)+COALESCE(length(CAST(digest AS BLOB)),0)+COALESCE(length(CAST(record_json AS BLOB)),0)+COALESCE(length(CAST(producer_gateway_id AS BLOB)),0)+COALESCE(length(CAST(producer_epoch AS BLOB)),0) FROM hosted_room_work_records_source WHERE room_id=NEW.room_id
    AND producer_gateway_id=NEW.producer_gateway_id
    AND producer_epoch=NEW.producer_epoch),0))
    AND ((SELECT COALESCE(SUM(20+COALESCE(length(CAST(room_id AS BLOB)),0)+COALESCE(length(CAST(revision AS BLOB)),0)+COALESCE(length(CAST(digest AS BLOB)),0)+COALESCE(length(CAST(record_json AS BLOB)),0)+COALESCE(length(CAST(producer_gateway_id AS BLOB)),0)+COALESCE(length(CAST(producer_epoch AS BLOB)),0)),0) FROM hosted_room_work_records_source)
        + (SELECT COALESCE(SUM(20+COALESCE(length(CAST(room_id AS BLOB)),0)+COALESCE(length(CAST(revision AS BLOB)),0)+COALESCE(length(CAST(digest AS BLOB)),0)+COALESCE(length(CAST(record_json AS BLOB)),0)+COALESCE(length(CAST(producer_gateway_id AS BLOB)),0)+COALESCE(length(CAST(producer_epoch AS BLOB)),0)+COALESCE(length(CAST(target_install_id AS BLOB)),0)+COALESCE(length(CAST(route_generation AS BLOB)),0)+COALESCE(length(CAST(status AS BLOB)),0)),0) FROM hosted_room_work_records_pending))-(COALESCE((SELECT 20+COALESCE(length(CAST(room_id AS BLOB)),0)+COALESCE(length(CAST(revision AS BLOB)),0)+COALESCE(length(CAST(digest AS BLOB)),0)+COALESCE(length(CAST(record_json AS BLOB)),0)+COALESCE(length(CAST(producer_gateway_id AS BLOB)),0)+COALESCE(length(CAST(producer_epoch AS BLOB)),0) FROM hosted_room_work_records_source WHERE room_id=NEW.room_id
    AND producer_gateway_id=NEW.producer_gateway_id
    AND producer_epoch=NEW.producer_epoch),0))+(20+COALESCE(length(CAST(NEW.room_id AS BLOB)),0)+COALESCE(length(CAST(NEW.revision AS BLOB)),0)+COALESCE(length(CAST(NEW.digest AS BLOB)),0)+COALESCE(length(CAST(NEW.record_json AS BLOB)),0)+COALESCE(length(CAST(NEW.producer_gateway_id AS BLOB)),0)+COALESCE(length(CAST(NEW.producer_epoch AS BLOB)),0))>4194304)

    OR ((SELECT COUNT(*) FROM hosted_room_work_records_source WHERE room_id=NEW.room_id
    AND producer_gateway_id=NEW.producer_gateway_id
    AND producer_epoch=NEW.producer_epoch)=0
    AND ((SELECT COALESCE(SUM(20+COALESCE(length(CAST(room_id AS BLOB)),0)+COALESCE(length(CAST(revision AS BLOB)),0)+COALESCE(length(CAST(digest AS BLOB)),0)+COALESCE(length(CAST(record_json AS BLOB)),0)+COALESCE(length(CAST(producer_gateway_id AS BLOB)),0)+COALESCE(length(CAST(producer_epoch AS BLOB)),0)),0) FROM hosted_room_work_records_source)
        + (SELECT COALESCE(SUM(20+COALESCE(length(CAST(room_id AS BLOB)),0)+COALESCE(length(CAST(revision AS BLOB)),0)+COALESCE(length(CAST(digest AS BLOB)),0)+COALESCE(length(CAST(record_json AS BLOB)),0)+COALESCE(length(CAST(producer_gateway_id AS BLOB)),0)+COALESCE(length(CAST(producer_epoch AS BLOB)),0)+COALESCE(length(CAST(target_install_id AS BLOB)),0)+COALESCE(length(CAST(route_generation AS BLOB)),0)+COALESCE(length(CAST(status AS BLOB)),0)),0) FROM hosted_room_work_records_pending)>4194304
    OR (SELECT COUNT(*) FROM hosted_room_work_records_source)
        + (SELECT COUNT(*) FROM hosted_room_work_records_pending)+1>512)))
                BEGIN SELECT RAISE(ABORT, 'work record storage is full'); END;

CREATE TRIGGER trg_hosted_room_work_records_source_budget_v4_update
                BEFORE UPDATE ON hosted_room_work_records_source WHEN (
                    ((20+COALESCE(length(CAST(NEW.room_id AS BLOB)),0)+COALESCE(length(CAST(NEW.revision AS BLOB)),0)+COALESCE(length(CAST(NEW.digest AS BLOB)),0)+COALESCE(length(CAST(NEW.record_json AS BLOB)),0)+COALESCE(length(CAST(NEW.producer_gateway_id AS BLOB)),0)+COALESCE(length(CAST(NEW.producer_epoch AS BLOB)),0))>(20+COALESCE(length(CAST(OLD.room_id AS BLOB)),0)+COALESCE(length(CAST(OLD.revision AS BLOB)),0)+COALESCE(length(CAST(OLD.digest AS BLOB)),0)+COALESCE(length(CAST(OLD.record_json AS BLOB)),0)+COALESCE(length(CAST(OLD.producer_gateway_id AS BLOB)),0)+COALESCE(length(CAST(OLD.producer_epoch AS BLOB)),0))
    AND ((SELECT COALESCE(SUM(20+COALESCE(length(CAST(room_id AS BLOB)),0)+COALESCE(length(CAST(revision AS BLOB)),0)+COALESCE(length(CAST(digest AS BLOB)),0)+COALESCE(length(CAST(record_json AS BLOB)),0)+COALESCE(length(CAST(producer_gateway_id AS BLOB)),0)+COALESCE(length(CAST(producer_epoch AS BLOB)),0)),0) FROM hosted_room_work_records_source)
        + (SELECT COALESCE(SUM(20+COALESCE(length(CAST(room_id AS BLOB)),0)+COALESCE(length(CAST(revision AS BLOB)),0)+COALESCE(length(CAST(digest AS BLOB)),0)+COALESCE(length(CAST(record_json AS BLOB)),0)+COALESCE(length(CAST(producer_gateway_id AS BLOB)),0)+COALESCE(length(CAST(producer_epoch AS BLOB)),0)+COALESCE(length(CAST(target_install_id AS BLOB)),0)+COALESCE(length(CAST(route_generation AS BLOB)),0)+COALESCE(length(CAST(status AS BLOB)),0)),0) FROM hosted_room_work_records_pending))-(20+COALESCE(length(CAST(OLD.room_id AS BLOB)),0)+COALESCE(length(CAST(OLD.revision AS BLOB)),0)+COALESCE(length(CAST(OLD.digest AS BLOB)),0)+COALESCE(length(CAST(OLD.record_json AS BLOB)),0)+COALESCE(length(CAST(OLD.producer_gateway_id AS BLOB)),0)+COALESCE(length(CAST(OLD.producer_epoch AS BLOB)),0))+(20+COALESCE(length(CAST(NEW.room_id AS BLOB)),0)+COALESCE(length(CAST(NEW.revision AS BLOB)),0)+COALESCE(length(CAST(NEW.digest AS BLOB)),0)+COALESCE(length(CAST(NEW.record_json AS BLOB)),0)+COALESCE(length(CAST(NEW.producer_gateway_id AS BLOB)),0)+COALESCE(length(CAST(NEW.producer_epoch AS BLOB)),0))>4194304)

    OR (1=0
    AND ((SELECT COALESCE(SUM(20+COALESCE(length(CAST(room_id AS BLOB)),0)+COALESCE(length(CAST(revision AS BLOB)),0)+COALESCE(length(CAST(digest AS BLOB)),0)+COALESCE(length(CAST(record_json AS BLOB)),0)+COALESCE(length(CAST(producer_gateway_id AS BLOB)),0)+COALESCE(length(CAST(producer_epoch AS BLOB)),0)),0) FROM hosted_room_work_records_source)
        + (SELECT COALESCE(SUM(20+COALESCE(length(CAST(room_id AS BLOB)),0)+COALESCE(length(CAST(revision AS BLOB)),0)+COALESCE(length(CAST(digest AS BLOB)),0)+COALESCE(length(CAST(record_json AS BLOB)),0)+COALESCE(length(CAST(producer_gateway_id AS BLOB)),0)+COALESCE(length(CAST(producer_epoch AS BLOB)),0)+COALESCE(length(CAST(target_install_id AS BLOB)),0)+COALESCE(length(CAST(route_generation AS BLOB)),0)+COALESCE(length(CAST(status AS BLOB)),0)),0) FROM hosted_room_work_records_pending)>4194304
    OR (SELECT COUNT(*) FROM hosted_room_work_records_source)
        + (SELECT COUNT(*) FROM hosted_room_work_records_pending)+1>512)))
                BEGIN SELECT RAISE(ABORT, 'work record storage is full'); END;

CREATE TRIGGER trg_hosted_room_work_records_source_immutable_v2
            BEFORE UPDATE ON hosted_room_work_records_source WHEN
                NEW.room_id!=OLD.room_id
    OR NEW.producer_gateway_id!=OLD.producer_gateway_id

    OR NEW.producer_epoch!=OLD.producer_epoch

    OR (OLD.disposition!='current'
    AND (NEW.record_json!=OLD.record_json
    OR NEW.revision!=OLD.revision

    OR NEW.digest!=OLD.digest
    OR NEW.disposition!=OLD.disposition))
            BEGIN SELECT RAISE(ABORT, 'historical work record is immutable'); END;

CREATE TRIGGER trg_hosted_room_work_records_source_delete_v2 BEFORE DELETE ON hosted_room_work_records_source
            WHEN OLD.disposition!='current'
    AND EXISTS (SELECT 1 FROM hosted_rooms
                WHERE room_id=OLD.room_id
    AND disbanded_at IS NULL)
            BEGIN SELECT RAISE(ABORT, 'historical work record is immutable'); END;

CREATE TRIGGER trg_hosted_room_work_records_source_replace_v2
            BEFORE INSERT ON hosted_room_work_records_source WHEN EXISTS (SELECT 1 FROM hosted_room_work_records_source p WHERE p.room_id=NEW.room_id

    AND p.producer_gateway_id=NEW.producer_gateway_id
    AND p.producer_epoch=NEW.producer_epoch

    AND p.disposition!='current')
            BEGIN SELECT RAISE(ABORT, 'historical work record is immutable'); END;

CREATE TRIGGER trg_hosted_room_work_records_pending_budget_v4_insert
                BEFORE INSERT ON hosted_room_work_records_pending WHEN (
                    ((20+COALESCE(length(CAST(NEW.room_id AS BLOB)),0)+COALESCE(length(CAST(NEW.revision AS BLOB)),0)+COALESCE(length(CAST(NEW.digest AS BLOB)),0)+COALESCE(length(CAST(NEW.record_json AS BLOB)),0)+COALESCE(length(CAST(NEW.producer_gateway_id AS BLOB)),0)+COALESCE(length(CAST(NEW.producer_epoch AS BLOB)),0)+COALESCE(length(CAST(NEW.target_install_id AS BLOB)),0)+COALESCE(length(CAST(NEW.route_generation AS BLOB)),0)+COALESCE(length(CAST(NEW.status AS BLOB)),0))>(COALESCE((SELECT 20+COALESCE(length(CAST(room_id AS BLOB)),0)+COALESCE(length(CAST(revision AS BLOB)),0)+COALESCE(length(CAST(digest AS BLOB)),0)+COALESCE(length(CAST(record_json AS BLOB)),0)+COALESCE(length(CAST(producer_gateway_id AS BLOB)),0)+COALESCE(length(CAST(producer_epoch AS BLOB)),0)+COALESCE(length(CAST(target_install_id AS BLOB)),0)+COALESCE(length(CAST(route_generation AS BLOB)),0)+COALESCE(length(CAST(status AS BLOB)),0) FROM hosted_room_work_records_pending WHERE room_id=NEW.room_id
    AND producer_gateway_id=NEW.producer_gateway_id
    AND producer_epoch=NEW.producer_epoch
    AND target_install_id=NEW.target_install_id),0))
    AND ((SELECT COALESCE(SUM(20+COALESCE(length(CAST(room_id AS BLOB)),0)+COALESCE(length(CAST(revision AS BLOB)),0)+COALESCE(length(CAST(digest AS BLOB)),0)+COALESCE(length(CAST(record_json AS BLOB)),0)+COALESCE(length(CAST(producer_gateway_id AS BLOB)),0)+COALESCE(length(CAST(producer_epoch AS BLOB)),0)),0) FROM hosted_room_work_records_source)
        + (SELECT COALESCE(SUM(20+COALESCE(length(CAST(room_id AS BLOB)),0)+COALESCE(length(CAST(revision AS BLOB)),0)+COALESCE(length(CAST(digest AS BLOB)),0)+COALESCE(length(CAST(record_json AS BLOB)),0)+COALESCE(length(CAST(producer_gateway_id AS BLOB)),0)+COALESCE(length(CAST(producer_epoch AS BLOB)),0)+COALESCE(length(CAST(target_install_id AS BLOB)),0)+COALESCE(length(CAST(route_generation AS BLOB)),0)+COALESCE(length(CAST(status AS BLOB)),0)),0) FROM hosted_room_work_records_pending))-(COALESCE((SELECT 20+COALESCE(length(CAST(room_id AS BLOB)),0)+COALESCE(length(CAST(revision AS BLOB)),0)+COALESCE(length(CAST(digest AS BLOB)),0)+COALESCE(length(CAST(record_json AS BLOB)),0)+COALESCE(length(CAST(producer_gateway_id AS BLOB)),0)+COALESCE(length(CAST(producer_epoch AS BLOB)),0)+COALESCE(length(CAST(target_install_id AS BLOB)),0)+COALESCE(length(CAST(route_generation AS BLOB)),0)+COALESCE(length(CAST(status AS BLOB)),0) FROM hosted_room_work_records_pending WHERE room_id=NEW.room_id
    AND producer_gateway_id=NEW.producer_gateway_id
    AND producer_epoch=NEW.producer_epoch
    AND target_install_id=NEW.target_install_id),0))+(20+COALESCE(length(CAST(NEW.room_id AS BLOB)),0)+COALESCE(length(CAST(NEW.revision AS BLOB)),0)+COALESCE(length(CAST(NEW.digest AS BLOB)),0)+COALESCE(length(CAST(NEW.record_json AS BLOB)),0)+COALESCE(length(CAST(NEW.producer_gateway_id AS BLOB)),0)+COALESCE(length(CAST(NEW.producer_epoch AS BLOB)),0)+COALESCE(length(CAST(NEW.target_install_id AS BLOB)),0)+COALESCE(length(CAST(NEW.route_generation AS BLOB)),0)+COALESCE(length(CAST(NEW.status AS BLOB)),0))>4194304)

    OR ((SELECT COUNT(*) FROM hosted_room_work_records_pending WHERE room_id=NEW.room_id
    AND producer_gateway_id=NEW.producer_gateway_id
    AND producer_epoch=NEW.producer_epoch
    AND target_install_id=NEW.target_install_id)=0
    AND ((SELECT COALESCE(SUM(20+COALESCE(length(CAST(room_id AS BLOB)),0)+COALESCE(length(CAST(revision AS BLOB)),0)+COALESCE(length(CAST(digest AS BLOB)),0)+COALESCE(length(CAST(record_json AS BLOB)),0)+COALESCE(length(CAST(producer_gateway_id AS BLOB)),0)+COALESCE(length(CAST(producer_epoch AS BLOB)),0)),0) FROM hosted_room_work_records_source)
        + (SELECT COALESCE(SUM(20+COALESCE(length(CAST(room_id AS BLOB)),0)+COALESCE(length(CAST(revision AS BLOB)),0)+COALESCE(length(CAST(digest AS BLOB)),0)+COALESCE(length(CAST(record_json AS BLOB)),0)+COALESCE(length(CAST(producer_gateway_id AS BLOB)),0)+COALESCE(length(CAST(producer_epoch AS BLOB)),0)+COALESCE(length(CAST(target_install_id AS BLOB)),0)+COALESCE(length(CAST(route_generation AS BLOB)),0)+COALESCE(length(CAST(status AS BLOB)),0)),0) FROM hosted_room_work_records_pending)>4194304
    OR (SELECT COUNT(*) FROM hosted_room_work_records_source)
        + (SELECT COUNT(*) FROM hosted_room_work_records_pending)+1>512)))
                BEGIN SELECT RAISE(ABORT, 'work record storage is full'); END;

CREATE TRIGGER trg_hosted_room_work_records_pending_budget_v4_update
                BEFORE UPDATE ON hosted_room_work_records_pending WHEN (
                    ((20+COALESCE(length(CAST(NEW.room_id AS BLOB)),0)+COALESCE(length(CAST(NEW.revision AS BLOB)),0)+COALESCE(length(CAST(NEW.digest AS BLOB)),0)+COALESCE(length(CAST(NEW.record_json AS BLOB)),0)+COALESCE(length(CAST(NEW.producer_gateway_id AS BLOB)),0)+COALESCE(length(CAST(NEW.producer_epoch AS BLOB)),0)+COALESCE(length(CAST(NEW.target_install_id AS BLOB)),0)+COALESCE(length(CAST(NEW.route_generation AS BLOB)),0)+COALESCE(length(CAST(NEW.status AS BLOB)),0))>(20+COALESCE(length(CAST(OLD.room_id AS BLOB)),0)+COALESCE(length(CAST(OLD.revision AS BLOB)),0)+COALESCE(length(CAST(OLD.digest AS BLOB)),0)+COALESCE(length(CAST(OLD.record_json AS BLOB)),0)+COALESCE(length(CAST(OLD.producer_gateway_id AS BLOB)),0)+COALESCE(length(CAST(OLD.producer_epoch AS BLOB)),0)+COALESCE(length(CAST(OLD.target_install_id AS BLOB)),0)+COALESCE(length(CAST(OLD.route_generation AS BLOB)),0)+COALESCE(length(CAST(OLD.status AS BLOB)),0))
    AND ((SELECT COALESCE(SUM(20+COALESCE(length(CAST(room_id AS BLOB)),0)+COALESCE(length(CAST(revision AS BLOB)),0)+COALESCE(length(CAST(digest AS BLOB)),0)+COALESCE(length(CAST(record_json AS BLOB)),0)+COALESCE(length(CAST(producer_gateway_id AS BLOB)),0)+COALESCE(length(CAST(producer_epoch AS BLOB)),0)),0) FROM hosted_room_work_records_source)
        + (SELECT COALESCE(SUM(20+COALESCE(length(CAST(room_id AS BLOB)),0)+COALESCE(length(CAST(revision AS BLOB)),0)+COALESCE(length(CAST(digest AS BLOB)),0)+COALESCE(length(CAST(record_json AS BLOB)),0)+COALESCE(length(CAST(producer_gateway_id AS BLOB)),0)+COALESCE(length(CAST(producer_epoch AS BLOB)),0)+COALESCE(length(CAST(target_install_id AS BLOB)),0)+COALESCE(length(CAST(route_generation AS BLOB)),0)+COALESCE(length(CAST(status AS BLOB)),0)),0) FROM hosted_room_work_records_pending))-(20+COALESCE(length(CAST(OLD.room_id AS BLOB)),0)+COALESCE(length(CAST(OLD.revision AS BLOB)),0)+COALESCE(length(CAST(OLD.digest AS BLOB)),0)+COALESCE(length(CAST(OLD.record_json AS BLOB)),0)+COALESCE(length(CAST(OLD.producer_gateway_id AS BLOB)),0)+COALESCE(length(CAST(OLD.producer_epoch AS BLOB)),0)+COALESCE(length(CAST(OLD.target_install_id AS BLOB)),0)+COALESCE(length(CAST(OLD.route_generation AS BLOB)),0)+COALESCE(length(CAST(OLD.status AS BLOB)),0))+(20+COALESCE(length(CAST(NEW.room_id AS BLOB)),0)+COALESCE(length(CAST(NEW.revision AS BLOB)),0)+COALESCE(length(CAST(NEW.digest AS BLOB)),0)+COALESCE(length(CAST(NEW.record_json AS BLOB)),0)+COALESCE(length(CAST(NEW.producer_gateway_id AS BLOB)),0)+COALESCE(length(CAST(NEW.producer_epoch AS BLOB)),0)+COALESCE(length(CAST(NEW.target_install_id AS BLOB)),0)+COALESCE(length(CAST(NEW.route_generation AS BLOB)),0)+COALESCE(length(CAST(NEW.status AS BLOB)),0))>4194304)

    OR (1=0
    AND ((SELECT COALESCE(SUM(20+COALESCE(length(CAST(room_id AS BLOB)),0)+COALESCE(length(CAST(revision AS BLOB)),0)+COALESCE(length(CAST(digest AS BLOB)),0)+COALESCE(length(CAST(record_json AS BLOB)),0)+COALESCE(length(CAST(producer_gateway_id AS BLOB)),0)+COALESCE(length(CAST(producer_epoch AS BLOB)),0)),0) FROM hosted_room_work_records_source)
        + (SELECT COALESCE(SUM(20+COALESCE(length(CAST(room_id AS BLOB)),0)+COALESCE(length(CAST(revision AS BLOB)),0)+COALESCE(length(CAST(digest AS BLOB)),0)+COALESCE(length(CAST(record_json AS BLOB)),0)+COALESCE(length(CAST(producer_gateway_id AS BLOB)),0)+COALESCE(length(CAST(producer_epoch AS BLOB)),0)+COALESCE(length(CAST(target_install_id AS BLOB)),0)+COALESCE(length(CAST(route_generation AS BLOB)),0)+COALESCE(length(CAST(status AS BLOB)),0)),0) FROM hosted_room_work_records_pending)>4194304
    OR (SELECT COUNT(*) FROM hosted_room_work_records_source)
        + (SELECT COUNT(*) FROM hosted_room_work_records_pending)+1>512)))
                BEGIN SELECT RAISE(ABORT, 'work record storage is full'); END;

CREATE TRIGGER trg_hosted_room_work_records_pending_immutable_v2
            BEFORE UPDATE ON hosted_room_work_records_pending WHEN
                NEW.room_id!=OLD.room_id
    OR NEW.producer_gateway_id!=OLD.producer_gateway_id

    OR NEW.producer_epoch!=OLD.producer_epoch

    OR (OLD.disposition!='current'
    AND (NEW.record_json!=OLD.record_json
    OR NEW.revision!=OLD.revision

    OR NEW.digest!=OLD.digest
    OR NEW.disposition!=OLD.disposition))
            BEGIN SELECT RAISE(ABORT, 'historical work record is immutable'); END;

CREATE TRIGGER trg_hosted_room_work_records_pending_delete_v2 BEFORE DELETE ON hosted_room_work_records_pending
            WHEN OLD.disposition!='current'
    AND EXISTS (SELECT 1 FROM hosted_rooms
                WHERE room_id=OLD.room_id
    AND disbanded_at IS NULL)
            BEGIN SELECT RAISE(ABORT, 'historical work record is immutable'); END;

CREATE TRIGGER trg_hosted_room_work_records_pending_replace_v2
            BEFORE INSERT ON hosted_room_work_records_pending WHEN EXISTS (SELECT 1 FROM hosted_room_work_records_pending p WHERE p.room_id=NEW.room_id

    AND p.producer_gateway_id=NEW.producer_gateway_id
    AND p.producer_epoch=NEW.producer_epoch

    AND p.target_install_id=NEW.target_install_id
    AND p.disposition!='current')
            BEGIN SELECT RAISE(ABORT, 'historical work record is immutable'); END;

CREATE TRIGGER trg_work_pending_outcome_v2 BEFORE UPDATE ON hosted_room_work_records_pending
        WHEN OLD.disposition!='current'
    AND (NEW.status!=OLD.status
    OR NEW.route_generation!=OLD.route_generation

    OR NEW.target_install_id!=OLD.target_install_id)
        BEGIN SELECT RAISE(ABORT, 'historical delivery outcome is immutable'); END;

CREATE TRIGGER trg_work_authority_transition_v2
        AFTER UPDATE OF authority_gateway_id,authority_epoch ON hosted_rooms BEGIN
        UPDATE hosted_room_work_records_source SET disposition='historical' WHERE room_id=NEW.room_id
    AND disposition='current'

    AND (producer_gateway_id!=NEW.authority_gateway_id
    OR producer_epoch!=NEW.authority_epoch);
        UPDATE hosted_room_work_records_pending SET disposition=CASE WHEN status='acked' THEN 'historical' ELSE 'superseded_authority' END
            WHERE room_id=NEW.room_id
    AND disposition='current'

    AND (producer_gateway_id!=NEW.authority_gateway_id
    OR producer_epoch!=NEW.authority_epoch);
        END;
