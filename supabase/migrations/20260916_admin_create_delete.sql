-- Apply after 20260915_admin_camps.sql. Does not delete any existing data.
begin;
grant insert,delete on public.camps to service_role;
create or replace function public.admin_delete_camp(p_camp_id uuid)
returns void language plpgsql security invoker set search_path='' as $$
begin
  -- Serializes with book_camp and admin_update_camp. Never delete booking records.
  perform 1 from public.camps where id=p_camp_id for update;
  if not found then raise exception 'CAMP_NOT_FOUND'; end if;
  if exists(select 1 from public.bookings where camp_id=p_camp_id) then
    raise exception 'CAMP_HAS_BOOKINGS';
  end if;
  delete from public.camps where id=p_camp_id;
end;
$$;
revoke all on function public.admin_delete_camp(uuid) from public,anon,authenticated;
grant execute on function public.admin_delete_camp(uuid) to service_role;
commit;
