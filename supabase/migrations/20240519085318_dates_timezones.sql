alter table "public"."extractor_jobs" alter column "created_at" set data type timestamp(0) with time zone using "created_at"::timestamp(0) with time zone;

alter table "public"."extractor_jobs" alter column "updated_at" set data type timestamp(0) with time zone using "updated_at"::timestamp(0) with time zone;

alter table "public"."extractors" alter column "created_at" set data type timestamp(0) with time zone using "created_at"::timestamp(0) with time zone;

alter table "public"."extractors" alter column "updated_at" set data type timestamp(0) with time zone using "updated_at"::timestamp(0) with time zone;

alter table "public"."transcripts" alter column "created_at" set data type timestamp(0) with time zone using "created_at"::timestamp(0) with time zone;

alter table "public"."transcripts" alter column "updated_at" set data type timestamp(0) with time zone using "updated_at"::timestamp(0) with time zone;



