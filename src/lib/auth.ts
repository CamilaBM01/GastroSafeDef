import { createHash } from 'crypto';  // Importamos la función para generar el hash.
import { db, userTable, sessionTable } from './db';  // Aquí importamos las tablas y la conexión a la base de datos.
import { generateSessionToken, validateSessionToken, type Session, type User } from './session';  // Funciones para gestionar sesiones.
import argon2 from 'argon2';  // Usamos argon2 para encriptar las contraseñas.
import { eq, sql } from 'drizzle-orm';  // Función para realizar consultas con Drizzle ORM.
import type { APIContext } from "astro";

export function setSessionTokenCookie(context: APIContext, token: string, expiresAt: Date): void {
  context.cookies.set("session", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: import.meta.env.PROD,  // Solo habilitado en producción
    expires: expiresAt,
    path: "/"
  });
}

export function deleteSessionTokenCookie(context: APIContext): void {
  context.cookies.set("session", "", {
    httpOnly: true,
    sameSite: "lax",
    secure: import.meta.env.PROD,
    maxAge: 0,
    path: "/"
  });
}
export async function registerUser( name: string,
  surname: string,
  email: string,
  password: string,
  role_id: number = 2 ): Promise<void> {
  // Encriptamos la contraseña antes de almacenarla usando argon2.
  const hashedPassword = await argon2.hash(password);
  
  // Insertamos el nuevo usuario en la base de datos.
  await db.insert(userTable).values({
    name,
    surname,
    email,
    password: hashedPassword,
    role_id,
    created_at: sql`NOW()` // Guardamos la contraseña encriptada.
  });
}

export async function loginUser(email: string, password: string): Promise<string | null> {
  // Buscamos el usuario por su email.
  console.log("Buscando usuario con email:", email);
  const user = await db.select().from(userTable).where(eq(userTable.email, email)).limit(1).execute();
  
  if (user.length === 0) {
    console.log("Usuario no encontrado");
    return null;  // Usuario no encontrado.
  }

  // Comprobamos que la contraseña coincida usando argon2.verify() en lugar de bcrypt.compare().
  const isPasswordValid = await argon2.verify(user[0].password, password);
  console.log("¿Contraseña válida?", isPasswordValid);
  if (!isPasswordValid) {
    return null;  // Contraseña incorrecta.
  }

  // Generamos el token de sesión si las credenciales son correctas.
  const token = generateSessionToken();
  
  // Creamos la sesión en la base de datos.
  await createSession(token, user[0].id);

  return token;  // Devolvemos el token al cliente.
}

export async function createSession(token: string, userId: number): Promise<void> {
  // Generamos el sessionId utilizando sha256 con la librería 'crypto' de Node.js.
  const sessionId = createHash('sha256').update(token).digest('hex');  // Usamos la función `createHash` de 'crypto' para hacer el hash
  
  const session = {
    id: sessionId,
    userId,
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30), // Sesión válida por 30 días
  };

  // Insertamos la sesión en la base de datos.
  await db.insert(sessionTable).values(session);
  console.log("Creando sesión:", session);

}

export async function validateUserSession(token: string): Promise<{ session: Session | null, user: User | null }> {
  const sessionId = createHash('sha256').update(token).digest('hex');  // Usa el mismo hash

  const session = await db.select().from(sessionTable).where(eq(sessionTable.id, sessionId)).limit(1).execute();

  if (session.length === 0) {
    return { session: null, user: null };
  }

  const user = await db.select().from(userTable).where(eq(userTable.id, session[0].userId)).limit(1).execute();

  return { session: session[0], user: user.length > 0 ? user[0] : null };
}

export async function logoutUser(token: string): Promise<void> {
  // Si se desea hacer logout, eliminamos la sesión de la base de datos.
  const { session } = await validateSessionToken(token);

  if (session) {
    await db.delete(sessionTable).where(eq(sessionTable.id, session.id));  // Eliminamos la sesión.
  }
}
export {
  generateSessionToken // Aquí importamos las tablas y la conexión a la base de datos.
};

