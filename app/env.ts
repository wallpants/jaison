import { z } from "zod";

export const ENV = z
   .object({
      APP_URL: z.string().url(),

      POSTGRES_URL: z.string().min(1),

      REVAI_KEY: z.string().min(1),

      OPENAI_KEY: z.string().min(1),

      SUPABASE_ANON_KEY: z.string().min(1),
      SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
      SUPABASE_URL: z.string().min(1),
   })
   .parse(process.env);
