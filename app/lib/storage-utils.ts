import { z } from "zod";

export function generateObjectPath({
   user_id,
   transcript_id,
   fileExtension,
}: {
   user_id: string;
   transcript_id: string;
   fileExtension: string | undefined;
}) {
   if (!fileExtension) throw new Error("File extension could not be read");
   return `${user_id}/${transcript_id}.${fileExtension}`;
}

const SParsedObjectPath = z.object({
   user_id: z.string().uuid(),
   transcript_id: z.string().uuid(),
   fileExtension: z.string().min(1),
});
export function parseObjectPath(objectPath: string) {
   const [user_id, transcript_idAndFileExt] = objectPath.split("/");
   const [transcript_id, fileExtension] = transcript_idAndFileExt!.split(".");
   const parsedObj = SParsedObjectPath.parse({
      user_id,
      transcript_id,
      fileExtension,
   });
   return parsedObj;
}
