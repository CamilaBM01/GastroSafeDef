import { db } from "@/lib/db";
import { favoriteTable, restaurantTable, reviewTable, userTable } from "@/lib/schema";
import { count, desc, eq, or } from "drizzle-orm";

/**
 * Obtiene todas las reseñas del sistema, incluyendo la información del usuario que la creó
 * y del restaurante al que hace referencia. Las reseñas se devuelven ordenadas desde la más nueva
 * hasta la más antigua, según la fecha de creación.
 *
 * @returns {Promise<Array<Object>>} Un array de objetos, cada uno representando una reseña.
 * Cada objeto incluye:
 * - `reviewId`: ID de la reseña.
 * - `title`: Título de la reseña.
 * - `description`: Descripción de la reseña.
 * - `suitable`: Booleano que indica si el restaurante fue apto para su condición digestiva.
 * - `createdAt`: Fecha de creación de la reseña.
 * - `updatedAt`: Fecha de última actualización de la reseña.
 * - `user`: Objeto con información del usuario que hizo la reseña (`id`, `name`, `surname`, `photo`).
 * - `restaurant`: Objeto con información del restaurante (`id`, `name`, `address`, `photo`).
 *
 * @example
 * const reviews = await getAllReviews();
 * console.log(reviews[0].title); // Título de la primera reseña
 */
export const getAllReviews = async () => {
    return await db
      .select({
        reviewId: reviewTable.id,
        title: reviewTable.title,
        description: reviewTable.description,
        suitable: reviewTable.suitable,
        createdAt: reviewTable.createdAt,
        updatedAt: reviewTable.updatedAt,
        user: {
          id: userTable.id,
          name: userTable.name,
          surname: userTable.surname,
          photo: userTable.photo,
        },
        restaurant: {
          id: restaurantTable.id,
          name: restaurantTable.name,
          address: restaurantTable.address,
          photo: restaurantTable.photo,
        }
      })
      .from(reviewTable)
      .innerJoin(userTable, eq(reviewTable.userId, userTable.id))
      .innerJoin(restaurantTable, eq(reviewTable.restaurantId, restaurantTable.id))
      .orderBy(desc(reviewTable.createdAt));
  };

  export const getPaginatedReviews = async (page: number = 1, pageSize: number = 10) => {
    const offset = (page - 1) * pageSize;
  
    // Obtener la data paginada
    const data = await db
      .select({
        reviewId: reviewTable.id,
        title: reviewTable.title,
        description: reviewTable.description,
        suitable: reviewTable.suitable,
        createdAt: reviewTable.createdAt,
        updatedAt: reviewTable.updatedAt,
        user: {
          id: userTable.id,
          name: userTable.name,
          surname: userTable.surname,
          photo: userTable.photo,
        },
        restaurant: {
          id: restaurantTable.id,
          name: restaurantTable.name,
          address: restaurantTable.address,
          photo: restaurantTable.photo,
        }
      })
      .from(reviewTable)
      .innerJoin(userTable, eq(reviewTable.userId, userTable.id))
      .innerJoin(restaurantTable, eq(reviewTable.restaurantId, restaurantTable.id))
      .orderBy(desc(reviewTable.createdAt))
      .limit(pageSize)
      .offset(offset);
  
    // Contar total de reseñas de manera manual
    const totalResult = await db
      .select({ count: reviewTable.id })
      .from(reviewTable);
      
    const total = totalResult.length > 0 ? totalResult[0].count : 0;
    const totalPages = Math.ceil(total / pageSize);
  
    return {
      data,
      page,
      pageSize,
      total,
      totalPages,
    };
  };

  export const deleteReviewById = async (reviewId: number) => {
    await db.transaction(async (tx) => {
      // Eliminar la reseña
      await tx.delete(reviewTable).where(eq(reviewTable.id, reviewId));
    });
  };

  export const countReviewsByUser = async (userId: number) => {
    const result = await db
      .select({ total: count() })
      .from(reviewTable)
      .where(eq(reviewTable.userId, userId));
  
    return result[0]?.total ?? 0;
  };



  export const getUserReviews = async (userId: number) => {
    return await db
      .select({
        id: reviewTable.id,
        title: reviewTable.title,
        description: reviewTable.description,
        suitable: reviewTable.suitable,
        createdAt: reviewTable.createdAt,
        restaurantName: restaurantTable.name,
        restaurantId: restaurantTable.id,
      })
      .from(reviewTable)
      .innerJoin(restaurantTable, eq(reviewTable.restaurantId, restaurantTable.id))
      .where(eq(reviewTable.userId, userId));
  };

  export const getUserFavorites = async (userId: number) => {
    return await db
      .select({
        restaurantId: restaurantTable.id,
        name: restaurantTable.name,
        address: restaurantTable.address,
        website: restaurantTable.website,
        mapsUrl: restaurantTable.maps_url,
        photo: restaurantTable.photo,
      })
      .from(favoriteTable)
      .innerJoin(restaurantTable, eq(favoriteTable.restaurantId, restaurantTable.id))
      .where(eq(favoriteTable.userId, userId));
  };

  export const insertReview = async(review:IReview):Promise<boolean>=>{
    try {
      const result = await db.insert(reviewTable).values(review);
      console.log(result);
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }


  export const getReviewsByUser = async (userId: number) => {
    return await db
      .select({
        id: reviewTable.id,
        title: reviewTable.title,
        description: reviewTable.description,
        suitable: reviewTable.suitable,
        createdAt: reviewTable.createdAt,
        restaurantName: restaurantTable.name,
        restaurantId: restaurantTable.id,
      })
      .from(reviewTable)
      .innerJoin(restaurantTable, eq(reviewTable.restaurantId, restaurantTable.id))
      .where(eq(reviewTable.userId, userId))
      .orderBy(reviewTable.createdAt);
  };
  