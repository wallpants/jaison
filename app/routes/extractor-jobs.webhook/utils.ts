import {
   Answer,
   Answers,
   Attempts,
   EXTRACTOR_JOB_STATUS,
   Monologue,
   Question,
} from "@/schemas/database";
import { submitQuestions } from "./submit-questions";

const MAX_ATTEMPTS = 5;

type Returns = {
   answers: Answers;
   attempts: Attempts;
   attemptCount: number;
   status: (typeof EXTRACTOR_JOB_STATUS)[number];
};

export async function extractAnswers({
   monologues,
   language,
   questions,
}: {
   monologues: Monologue[];
   language: "es" | "en";
   questions: Question[];
}): Promise<Returns> {
   const answers: Answers = { data: [] };
   const attempts: Attempts = [];
   let remainingQuestions: Question[] = questions;

   // 1. submit questions & extract valid answers
   // 2. retry if unable to parse or invalid answers

   let attemptCount = 0;
   while (remainingQuestions.length && attemptCount < MAX_ATTEMPTS) {
      attemptCount += 1;

      const attempt = await submitQuestions({
         monologues,
         language,
         questions: remainingQuestions,
      });

      attempts.push(attempt);

      const remainingQuestionTags = remainingQuestions.map((q) => q.tag);
      attempt.answers?.data.forEach((answer) => {
         if (
            isValidAnswerTag(answer, remainingQuestionTags) &&
            hasValidCitations(answer, monologues)
         ) {
            // if valid answer, add to answers and remove question
            // from remainingQuestions
            answers.data.push(answer);
            remainingQuestions = remainingQuestions.filter((q) => q.tag !== answer.tag);
         }
      });
   }

   return {
      answers,
      attempts,
      attemptCount,
      status: remainingQuestions.length ? "failed" : "completed",
   };
}

function isValidAnswerTag(answer: Answer, questionIds: string[]) {
   return questionIds.includes(answer.tag);
}

function hasValidCitations(answer: Answer, monologues: Monologue[]): boolean {
   for (const citation of answer.citations) {
      const monologue = monologues.find((m) => m.timestamp === citation.timestamp);
      if (!monologue?.content.includes(citation.passage)) return false;
   }
   return true;
}
