-- Run once in Supabase SQL Editor. No public/admin user IDs are stored here:
-- the Next.js server verifies the owner's Clerk ID before using its secret key.
begin;
alter table public.camps
  add column if not exists description text,
  add column if not exists arrival_information text;

-- Invoker rights: this function can run only as service_role. It is not a
-- SECURITY DEFINER function and cannot grant elevated access to a visitor.
create or replace function public.admin_update_camp(p_camp_id uuid,p_details jsonb)
returns jsonb language plpgsql security invoker set search_path='' as $$
declare
  selected public.camps%rowtype;
  booked integer;
begin
  -- Uses the same camp lock as book_camp, preventing capacity/booking races.
  select * into selected from public.camps where id=p_camp_id for update;
  if not found then raise exception 'CAMP_NOT_FOUND'; end if;
  select count(*) into booked from public.bookings where camp_id=p_camp_id;
  if (p_details->>'capacity')::integer < booked then raise exception 'CAPACITY_BELOW_BOOKINGS'; end if;
  if exists(select 1 from public.bookings where camp_id=p_camp_id and
    (participant_age < (p_details->>'min_age')::integer or participant_age > (p_details->>'max_age')::integer))
  then raise exception 'AGE_EXCLUDES_BOOKINGS'; end if;

  update public.camps set
    title=p_details->>'title',subtitle=p_details->>'subtitle',tag=p_details->>'tag',
    description=p_details->>'description',arrival_information=p_details->>'arrival_information',
    starts_at=(p_details->>'starts_at')::timestamptz,ends_at=(p_details->>'ends_at')::timestamptz,
    location=p_details->>'location',min_age=(p_details->>'min_age')::integer,max_age=(p_details->>'max_age')::integer,
    price_pence=(p_details->>'price_pence')::integer,capacity=(p_details->>'capacity')::integer,
    published=(p_details->>'published')::boolean,booking_open=(p_details->>'booking_open')::boolean
  where id=p_camp_id returning * into selected;

  -- Keep the parent's booking display aligned with changed event details.
  -- Preserve the original price agreed when each booking was made.
  update public.bookings set camp_title=selected.title,starts_at=selected.starts_at where camp_id=p_camp_id;
  return to_jsonb(selected);
end;
$$;
revoke all on function public.admin_update_camp(uuid,jsonb) from public,anon,authenticated;
grant usage on schema public to service_role;
grant select,update on public.camps,public.bookings to service_role;
grant execute on function public.admin_update_camp(uuid,jsonb) to service_role;
commit;
