import { db } from "@/lib/db.server";
import {
   EXTRACTOR_JOB_STATUS,
   extractorJobsTable,
   extractorsTable,
   transcriptsTable,
} from "@/schemas/database";
import { ActionFunctionArgs } from "@remix-run/node";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { extractAnswers } from "./utils";

// json: {
//   type: 'INSERT',
//   table: 'extractor_jobs',
//   record: {
//     id: 2,
//     status: 'waiting',
//     answers: null,
//     user_id: '826763b8-09bb-46ab-93c7-bf9665d6b55d',
//     attempts: null,
//     created_at: '2024-05-19T02:10:43',
//     updated_at: '2024-05-19T02:10:43',
//     extractor_id: 1,
//     transcript_id: 2
//   },
//   schema: 'public',
//   old_record: null
// }
const payloadSchema = z.object({
   type: z.enum(["INSERT", "UPDATE"]),
   record: z.object({
      id: z.number(),
      status: z.enum(EXTRACTOR_JOB_STATUS),
      transcript_id: z.number(),
      extractor_id: z.number(),
   }),
   old_record: z
      .object({
         id: z.number(),
         status: z.enum(EXTRACTOR_JOB_STATUS),
      })
      .nullable(),
});

async function processPrompt(json: z.infer<typeof payloadSchema>) {
   const transcript = await db.query.transcriptsTable.findFirst({
      where: eq(transcriptsTable.id, json.record.transcript_id),
   });

   if (!transcript) {
      throw Error(`Transcript ${json.record.transcript_id} not found`);
   }

   if (!transcript.monologues) {
      throw Error(`Transcript ${json.record.transcript_id} has no monologues`);
   }

   const extractor = await db.query.extractorsTable.findFirst({
      where: eq(extractorsTable.id, json.record.extractor_id),
      columns: { questions: true },
   });

   if (!extractor) {
      throw Error(`extractor not found ${json.record.extractor_id}`);
   }

   const res = await extractAnswers({
      monologues: transcript.monologues,
      language: transcript.language,
      questions: extractor.questions,
   });

   await db
      .update(extractorJobsTable)
      .set({
         attempts: res.attempts,
         answers: res.answers,
         status: res.status,
      })
      .where(eq(extractorJobsTable.id, json.record.id));
}

export async function action({ request }: ActionFunctionArgs) {
   const json = payloadSchema.parse(await request.json());
   const isUpdatedFromWaitingToStarted =
      json.type === "UPDATE" &&
      json.old_record?.status === "waiting" &&
      json.record.status === "started";

   const isInsertedAsStarted = json.type === "INSERT" && json.record.status === "started";

   if (!isUpdatedFromWaitingToStarted && !isInsertedAsStarted) {
      return new Response(
         JSON.stringify({
            json,
            message: "does not trigger",
            isInsertedAsStarted,
            isUpdatedFromWaitingToStarted,
         }),
         { status: 200 },
      );
   }

   // don't wait for the prompt to be processed. It takes a long time
   // and the webhook call from supabase would timeout
   processPrompt(json).catch((err: unknown) => {
      console.error(err);
      void db
         .update(extractorJobsTable)
         .set({ status: "failed" })
         .where(eq(extractorJobsTable.id, json.record.id));
   });
   return new Response(JSON.stringify({ json }), { status: 200 });
}
