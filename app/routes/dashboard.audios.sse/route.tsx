import { AUTH_REDIRECT } from "@/consts";
import { createServerClient } from "@/lib/supabase-server-client.server";
import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import { EventStream } from "remix-event-stream/server";
import { loader as routeLoader } from "../dashboard.audios/route";

const SSE_INTERVAL = 7_000;

export async function loader({ request }: LoaderFunctionArgs) {
   const { supabase } = createServerClient(request);
   const {
      data: { user },
   } = await supabase.auth.getUser();
   if (!user) throw redirect(AUTH_REDIRECT);

   return new EventStream(request, (send) => {
      const timer = setInterval(() => {
         routeLoader({ request, context: { user }, params: {} })
            .then((data) => send(JSON.stringify(data)))
            .catch((err: unknown) => console.error(err));
      }, SSE_INTERVAL);

      return () => {
         clearInterval(timer);
      };
   });
}
