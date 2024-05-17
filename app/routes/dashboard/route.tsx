import { createServerClient } from "@/lib/supabase-server-client.server";
import { LoaderFunctionArgs, json, redirect } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import { TopBar } from "../_index/top-bar";
import { Sidebar } from "./sidebar";

export async function loader({ request }: LoaderFunctionArgs) {
   const { supabase, headers } = createServerClient(request);
   const {
      data: { user },
      error,
   } = await supabase.auth.getUser();
   if (error || !user) throw redirect("/");
   return json({ user }, { headers });
}

export default function Dashboard() {
   const loaderData = useLoaderData<typeof loader>();

   return (
      <div className="size-full">
         <TopBar userEmail={loaderData.user.email} />
         <div className="flex h-full">
            <Sidebar className="shrink-0" />
            <Outlet />
         </div>
      </div>
   );
}
