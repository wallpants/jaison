import { postgresClient } from "@/lib/db.server";

void postgresClient.end();
