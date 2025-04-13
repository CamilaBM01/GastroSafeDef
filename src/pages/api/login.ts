// src/pages/api/login.ts

import argon2 from 'argon2'; // Para encriptar la contraseña
import { db, userTable } from '../../lib/db'; // Conexión a tu base de datos
import { eq } from 'drizzle-orm';

export async function post({ request }: { request: Request }) {
  const { email, password } = await request.json(); // Obtenemos las credenciales del body de la solicitud

  // Buscamos al usuario en la base de datos por su email
  const user = await db.select().from(userTable).where(eq(userTable.email, email)).limit(1);

  if (user.length === 0) {
    return new Response(JSON.stringify({ message: 'Usuario no encontrado' }), {
      status: 404,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  // Verificamos la contraseña con argon2
  const validPassword = await argon2.verify(user[0].password, password);

  if (!validPassword) {
    return new Response(JSON.stringify({ message: 'Contraseña incorrecta' }), {
      status: 401,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  // Si la autenticación es exitosa, generamos un token de sesión
  const token = generateSessionToken();

  // Establecemos el token en una cookie
  return new Response(JSON.stringify({ message: 'Inicio de sesión exitoso' }), {
    status: 200,
    headers: {
      'Set-Cookie': `session=${token}; HttpOnly; Path=/; Max-Age=2592000; SameSite=Strict`,
      'Content-Type': 'application/json',
    },
  });
}

export function generateSessionToken(): string {
  return crypto.randomUUID(); // Generamos un token único (usando el estándar UUID)
}
