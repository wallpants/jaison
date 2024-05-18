import { ActionFunctionArgs } from "@remix-run/node";

// json: {
//   type: 'INSERT',
//   table: 'objects',
//   record: {
//     id: '5130c4df-82f5-45e7-8225-aa213d7ac4f7',
//     name: 'IMG_20240504_0001 (3).jpg',
//     owner: null,
//     version: '78ab8e20-a3c2-46c7-a520-df7ef1a0d4e1',
//     metadata: {
//       eTag: '"918713aa40a0489f01c3c01a3a46e0c2"',
//       size: 2234481,
//       mimetype: 'image/jpeg',
//       cacheControl: 'max-age=3600',
//       lastModified: '2024-05-16T07:49:43.568Z',
//       contentLength: 2234481,
//       httpStatusCode: 200
//     },
//     owner_id: null,
//     bucket_id: 'audios',
//     created_at: '2024-05-16T07:49:43.585919+00:00',
//     updated_at: '2024-05-16T07:49:43.585919+00:00',
//     path_tokens: [ 'IMG_20240504_0001 (3).jpg' ],
//     last_accessed_at: '2024-05-16T07:49:43.585919+00:00'
//   },
//   schema: 'storage',
//   old_record: null
// }

export async function action({ request }: ActionFunctionArgs) {
   const json: unknown = await request.json();
   console.log("json:", json);
   return null;
}
