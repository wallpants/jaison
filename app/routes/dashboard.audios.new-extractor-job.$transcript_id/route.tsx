import { Button } from "@/components/ui/button";
import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogFooter,
   DialogHeader,
   DialogTitle,
} from "@/components/ui/dialog";
import { Form, getFormFields, useFormSubmit } from "@/components/ui/form";
import { AUTH_REDIRECT } from "@/consts";
import { db } from "@/lib/db.server";
import { createServerClient } from "@/lib/supabase-server-client.server";
import { extractorJobsTable, extractorsTable } from "@/schemas/database";
import { zodResolver } from "@hookform/resolvers/zod";
import { ActionFunctionArgs, LoaderFunctionArgs, redirect } from "@remix-run/node";
import { Outlet, useActionData, useLoaderData, useNavigate } from "@remix-run/react";
import { eq } from "drizzle-orm";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { FormExtractor } from "../dashboard.audios.upload/form-extractor";

export const formSchema = z.object({
   extractorId: z.coerce.number(),
});
export type FormSchema = z.infer<typeof formSchema>;

export async function action({ request, params }: ActionFunctionArgs) {
   const { supabase } = createServerClient(request);
   const {
      data: { user },
   } = await supabase.auth.getUser();
   if (!user) throw redirect(AUTH_REDIRECT);

   const values = await getFormFields<FormSchema>(request);
   const { transcript_id } = z.object({ transcript_id: z.coerce.number() }).parse(params);

   const [inserted] = await db
      .insert(extractorJobsTable)
      .values({
         status: "started",
         user_id: user.id,
         extractor_id: values.extractorId,
         transcript_id: transcript_id,
         created_at: new Date().toISOString(),
         updated_at: new Date().toISOString(),
      })
      .returning();
   if (!inserted) throw Error("Something went wrong creating the extractor job");
   return { success: true, inserted };
}

export async function loader({ request }: LoaderFunctionArgs) {
   const { supabase } = createServerClient(request);
   const {
      data: { user },
   } = await supabase.auth.getUser();
   if (!user) throw redirect(AUTH_REDIRECT);

   const extractors = await db.query.extractorsTable.findMany({
      where: eq(extractorsTable.user_id, user.id),
   });
   return { extractors };
}

export default function NewExtractorJobRoute() {
   const loaderData = useLoaderData<typeof loader>();
   const navigate = useNavigate();
   const submit = useFormSubmit();
   const actionData = useActionData<typeof action>();
   const [open, setOpen] = useState(true);

   const form = useForm<FormSchema>({
      resolver: zodResolver(formSchema),
      defaultValues: {
         extractorId: "" as unknown as number,
      },
   });

   useEffect(() => {
      if (!open) setTimeout(() => navigate(".."), 100);
   }, [actionData, navigate, open]);

   useEffect(() => {
      actionData?.success && setOpen(false);
   }, [actionData?.success]);

   return (
      <>
         <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="w-[400px] max-w-[400px]">
               <DialogHeader>
                  <DialogTitle>Extractor Job</DialogTitle>
                  <DialogDescription></DialogDescription>
               </DialogHeader>
               <Form {...form}>
                  <form
                     className="grid grid-cols-2 gap-4"
                     onSubmit={form.handleSubmit(submit, (err) => {
                        console.log("formErrors: ", err);
                     })}
                  >
                     <FormExtractor
                        form={form}
                        extractors={loaderData.extractors}
                        className="col-span-2"
                     />
                     <DialogFooter className="col-span-2">
                        <Button>Continue</Button>
                     </DialogFooter>
                  </form>
               </Form>
            </DialogContent>
         </Dialog>
         <Outlet />
      </>
   );
}
