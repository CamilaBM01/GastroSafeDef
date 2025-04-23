import type { APIContext } from "astro";
import { db, userTable } from "@/lib/db";
import { hash } from "argon2";
import { eq } from "drizzle-orm";

export async function POST(context: APIContext) {
  const form = await context.request.formData();

  const name = form.get("name")?.toString() ?? "";
  const surname = form.get("surname")?.toString() ?? "";
  const email = form.get("email")?.toString() ?? "";
  const password = form.get("password")?.toString() ?? "";
  const digestive_condition = form.get("digestive_condition")?.toString() ?? "";

  // Comprobación rápida de campos obligatorios
  if (!name || !surname || !email || !password) {
    return context.redirect("/register?error=incomplete");
  }

  const existingUser = await db
    .select()
    .from(userTable)
    .where(eq(userTable.email, email))
    .limit(1);

  if (existingUser.length > 0) {
    return context.redirect("/register?error=exists");
  }

  const hashedPassword = await hash(password);

  await db.insert(userTable).values({
    name,
    surname,
    email,
    password: hashedPassword,
    digestive_condition,
    role_id: 2, // 👈 Usuario normal
    created_at: new Date(),
  });

  return context.redirect("/register/success");
}
