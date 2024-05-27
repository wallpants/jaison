// This users table is created by supabase and we only define it here
// to be able to define relations to with the user.id
import { pgSchema, uuid } from "drizzle-orm/pg-core";

const authSchema = pgSchema("auth");

export const usersTable = authSchema.table("users", {
   id: uuid("id").primaryKey(),
});
