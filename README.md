# Elevate Sports

JavaScript, Next.js App Router and Tailwind CSS. Clerk handles visitor authentication; Supabase hosts camp and booking records. The site currently displays three editable coming-soon cards, as requested. No real camp dates, prices, venues or age ranges are invented.

## Run locally

Use Node.js 22 or later (24 recommended):

```sh
npm install
npm run dev
```

`npm run build` creates a deployable static website in `out/`. Supabase provides the remote backend; this design does not require a Next.js application server. The Clerk React SDK runs inside Next.js client components; authentication and authorisation are verified by Supabase for every database request. `npm start` is not used for static exports.

## Connect your accounts later

1. Create a Clerk application. Enable your preferred login methods.
2. Activate Clerk's Supabase integration; add the Clerk instance domain to Supabase Authentication → Third-party auth. Follow https://supabase.com/docs/guides/auth/third-party/clerk . Use the native integration, not a legacy JWT template.
3. Copy `.env.example` to `.env.local`. Fill in the Clerk **publishable** key, Supabase project URL and Supabase **publishable** key. No secret or service-role keys belong in browser code.
4. Run `supabase/schema.sql` once in a new Supabase project's SQL editor.
5. Add confirmed camp rows in Supabase's `camps` table, then set `published=true` and `booking_open=true` when ready.
6. Restart development or rebuild and redeploy. `NEXT_PUBLIC_` values are compiled into the static export, so changing runtime settings alone cannot update them.
7. Configure Clerk's production domain and allowed redirect origins for the final public domain. Sites preview access is separate from visitor Clerk authentication.

Live authentication and database integration require your real projects and have not been tested against live services. Before accepting registrations, verify sign-in, cross-account data isolation, duplicate bookings, age restrictions, a full camp and concurrent booking attempts in your Supabase project.

## Content and images

Landing-page text: `app/page.js`. Preview camp cards: `lib/camps.js`. Styles: `app/globals.css`.

Hero photograph: RDNE Stock project, [Kids Playing Basketball with Their Coach](https://www.pexels.com/photo/kids-playing-basketball-with-their-coach-8336951/), used under the [Pexels license](https://www.pexels.com/license/). Stock imagery does not depict or imply endorsement of Elevate Sports.

Booking records reserve a place; there is no payment integration or email-delivery service. Add the organisation's contact details, booking terms and privacy information before opening real registration.
