import { db } from "@/lib/db.server";
import { transcriptsTable } from "@/schemas/database";
import { ActionFunctionArgs } from "@remix-run/node";
import { eq } from "drizzle-orm";
import { z } from "zod";

export async function action({ params }: ActionFunctionArgs) {
   const { transcript_id } = z.object({ transcript_id: z.coerce.number() }).parse(params);
   await db.delete(transcriptsTable).where(eq(transcriptsTable.id, transcript_id));
   return null;
}
