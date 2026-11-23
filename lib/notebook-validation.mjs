import { AdminError, UUID } from './admin-validation.mjs';
export function validateEntry(data) {
  if (!data || typeof data !== 'object' || Array.isArray(data)) throw new AdminError('Enter notebook details.');
  if (Object.keys(data).some(key => !['title', 'kind', 'entry_date', 'content'].includes(key))) throw new AdminError('Unknown notebook field.');
  if (!['journal', 'session'].includes(data.kind)) throw new AdminError('Choose journal or session plan.');
  if (typeof data.title !== 'string' || !data.title.trim() || data.title.trim().length > 160) throw new AdminError('Enter a title of up to 160 characters.');
  if (typeof data.content !== 'string' || data.content.length > 20000) throw new AdminError('Keep your notes within 20,000 characters.');
  const date = data.entry_date;
  if (typeof date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(date) || !Number.isFinite(Date.parse(date)) || new Date(date).toISOString().slice(0, 10) !== date) throw new AdminError('Enter a valid date.');
  return {title: data.title.trim(), kind: data.kind, entry_date: date, content: data.content};
}
export function validateVersion(version) {
  if (!Number.isSafeInteger(version) || version < 1 || version >= 2147483647) throw new AdminError('Invalid entry version. Reload the entry.');
  return version;
}

export function validateNoteId(id) {
  if (typeof id !== 'string' || !UUID.test(id)) throw new AdminError('Invalid notebook entry ID.');
  return id;
}
