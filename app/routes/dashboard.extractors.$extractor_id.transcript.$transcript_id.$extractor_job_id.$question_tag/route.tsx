import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AUTH_REDIRECT } from "@/consts";
import { ENV } from "@/env";
import { db } from "@/lib/db.server";
import { createServerClient } from "@/lib/supabase-server-client.server";
import { extractorJobsTable, transcriptsTable } from "@/schemas/database";
import { redirect, useLoaderData, useNavigate } from "@remix-run/react";
import { createBrowserClient } from "@supabase/ssr";
import { and, eq } from "drizzle-orm";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { LoaderFunctionArgs } from "react-router";
import { z } from "zod";
import { AudioPlayer } from "./audio-player";
import { Transcript } from "./transcript";
import { makeMonologueSpans } from "./utils";

export async function loader({ request, params }: LoaderFunctionArgs) {
   const { supabase } = createServerClient(request);
   const {
      data: { user },
   } = await supabase.auth.getUser();
   if (!user) throw redirect(AUTH_REDIRECT);

   const { transcript_id, extractor_job_id, question_tag } = z
      .object({
         transcript_id: z.coerce.number(),
         extractor_job_id: z.coerce.number(),
         question_tag: z.string().min(1),
      })
      .parse(params);

   console.log("extractor_job_id: ", extractor_job_id);
   console.log("question_tag: ", question_tag);

   const transcript = await db.query.transcriptsTable.findFirst({
      where: and(eq(transcriptsTable.user_id, user.id), eq(transcriptsTable.id, transcript_id)),
   });
   if (!transcript)
      throw new Response(`Unable to find transcript ${transcript_id}`, { status: 404 });

   const extractorJob = await db.query.extractorJobsTable.findFirst({
      columns: { answers: true },
      with: { extractor: { columns: { name: true, questions: true } } },
      where: and(
         eq(extractorJobsTable.user_id, user.id),
         eq(extractorJobsTable.id, Number(extractor_job_id)),
      ),
   });
   if (!extractorJob)
      throw new Response(`Unable to find extractorJob ${extractor_job_id}`, { status: 404 });

   return {
      transcript,
      extractorJob,
      question_tag,
      userId: user.id,
      supabaseAnon: ENV.SUPABASE_ANON_KEY,
      supabaseUrl: ENV.SUPABASE_URL,
   };
}

export default function TranscriptDialog() {
   const loaderData = useLoaderData<typeof loader>();
   const navigate = useNavigate();
   const [open, setOpen] = useState(true);

   useEffect(() => {
      if (!open) setTimeout(() => navigate(".."), 100);
   }, [navigate, open]);

   const audioRef = useRef<HTMLAudioElement>(null);
   const [currElement, setCurrElement] = useState<number>();
   const [passagesNodeList, setPassagesNodeList] = useState<NodeListOf<Element>>();

   const supabase = createBrowserClient(loaderData.supabaseUrl, loaderData.supabaseAnon);

   // const { data: transcript, isLoading } = useTranscript({ transcriptId });

   const setAudioTime = useCallback((timestamp: string) => {
      if (!audioRef.current) return;
      const [hours, minutes, seconds] = timestamp.split(":");
      const totalMins = Number(minutes) + Number(hours) * 60;
      const totalSecs = Number(seconds) + totalMins * 60;
      audioRef.current.currentTime = totalSecs;
      void audioRef.current.play();
   }, []);

   const question = useMemo(
      () =>
         loaderData.extractorJob.extractor.questions.find(
            ({ tag }) => tag === loaderData.question_tag,
         ),
      [loaderData],
   );

   const answer = useMemo(
      () =>
         loaderData.extractorJob.answers?.data.find(({ tag }) => tag === loaderData.question_tag),
      [loaderData],
   );

   const handleCurrElementUpdate = useCallback(
      (idx: number) => {
         setCurrElement(idx);
         if (!passagesNodeList) return;
         passagesNodeList[idx]?.scrollIntoView({ behavior: "smooth" });
      },
      [passagesNodeList, setCurrElement],
   );

   function goToNext() {
      if (currElement === undefined || !passagesNodeList?.length) return;
      const newIdx = (currElement + 1) % passagesNodeList.length;
      handleCurrElementUpdate(newIdx);
   }

   function goToPrev() {
      if (currElement === undefined || !passagesNodeList?.length) return;
      let newIdx = currElement - 1;
      if (newIdx < 0) newIdx += passagesNodeList.length;
      handleCurrElementUpdate(newIdx);
   }

   useEffect(() => {
      if (!passagesNodeList?.length) return;
      if (currElement === undefined) {
         handleCurrElementUpdate(0);
      }
   }, [currElement, handleCurrElementUpdate, passagesNodeList]);

   const monologueSpans = useMemo(
      () => makeMonologueSpans(loaderData.transcript.monologues, answer),
      [answer, loaderData.transcript],
   );

   return (
      <Dialog open={open} onOpenChange={setOpen}>
         <DialogContent className="w-[800px] max-w-[800px]">
            <DialogHeader>
               <DialogTitle className="px-2">
                  <span className="text-muted-foreground">Audio: </span>
                  <span>{loaderData.transcript.name}</span>
               </DialogTitle>
               <div className="px-2">
                  <div className="mt-2 flex gap-x-5">
                     <div>
                        <p className="text-sm text-muted-foreground">Tag</p>
                        <p>{question?.tag}</p>
                     </div>
                     <div>
                        <p className="text-sm text-muted-foreground">Question</p>
                        <p>{question?.question}</p>
                     </div>
                     <div>
                        <p className="text-sm text-muted-foreground">Answer</p>
                        <p>{answer?.answer}</p>
                     </div>
                  </div>
                  <div className="mt-5 flex items-center">
                     <div className="mr-5">
                        <p className="text-sm font-medium text-muted-foreground">Sources</p>
                        <p>
                           {(currElement ?? 0) + 1}/{passagesNodeList?.length ?? "X"}
                        </p>
                     </div>
                     <Button variant="outline" className="mr-2 size-8 p-0" onClick={goToPrev}>
                        <span className="sr-only">Go to previous source</span>
                        <ChevronLeftIcon className="size-4" />
                     </Button>
                     <Button variant="outline" className="size-8 p-0" onClick={goToNext}>
                        <span className="sr-only">Go to next source</span>
                        <ChevronRightIcon className="size-4" />
                     </Button>
                     <AudioPlayer
                        transcriptId={loaderData.transcript.id}
                        audioRef={audioRef}
                        supabase={supabase}
                        userId={loaderData.userId}
                     />
                  </div>
               </div>
            </DialogHeader>
            <div className="h-[600px] overflow-y-scroll">
               <Transcript
                  monologueSpans={monologueSpans}
                  passagesNodeList={passagesNodeList}
                  setPassagesNodeList={setPassagesNodeList}
                  setAudioTime={setAudioTime}
               />
            </div>
         </DialogContent>
      </Dialog>
   );
}
