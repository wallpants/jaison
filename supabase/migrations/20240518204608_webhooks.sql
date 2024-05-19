create trigger "insert_extractor_job" after insert
on "public"."extractor_jobs" for each row
execute function "supabase_functions"."http_request"(
  'http://host.docker.internal:5173/extractor_jobs/webhook',
  'POST',
  '{"Content-Type":"application/json"}',
  '{}',
  '5000'
);

create trigger "update_extractor_job" after update
on "public"."extractor_jobs" for each row
execute function "supabase_functions"."http_request"(
  'http://host.docker.internal:5173/extractor_jobs/webhook',
  'POST',
  '{"Content-Type":"application/json"}',
  '{}',
  '5000'
);
