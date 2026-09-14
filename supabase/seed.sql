-- Development/test data. Apply schema.sql first, then run this file in
-- Supabase SQL Editor. Re-running does not create duplicate camps or
-- overwrite a camp you have edited. Bookings stay closed by default.
begin;

-- These optional fields are displayed by the existing event details page.
alter table public.camps
  add column if not exists description text,
  add column if not exists arrival_information text;

insert into public.camps (
  id, title, subtitle, tag, description,
  starts_at, ends_at, location, min_age, max_age,
  price_pence, capacity, arrival_information, published, booking_open
)
values (
  'ba5e0001-0000-4000-8000-000000000001',
  '[DEMO] Physical Literacy Basketball Camp',
  'Developing movement skills, confidence and enjoyment through basketball.',
  'DEMO CAMP',
  'Sample camp for testing the Elevate Basketball database connection.
   Basketball games and playful challenges explore balance, coordination,
   running, jumping, throwing and catching. This is test data, not a real event.',
  -- Always a future date on first insertion, with UK local start/end times.
  ((current_date + 30) + time '09:00') at time zone 'Europe/London',
  ((current_date + 30) + time '15:00') at time zone 'Europe/London',
  'Demo Sports Centre — test venue only',
  8, 12,
  3500, -- GBP 35.00
  24,
  'Example only: arrive 15 minutes early. Bring sportswear, trainers,
   a water bottle and a packed lunch. Final instructions to be confirmed.',
  true,  -- Visible to the website through the published-camps RLS policy.
  false  -- Keep registration closed for this connection check.
)
on conflict (id) do nothing;

commit;

-- Verify what was saved (including the generated date).
select id, title, starts_at, ends_at, location,
       min_age, max_age, price_pence, capacity, published, booking_open
from public.camps
where id = 'ba5e0001-0000-4000-8000-000000000001';

-- Optional: only in a test project, enable registration to test Clerk + bookings:
-- update public.camps set booking_open = true
-- where id = 'ba5e0001-0000-4000-8000-000000000001';
