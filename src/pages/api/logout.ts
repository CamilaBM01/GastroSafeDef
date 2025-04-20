import type { APIContext } from "astro";
import { deleteSessionTokenCookie, validateUserSession } from "../../lib/auth";
import { db, sessionTable } from "../../lib/db";
import { eq } from "drizzle-orm";
import { createHash } from "crypto";

export async function GET(context: APIContext) {
  const token = context.cookies.get("session")?.value ?? null;

  if (token) {
    const sessionId = createHash("sha256").update(token).digest("hex");
    await db.delete(sessionTable).where(eq(sessionTable.id, sessionId));
    deleteSessionTokenCookie(context);
  }

  return context.redirect("/login");
}