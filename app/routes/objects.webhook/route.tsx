import { ActionFunctionArgs } from "@remix-run/node";

type Payload = {
   type: "INSERT";
   table: "objects";
   record: {
      id: string; //  '581f3196-26fb-4673-abdb-6e8b0fb18b98'
      name: string; // '02bc108a-cff0-4aa2-a784-8b34221223af/1.mp3'
      owner: string; // '02bc108a-cff0-4aa2-a784-8b34221223af'
      version: string; // '48e298d1-b745-4d11-bd37-57bc07daa9ec'
      metadata: {
         eTag: string; // '"b342ed9dcd723c234ca7566b1b7aa112"';
         size: number; // 812012 (bytes)
         mimetype: string; // 'audio/mpeg'
         cacheControl: string; // 'max-age=3600'
         lastModified: string; // '2024-05-18T21:43:57.897Z'
         contentLength: number; // 812012 (bytes)
         httpStatusCode: number; // 200
      };
      owner_id: string; // '02bc108a-cff0-4aa2-a784-8b34221223af'
      bucket_id: string; // 'audios'
      created_at: string; // '2024-05-18T21:43:57.909572+00:00',
      updated_at: string; // '2024-05-18T21:43:57.909572+00:00',
      path_tokens: string[]; // [ '02bc108a-cff0-4aa2-a784-8b34221223af', '1.mp3' ]
      last_accessed_at: string; // '2024-05-18T21:43:57.909572+00:00'
   };
   schema: string; // 'storage'
   old_record: null;
};

export async function action({ request }: ActionFunctionArgs) {
   const json = (await request.json()) as Payload;
   console.log("json:", json);
   return null;
}
