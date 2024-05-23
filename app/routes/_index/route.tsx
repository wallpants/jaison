import { createServerClient } from "@/lib/supabase-server-client.server";
import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { TopBar } from "./top-bar";

export const meta: MetaFunction = () => {
   return [{ title: "JAISON" }, { name: "description", content: "Welcome to jaison!" }];
};

export async function loader({ request }: LoaderFunctionArgs) {
   const { supabase } = createServerClient(request);
   const {
      data: { user },
   } = await supabase.auth.getUser();
   return { user };
}

export default function Index() {
   const loaderData = useLoaderData<typeof loader>();

   return (
      <>
         <TopBar userEmail={loaderData.user?.email} />
         <div className="flex size-full flex-col items-center justify-center gap-y-4">
            <h1 className="text-6xl">Welcome!</h1>
            <p className="text-lg">Some lorem ipsum...</p>
         </div>
      </>
   );
}
