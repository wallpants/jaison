create sequence "public"."transcripts_id_seq";

create table "public"."transcripts" (
    "id" integer not null default nextval('transcripts_id_seq'::regclass),
    "label" text
);


alter table "public"."transcripts" enable row level security;

alter sequence "public"."transcripts_id_seq" owned by "public"."transcripts"."id";

CREATE UNIQUE INDEX transcripts_pkey ON public.transcripts USING btree (id);

alter table "public"."transcripts" add constraint "transcripts_pkey" PRIMARY KEY using index "transcripts_pkey";

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



