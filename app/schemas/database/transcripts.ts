import { relations } from "drizzle-orm";
import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { jsonb } from "../utils";
import { extractorJobsTable } from "./extractor-jobs";

export const TRANSCRIPT_STATUS = ["waiting", "started", "failed", "completed"] as const;
export const TRANSCRIPT_LANGUAGES = ["es", "en"] as const;

export const transcriptsTable = pgTable("transcripts", {
   id: serial("id").primaryKey(),
   user_id: text("user_id").notNull(),
   object_id: text("object_id"),
   name: text("name").notNull(),
   language: text("language", { enum: TRANSCRIPT_LANGUAGES }).notNull(),
   status: text("status", { enum: TRANSCRIPT_STATUS }).notNull(),
   monologues: jsonb("monologues").$type<Monologue[]>(),
   revai_job_id: text("revai_job_id"),
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

export type SelectTranscript = typeof transcriptsTable.$inferSelect;
export type InsertTranscript = typeof transcriptsTable.$inferInsert;

export const transcriptsRelations = relations(transcriptsTable, ({ many }) => ({
   extractor_jobs: many(extractorJobsTable),
}));

export type Monologue = {
   /** @example "Hello?" */
   content: string;
   /** @example "Speaker 0" */
   speaker: string;
   /** @example "00:00:02" */
   timestamp: string;
};
