import { z } from "zod";

export const ENV = z
   .object({
      POSTGRES_URL: z.string().min(1),

      SUPABASE_ANON_KEY: z.string().min(1),
      SUPABASE_URL: z.string().min(1),
   })
   .parse(process.env);
