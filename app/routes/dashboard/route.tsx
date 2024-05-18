import { Main } from "@/components/main";
import { Button } from "@/components/ui/button";
import { AUTH_REDIRECT } from "@/consts";
import { ENV } from "@/env";
import { db } from "@/lib/db.server";
import { createServerClient } from "@/lib/supabase-server-client.server";
import { useTable } from "@/lib/use-table";
import { LoaderFunctionArgs, json, redirect } from "@remix-run/node";
import { Link, Outlet, useLoaderData } from "@remix-run/react";
import { UploadIcon } from "lucide-react";
import { TopBar } from "../_index/top-bar";
import { Sidebar } from "./sidebar";
import { TranscriptsTable } from "./transcripts-table";
import { columns } from "./transcripts-table/columns";

export async function loader({ request }: LoaderFunctionArgs) {
   const { supabase, headers } = createServerClient(request);
   const {
      data: { user },
   } = await supabase.auth.getUser();
   if (!user) throw redirect(AUTH_REDIRECT);

   const extractors = await db.query.extractorsTable.findMany();
   const transcripts = await db.query.transcriptsTable.findMany({
      with: { extractor_jobs: true },
   });

   return json(
      {
         user: user,
         transcripts,
         extractors,
         supabaseUrl: ENV.SUPABASE_URL,
         supabaseAnon: ENV.SUPABASE_ANON_KEY,
      },
      { headers },
   );
}

export default function Dashboard() {
   const loaderData = useLoaderData<typeof loader>();

   const table = useTable({
      rows: loaderData.transcripts,
      columns,
   });

   return (
      <div className="size-full">
         <TopBar userEmail={loaderData.user.email} />
         <div className="flex h-full">
            <Sidebar extractors={loaderData.extractors} />
            <Main title="Uploaded Audios">
               <div className="mb-4 flex items-center justify-between">
                  <p>Here&apos;s a list of audios you have uploaded</p>
                  <Button asChild>
                     <Link to="upload-audio">
                        <UploadIcon size={16} className="mr-2" />
                        Upload Audio
                     </Link>
                  </Button>
               </div>
               <TranscriptsTable table={table} />
            </Main>
            <Outlet />
         </div>
      </div>
   );
}
