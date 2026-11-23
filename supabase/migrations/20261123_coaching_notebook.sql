-- Private owner notebook. Apply in Supabase SQL Editor before deployment.
begin;
create table public.coaching_notes (
  id uuid primary key default gen_random_uuid(),
  kind text not null check (kind in ('journal', 'session')),
  title text not null check (char_length(btrim(title)) between 1 and 160),
  entry_date date not null,
  content text not null default '' check (char_length(content) <= 20000),
  version integer not null default 1 check (version > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index coaching_notes_date_idx on public.coaching_notes (entry_date desc, id);
alter table public.coaching_notes enable row level security;
-- No browser policies: Clerk sessions, including the owner, cannot query this
-- table directly. Only the server's owner-checked admin API accesses it.
revoke all on public.coaching_notes from public, anon, authenticated;
grant select, insert, update, delete on public.coaching_notes to service_role;
commit;
