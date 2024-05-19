import { relations } from "drizzle-orm";
import { integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { z } from "zod";
import { jsonb } from "../utils";
import { Question, extractorsTable } from "./extractors";
import { transcriptsTable } from "./transcripts";

export const EXTRACTOR_JOB_STATUS = ["waiting", "started", "failed", "completed"] as const;

export const extractorJobsTable = pgTable("extractor_jobs", {
   id: serial("id").primaryKey(),
   user_id: text("user_id").notNull(),
   transcript_id: integer("transcript_id")
      .references(() => transcriptsTable.id, { onDelete: "cascade" })
      .notNull(),
   extractor_id: integer("extractor_id")
      .references(() => extractorsTable.id, { onDelete: "cascade" })
      .notNull(),
   status: text("status", { enum: EXTRACTOR_JOB_STATUS }).notNull(),
   answers: jsonb("answers").$type<Answers>(),
   attempts: jsonb("attempts").$type<Attempts>(),
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

export const answerSchema = z.object({
   tag: z.string().describe("tag of question asked"),
   answer: z.string().describe("Concise answer to the question"),
   citations: z.array(
      z
         .object({
            speaker: z.coerce.number().describe("Speaker id"),
            timestamp: z
               .string()
               .describe(
                  "Timestamp representing when the message containing the passage was spoken",
               ),
            passage: z
               .string()
               .describe(
                  "String must be an exact match to passages in the conversation, including misspellings, grammatical errors, missing symbols or characters, and capitalization. Passages must not include the speaker (e.g. 'Speaker 0') nor timestamps (e.g. 00:00:02)",
               ),
         })
         .describe(
            "Passages from which the answer was derived. Multiple citations can be included per answer. Citations may include passages from multiple speakers. If no citations are found, set as empty array.",
         ),
   ),
});

export const answersSchema = z.object({
   data: z.array(answerSchema),
});

export type Answer = z.infer<typeof answerSchema>;
export type Answers = z.infer<typeof answersSchema>;

export type GptMessage = {
   role: "user" | "system" | "assistant";
   content: string;
};

export type Attempts = {
   error?: unknown;
   questions: Question[];
   answers?: Answers;
   messages: GptMessage[];
}[];
