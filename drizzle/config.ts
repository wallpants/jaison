import { ENV } from "@/env";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
   schema: "./app/schemas/database/index.ts",
   dialect: "postgresql",
   dbCredentials: {
      url: ENV.POSTGRES_URL,
   },
   verbose: true,
   strict: true,
});
