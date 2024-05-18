import { TRANSCRIPT_LANGUAGES } from "@/schemas/database";
import { zNumber } from "@/schemas/utils";
import { type FileError } from "react-dropzone-esm";
import { z } from "zod";

const AUDIO_MAX_LEN_MINS = 20;
export const AUDIO_MAX_SIZE_MB = 20;

export const formSchema = z.object({
   language: z.enum(TRANSCRIPT_LANGUAGES),
   name: z.string().min(1, "Name is required"),
   audioFile: z.custom<File>((f) => f instanceof File, "Audio file is required"),
   extractorId: zNumber("Required"),
});

export type FormSchema = z.infer<typeof formSchema>;

export function validateAudioLength(file: File) {
   return new Promise<null | FileError>((resolve) => {
      const reader = new FileReader();
      const readingFailed = {
         code: "reading-failed",
         message: "File reading failed",
      };
      reader.onabort = () => {
         resolve({
            code: "reading-aborted",
            message: "File reading aborted",
         });
      };
      reader.onerror = () => {
         resolve(readingFailed);
      };
      reader.onload = async (event) => {
         if (!event.target?.result || typeof event.target.result === "string") {
            resolve(readingFailed);
            return;
         }
         const audioContext = new window.AudioContext();
         await audioContext.decodeAudioData(event.target.result, (buffer) => {
            const durationSeconds = buffer.duration;
            if (durationSeconds > 60 * AUDIO_MAX_LEN_MINS) {
               resolve({
                  code: "audio-too-long",
                  message: `Audio length must not exceed ${AUDIO_MAX_LEN_MINS} minutes.`,
               });
               return;
            }
            resolve(null);
         });
      };
      reader.readAsArrayBuffer(file);
   });
}
