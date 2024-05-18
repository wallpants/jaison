insert into storage.buckets (id, name, public) values ('audios', 'audios', false);

create policy "Give users access to own folder 1brjcyl_0"
on "storage"."objects"
as permissive
for select
to public
using (((bucket_id = 'audios'::text) AND (( SELECT (auth.uid())::text AS uid) = (storage.foldername(name))[1])));


create policy "Give users access to own folder 1brjcyl_1"
on "storage"."objects"
as permissive
for insert
to public
with check (((bucket_id = 'audios'::text) AND (( SELECT (auth.uid())::text AS uid) = (storage.foldername(name))[1])));


create policy "Give users access to own folder 1brjcyl_2"
on "storage"."objects"
as permissive
for update
to public
using (((bucket_id = 'audios'::text) AND (( SELECT (auth.uid())::text AS uid) = (storage.foldername(name))[1])));


create policy "Give users access to own folder 1brjcyl_3"
on "storage"."objects"
as permissive
for delete
to public
using (((bucket_id = 'audios'::text) AND (( SELECT (auth.uid())::text AS uid) = (storage.foldername(name))[1])));
