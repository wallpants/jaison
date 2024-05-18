import { ENV } from "@/env";
import { createServerClient as _createServerClient, parse, serialize } from "@supabase/ssr";

export function createServerClient(request: Request) {
   const cookies = parse(request.headers.get("Cookie") ?? "");
   const headers = new Headers();

   const supabase = _createServerClient(ENV.SUPABASE_URL, ENV.SUPABASE_SERVICE_ROLE_KEY, {
      cookies: {
         get(key) {
            return cookies[key];
         },
         set(key, value, options) {
            headers.append("Set-Cookie", serialize(key, value, options));
         },
         remove(key, options) {
            headers.append("Set-Cookie", serialize(key, "", options));
         },
      },
   });

   return { supabase, headers };
}
