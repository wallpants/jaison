import { ENV } from "@/env";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as database from "../schemas/database";
import { singleton } from "./singleton";

export const postgresClient = singleton("postgres", () =>
   postgres(ENV.POSTGRES_URL, { prepare: false }),
);
export const db = singleton("db", () => drizzle(postgresClient, { schema: database }));
