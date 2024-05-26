import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ENV } from "@/env";
import { createServerClient } from "@/lib/supabase-server-client.server";
import { cn } from "@/lib/utils";
import { ActionFunctionArgs, LoaderFunctionArgs, redirect } from "@remix-run/node";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import { createBrowserClient } from "@supabase/ssr";
import { AuthError, EmailOtpType } from "@supabase/supabase-js";
import { z } from "zod";
import { TopBar } from "./_index/top-bar";

export async function action({ request }: ActionFunctionArgs) {
   const formData = await request.formData();
   const { email } = z
      .object({ email: z.string().email() })
      .parse(Object.fromEntries(formData.entries()));

   const { supabase } = createServerClient(request);
   const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
         // If set to "true" users are registered if email is new
         shouldCreateUser: false,
      },
   });
   if (!error) return { success: true } as const;
   return { success: false, error: error.message } as const;
}

export async function loader({ request }: LoaderFunctionArgs) {
   const url = new URL(request.url);
   const token_hash = url.searchParams.get("token_hash");
   const type = url.searchParams.get("type");
   const code = url.searchParams.get("code");

   const { supabase, headers } = createServerClient(request);

   let error: AuthError | null = null;
   if (token_hash && type) {
      // Magic Links, sign up links
      ({ error } = await supabase.auth.verifyOtp({ token_hash, type: type as EmailOtpType }));
      if (!error) throw redirect("/dashboard", { headers });
   }

   if (code) {
      // Social login (Google, Github, etc)
      ({ error } = await supabase.auth.exchangeCodeForSession(code));
      if (!error) throw redirect("/dashboard", { headers });
   }

   return { error, SUPABASE_URL: ENV.SUPABASE_URL, SUPABASE_ANON_KEY: ENV.SUPABASE_ANON_KEY };
}

export default function SignIn() {
   const loaderData = useLoaderData<typeof loader>();
   const actionData = useActionData<typeof action>();

   const supabase = createBrowserClient(loaderData.SUPABASE_URL, loaderData.SUPABASE_ANON_KEY);

   async function handleGoogleLogin() {
      console.log("login with google");
      await supabase.auth.signInWithOAuth({
         provider: "google",
         options: { redirectTo: "http://localhost:5173/login" },
      });
   }

   return (
      <>
         <TopBar userEmail={undefined} />
         <div className="grid size-full flex-1 grid-cols-2">
            <img
               src="/auth-image.jpg"
               className="hidden h-full border-r object-cover md:block"
               alt="logo"
            />
            <Form
               method="post"
               className={cn(
                  "col-span-2 md:col-span-1",
                  "mx-auto -mt-10 h-full w-80 max-w-[90%]",
                  "flex flex-col items-center justify-center gap-y-4",
               )}
            >
               <h2 className="text-2xl font-bold">Welcome</h2>
               <p className="text-center text-muted-foreground">Enter your details to sign in</p>
               <Input name="email" type="email" placeholder="email" />

               <div className="flex w-full gap-x-2">
                  <Button className="w-full">Send Magic Link</Button>
                  <Button type="button" className="w-full" onClick={handleGoogleLogin}>
                     Login with Google
                  </Button>
               </div>
               {actionData &&
                  (actionData.success ? (
                     <p className="text-center text-success">
                        You can close this window. Magic Link was sent to your email.
                     </p>
                  ) : (
                     <p className="text-center text-destructive">{actionData.error}</p>
                  ))}
            </Form>
         </div>
      </>
   );
}
