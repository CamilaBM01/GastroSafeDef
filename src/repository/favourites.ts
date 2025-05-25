import { db } from "@/lib/db";
import { favoriteTable, restaurantTable } from "@/lib/schema";
import { count, eq, sql } from "drizzle-orm";


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

  
/**
 * Obtiene el número total de favoritos de un restaurante por su ID.
 * 
 * @param restaurantId ID del restaurante
 * @returns Número de usuarios que lo tienen como favorito
 */
export const countFavoritesByRestaurant = async (restaurantId: number): Promise<number> => {
  const result = await db
    .select({ total: sql<number>`COUNT(*)` })
    .from(favoriteTable)
    .where(eq(favoriteTable.restaurantId, restaurantId));

  return result[0]?.total ?? 0;
};

export const getFavoritesCountGrouped = async () => {
  const result = await db
    .select({
      restaurantId: favoriteTable.restaurantId,
      total: sql<number>`COUNT(*)`,
    })
    .from(favoriteTable)
    .groupBy(favoriteTable.restaurantId);

  return Object.fromEntries(result.map(r => [r.restaurantId, r.total]));
};