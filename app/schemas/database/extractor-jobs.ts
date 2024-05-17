import { relations } from "drizzle-orm";
import { integer, jsonb, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { extractorsTable } from "./extractors";
import { transcriptsTable } from "./transcripts";

export const EXTRACTOR_JOB_STATUS = [
   "waiting",
   "started",
   "failed",
   "completed",
   "synced",
] as const;

export const extractorJobsTable = pgTable("extractor_jobs", {
   id: serial("id").primaryKey(),
   user_id: text("user_id").notNull(),
   transcript_id: integer("transcript_id")
      .references(() => transcriptsTable.id)
      .notNull(),
   extractor_id: integer("extractor_id")
      .references(() => extractorsTable.id)
      .notNull(),
   status: text("status", { enum: EXTRACTOR_JOB_STATUS }).notNull(),
   answers: jsonb("answers").$type<{ data: Answer[] }>(),
   attempts: jsonb("attempts"),
   created_at: timestamp("created_at", { precision: 0, mode: "string" }).notNull(),
   updated_at: timestamp("updated_at", { precision: 0, mode: "string" }).notNull(),
});

export type SelectExtractorJob = typeof extractorJobsTable.$inferSelect;
export type InsertExtractorJob = typeof extractorJobsTable.$inferInsert;

export const extractorJobsRelations = relations(extractorJobsTable, ({ one }) => ({
   extractor: one(extractorsTable, {
      fields: [extractorJobsTable.extractor_id],
      references: [extractorsTable.id],
   }),
   transcript: one(transcriptsTable, {
      fields: [extractorJobsTable.transcript_id],
      references: [transcriptsTable.id],
   }),
}));

export type Answer = {
   id: string;
   answer: string;
   citations: {
      passage: string;
      speaker: number;
      timestamp: string;
   }[];
};
