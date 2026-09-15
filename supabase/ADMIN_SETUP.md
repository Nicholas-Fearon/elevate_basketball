# Private camp administration

The admin area is `/admin/`. It supports updating existing camps and viewing the participants and guardian details booked onto each camp.

## One-time setup

1. Run `supabase/migrations/20260915_admin_camps.sql` in your Supabase project's SQL Editor. It adds the update function; it does not seed or delete camps.
2. In Vercel → Project → Settings → Environment Variables, add these server-only variables for Production:
   - `ADMIN_CLERK_USER_ID`: your exact user ID from the production Clerk dashboard, beginning `user_`. Only this account can access admin data.
   - `SUPABASE_SECRET_KEY`: your Supabase secret API key, from the same project as `NEXT_PUBLIC_SUPABASE_URL`. A legacy `SUPABASE_SERVICE_ROLE_KEY` is also supported instead.
3. Keep your existing `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, and `CLERK_SECRET_KEY` configured. Clerk keys must belong to the same instance as the admin user ID.
4. Deploy this code to Vercel, or redeploy after changing environment variables. Visit `/admin/` and sign in with your account.

Never prefix the admin ID or Supabase secret variables with `NEXT_PUBLIC_`. Never commit secret values. For local development, use `.env.local` and the user ID from your development Clerk instance, then restart Next.js.

## Behaviour and verification

- Missing admin configuration denies access. Every admin API request verifies the Clerk session and the exact allowed user ID before connecting with elevated database privileges.
- Booking data is not cached or stored in browser local storage. Signing out clears the dashboard.
- Dates use Europe/London, including British Summer Time. Price is for the entire camp.
- Capacity cannot be reduced below existing bookings. Age changes cannot exclude existing participants. Updates and new bookings lock the same camp row to protect capacity.
- Changing a camp name or start date updates existing booking displays. Existing bookings retain the price agreed when booked. No parent notifications are sent; communicate schedule or venue changes separately.
- Hiding a camp also closes bookings. Past camps remain available to the administrator.
- Booked price does not indicate whether a payment has been received.

After configuration, verify that signed-out visitors and a different Clerk account cannot access `/api/admin/camps/` or any camp's bookings API. With your owner account, edit a camp, save, and check its public detail page. Confirm a known booking appears under that camp's Bookings tab.

Run `node --test tests/admin.test.mjs` for the authorization and input-validation checks, and `npm run build` to validate the Next.js routes. These automated checks do not replace verifying the live Clerk/Supabase configuration.
