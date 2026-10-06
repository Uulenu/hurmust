begin;
select set_config('hurmust.test_a',gen_random_uuid()::text,true);
select set_config('hurmust.test_b',gen_random_uuid()::text,true);
insert into auth.users(id,aud,role,email) values
(current_setting('hurmust.test_a')::uuid,'authenticated','authenticated','hurmust-rls-a@example.invalid'),
(current_setting('hurmust.test_b')::uuid,'authenticated','authenticated','hurmust-rls-b@example.invalid');
select set_config('request.jwt.claim.sub',current_setting('hurmust.test_a'),true);
set local role authenticated;
do $$
declare n integer; blocked boolean:=false;
begin
 insert into public.hurmust_user_data(user_id,payload) values(auth.uid(),'{"draft":null,"plans":[],"bookmarks":[]}');
 select count(*) into n from public.hurmust_user_data; assert n=1,'Own insert/select failed';
 begin insert into public.hurmust_user_data(user_id,payload) values(current_setting('hurmust.test_b')::uuid,'{"draft":null,"plans":[],"bookmarks":[]}'); exception when insufficient_privilege then blocked:=true; end;
 assert blocked,'Cross-account insert allowed';
 blocked:=false;
 begin update public.hurmust_user_data set user_id=current_setting('hurmust.test_b')::uuid where user_id=auth.uid(); exception when insufficient_privilege then blocked:=true; end;
 assert blocked,'Owner reassignment allowed';
 update public.hurmust_user_data set payload='{"draft":null,"plans":[],"bookmarks":["test"]}' where user_id=auth.uid();
 get diagnostics n=row_count; assert n=1,'Own update failed';
 for n in 1..10 loop assert public.hurmust_take_ai_slot(),'Quota failed early'; end loop;
 assert not public.hurmust_take_ai_slot(),'Quota exceeds ten';
 blocked:=false;
 begin update hurmust_private.ai_usage set requests=1; exception when insufficient_privilege then blocked:=true; end;
 assert blocked,'Counter directly mutable';
end $$;
reset role;
select set_config('request.jwt.claim.sub',current_setting('hurmust.test_b'),true);
set local role authenticated;
do $$
declare n integer;
begin
 select count(*) into n from public.hurmust_user_data; assert n=0,'Another user sees private data';
 update public.hurmust_user_data set updated_at=now() where user_id=current_setting('hurmust.test_a')::uuid; get diagnostics n=row_count; assert n=0,'Cross-user update allowed';
 delete from public.hurmust_user_data where user_id=current_setting('hurmust.test_a')::uuid; get diagnostics n=row_count; assert n=0,'Cross-user delete allowed';
 insert into public.hurmust_user_data(user_id,payload) values(auth.uid(),'{"draft":null,"plans":[],"bookmarks":[]}');
 delete from public.hurmust_user_data where user_id=auth.uid(); get diagnostics n=row_count; assert n=1,'Own delete failed';
end $$;
reset role;
set local role anon;
do $$
declare blocked boolean:=false;
begin
 begin perform * from public.hurmust_user_data; exception when insufficient_privilege then blocked:=true; end; assert blocked,'Anonymous read allowed';
 blocked:=false;
 begin perform public.hurmust_take_ai_slot(); exception when insufficient_privilege then blocked:=true; end; assert blocked,'Anonymous AI quota access allowed';
end $$;
reset role;
rollback;
select 'PASS: own CRUD, cross-account denial, anonymous denial, quota cap, private counter isolation; test data rolled back.' as result;