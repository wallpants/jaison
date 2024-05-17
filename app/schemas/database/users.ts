import { pgTable, serial, text, varchar } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
   id: serial("id").primaryKey(),
   firstname: text("firstname"),
   lastname: text("lastname"),
   phone: varchar("phone", { length: 256 }),
});
