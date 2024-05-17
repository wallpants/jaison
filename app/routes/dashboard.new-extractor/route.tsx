import { Button } from "@/components/ui/button";
import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogFooter,
   DialogHeader,
   DialogTitle,
} from "@/components/ui/dialog";
import {
   Form,
   FormControl,
   FormDescription,
   FormField,
   FormItem,
   FormLabel,
   FormMessage,
   getFormFields,
   useFormSubmit,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { AUTH_REDIRECT } from "@/consts";
import { db } from "@/lib/db.server";
import { createServerClient } from "@/lib/supabase-server-client.server";
import { extractorsTable, questionsSchema } from "@/schemas/database";
import { zodResolver } from "@hookform/resolvers/zod";
import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { useActionData, useNavigate } from "@remix-run/react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { FormQuestions } from "./questions";
import { genQuestion } from "./utils";

export const formSchema = z.object({
   name: z.string().min(5, "Name must contain at least 5 characters"),
   questions: questionsSchema,
});
export type FormSchema = z.infer<typeof formSchema>;

export async function action({ request }: ActionFunctionArgs) {
   const { supabase } = createServerClient(request);
   const {
      data: { user },
   } = await supabase.auth.getUser();
   if (!user) throw redirect(AUTH_REDIRECT);
   const values = await getFormFields<FormSchema>(request);
   const [inserted] = await db
      .insert(extractorsTable)
      .values({
         name: values.name,
         questions: values.questions,
         user_id: user.id,
         created_at: new Date().toISOString(),
         updated_at: new Date().toISOString(),
      })
      .returning();
   if (!inserted) throw new Error("Something went wrong creating the extractor");
   return { success: true as const, inserted };
}

export default function NewExtractorRoute() {
   const navigate = useNavigate();
   const submit = useFormSubmit();
   const actionData = useActionData<typeof action>();
   const [open, setOpen] = useState(true);

   const form = useForm<FormSchema>({
      resolver: zodResolver(formSchema),
      defaultValues: {
         name: "",
         questions: [genQuestion()],
      },
   });

   useEffect(() => {
      if (!open) {
         let path = "..";
         if (actionData?.success) path += `?extractor_id=${actionData.inserted.id}`;
         setTimeout(() => navigate(path), 100);
      }
   }, [actionData, navigate, open]);

   useEffect(() => {
      actionData?.success && setOpen(false);
   }, [actionData?.success]);

   return (
      <Dialog open={open} onOpenChange={setOpen}>
         <DialogContent className="w-[800px] max-w-[800px]">
            <DialogHeader>
               <DialogTitle>New Extractor</DialogTitle>
               <DialogDescription>
                  Create an extractor to process your audio files.
               </DialogDescription>
            </DialogHeader>
            <Form {...form}>
               <form
                  className="grid grid-cols-2 gap-4"
                  onSubmit={form.handleSubmit(submit, (err) => {
                     console.log("formErrors: ", err);
                  })}
               >
                  <FormField
                     name="name"
                     control={form.control}
                     render={({ field }) => (
                        <FormItem className="col-span-1">
                           <FormLabel>Name</FormLabel>
                           <FormDescription>Name to identify your extractor.</FormDescription>
                           <FormControl>
                              <Input {...field} />
                           </FormControl>
                           <FormMessage />
                        </FormItem>
                     )}
                  />
                  <FormQuestions form={form} className="col-span-2" />
                  <DialogFooter className="col-span-2">
                     <Button>Continue</Button>
                  </DialogFooter>
               </form>
            </Form>
         </DialogContent>
      </Dialog>
   );
}
