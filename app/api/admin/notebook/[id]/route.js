import { withAdmin, adminDatabase, readJSON } from '@/lib/admin-server';
import { AdminError } from '@/lib/admin-validation.mjs';
import { validateEntry, validateVersion, validateNoteId } from '@/lib/notebook-validation.mjs';
export const dynamic = 'force-dynamic';
export async function PATCH(request, {params}) {
  return withAdmin(request, async () => {
    const id = validateNoteId((await params).id);
    const {version, ...fields} = await readJSON(request);
    const current = validateVersion(version);
    const entry = validateEntry(fields);
    const {data, error} = await adminDatabase().from('coaching_notes').update({...entry, version: current + 1, updated_at: new Date().toISOString()}).eq('id', id).eq('version', current).select('*').maybeSingle();
    if (error) throw error;
    if (!data) throw new AdminError('This entry changed or was deleted in another window. Copy your unsaved notes, then reload the notebook.', 409);
    return {entry: data};
  });
}
export async function DELETE(request, {params}) {
  return withAdmin(request, async () => {
    const id = validateNoteId((await params).id);
    const {version} = await readJSON(request);
    const current = validateVersion(version);
    const {data, error} = await adminDatabase().from('coaching_notes').delete().eq('id', id).eq('version', current).select('id').maybeSingle();
    if (error) throw error;
    if (!data) throw new AdminError('This entry changed or was already deleted. Reload the notebook before deleting it.', 409);
    return {deleted: true};
  });
}
