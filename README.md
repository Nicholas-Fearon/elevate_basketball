# Elevate Basketball

JavaScript, Next.js App Router and Tailwind CSS. Clerk handles visitor authentication; Supabase hosts camp and booking records. Published camps and bookings come from Supabase; the administrator manages camp details and participant lists at `/admin/`.

## Run locally

Use Node.js 22 or later (24 recommended):

```sh
npm install
npm run dev
```

`npm run build` creates the Next.js production build in `.next/`; `npm start` serves it locally. Deploy on Vercel using the Next.js framework preset and default output directory (remove any `out` override). The app now requires the Next.js server runtime for Clerk middleware and does not use static export.

`proxy.js` runs `clerkMiddleware()` on page and API requests, skipping framework assets and static files. It establishes authentication context without gating public pages. Clerk components use `@clerk/nextjs`; Supabase RLS and the `book_camp` function continue to enforce booking authentication and record ownership.

## Configuration

1. Create a Clerk application. Enable your preferred login methods.
2. Activate Clerk's Supabase integration; add the Clerk instance domain to Supabase Authentication → Third-party auth. Follow https://supabase.com/docs/guides/auth/third-party/clerk . Use the native integration, not a legacy JWT template.
3. Set `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`, `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` in `.env.local` and Vercel environment variables. The two Clerk keys must belong to the same instance. `CLERK_SECRET_KEY` is server-only: never prefix it with `NEXT_PUBLIC_` or commit it. Never use a Supabase service-role key in browser code.
4. Run `supabase/schema.sql` once in a new Supabase project's SQL editor.
5. Apply the SQL migrations in `supabase/migrations/` in filename order, then follow `supabase/ADMIN_SETUP.md` to configure admin access. Create camps in `/admin/` and enable Published and Booking open when ready.
6. Restart development or rebuild and redeploy. `NEXT_PUBLIC_` values are compiled into the client build, so changing runtime settings alone cannot update them.
7. Configure Clerk's production domain and allowed redirect origins for the final public domain. Use production Clerk keys for the production domain, and connect that production Clerk instance to Supabase.

Live authentication and database integration require your real projects and have not been tested against live services. Before accepting registrations, verify sign-in, cross-account data isolation, duplicate bookings, age restrictions, a full camp and concurrent booking attempts in your Supabase project.

## Content and images

Landing-page text: `app/page.js`. School information: `app/schools/page.js`. Styles: `app/globals.css`.

Hero photograph: RDNE Stock project, [Kids Playing Basketball with Their Coach](https://www.pexels.com/photo/kids-playing-basketball-with-their-coach-8336951/), used under the [Pexels license](https://www.pexels.com/license/). Stock imagery does not depict or imply endorsement of Elevate Basketball.

Booking records reserve a place and show an on-screen confirmation. Payment is collected in person on the day; there is no payment integration or email-delivery service. Add the organisation's contact details, booking terms and privacy information before opening real registration.

## Event pages

Published Supabase camps use `/camp/?id=<uuid>` to fetch current details without requiring a rebuild. Edit dates, times, venue, ages, price and descriptions in the admin area.

In a new VS Code terminal, run `nvm use` and `npm run dev`; open the Local URL printed by Next.js. Stop the server with Ctrl+C.
