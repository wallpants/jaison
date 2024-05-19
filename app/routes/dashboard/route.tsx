import { AUTH_REDIRECT } from "@/consts";
import { db } from "@/lib/db.server";
import { createServerClient } from "@/lib/supabase-server-client.server";
import { extractorsTable } from "@/schemas/database";
import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import { eq } from "drizzle-orm";
import { TopBar } from "../_index/top-bar";
import { Sidebar } from "./sidebar";

export async function loader({ request }: LoaderFunctionArgs) {
   const { supabase } = createServerClient(request);
   const {
      data: { user },
   } = await supabase.auth.getUser();
   if (!user) throw redirect(AUTH_REDIRECT);

   const extractors = await db.query.extractorsTable.findMany({
      where: eq(extractorsTable.user_id, user.id),
   });

   return {
      userEmail: user.email,
      extractors,
   };
}

export default function Dashboard() {
   const loaderData = useLoaderData<typeof loader>();

   return (
      <div className="size-full">
         <TopBar userEmail={loaderData.userEmail} />
         <div className="flex h-full">
            <Sidebar extractors={loaderData.extractors} />
            <Outlet />
         </div>
      </div>
   );
}
