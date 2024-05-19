import { ENV } from "@/env";
import { db } from "@/lib/db.server";
import { generateMonologuesFromContent } from "@/lib/utils";
import { extractorJobsTable, transcriptsTable } from "@/schemas/database";
import { ActionFunctionArgs } from "@remix-run/node";
import { and, eq } from "drizzle-orm";
import { RevAiApiClient } from "revai-node-sdk";
import { z } from "zod";

// job: {
//   id: 'ipL3Y2oPbnI9Rhtq',
//   created_on: '2023-06-14T03:40:16.587Z',
//   completed_on: '2023-06-14T03:40:28.976Z',
//   name: 'ZDlifXFX1Z1mJ90yg8ZQn.short-telco-sales-call.mp3',
//   status: 'transcribed',
//   duration_seconds: 31.25,
//   type: 'async',
//   language: 'en',
//   transcriber: 'machine'
// }

const payloadSchema = z.object({
   job: z.object({
      id: z.string(),
      created_on: z.string().datetime(),
      completed_on: z.string().datetime(),
      name: z.string(),
      status: z.enum(["in_progress", "transcribed", "failed"]),
      duration_seconds: z.number(),
      type: z.string(),
      language: z.string(),
      transcriber: z.string(),
   }),
});

export async function action({ request }: ActionFunctionArgs) {
   const json = payloadSchema.parse(await request.json());

   if (json.job.status === "failed") {
      await db
         .update(transcriptsTable)
         .set({ status: "failed" })
         .where(eq(transcriptsTable.revai_job_id, json.job.id));
      // we return 200 so revai doesn't retry to hit this endpoint
      // to notify us that the job failed
      return new Response("OKAY", { status: 200 });
   }

   const revaiClient = new RevAiApiClient(ENV.REVAI_KEY);
   const text = await revaiClient.getTranscriptText(json.job.id);
   const [transcript] = await db
      .update(transcriptsTable)
      .set({ status: "completed", monologues: generateMonologuesFromContent(text) })
      .where(eq(transcriptsTable.revai_job_id, json.job.id))
      .returning();

   if (transcript) {
      await db
         .update(extractorJobsTable)
         .set({ status: "started" })
         .where(
            and(
               eq(extractorJobsTable.transcript_id, transcript.id),
               eq(extractorJobsTable.status, "waiting"),
            ),
         );
   }

   return new Response("OKAY", {
      status: 200,
   });
}
