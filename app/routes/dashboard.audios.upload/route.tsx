import { LoadingIndicator } from "@/components/loading-indicator";
import { Button } from "@/components/ui/button";
import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogFooter,
   DialogHeader,
   DialogTitle,
} from "@/components/ui/dialog";
import { Form, FormField, FormMessage, getFormFields } from "@/components/ui/form";
import { AUTH_REDIRECT } from "@/consts";
import { ENV } from "@/env";
import { db } from "@/lib/db.server";
import { generateObjectPath } from "@/lib/storage-utils";
import { createServerClient } from "@/lib/supabase-server-client.server";
import { extractorJobsTable, extractorsTable, transcriptsTable } from "@/schemas/database";
import { zodResolver } from "@hookform/resolvers/zod";
import { ActionFunctionArgs, LoaderFunctionArgs, redirect } from "@remix-run/node";
import { Outlet, useActionData, useLoaderData, useNavigate, useSubmit } from "@remix-run/react";
import { createBrowserClient } from "@supabase/ssr";
import { eq } from "drizzle-orm";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { FormExtractor } from "./form-extractor";
import { FormFile } from "./form-file";
import { FormLanguage } from "./form-language";
import { FormName } from "./form-name";
import { FormSchema, formSchema } from "./schema";

export async function action({ request }: ActionFunctionArgs) {
   const { supabase } = createServerClient(request);
   const {
      data: { user },
   } = await supabase.auth.getUser();
   if (!user) throw redirect(AUTH_REDIRECT);

   // POST: Create transcript to start process
   if (request.method === "POST") {
      const json = await getFormFields<Omit<FormSchema, "audioFile">>(request);
      const [insertedTranscript] = await db
         .insert(transcriptsTable)
         .values({
            name: json.name,
            language: json.language,
            status: "waiting",
            user_id: user.id,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
         })
         .returning({ id: transcriptsTable.id });
      if (!insertedTranscript) throw Error("failed to insert transcript");

      const [insertedJob] = await db
         .insert(extractorJobsTable)
         .values({
            user_id: user.id,
            status: "waiting",
            extractor_id: json.extractorId,
            transcript_id: insertedTranscript.id,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
         })
         .returning({ id: transcriptsTable.id });
      if (!insertedJob) throw Error("failed to insert extractor job");

      return { transcriptId: insertedTranscript.id };
   }

   // DELETE: Delete transcript in case of file upload error
   if (request.method === "DELETE") {
      const json = await getFormFields<{ transcriptId: number }>(request);
      await db.delete(transcriptsTable).where(eq(transcriptsTable.id, json.transcriptId));
      return null;
   }

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
   return {
      userId: user.id,
      extractors,
      supabaseAnon: ENV.SUPABASE_ANON_KEY,
      supabaseUrl: ENV.SUPABASE_URL,
   };
}

export default function UploadAudio() {
   const loaderData = useLoaderData<typeof loader>();
   const actionData = useActionData<typeof action>();
   const submit = useSubmit();
   const navigate = useNavigate();
   const [open, setOpen] = useState(true);
   const [isProcessing, setIsProcessing] = useState(false);
   const [isValidatingAudioFile, setIsValidatingAudioFile] = useState(false);
   const supabase = createBrowserClient(loaderData.supabaseUrl, loaderData.supabaseAnon);

   const form = useForm<FormSchema>({
      resolver: zodResolver(formSchema),
      defaultValues: {
         language: "en",
         name: "",
         audioFile: null as unknown as File,
         extractorId: "" as unknown as number,
      },
   });

   // eslint-disable-next-line
   const onSubmit: SubmitHandler<FormSchema> = ({ audioFile, ...values }) => {
      setIsProcessing(true);
      submit(values, { method: "post", encType: "application/json" });
   };

   useEffect(() => {
      if (!actionData || !("transcriptId" in actionData)) return;

      const audioFile = form.getValues("audioFile");

      const objectPath = generateObjectPath({
         user_id: loaderData.userId,
         transcript_id: String(actionData.transcriptId),
         fileExtension: audioFile.name.split(".").pop(),
      });

      supabase.storage
         .from("audios")
         .upload(objectPath, audioFile)
         .then(({ error }) => {
            setIsProcessing(false);
            if (!error) {
               setOpen(false);
               return;
            }
            // if file failed to upload, delete newly created transcript
            submit(
               { transcriptId: actionData.transcriptId },
               { method: "DELETE", encType: "application/json" },
            );
            form.setError("root", {
               message: error.message,
            });
         })
         .catch((err: unknown) => {
            form.setError("root", {
               message: (err as Error).message,
            });
         });
      // only actionData changes should trigger this hook
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [actionData]);

   useEffect(() => {
      if (!open) setTimeout(() => navigate(".."), 100);
   }, [navigate, open]);

   return (
      <>
         <Dialog open={open} onOpenChange={setOpen}>
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
                     <FormLanguage form={form} className="ml-10" />
                     <FormExtractor
                        form={form}
                        extractors={loaderData.extractors}
                        className="col-span-2"
                     />
                     <FormFile
                        form={form}
                        isValidatingAudioFile={isValidatingAudioFile}
                        setIsValidatingAudioFile={setIsValidatingAudioFile}
                     />
                     <FormField name="root" render={() => <FormMessage />} />

                     <DialogFooter className="col-span-2">
                        <Button disabled={isProcessing} className="w-20">
                           {isProcessing ? <LoadingIndicator /> : "Continue"}
                        </Button>
                     </DialogFooter>
                  </form>
               </Form>
            </DialogContent>
         </Dialog>
         <Outlet />
      </>
   );
}
