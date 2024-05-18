import { ENV } from "@/env";
import { db } from "@/lib/db.server";
import { parseObjectPath } from "@/lib/storage-utils";
import { createServerClient } from "@/lib/supabase-server-client.server";
import { transcriptsTable } from "@/schemas/database";
import { ActionFunctionArgs } from "@remix-run/node";
import { eq } from "drizzle-orm";
import { RevAiApiClient } from "revai-node-sdk";
import { z } from "zod";

// type Payload = {
//    type: "INSERT";
//    table: "objects";
//    record: {
//       id: string; //  '581f3196-26fb-4673-abdb-6e8b0fb18b98'
//       name: string; // '02bc108a-cff0-4aa2-a784-8b34221223af/1.mp3'
//       owner: string; // '02bc108a-cff0-4aa2-a784-8b34221223af'
//       version: string; // '48e298d1-b745-4d11-bd37-57bc07daa9ec'
//       metadata: {
//          eTag: string; // '"b342ed9dcd723c234ca7566b1b7aa112"';
//          size: number; // 812012 (bytes)
//          mimetype: string; // 'audio/mpeg'
//          cacheControl: string; // 'max-age=3600'
//          lastModified: string; // '2024-05-18T21:43:57.897Z'
//          contentLength: number; // 812012 (bytes)
//          httpStatusCode: number; // 200
//       };
//       owner_id: string; // '02bc108a-cff0-4aa2-a784-8b34221223af'
//       bucket_id: string; // 'audios'
//       created_at: string; // '2024-05-18T21:43:57.909572+00:00',
//       updated_at: string; // '2024-05-18T21:43:57.909572+00:00',
//       path_tokens: string[]; // [ '02bc108a-cff0-4aa2-a784-8b34221223af', '1.mp3' ]
//       last_accessed_at: string; // '2024-05-18T21:43:57.909572+00:00'
//    };
//    schema: string; // 'storage'
//    old_record: null;
// };

const payloadSchema = z.object({
   type: z.literal("INSERT"),
   table: z.literal("objects"),
   schema: z.literal("storage"),
   record: z.object({
      id: z.string().uuid(),
      name: z.string().min(1),
      bucket_id: z.string().min(1),
   }),
});

export async function action({ request }: ActionFunctionArgs) {
   const json = payloadSchema.parse(await request.json());
   console.log("json: ", json);
   const host = request.headers.get("host");

   if (json.record.bucket_id !== "audios") {
      return new Response("Not 'audios' bucket", { status: 400 });
   }

   const { supabase } = createServerClient(request);

   // Generate signed url for rev.ai transcription service
   // to access the audio file
   const expiresIn = 60 * 60; // 1 hour
   const { data, error } = await supabase.storage
      .from("audios")
      .createSignedUrl(json.record.name, expiresIn);

   if (error) {
      return new Response(error.message, { status: 500 });
   }

   const revaiClient = new RevAiApiClient(ENV.REVAI_KEY);
   const { transcript_id } = parseObjectPath(json.record.name);

   try {
      console.log("try");
      const transcript = await db.query.transcriptsTable.findFirst({
         where: eq(transcriptsTable.id, transcript_id),
      });
      if (!transcript) {
         throw new Response(`Unable to find transcript ${transcript_id}`, { status: 500 });
      }

      const url = `${process.env.NODE_ENV === "development" ? "http://" : "https://"}${host}/revai/webhook`;

      // Submit transcription job
      /**
       * Job = { id: "8o4AWgI0pk7nABnH", created_on:
       * "2023-06-14T03:31:25.56Z", name: "R6dEi7gr8J4-g4iRtecxd.mp3", status:
       * "in_progress", type: "async", language: "en", transcriber: "machine"
       * };
       */
      const job = await revaiClient.submitJob({
         source_config: {
            url: data.signedUrl,
         },
         notification_config: {
            url,
            // auth_headers: {
            //    Authorization: `Bearer ${env.WEBHOOKS_SECRET_TOKEN}`,
            // },
         },
         transcriber: "machine",
         language: transcript.language,
      });
      console.log("here2");

      // save job id in transcript
      await db
         .update(transcriptsTable)
         .set({ revai_job_id: job.id, status: "started" })
         .where(eq(transcriptsTable.id, transcript_id));

      console.log("here3");
      return new Response("OK", {
         status: 200,
      });
   } catch (error: unknown) {
      console.log("here4");
      return new Response((error as Error).message, {
         status: 500,
      });
   }
}
