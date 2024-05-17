import { relations } from "drizzle-orm";
import { jsonb, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { z } from "zod";
import { extractorJobsTable } from "./extractor-jobs";

export const extractorsTable = pgTable("extractors", {
   id: serial("id").primaryKey(),
   user_id: text("user_id").notNull(),
   name: text("name").notNull(),
   questions: jsonb("questions").$type<Question[]>().notNull(),
   created_at: timestamp("created_at", { precision: 0, mode: "string" }).notNull(),
   updated_at: timestamp("updated_at", { precision: 0, mode: "string" }).notNull(),
});

export type SelectExtractor = typeof extractorsTable.$inferSelect;
export type InsertExtractor = typeof extractorsTable.$inferInsert;

export const extractorsRelations = relations(extractorsTable, ({ many }) => ({
   extractor_jobs: many(extractorJobsTable),
}));

const questionSchema = z.object({ tag: z.string().min(1), question: z.string() });
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
   { message: "Tags must be unique", path: ["", "root"] },
);
