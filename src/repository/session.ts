import { sessionTable } from "@/lib/db";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { createHash } from "crypto";

export async function getSession(token: string) {
  const sessionId = createHash("sha256").update(token).digest("hex");

  const session = await db
    .select()
    .from(sessionTable)
    .where(eq(sessionTable.id, sessionId))
    .limit(1);

  return session[0] ?? null;
}