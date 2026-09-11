import { createClient } from '@supabase/supabase-js';
export const databaseConfigured = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY);
export function createSupabaseClient(getToken = async () => null) {
  if (!databaseConfigured) return null;
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY, {
    accessToken: getToken,
  });
}
