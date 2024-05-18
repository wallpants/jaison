alter table "public"."extractor_jobs" drop constraint "extractor_jobs_extractor_id_extractors_id_fk";

alter table "public"."extractor_jobs" drop constraint "extractor_jobs_transcript_id_transcripts_id_fk";

alter table "public"."extractor_jobs" add constraint "extractor_jobs_extractor_id_extractors_id_fk" FOREIGN KEY (extractor_id) REFERENCES extractors(id) ON DELETE CASCADE not valid;

alter table "public"."extractor_jobs" validate constraint "extractor_jobs_extractor_id_extractors_id_fk";

alter table "public"."extractor_jobs" add constraint "extractor_jobs_transcript_id_transcripts_id_fk" FOREIGN KEY (transcript_id) REFERENCES transcripts(id) ON DELETE CASCADE not valid;

alter table "public"."extractor_jobs" validate constraint "extractor_jobs_transcript_id_transcripts_id_fk";



