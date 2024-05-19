import { Monologue, Question, answersSchema } from "@/schemas/database";
import { zodToJsonSchema } from "zod-to-json-schema";

const i18 = {
   en: { name: "English" },
   es: { name: "Spanish" },
} as const;

const languageList = new Intl.ListFormat("en", {
   style: "long",
   type: "disjunction",
}).format(Object.values(i18).map(({ name }) => name));

export function generateMainPrompt({
   monologues,
   questions,
   language,
}: {
   monologues: Monologue[];
   questions: Question[];
   language: "en" | "es";
}) {
   const extractorLan = i18[language].name;
   const resJsonSchema = JSON.stringify(zodToJsonSchema(answersSchema));
   const conversation = monologues
      .map((m) => `${m.speaker}\t${m.timestamp}\t${m.content}`)
      .join("\n");
   const questionsString = questions.map(({ tag, question }) => `${tag} - ${question}`).join("\n");

   return `
You will be provided with a conversation in ${languageList}.
Your task is to answer the questions delimited by """questions-start""" and """questions-end"""
using only the conversation delimited by """conversation-start""" and """conversation-end"""
as source and cite the passage(s) of the conversation used to answer the questions.
Try to answer questions as concisely as possible.
Questions must be answered in ${extractorLan}.

If the conversation does not contain the information needed to answer a question
the answer should be "N/A" and citations should be set to an empty array.
If an answer to a question is provided, citations must be included.

Questions follow the format:

maxPrice - How much is the customer willing to pay?
customerName - What is the name of the customer?

Where "maxPrice" is the tag for the question "How much is the customer willing to pay?"
and "customerName" is the tag for the question "What is the name of the customer?"

Questions are not listed in order. Answers to these questions don't necessarily appear
in chronological order in the conversation. Start the conversation from the beginning
every time when looking for citations.

You may only respond in JSON format. Your response should comply with the following schema:

${resJsonSchema}

The conversation follows the next format:

Speaker 0    00:00:02    Hello?  
Speaker 1    00:00:03    Hi, how are you doing?  
Speaker 0    00:00:06    I'm doing well, thank you.  

Where "Speaker 0" represents the speaker with id "0". The timestamp "00:00:02" represents when during the conversation the message "Hello?" was spoken.

"""conversation-start"""
${conversation}
"""conversation-end"""

"""questions-start"""
${questionsString}
"""questions-end"""`;
}
