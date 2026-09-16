import "server-only";
import { auth } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";
import { AdminError, runAdminRequest } from "./admin-validation.mjs";
export function withAdmin(request, operation) {
  return runAdminRequest(request, {
    authenticate: auth,
    adminId: process.env.ADMIN_CLERK_USER_ID,
    operation,
  });
}
// Only call inside withAdmin's operation, after the server has checked the user.
export function adminDatabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key)
    throw new AdminError(
      "The admin database connection has not been configured.",
      503,
    );
  return createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
    global: {
      fetch: (url, options) =>
        fetch(url, {
          ...options,
          cache: "no-store",
          signal: AbortSignal.timeout(15000),
        }),
    },
  });
}
export async function readJSON(request) {
  if (Number(request.headers.get("content-length")) > 50000)
    throw new AdminError("Camp details are too large.", 413);
  const body = await request.text();
  if (body.length > 50000)
    throw new AdminError("Camp details are too large.", 413);
  try {
    return JSON.parse(body);
  } catch {
    throw new AdminError("Invalid JSON.");
  }
}
