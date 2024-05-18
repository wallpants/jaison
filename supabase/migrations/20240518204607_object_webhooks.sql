create trigger "insert_object" after insert
on "storage"."objects" for each row
execute function "supabase_functions"."http_request"(
  'http://host.docker.internal:5173/objects/webhook',
  'POST',
  '{"Content-Type":"application/json"}',
  '{}',
  '3000'
);
