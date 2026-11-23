-- Apply once in a new Supabase project. Configure native Clerk third-party auth first.
begin;
create table public.camps (
 id uuid primary key default gen_random_uuid(),
 title text not null check (char_length(title) between 2 and 100),
 subtitle text not null default '',
 tag text not null default 'BASKETBALL CAMP',
 starts_at timestamptz not null,
 ends_at timestamptz not null,
 location text not null check (char_length(location) between 2 and 200),
 min_age integer not null check (min_age between 3 and 17),
 max_age integer not null check (max_age between 3 and 18),
 price_pence integer not null check (price_pence >= 0),
 capacity integer not null check (capacity between 1 and 1000),
 published boolean not null default false,
 booking_open boolean not null default false,
 check (ends_at > starts_at),
 check (max_age >= min_age)
);
create table public.bookings (
 id uuid primary key default gen_random_uuid(),
 camp_id uuid not null references public.camps(id),
 user_id text not null,
 participant_name text not null check (char_length(participant_name) between 2 and 100),
 participant_key text generated always as (lower(btrim(participant_name))) stored,
 participant_age integer not null,
 guardian_name text not null,
 contact_email text not null,
 guardian_consent boolean not null check (guardian_consent),
 camp_title text not null,
 starts_at timestamptz not null,
 price_pence integer not null,
 created_at timestamptz not null default now(),
 unique(camp_id,user_id,participant_key)
);
create index bookings_user_idx on public.bookings(user_id);
alter table public.camps enable row level security;
alter table public.bookings enable row level security;
revoke all on public.camps from anon, authenticated;
revoke all on public.bookings from anon, authenticated;
grant select on public.camps to anon, authenticated;
grant select on public.bookings to authenticated;
create policy "Visitors can read published camps" on public.camps for select to anon,authenticated using (published);
create policy "Guardians can read only their own bookings" on public.bookings for select to authenticated using ((select auth.jwt()->>'sub') = user_id);
-- Browser clients cannot insert/update/delete directly. This narrow RPC is the only booking writer.
create function public.book_camp(p_camp_id uuid,p_participant_name text,p_age integer,p_guardian_name text,p_contact_email text,p_guardian_consent boolean)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare
 caller text := auth.jwt()->>'sub';
 selected public.camps%rowtype;
 reservation public.bookings%rowtype;
 used integer;
begin
 if caller is null or caller = '' or coalesce(auth.jwt()->>'role','') <> 'authenticated' then raise exception 'AUTH_REQUIRED'; end if;
 if p_participant_name is null or char_length(btrim(p_participant_name)) not between 2 and 100
 or p_guardian_name is null or char_length(btrim(p_guardian_name)) not between 2 and 100
 or p_contact_email is null or char_length(p_contact_email) > 254 or p_contact_email !~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'
 or p_age is null or p_guardian_consent is distinct from true then raise exception 'INVALID_DETAILS'; end if;
 -- Serialise writes per camp, preventing two users from taking the last place.
 select * into selected from public.camps where id=p_camp_id for update;
 if not found then raise exception 'CAMP_CLOSED'; end if;
 -- Idempotent retries return a previously saved reservation without consuming another place.
 select * into reservation from public.bookings where camp_id=p_camp_id and user_id=caller and participant_key=lower(btrim(p_participant_name));
 if found then return jsonb_build_object('id',reservation.id,'participant_name',reservation.participant_name,'price_pence',reservation.price_pence); end if;
 if not selected.published or not selected.booking_open or selected.starts_at <= now() then raise exception 'CAMP_CLOSED'; end if;
 if p_age < selected.min_age or p_age > selected.max_age then raise exception 'AGE_NOT_ELIGIBLE'; end if;
 select count(*) into used from public.bookings where camp_id=p_camp_id;
 if used >= selected.capacity then raise exception 'CAMP_FULL'; end if;
 insert into public.bookings(camp_id,user_id,participant_name,participant_age,guardian_name,contact_email,guardian_consent,camp_title,starts_at,price_pence)
 values(p_camp_id,caller,btrim(p_participant_name),p_age,btrim(p_guardian_name),btrim(p_contact_email),true,selected.title,selected.starts_at,selected.price_pence)
 returning * into reservation;
 return jsonb_build_object('id',reservation.id,'participant_name',reservation.participant_name,'price_pence',reservation.price_pence);
end;
$$;
revoke all on function public.book_camp(uuid,text,integer,text,text,boolean) from public,anon;
grant execute on function public.book_camp(uuid,text,integer,text,text,boolean) to authenticated;
commit;
