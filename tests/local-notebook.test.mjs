import test from 'node:test';
import assert from 'node:assert/strict';
import 'fake-indexeddb/auto';
import {IDBObjectStore} from 'fake-indexeddb';
import {listEntries, saveEntry, deleteEntry, exportBackup, importBackup, parseBackup, BACKUP_FORMAT} from '../lib/local-notebook.mjs';
const fields = {title: 'Passing', kind: 'session', entry_date: '2026-11-23', content: 'Dribbling, passing and games'};
test('saved entries persist across connections and accounts remain separate', async () => {
  const entry = await saveEntry('user_persist', fields);
  assert.deepEqual(await listEntries('user_persist'), [entry]);
  assert.deepEqual(await listEntries('user_other'), []);
  await assert.rejects(listEntries(''), /Sign in/);
});
test('concurrent writes reject a stale version without losing saved work', async () => {
  const original = await saveEntry('user_concurrent', fields);
  const results = await Promise.allSettled([
    saveEntry('user_concurrent', {...fields, title: 'First'}, original),
    saveEntry('user_concurrent', {...fields, title: 'Second'}, original),
  ]);
  assert.equal(results.filter(r => r.status === 'fulfilled').length, 1);
  assert.equal(results.filter(r => r.status === 'rejected').length, 1);
  const [latest] = await listEntries('user_concurrent');
  assert.equal(latest.version, 2);
  await assert.rejects(deleteEntry('user_concurrent', original), /another tab/);
  await deleteEntry('user_concurrent', latest);
  assert.deepEqual(await listEntries('user_concurrent'), []);
  await assert.rejects(saveEntry('user_concurrent', fields, latest), /another tab/);
});
test('backup round trip preserves content and never replaces existing entries', async () => {
  const original = await saveEntry('user_backup', fields);
  const backup = await exportBackup('user_backup');
  assert.equal(await importBackup('user_restore', backup), 1);
  const [restored] = await listEntries('user_restore');
  assert.equal(restored.content, original.content);
  assert.equal(restored.entry_date, original.entry_date);
  assert.notEqual(restored.id, original.id);
  await importBackup('user_restore', backup);
  assert.equal((await listEntries('user_restore')).length, 2);
});
test('malformed backups are rejected completely before any write', async () => {
  await saveEntry('user_invalid', fields);
  const bad = JSON.stringify({format: BACKUP_FORMAT, entries: [fields, {...fields, entry_date: '2026-02-30'}]});
  assert.throws(() => importBackup('user_invalid', bad));
  assert.equal((await listEntries('user_invalid')).length, 1);
  for (const text of ['not json', '{}', 'null', JSON.stringify({format: BACKUP_FORMAT, entries: [null]})]) assert.throws(() => parseBackup(text));
});
test('failed imports roll back and storage failures never report success', async t => {
  const backup = JSON.stringify({format: BACKUP_FORMAT, entries: [fields, fields]});
  const originalAdd = IDBObjectStore.prototype.add;
  let calls = 0;
  const add = t.mock.method(IDBObjectStore.prototype, 'add', function(...args) {
    if (++calls === 2) throw new Error('Storage full');
    return originalAdd.apply(this, args);
  });
  await assert.rejects(importBackup('user_rollback', backup), /Storage full/);
  add.mock.restore();
  assert.deepEqual(await listEntries('user_rollback'), []);
  const put = t.mock.method(IDBObjectStore.prototype, 'put', () => {throw new Error('Storage full');});
  await assert.rejects(saveEntry('user_rollback', fields), /Storage full/);
  put.mock.restore();
  assert.deepEqual(await listEntries('user_rollback'), []);
});
