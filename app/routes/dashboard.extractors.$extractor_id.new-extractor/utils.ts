import { nanoid } from "nanoid";

export function genQuestion() {
   return { id: nanoid(5), tag: "", question: "" };
}
