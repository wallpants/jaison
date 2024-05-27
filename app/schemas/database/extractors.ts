import { relations } from "drizzle-orm";
import { pgTable, serial, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { z } from "zod";
import { jsonb } from "../utils";
import { extractorJobsTable } from "./extractor-jobs";
import { usersTable } from "./users";

export const extractorsTable = pgTable("extractors", {
   id: serial("id").primaryKey(),
   user_id: uuid("user_id")
      .references(() => usersTable.id, { onDelete: "cascade" })
      .notNull(),
   name: text("name").notNull(),
   questions: jsonb("questions").$type<Question[]>().notNull(),
   created_at: timestamp("created_at", {
      precision: 0,
      withTimezone: true,
      mode: "string",
   }).notNull(),
   updated_at: timestamp("updated_at", {
      precision: 0,
      withTimezone: true,
      mode: "string",
   }).notNull(),
});

export type SelectExtractor = typeof extractorsTable.$inferSelect;
export type InsertExtractor = typeof extractorsTable.$inferInsert;

export const extractorsRelations = relations(extractorsTable, ({ many }) => ({
   extractor_jobs: many(extractorJobsTable),
}));

const questionSchema = z.object({
   tag: z
      .string()
      .min(1, "Tag must contain at least 1 character")
      .refine((data) => /^[a-zA-Z]+$/.test(data), {
         message: "Tags may only contain letters and no spaces",
      }),
   question: z.string().min(5, "Question must contain at least 5 characters"),
});
export type Question = z.infer<typeof questionSchema>;

export const questionsSchema = z.array(questionSchema).refine(
   (data) => {
      const tags = new Set();
      for (const { tag } of data) {
         if (tags.has(tag)) return false;
         tags.add(tag);
      }
      return true;
   },
   { message: "Tags must be unique" },
);
