import { db } from "@/lib/db.server";
import { extractorJobsTable } from "@/schemas/database";
import { ActionFunctionArgs } from "@remix-run/node";
import { eq } from "drizzle-orm";
import { z } from "zod";

export async function action({ params }: ActionFunctionArgs) {
   const { extractor_job_id } = z.object({ extractor_job_id: z.coerce.number() }).parse(params);
   await db.delete(extractorJobsTable).where(eq(extractorJobsTable.id, extractor_job_id));
   return null;
}
