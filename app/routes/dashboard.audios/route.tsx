import { Main } from "@/components/main";
import { Button } from "@/components/ui/button";
import { AUTH_REDIRECT } from "@/consts";
import { db } from "@/lib/db.server";
import { createServerClient } from "@/lib/supabase-server-client.server";
import { useTable } from "@/lib/use-table";
import { transcriptsTable } from "@/schemas/database";
import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import { Link, Outlet, useLoaderData, useRevalidator } from "@remix-run/react";
import { eq } from "drizzle-orm";
import { UploadIcon } from "lucide-react";
import { useEffect } from "react";
import { TranscriptsTable } from "./transcripts-table";
import { columns } from "./transcripts-table/columns";

const POLL_INTERVAL = 10_000;

export async function loader({ request }: LoaderFunctionArgs) {
   const { supabase } = createServerClient(request);
   const {
      data: { user },
   } = await supabase.auth.getUser();
   if (!user) throw redirect(AUTH_REDIRECT);

   const transcripts = await db.query.transcriptsTable.findMany({
      where: eq(transcriptsTable.user_id, user.id),
      with: {
         extractor_jobs: {
            columns: {
               id: true,
               created_at: true,
               status: true,
            },
            with: {
               extractor: {
                  columns: {
                     name: true,
                  },
               },
            },
         },
      },
      columns: { id: true, name: true, status: true, created_at: true },
   });

   return {
      userEmail: user.email,
      transcripts,
   };
}

export default function UploadedAudios() {
   const revalidator = useRevalidator();
   const loaderData = useLoaderData<typeof loader>();

   useEffect(() => {
      const interval = setInterval(() => {
         revalidator.revalidate();
      }, POLL_INTERVAL);

      return () => {
         clearInterval(interval);
      };
   }, [revalidator]);

   const table = useTable({
      rows: loaderData.transcripts,
      columns,
   });

   return (
      <>
         <Main title="Uploaded Audios">
            <div className="mb-4 flex items-center justify-between">
               <p>Here&apos;s a list of audios you have uploaded</p>
               <Button asChild>
                  <Link to="upload">
                     <UploadIcon size={16} className="mr-2" />
                     Upload Audio
                  </Link>
               </Button>
            </div>
            <TranscriptsTable table={table} />
         </Main>
         <Outlet />
      </>
   );
}
