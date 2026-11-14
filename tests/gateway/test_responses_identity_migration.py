"""Current terminal identities remain bounded after reopening; live identities survive."""
import asyncio

import pytest
from aiohttp import web
from aiohttp.test_utils import TestClient, TestServer

from tests.gateway.test_responses_identity_retention import _app


def _evict_terminal_bodies(store):
    conn = store._conn
    conn.execute("DELETE FROM responses WHERE response_id LIKE 'idem:%'")
    conn.commit()


@pytest.mark.asyncio
async def test_reopened_terminal_identities_age_out_but_a_live_one_is_kept(api, owner):
    from gateway.platforms.api_server_response_store import ResponseStore
    calls, gate = [], (asyncio.Event(), asyncio.Event())
    path = api._response_store._db_path
    async with TestClient(TestServer(_app(api, owner, calls, gate))) as client:
        for index in range(12):
            response = await client.post('/v1/responses', json={'input': f'old {index}'},
                                         headers={'Idempotency-Key': f'old-{index}'})
            assert response.status == 200
        slow = asyncio.create_task(client.post('/v1/responses', json={'input': 'slow'},
                                               headers={'Idempotency-Key': 'live'}))
        try:
            await asyncio.wait_for(gate[0].wait(), 10)
            _evict_terminal_bodies(api._response_store)
            api._response_store.close()
            # The upgraded release reopens the same file with a small identity bound.
            api._response_store = ResponseStore(db_path=path, max_size=1, max_identities=3)
            for index in range(5):
                response = await client.post('/v1/responses', json={'input': f'new {index}'},
                                             headers={'Idempotency-Key': f'new-{index}'})
                assert response.status == 200
            keys = sorted(row[0].rsplit(':', 1)[1] for row in
                          api._response_store._conn.execute('SELECT request_key FROM response_keys'))
            # Migrated finished identities age out first; the request still running keeps its identity.
            assert keys == ['live', 'new-2', 'new-3', 'new-4'], keys
        finally:
            gate[1].set()
        original = await (await slow).json()
        retry = await client.post('/v1/responses', json={'input': 'slow'}, headers={'Idempotency-Key': 'live'})
        assert retry.status == 200 and await retry.json() == original
        # An aged-out migrated key is still refused, never executed a second time.
        expired = await client.post('/v1/responses', json={'input': 'old 11'},
                                    headers={'Idempotency-Key': 'old-11'})
        assert expired.status == 409
        assert (await expired.json())['error']['code'] == 'admission_conflict'
    assert calls == [f'old {index}' for index in range(12)] + ['slow'] + [f'new {index}' for index in range(5)]
