import { db } from "@/lib/db.server";
import { extractorsTable } from "@/schemas/database";
import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { eq } from "drizzle-orm";
import { z } from "zod";

export async function action({ params }: ActionFunctionArgs) {
   const { extractor_id } = z.object({ extractor_id: z.coerce.number() }).parse(params);
   await db.delete(extractorsTable).where(eq(extractorsTable.id, extractor_id));
   return redirect("/dashboard/audios");
}
