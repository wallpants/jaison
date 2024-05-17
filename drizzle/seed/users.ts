import { db } from "@/lib/db.server";
import { usersTable } from "@/schemas/database";

export async function dropUsers() {
   // eslint-disable-next-line drizzle/enforce-delete-with-where
   await db.delete(usersTable);
}

export async function seedUsers() {
   await db.insert(usersTable).values({
      firstname: "Gual",
      lastname: "Casas",
   });
}
