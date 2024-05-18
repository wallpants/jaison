import { Monologue } from "@/schemas/database";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
   return twMerge(clsx(inputs));
}

export function generateMonologuesFromContent(content: string) {
   const monologues: Monologue[] = [];
   if (!content) return monologues;

   const lines = content.split("\n");

   lines.forEach((line) => {
      if (!line) return;
      const [speaker, timestamp, content] = line.trimEnd().split(/ {2,}/);
      if (!speaker || !timestamp || !content)
         throw Error("Unable to generate Monologues from content");
      monologues.push({ speaker, timestamp, content });
   });

   return monologues;
}
