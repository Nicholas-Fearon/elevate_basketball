import test from 'node:test';
import assert from 'node:assert/strict';
import {validateEntry, validateVersion, validateNoteId} from '../lib/notebook-validation.mjs';
const entry = {title: '  Passing practice  ', kind: 'session', entry_date: '2026-11-23', content: 'Ball familiarisation and dribbling'};
test('notebook validates both entry types and preserves plain text', () => {
  assert.equal(validateEntry(entry).title, 'Passing practice');
  assert.equal(validateEntry({...entry, kind: 'journal', content: '<script>notes</script>'}).content, '<script>notes</script>');
});
test('rejects malformed dates and oversized or unexpected fields', () => {
  for (const change of [{entry_date: '2027-02-29'}, {entry_date: '2026-04-31'}, {title: ' '}, {title: 'a'.repeat(161)}, {content: 'x'.repeat(20001)}, {kind: 'public'}, {published: true}, {version: 1}]) assert.throws(() => validateEntry({...entry, ...change}));
  for (const value of [null, [], 'text']) assert.throws(() => validateEntry(value));
  assert.equal(validateEntry({...entry, entry_date: '2028-02-29'}).entry_date, '2028-02-29');
});
test('entry identities and optimistic versions are strictly validated', () => {
  assert.equal(validateVersion(1), 1);
  for (const value of [null, '1', 0, -1, 1.5, 2147483647]) assert.throws(() => validateVersion(value));
  assert.equal(validateNoteId('12345678-1234-1234-1234-123456789abc'), '12345678-1234-1234-1234-123456789abc');
  for (const value of [null, 'bad', {}, 123]) assert.throws(() => validateNoteId(value));
});
