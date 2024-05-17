import { postgresClient } from "@/lib/db.server";
import { dropUsers, seedUsers } from "./users";

await dropUsers();
await seedUsers();

void postgresClient.end();
