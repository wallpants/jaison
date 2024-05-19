import { SupabaseClient } from "@supabase/supabase-js";
import { useEffect, useState, type RefObject } from "react";

interface Props {
   transcriptId: number;
   objectId: string;
   audioRef: RefObject<HTMLAudioElement>;
   supabase: SupabaseClient;
   userId: string;
}

export const AudioPlayer = ({ transcriptId, objectId, audioRef, supabase, userId }: Props) => {
   const [url, setUrl] = useState<string>();

   async function getAudioUrl() {
      const { data: files } = await supabase.storage.from("audios").list(userId, {
         search: String(transcriptId),
         limit: 100,
      });

      const file = files?.find((file) => file.id === objectId);

      if (file) {
         const EXPIRES_IN = 60 * 30; // 30 mins
         const { data } = await supabase.storage
            .from("audios")
            .createSignedUrl(`${userId}/${file.name}`, EXPIRES_IN);
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
