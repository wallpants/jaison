import { SupabaseClient } from "@supabase/supabase-js";
import { useEffect, useState, type RefObject } from "react";

interface Props {
   transcriptId: number;
   audioRef: RefObject<HTMLAudioElement>;
   supabase: SupabaseClient;
   userId: string;
}

export const AudioPlayer = ({ transcriptId, audioRef, supabase, userId }: Props) => {
   const [url, setUrl] = useState<string>();

   async function getAudioUrl() {
      const { data: files } = await supabase.storage.from("audios").list(userId, {
         search: String(transcriptId),
         limit: 1,
      });

      console.log("files: ", files);

      if (files?.[0]) {
         const EXPIRES_IN = 60 * 30; // 30 mins
         const { data } = await supabase.storage
            .from("audios")
            .createSignedUrl(`${userId}/${files[0].name}`, EXPIRES_IN);
         if (data) {
            setUrl(data.signedUrl);
         }
      }
   }

   useEffect(() => {
      void getAudioUrl();
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, []);

   return (
      <div className="ml-10">
         {/* eslint-disable-next-line */}
         <audio ref={audioRef} controls src={url} preload="metadata" />
      </div>
   );
};
