// src/pages/api/logout.ts

export async function post() {
    // Aquí borramos la cookie "session" estableciendo su fecha de expiración en el pasado
    return new Response(JSON.stringify({ message: 'Sesión cerrada' }), {
      status: 200,
      headers: {
        'Set-Cookie': 'session=; HttpOnly; Path=/; Max-Age=0; SameSite=Strict', // Esto elimina la cookie
        'Content-Type': 'application/json',
      },
    });
  }
  