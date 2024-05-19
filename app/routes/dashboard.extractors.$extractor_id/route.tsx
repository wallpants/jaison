import { DataTable } from "@/components/data-table";
import { Main } from "@/components/main";
import { Button } from "@/components/ui/button";
import { AUTH_REDIRECT } from "@/consts";
import { db } from "@/lib/db.server";
import { createServerClient } from "@/lib/supabase-server-client.server";
import { useTable } from "@/lib/use-table";
import { extractorJobsTable, extractorsTable } from "@/schemas/database";
import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import { Outlet, useLoaderData, useSubmit } from "@remix-run/react";
import { and, desc, eq } from "drizzle-orm";
import { TrashIcon } from "lucide-react";
import { useMemo } from "react";
import { z } from "zod";
import { generateColumns } from "./columns";

export async function loader({ request, params }: LoaderFunctionArgs) {
   const { supabase } = createServerClient(request);
   const {
      data: { user },
   } = await supabase.auth.getUser();
   if (!user) throw redirect(AUTH_REDIRECT);

   const { extractor_id } = z.object({ extractor_id: z.coerce.number() }).parse(params);

   const extractor = await db.query.extractorsTable.findFirst({
      where: and(eq(extractorsTable.user_id, user.id), eq(extractorsTable.id, extractor_id)),
   });

   if (!extractor) throw new Response(`Could not find extractor ${extractor_id}`, { status: 404 });

   const extractorJobs = await db.query.extractorJobsTable.findMany({
      where: and(
         eq(extractorJobsTable.user_id, user.id),
         eq(extractorJobsTable.extractor_id, extractor_id),
      ),
      orderBy: desc(extractorJobsTable.created_at),
      with: { transcript: { columns: { id: true, name: true } } },
   });

   return { extractorJobs, extractor };
}

export default function Extractor() {
   const loaderData = useLoaderData<typeof loader>();
   const submit = useSubmit();

   const columns = useMemo(() => generateColumns(loaderData.extractor), [loaderData.extractor]);

   const table = useTable({
      rows: loaderData.extractorJobs,
      columns,
   });

   function handleDelete() {
      submit(null, {
         method: "post",
         action: "delete",
         navigate: false,
      });
   }

   return (
      <>
         <Main title={loaderData.extractor.name}>
            <div className="mb-4 flex items-center justify-between">
               <p>Here&apos;s a list of audios processed by your extractor.</p>
               <Button onClick={handleDelete} variant="destructive">
                  <TrashIcon size={16} className="mr-2" />
                  Delete Extractor
               </Button>
            </div>
            <DataTable table={table} />
         </Main>
         <Outlet />
      </>
   );
}
