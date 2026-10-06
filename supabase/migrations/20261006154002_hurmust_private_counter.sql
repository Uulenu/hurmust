alter function public.hurmust_take_ai_slot() set schema hurmust_private;
grant usage on schema hurmust_private to authenticated;
revoke all on function hurmust_private.hurmust_take_ai_slot() from public,anon;
grant execute on function hurmust_private.hurmust_take_ai_slot() to authenticated;
create function public.hurmust_take_ai_slot() returns boolean language sql security invoker set search_path='' as $$
 select hurmust_private.hurmust_take_ai_slot();
$$;
revoke all on function public.hurmust_take_ai_slot() from public,anon;
grant execute on function public.hurmust_take_ai_slot() to authenticated;
create policy deny_direct_counter_access on hurmust_private.ai_usage for all to authenticated using(false) with check(false);
