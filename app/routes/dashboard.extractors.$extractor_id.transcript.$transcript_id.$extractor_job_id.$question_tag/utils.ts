import { Answer, Monologue } from "@/schemas/database";

export type MonologueSpans = {
   speaker: string;
   timestamp: string;
   spans: { text: string; isAnswer: boolean }[];
}[];

export function makeMonologueSpans(
   monologues: Monologue[] | undefined | null,
   answer?: Answer,
): MonologueSpans {
   const citationTimestamps = answer?.citations.map((c) => c.timestamp);

   if (!monologues) return [];

   if (!citationTimestamps?.length) {
      return monologues.map((m) => ({
         speaker: m.speaker,
         timestamp: m.timestamp,
         spans: [{ text: m.content, isAnswer: false }],
      }));
   }

   return monologues.map((m) => {
      const monologueCitations = answer?.citations.filter((c) => c.timestamp === m.timestamp);

      if (!monologueCitations?.length) {
         return {
            speaker: m.speaker,
            timestamp: m.timestamp,
            spans: [{ text: m.content, isAnswer: false }],
         };
      }

      const spans: MonologueSpans[number]["spans"] = [];

      const passages = monologueCitations
         .map(({ passage }) => ({
            text: passage,
            pos: m.content.indexOf(passage),
         }))
         .filter(({ pos }) => pos !== -1)
         .sort((a, b) => a.pos - b.pos);

      spans.push({
         isAnswer: false,
         text: m.content.slice(0, passages[0]?.pos),
      });

      passages.forEach(({ pos, text }, idx) => {
         spans.push(
            {
               isAnswer: true,
               text: m.content.slice(pos, pos + text.length),
            },
            {
               isAnswer: false,
               text: m.content.slice(pos + text.length, passages[idx + 1]?.pos),
            },
         );
      });

      return {
         speaker: m.speaker,
         timestamp: m.timestamp,
         spans,
      };
   });
}
