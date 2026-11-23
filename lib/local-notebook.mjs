import {validateEntry, validateNoteId, validateVersion} from './notebook-validation.mjs';
export const BACKUP_FORMAT = 'elevate-coaching-notebook-v1';
export const MAX_BACKUP_BYTES = 10 * 1024 * 1024;
function openDatabase(userId) {
  if (!/^user_[A-Za-z0-9]+$/.test(userId || '')) return Promise.reject(new Error('Sign in to open your notebook.'));
  if (!globalThis.indexedDB) return Promise.reject(new Error('Browser storage is unavailable. Use a browser with IndexedDB enabled.'));
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(`elevate-notebook:${userId}`, 1);
    request.onupgradeneeded = () => request.result.createObjectStore('entries', {keyPath: 'id'});
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(new Error('Cannot open browser storage. Check your browser settings.'));
  });
}
async function transaction(userId, mode, operation) {
  const db = await openDatabase(userId);
  return new Promise((resolve, reject) => {
    const tx = db.transaction('entries', mode);
    let result, failure;
    tx.oncomplete = () => {db.close(); resolve(result);};
    tx.onabort = () => {db.close(); reject(failure || new Error('Browser storage could not save your changes. Check available storage and try again.'));};
    try {operation(tx.objectStore('entries'), value => {result = value;}, error => {failure = error; tx.abort();});}
    catch (error) {failure = error; tx.abort();}
  });
}
export function listEntries(userId) {
  return transaction(userId, 'readonly', (store, done) => {
    store.getAll().onsuccess = event => done(event.target.result);
  });
}
export function saveEntry(userId, fields, selected = null) {
  const value = validateEntry(fields);
  if (selected) {validateNoteId(selected.id); validateVersion(selected.version);}
  return transaction(userId, 'readwrite', (store, done, fail) => {
    const write = previous => {
      const now = new Date().toISOString();
      const entry = {...value, id: previous?.id || crypto.randomUUID(), version: previous ? previous.version + 1 : 1, created_at: previous?.created_at || now, updated_at: now};
      store.put(entry); done(entry);
    };
    if (!selected) return write(null);
    store.get(selected.id).onsuccess = event => {
      const previous = event.target.result;
      if (!previous || previous.version !== selected.version) return fail(new Error('This entry changed or was deleted in another tab. Copy your unsaved notes, then reload the notebook.'));
      write(previous);
    };
  });
}
export function deleteEntry(userId, selected) {
  validateNoteId(selected.id); validateVersion(selected.version);
  return transaction(userId, 'readwrite', (store, done, fail) => {
    store.get(selected.id).onsuccess = event => {
      const previous = event.target.result;
      if (!previous || previous.version !== selected.version) return fail(new Error('This entry changed or was deleted in another tab. Reload before deleting.'));
      store.delete(selected.id); done(true);
    };
  });
}
export function parseBackup(text) {
  if (new TextEncoder().encode(text).length > MAX_BACKUP_BYTES) throw new Error('Choose a backup smaller than 10 MB.');
  let backup;
  try {backup = JSON.parse(text);} catch {throw new Error('This file is not a valid notebook backup.');}
  if (!backup || backup.format !== BACKUP_FORMAT || !Array.isArray(backup.entries) || backup.entries.length > 1000) throw new Error('Choose an Elevate notebook backup with at most 1,000 entries.');
  return backup.entries.map(entry => {
    if (!entry || typeof entry !== 'object') throw new Error('The backup contains an invalid entry.');
    return validateEntry({title: entry.title, kind: entry.kind, entry_date: entry.entry_date, content: entry.content});
  });
}
export async function exportBackup(userId) {
  const entries = await listEntries(userId);
  const text = JSON.stringify({format: BACKUP_FORMAT, exported_at: new Date().toISOString(), entries}, null, 2);
  // Never export a file that this version cannot import.
  parseBackup(text);
  return text;
}
export function importBackup(userId, text) {
  const entries = parseBackup(text);
  return transaction(userId, 'readwrite', (store, done) => {
    const now = new Date().toISOString();
    for (const entry of entries) store.add({...entry, id: crypto.randomUUID(), version: 1, created_at: now, updated_at: now});
    done(entries.length);
  });
}
