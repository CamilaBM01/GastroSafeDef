import { db } from "@/lib/db";
import { favoriteTable, restaurantTable } from "@/lib/schema";
import { eq } from "drizzle-orm";


/**
 * Obtiene la lista de IDs de restaurantes favoritos de un usuario.
 * @param userId ID del usuario.
 * @returns Array de restaurantId.
 */
export const getFavoritesByUserId = async (userId: number): Promise<number[]> => {
    const result = await db
      .select({ restaurantId: favoriteTable.restaurantId })
      .from(favoriteTable)
      .where(eq(favoriteTable.userId, userId));
  
    return result.map(fav => fav.restaurantId);
  };

  /**
 * Devuelve la lista completa de restaurantes que están en favoritos de un usuario.
 * @param userId ID del usuario.
 * @returns Lista de restaurantes.
 */
export const getFavoriteRestaurantsByUserId = async (userId: number) => {
    return await db
      .select({
        id: restaurantTable.id,
        name: restaurantTable.name,
        address: restaurantTable.address,
        website: restaurantTable.website,
        maps_url: restaurantTable.maps_url,
        photo: restaurantTable.photo
      })
      .from(restaurantTable)
      .innerJoin(favoriteTable, eq(favoriteTable.restaurantId, restaurantTable.id))
      .where(eq(favoriteTable.userId, userId));
  };
  
  /**
 * Lista los restaurantes favoritos del usuario.
 * @param userId ID del usuario.
 * @returns Array de objetos de restaurante.
 */
export const listFavoriteRestaurantsByUserId = async (userId: number) => {
    return await db
      .select()
      .from(restaurantTable)
      .innerJoin(favoriteTable, eq(favoriteTable.restaurantId, restaurantTable.id))
      .where(eq(favoriteTable.userId, userId));
  };