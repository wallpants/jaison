import { ENV } from "@/env";
import { Attempts, Monologue, Question, answersSchema } from "@/schemas/database";
import OpenAI from "openai";
import { generateMainPrompt } from "./generate-prompt";

const openai = new OpenAI({
   apiKey: ENV.OPENAI_KEY,
});

/**
 * Generates initial prompt with instructions, transcript content & questions,
 * and validates the response against the defined zod schema.
 */
export async function submitQuestions(params: {
   monologues: Monologue[];
   questions: Question[];
   language: "en" | "es";
}): Promise<Attempts[number]> {
   const attempt: Attempts[number] = {
      questions: params.questions,
      messages: [{ role: "user", content: generateMainPrompt(params) }],
   };

   const chatCompletion = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      messages: attempt.messages,
   });

   try {
      const responseContent =
         chatCompletion.choices[0]?.message?.content ?? "no responseContent found";
      attempt.messages.push({ role: "assistant", content: responseContent });
      // sometimes gpt's response is not JSON parse-able and this throws
      const parsedContent: unknown = JSON.parse(responseContent);
      attempt.answers = answersSchema.parse(parsedContent);
   } catch (err) {
      attempt.error = err;
   }

   return attempt;
}
