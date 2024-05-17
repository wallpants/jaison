import { createServerClient } from "@/lib/supabase-server-client.server";
import { LoaderFunctionArgs, redirect } from "@remix-run/node";

export async function loader({ request }: LoaderFunctionArgs) {
   const { supabase, headers } = createServerClient(request);
   await supabase.auth.signOut();
   return redirect("/", { headers });
}
