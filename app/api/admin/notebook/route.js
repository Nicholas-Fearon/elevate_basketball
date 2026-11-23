import { withAdmin, adminDatabase, readJSON } from '@/lib/admin-server';
import { validateEntry } from '@/lib/notebook-validation.mjs';
export const dynamic = 'force-dynamic';
export async function GET(request) {
  return withAdmin(request, async () => {
    const db = adminDatabase();
    const entries = [];
    for (let offset = 0; ; offset += 500) {
      const {data, error} = await db.from('coaching_notes').select('*').order('entry_date', {ascending: false}).order('id').range(offset, offset + 499);
      if (error) throw error;
      entries.push(...data);
      if (data.length < 500) break;
    }
    return {entries};
  });
}
export async function POST(request) {
  return withAdmin(request, async () => {
    const entry = validateEntry(await readJSON(request));
    const {data, error} = await adminDatabase().from('coaching_notes').insert(entry).select('*').single();
    if (error) throw error;
    return {entry: data};
  });
}
