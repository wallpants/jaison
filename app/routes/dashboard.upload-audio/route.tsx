import { Button } from "@/components/ui/button";
import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogFooter,
   DialogHeader,
   DialogTitle,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { AUTH_REDIRECT } from "@/consts";
import { db } from "@/lib/db.server";
import { createServerClient } from "@/lib/supabase-server-client.server";
import { extractorsTable } from "@/schemas/database";
import { zodResolver } from "@hookform/resolvers/zod";
import { ActionFunctionArgs, LoaderFunctionArgs, redirect } from "@remix-run/node";
import { useNavigate } from "@remix-run/react";
import { eq } from "drizzle-orm";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { FormLanguage } from "./form-language";
import { FormName } from "./form-name";
import { FormSchema, formSchema } from "./schema";

export async function action({ request }: ActionFunctionArgs) {
   const form = await request.formData();
   const obj = Object.fromEntries(form.entries());
   console.log("obj: ", obj);
   return null;
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
   return { user, extractors };
}

export default function UploadAudio() {
   const navigate = useNavigate();
   const [open, setOpen] = useState(true);

   const form = useForm<FormSchema>({
      resolver: zodResolver(formSchema),
      defaultValues: {
         language: "en",
         name: "",
         keywords: [],
         audioFile: null as unknown as File,
         extractorId: "" as unknown as number,
      },
   });

   const onSubmit: SubmitHandler<FormSchema> = (values) => {
      console.log("values: ", values);
   };

   return (
      <Dialog
         open={open}
         onOpenChange={(isOpening) => {
            setOpen(isOpening);
            if (!isOpening) {
               // slight delay navigating away when closing
               // to allow animations to run
               setTimeout(() => {
                  navigate("..");
               }, 100);
            }
         }}
      >
         <DialogContent>
            <DialogHeader>
               <DialogTitle>Upload Audio</DialogTitle>
               <DialogDescription>
                  Upload an audio file and select an extractor to process it.
               </DialogDescription>
            </DialogHeader>
            <Form {...form}>
               <form
                  className="grid grid-cols-2 gap-4"
                  onSubmit={form.handleSubmit(onSubmit, (err) => {
                     console.log("formErrors:", err);
                  })}
               >
                  <FormName form={form} />
                  <FormLanguage form={form} />
                  {/* <FormExtractor form={form} /> */}
                  <DialogFooter className="col-span-2">
                     <Button>Continue</Button>
                  </DialogFooter>
               </form>
            </Form>
         </DialogContent>
      </Dialog>
   );
}
