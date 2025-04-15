import argon2 from 'argon2';
import { db, userTable } from '../../lib/db';
import { eq } from 'drizzle-orm';
import { generateSessionToken, createSession, setSessionTokenCookie } from '../../lib/auth';
import type { APIContext } from "astro";
import { serialize } from 'cookie';

export async function POST(context: APIContext) {
  console.log("EJECUTANDO POST LOGIN");
  const { request } = context;
  const form = await context.request.formData();
  const email = form.get("email")?.toString() ?? "";
  const password = form.get("password")?.toString() ?? "";
  const remember = form.get("remember") === "1"; // Verificamos si el checkbox está marcado

  const user = await db.select().from(userTable).where(eq(userTable.email, email)).limit(1);

  if (user.length === 0) {
    return context.redirect("/login?error=user");
  }

  const validPassword = await argon2.verify(user[0].password, password);

  if (!validPassword) {
    return context.redirect("/login?error=invalid");
  }

  console.log("Login correcto, generando token...");
  const token = generateSessionToken();
  console.log("Token generado:", token);

  // Si "remember" está marcado, la cookie durará 30 días; de lo contrario, será una sesión temporal
  const expiresAt = remember ? new Date(Date.now() + 1000 * 60 * 60 * 24 * 30) : undefined;

  await createSession(token, user[0].id);

  // ⚠️ Aquí creamos manualmente el header Set-Cookie
  const cookie = serialize("session", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: import.meta.env.PROD,
    expires: expiresAt, // Solo se establece si "remember" es true
    path: "/",
  });

  return new Response(null, {
    status: 302,
    headers: {
      Location: "/admin/users/dashboardUsers",
      "Set-Cookie": cookie,
    },
  });
}
