import { db } from "@/lib/db";
import { favoriteTable } from "@/lib/schema";
import type { APIRoute } from "astro";
import { and, eq } from "drizzle-orm";

export const POST: APIRoute = async ({ request }) => {
    const formData = await request.formData();
    const userId = Number(formData.get("userId"));
    const restaurantId = Number(formData.get("restaurantId"));
  
    if (!userId || !restaurantId) {
      return new Response("Parámetros inválidos", { status: 400 });
    }
  
    // Comprobamos si ya es favorito
    const exists = await db
      .select()
      .from(favoriteTable)
      .where(and(eq(favoriteTable.userId, userId), eq(favoriteTable.restaurantId, restaurantId)));
  
    if (exists.length > 0) {
      // Eliminar si ya es favorito
      await db
        .delete(favoriteTable)
        .where(and(eq(favoriteTable.userId, userId), eq(favoriteTable.restaurantId, restaurantId)));
      return new Response(JSON.stringify({ success: true, added: false }), { status: 200 });
    } else {
      // Añadir si no es favorito
      await db.insert(favoriteTable).values({ userId, restaurantId });
      return new Response(JSON.stringify({ success: true, added: true }), { status: 200 });
    }
  };