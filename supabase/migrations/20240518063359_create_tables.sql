create sequence "public"."extractor_jobs_id_seq";

create sequence "public"."extractors_id_seq";

create sequence "public"."transcripts_id_seq";

create table "public"."extractor_jobs" (
    "id" integer not null default nextval('extractor_jobs_id_seq'::regclass),
    "user_id" text not null,
    "transcript_id" integer not null,
    "extractor_id" integer not null,
    "status" text not null,
    "answers" jsonb,
    "attempts" jsonb,
    "created_at" timestamp(0) without time zone not null,
    "updated_at" timestamp(0) without time zone not null
);


alter table "public"."extractor_jobs" enable row level security;

create table "public"."extractors" (
    "id" integer not null default nextval('extractors_id_seq'::regclass),
    "user_id" text not null,
    "name" text not null,
    "questions" jsonb not null,
    "created_at" timestamp(0) without time zone not null,
    "updated_at" timestamp(0) without time zone not null
);


alter table "public"."extractors" enable row level security;

create table "public"."transcripts" (
    "id" integer not null default nextval('transcripts_id_seq'::regclass),
    "user_id" text not null,
    "object_id" text,
    "name" text not null,
    "language" text not null,
    "status" text not null,
    "monologues" jsonb,
    "revai_job_id" text,
    "created_at" timestamp(0) without time zone not null,
    "updated_at" timestamp(0) without time zone not null
);


alter table "public"."transcripts" enable row level security;

alter sequence "public"."extractor_jobs_id_seq" owned by "public"."extractor_jobs"."id";

alter sequence "public"."extractors_id_seq" owned by "public"."extractors"."id";

alter sequence "public"."transcripts_id_seq" owned by "public"."transcripts"."id";

CREATE UNIQUE INDEX extractor_jobs_pkey ON public.extractor_jobs USING btree (id);

CREATE UNIQUE INDEX extractors_pkey ON public.extractors USING btree (id);

CREATE UNIQUE INDEX transcripts_pkey ON public.transcripts USING btree (id);

alter table "public"."extractor_jobs" add constraint "extractor_jobs_pkey" PRIMARY KEY using index "extractor_jobs_pkey";

alter table "public"."extractors" add constraint "extractors_pkey" PRIMARY KEY using index "extractors_pkey";

alter table "public"."transcripts" add constraint "transcripts_pkey" PRIMARY KEY using index "transcripts_pkey";

alter table "public"."extractor_jobs" add constraint "extractor_jobs_extractor_id_extractors_id_fk" FOREIGN KEY (extractor_id) REFERENCES extractors(id) not valid;

alter table "public"."extractor_jobs" validate constraint "extractor_jobs_extractor_id_extractors_id_fk";

alter table "public"."extractor_jobs" add constraint "extractor_jobs_transcript_id_transcripts_id_fk" FOREIGN KEY (transcript_id) REFERENCES transcripts(id) not valid;

alter table "public"."extractor_jobs" validate constraint "extractor_jobs_transcript_id_transcripts_id_fk";

grant delete on table "public"."extractor_jobs" to "anon";

grant insert on table "public"."extractor_jobs" to "anon";

grant references on table "public"."extractor_jobs" to "anon";

grant select on table "public"."extractor_jobs" to "anon";

grant trigger on table "public"."extractor_jobs" to "anon";

grant truncate on table "public"."extractor_jobs" to "anon";

grant update on table "public"."extractor_jobs" to "anon";

grant delete on table "public"."extractor_jobs" to "authenticated";

grant insert on table "public"."extractor_jobs" to "authenticated";

grant references on table "public"."extractor_jobs" to "authenticated";

grant select on table "public"."extractor_jobs" to "authenticated";

grant trigger on table "public"."extractor_jobs" to "authenticated";

grant truncate on table "public"."extractor_jobs" to "authenticated";

grant update on table "public"."extractor_jobs" to "authenticated";

grant delete on table "public"."extractor_jobs" to "service_role";

grant insert on table "public"."extractor_jobs" to "service_role";

grant references on table "public"."extractor_jobs" to "service_role";

grant select on table "public"."extractor_jobs" to "service_role";

grant trigger on table "public"."extractor_jobs" to "service_role";

grant truncate on table "public"."extractor_jobs" to "service_role";

grant update on table "public"."extractor_jobs" to "service_role";

grant delete on table "public"."extractors" to "anon";

grant insert on table "public"."extractors" to "anon";

grant references on table "public"."extractors" to "anon";

grant select on table "public"."extractors" to "anon";

grant trigger on table "public"."extractors" to "anon";

grant truncate on table "public"."extractors" to "anon";

grant update on table "public"."extractors" to "anon";

grant delete on table "public"."extractors" to "authenticated";

grant insert on table "public"."extractors" to "authenticated";

grant references on table "public"."extractors" to "authenticated";

grant select on table "public"."extractors" to "authenticated";

grant trigger on table "public"."extractors" to "authenticated";

grant truncate on table "public"."extractors" to "authenticated";

grant update on table "public"."extractors" to "authenticated";

grant delete on table "public"."extractors" to "service_role";

grant insert on table "public"."extractors" to "service_role";

grant references on table "public"."extractors" to "service_role";

grant select on table "public"."extractors" to "service_role";

grant trigger on table "public"."extractors" to "service_role";

grant truncate on table "public"."extractors" to "service_role";

grant update on table "public"."extractors" to "service_role";

grant delete on table "public"."transcripts" to "anon";

grant insert on table "public"."transcripts" to "anon";

grant references on table "public"."transcripts" to "anon";

grant select on table "public"."transcripts" to "anon";

grant trigger on table "public"."transcripts" to "anon";

grant truncate on table "public"."transcripts" to "anon";

grant update on table "public"."transcripts" to "anon";

grant delete on table "public"."transcripts" to "authenticated";

grant insert on table "public"."transcripts" to "authenticated";

grant references on table "public"."transcripts" to "authenticated";

grant select on table "public"."transcripts" to "authenticated";

grant trigger on table "public"."transcripts" to "authenticated";

grant truncate on table "public"."transcripts" to "authenticated";

grant update on table "public"."transcripts" to "authenticated";

grant delete on table "public"."transcripts" to "service_role";

grant insert on table "public"."transcripts" to "service_role";

grant references on table "public"."transcripts" to "service_role";

grant select on table "public"."transcripts" to "service_role";

grant trigger on table "public"."transcripts" to "service_role";

grant truncate on table "public"."transcripts" to "service_role";

grant update on table "public"."transcripts" to "service_role";



