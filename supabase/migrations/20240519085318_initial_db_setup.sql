
SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

CREATE EXTENSION IF NOT EXISTS "pg_net" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pgsodium" WITH SCHEMA "pgsodium";

COMMENT ON SCHEMA "public" IS 'standard public schema';

CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";

CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pgjwt" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";

SET default_tablespace = '';

SET default_table_access_method = "heap";

CREATE TABLE IF NOT EXISTS "public"."extractor_jobs" (
    "id" integer NOT NULL,
    "user_id" "text" NOT NULL,
    "transcript_id" integer NOT NULL,
    "extractor_id" integer NOT NULL,
    "status" "text" NOT NULL,
    "answers" "jsonb",
    "attempts" "jsonb",
    "created_at" timestamp(0) with time zone NOT NULL,
    "updated_at" timestamp(0) with time zone NOT NULL
);

ALTER TABLE "public"."extractor_jobs" OWNER TO "postgres";

CREATE SEQUENCE IF NOT EXISTS "public"."extractor_jobs_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER TABLE "public"."extractor_jobs_id_seq" OWNER TO "postgres";

ALTER SEQUENCE "public"."extractor_jobs_id_seq" OWNED BY "public"."extractor_jobs"."id";

CREATE TABLE IF NOT EXISTS "public"."extractors" (
    "id" integer NOT NULL,
    "user_id" "text" NOT NULL,
    "name" "text" NOT NULL,
    "questions" "jsonb" NOT NULL,
    "created_at" timestamp(0) with time zone NOT NULL,
    "updated_at" timestamp(0) with time zone NOT NULL
);

ALTER TABLE "public"."extractors" OWNER TO "postgres";

CREATE SEQUENCE IF NOT EXISTS "public"."extractors_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER TABLE "public"."extractors_id_seq" OWNER TO "postgres";

ALTER SEQUENCE "public"."extractors_id_seq" OWNED BY "public"."extractors"."id";

CREATE TABLE IF NOT EXISTS "public"."transcripts" (
    "id" integer NOT NULL,
    "user_id" "text" NOT NULL,
    "object_id" "text",
    "name" "text" NOT NULL,
    "language" "text" NOT NULL,
    "status" "text" NOT NULL,
    "monologues" "jsonb",
    "revai_job_id" "text",
    "created_at" timestamp(0) with time zone NOT NULL,
    "updated_at" timestamp(0) with time zone NOT NULL
);

ALTER TABLE "public"."transcripts" OWNER TO "postgres";

CREATE SEQUENCE IF NOT EXISTS "public"."transcripts_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER TABLE "public"."transcripts_id_seq" OWNER TO "postgres";

ALTER SEQUENCE "public"."transcripts_id_seq" OWNED BY "public"."transcripts"."id";

ALTER TABLE ONLY "public"."extractor_jobs" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."extractor_jobs_id_seq"'::"regclass");

ALTER TABLE ONLY "public"."extractors" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."extractors_id_seq"'::"regclass");

ALTER TABLE ONLY "public"."transcripts" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."transcripts_id_seq"'::"regclass");

ALTER TABLE ONLY "public"."extractor_jobs"
    ADD CONSTRAINT "extractor_jobs_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."extractors"
    ADD CONSTRAINT "extractors_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."transcripts"
    ADD CONSTRAINT "transcripts_pkey" PRIMARY KEY ("id");

CREATE OR REPLACE TRIGGER "insert_extractor_job" AFTER INSERT ON "public"."extractor_jobs" FOR EACH ROW EXECUTE FUNCTION "supabase_functions"."http_request"('http://host.docker.internal:5173/extractor-jobs/webhook', 'POST', '{"Content-Type":"application/json"}', '{}', '5000');

CREATE OR REPLACE TRIGGER "update_extractor_job" AFTER UPDATE ON "public"."extractor_jobs" FOR EACH ROW EXECUTE FUNCTION "supabase_functions"."http_request"('http://host.docker.internal:5173/extractor-jobs/webhook', 'POST', '{"Content-Type":"application/json"}', '{}', '5000');

ALTER TABLE ONLY "public"."extractor_jobs"
    ADD CONSTRAINT "extractor_jobs_extractor_id_extractors_id_fk" FOREIGN KEY ("extractor_id") REFERENCES "public"."extractors"("id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."extractor_jobs"
    ADD CONSTRAINT "extractor_jobs_transcript_id_transcripts_id_fk" FOREIGN KEY ("transcript_id") REFERENCES "public"."transcripts"("id") ON DELETE CASCADE;

ALTER TABLE "public"."extractor_jobs" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."extractors" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."transcripts" ENABLE ROW LEVEL SECURITY;

ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";

GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";

GRANT ALL ON TABLE "public"."extractor_jobs" TO "anon";
GRANT ALL ON TABLE "public"."extractor_jobs" TO "authenticated";
GRANT ALL ON TABLE "public"."extractor_jobs" TO "service_role";

GRANT ALL ON SEQUENCE "public"."extractor_jobs_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."extractor_jobs_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."extractor_jobs_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."extractors" TO "anon";
GRANT ALL ON TABLE "public"."extractors" TO "authenticated";
GRANT ALL ON TABLE "public"."extractors" TO "service_role";

GRANT ALL ON SEQUENCE "public"."extractors_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."extractors_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."extractors_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."transcripts" TO "anon";
GRANT ALL ON TABLE "public"."transcripts" TO "authenticated";
GRANT ALL ON TABLE "public"."transcripts" TO "service_role";

GRANT ALL ON SEQUENCE "public"."transcripts_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."transcripts_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."transcripts_id_seq" TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "service_role";

RESET ALL;

--
-- Dumped schema changes for auth and storage
--

CREATE OR REPLACE TRIGGER "insert_object" AFTER INSERT ON "storage"."objects" FOR EACH ROW EXECUTE FUNCTION "supabase_functions"."http_request"('http://host.docker.internal:5173/objects/webhook', 'POST', '{"Content-Type":"application/json"}', '{}', '5000');

INSERT INTO storage.buckets (id, name, public) VALUES ('audios', 'audios', false);

CREATE POLICY "Give users access to own folder 1brjcyl_0" ON "storage"."objects" FOR SELECT USING ((("bucket_id" = 'audios'::"text") AND (( SELECT ("auth"."uid"())::"text" AS "uid") = ("storage"."foldername"("name"))[1])));

CREATE POLICY "Give users access to own folder 1brjcyl_1" ON "storage"."objects" FOR INSERT WITH CHECK ((("bucket_id" = 'audios'::"text") AND (( SELECT ("auth"."uid"())::"text" AS "uid") = ("storage"."foldername"("name"))[1])));

CREATE POLICY "Give users access to own folder 1brjcyl_2" ON "storage"."objects" FOR UPDATE USING ((("bucket_id" = 'audios'::"text") AND (( SELECT ("auth"."uid"())::"text" AS "uid") = ("storage"."foldername"("name"))[1])));

CREATE POLICY "Give users access to own folder 1brjcyl_3" ON "storage"."objects" FOR DELETE USING ((("bucket_id" = 'audios'::"text") AND (( SELECT ("auth"."uid"())::"text" AS "uid") = ("storage"."foldername"("name"))[1])));

