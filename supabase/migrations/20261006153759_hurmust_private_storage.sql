create table public.hurmust_user_data (
 user_id uuid primary key references auth.users(id) on delete cascade,
 payload jsonb not null,
 updated_at timestamptz not null default now(),
 constraint hurmust_payload_shape check (
  jsonb_typeof(payload)='object' and payload ?& array['draft','plans','bookmarks']
  and jsonb_typeof(payload->'draft') in ('object','null')
  and jsonb_typeof(payload->'plans')='array'
  and jsonb_typeof(payload->'bookmarks')='array'
  and jsonb_array_length(payload->'plans')<=100
  and jsonb_array_length(payload->'bookmarks')<=500
  and octet_length(payload::text)<=1048576)
);
alter table public.hurmust_user_data enable row level security;
revoke all on public.hurmust_user_data from anon,authenticated;
grant select,insert,update,delete on public.hurmust_user_data to authenticated;
create policy hurmust_select_own on public.hurmust_user_data for select to authenticated using ((select auth.uid())=user_id);
create policy hurmust_insert_own on public.hurmust_user_data for insert to authenticated with check ((select auth.uid())=user_id);
create policy hurmust_update_own on public.hurmust_user_data for update to authenticated using ((select auth.uid())=user_id) with check ((select auth.uid())=user_id);
create policy hurmust_delete_own on public.hurmust_user_data for delete to authenticated using ((select auth.uid())=user_id);
create schema hurmust_private;
revoke all on schema hurmust_private from public,anon,authenticated;
create table hurmust_private.ai_usage (
 user_id uuid not null references auth.users(id) on delete cascade,
 hour timestamptz not null,
 requests integer not null check(requests between 1 and 10),
 primary key(user_id,hour)
);
alter table hurmust_private.ai_usage enable row level security;
revoke all on hurmust_private.ai_usage from public,anon,authenticated;
-- Privilege is needed only to update the private counter; identity always comes from verified auth.uid().
create function public.hurmust_take_ai_slot() returns boolean
language plpgsql security definer set search_path='' as $$
declare uid uuid := auth.uid(); accepted integer;
begin
 if uid is null then return false; end if;
 delete from hurmust_private.ai_usage where user_id=uid and hour<now()-interval '7 days';
 insert into hurmust_private.ai_usage(user_id,hour,requests)
 values(uid,date_trunc('hour',now()),1)
 on conflict(user_id,hour) do update set requests=hurmust_private.ai_usage.requests+1
 where hurmust_private.ai_usage.requests<10 returning requests into accepted;
 return accepted is not null;
end;
$$;
revoke all on function public.hurmust_take_ai_slot() from public,anon;
grant execute on function public.hurmust_take_ai_slot() to authenticated;
