// cspell:ignore weba
import { CheckIcon, FileAudioIcon } from "lucide-react";
import { useCallback } from "react";
import { ErrorCode, useDropzone, type DropzoneOptions, type FileError } from "react-dropzone-esm";
import { type UseFormReturn } from "react-hook-form";

import { LoadingIndicator } from "@/components/loading-indicator";
import { FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { AUDIO_MAX_SIZE_MB, FormSchema, validateAudioLength } from "./schema";

interface Props {
   form: UseFormReturn<FormSchema>;
   isValidatingAudioFile: boolean;
   setIsValidatingAudioFile: (newValue: boolean) => void;
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(() => resolve(true), ms));

export const FormFile = ({ form, isValidatingAudioFile, setIsValidatingAudioFile }: Props) => {
   const onDrop = useCallback<NonNullable<DropzoneOptions["onDrop"]>>(
      async (acceptedFiles, rejectedFiles) => {
         setIsValidatingAudioFile(true);
         form.resetField("audioFile");
         const acceptedFile = acceptedFiles[0];
         const rejectedFile = rejectedFiles[0];

         if (rejectedFile) {
            const firstError: FileError = rejectedFile.errors[0]!;
            const message =
               firstError.code === (ErrorCode.FileTooLarge as string)
                  ? `Audio file must not exceed size ${AUDIO_MAX_SIZE_MB}MB`
                  : firstError.message;
            form.setError("audioFile", { message });
         }

         if (acceptedFile) {
            const error = await validateAudioLength(acceptedFile);
            await sleep(10);
            if (error) {
               form.setError("audioFile", {
                  message: error.message,
                  type: error.code,
               });
            } else {
               form.setValue("audioFile", acceptedFiles[0]!, {
                  shouldDirty: true,
                  shouldTouch: true,
                  shouldValidate: true,
               });
            }
         }

         setIsValidatingAudioFile(false);
      },
      [form, setIsValidatingAudioFile],
   );

   const { getRootProps, getInputProps, isDragActive } = useDropzone({
      accept: {
         "audio/*": [".mp3", ".oga", ".wav", ".weba"],
      },
      onDrop,
      maxSize: 1_048_576 * AUDIO_MAX_SIZE_MB,
      multiple: false,
      disabled: form.formState.isValidating,
   });

   return (
      <FormField
         control={form.control}
         name="audioFile"
         render={({ field }) => (
            <FormItem className="col-span-2">
               <FormLabel>Audio file</FormLabel>
               <div
                  className={cn(
                     "mt-2 flex h-[160px] justify-center rounded-md border border-input px-6 py-10 text-center text-xs text-muted-foreground",
                     isValidatingAudioFile ? "border-muted" : "cursor-pointer",
                  )}
                  {...getRootProps()}
               >
                  <input {...getInputProps()} />
                  <InputBox
                     isDragActive={isDragActive}
                     isValidating={isValidatingAudioFile}
                     file={field.value}
                  />
               </div>
               <FormMessage />
            </FormItem>
         )}
      />
   );
};

const InputBox = ({
   isDragActive,
   isValidating,
   file,
}: {
   isDragActive: boolean;
   isValidating: boolean;
   file: File;
}) => {
   if (isValidating) {
      return (
         <div className="flex items-center">
            <LoadingIndicator className="mr-2" />
            Validating...
         </div>
      );
   }

   if (file) {
      return (
         <div className="flex items-center text-sm">
            <CheckIcon className="mr-2 size-4 text-success" />
            {file.name}
         </div>
      );
   }

   return (
      <div>
         <FileAudioIcon className="mx-auto mb-2 size-9" aria-hidden="true" />
         {isDragActive ? (
            <p>Drop the files here ...</p>
         ) : (
            <>
               <p>Drag n drop some files here, or click to select files.</p>
               <p>MP3, OGG, WAV, WEBA up to {AUDIO_MAX_SIZE_MB}MB</p>
            </>
         )}
      </div>
   );
};
