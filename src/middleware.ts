// src/middleware.ts

import { defineMiddleware } from "astro:middleware";
import { validateUserSession, setSessionTokenCookie, deleteSessionTokenCookie } from "./lib/auth";  // Importa las funciones necesarias

const publicRoutes = ["/login", "/register",  "/api/signin", "/register/success", "/api/register"];

export const onRequest = defineMiddleware(async (context, next) => {
  const token = context.cookies.get("session")?.value ?? null;
  const currentPath = context.url.pathname; // Ruta actual del usuario

  // Si la ruta actual es pública (login o register), no hacemos nada
  if (publicRoutes.includes(currentPath)) {
    return next(); // Deja que el usuario continúe sin hacer nada
  }

  // Si no hay token y el usuario está en una página que no es pública, redirigimos a login
  if (!token) {
    return context.redirect("/login"); // Redirigimos al login
  }

  // Si el token existe, lo validamos
  const { session, user } = await validateUserSession(token);
  
  // Si la sesión no es válida o ha expirado, redirigimos a login
  if (!session || Date.now() >= session.expiresAt.getTime()) {
    deleteSessionTokenCookie(context);
    context.locals.user = null;
    context.locals.session = null;
    return context.redirect("/login");
  }

  // Si todo está bien, almacenamos la sesión y el usuario
  context.locals.session = session;
  context.locals.user = user;

  return next(); // Continuamos al siguiente paso (mostrar la página)
});
