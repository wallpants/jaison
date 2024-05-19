import { AUTH_REDIRECT } from "@/consts";
import { createServerClient } from "@/lib/supabase-server-client.server";
import { redirect, type LoaderFunctionArgs } from "@remix-run/node";
import { EventStream } from "remix-event-stream/server";
import { loader as routeLoader } from "../dashboard/route";

const SSE_INTERVAL = 5_000;

export async function loader({ request }: LoaderFunctionArgs) {
   const { supabase } = createServerClient(request);
   const {
      data: { user },
   } = await supabase.auth.getUser();
   if (!user) throw redirect(AUTH_REDIRECT);

   return new EventStream(request, (send) => {
      const timer = setInterval(() => {
         routeLoader({ request, params: {}, context: { user } })
            .then((data) => {
               send(JSON.stringify(data));
            })
            .catch((err: unknown) => {
               console.error(err);
            });
      }, SSE_INTERVAL);

      return () => {
         clearInterval(timer);
      };
   });
}
