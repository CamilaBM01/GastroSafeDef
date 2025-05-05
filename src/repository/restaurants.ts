import { db } from "@/lib/db";
import { desc, eq, or, like } from "drizzle-orm";
import { favoriteTable, restaurantTable, reviewTable, userTable } from "@/lib/schema";

export const insertRestaurant = async(restaurant:IRestaurant):Promise<boolean>=>{
  try {
    const result = await db.insert(restaurantTable).values(restaurant);
    console.log(result);
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}
// Función para obtener restaurantes desde la base de datos, opcionalmente filtrando por nombre.
export const listRestaurants = async (query?: string) => {
  if (!query) {
    // Si no hay término de búsqueda, devolvemos todos los restaurantes.
    return await db.select().from(restaurantTable);
  }

  // Preparamos el término de búsqueda con % para una búsqueda parcial.
  const q = `%${query}%`;

  // Realizamos la consulta buscando en los campos name y address.
  return await db
    .select()
    .from(restaurantTable)
    .where(
      or(
        like(restaurantTable.name, q),     // Filtra por nombre del restaurante
        like(restaurantTable.address, q)   // Filtra por dirección del restaurante
      )
    );
};


/**
 * Funcion para editar un restaurante ya existente e insertar los datos cambiados en la bd
 * @param restaurant 
 * @returns 
 */
export const insertEditRestaurant = async(restaurant:IRestaurant):Promise<boolean>=>{
  try{
    if (!restaurant.id) {
      throw new Error("El ID del usuario es obligatorio para actualizar");
    }
    const result = await db.update(restaurantTable)
                            .set({ 
                                id:restaurant.id,
                                name: restaurant.name,
                                address: restaurant.address,
                                website: restaurant.website,
                                maps_url: restaurant.maps_url,
                                photo: restaurant.photo,
                            })
                            .where(eq(restaurantTable.id, restaurant.id))
                            console.log("Restaurant actualizado:", result);
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

/**
 * Encuentra un restuarante en la base de datos.
 *
 * Esta función busca un restuarante en la tabla `restuarant` basándose en el `restuarantId` proporcionado.
 * Si se encuentra el restuarante, devuelve un objeto `Irestuarante`.
 * Si no se encuentra el restuarante, devuelve `null`.
 *
 * @param {number} restaurantId - El ID del usuario que se busca.
 * @returns {Promise<IRestaurant | null>} - Una promesa que resuelve con un objeto `IUser` si el usuario es encontrado, o `null` si no lo es.
 */
export const findRestaurant = async (restaurantId: number): Promise<IRestaurant | null> => {
  const restaurant = await db
    .select()
    .from(restaurantTable)
    .where(eq(restaurantTable.id, restaurantId));

  return (restaurant[0] as IRestaurant) ?? null;
};

export const deleteRestaurantById = async (restaurantId: number) => {
  await db.transaction(async (tx) => {
    // Eliminar reseñas del restaurante
    await tx.delete(reviewTable).where(eq(reviewTable.restaurantId, restaurantId));

    // Eliminar favoritos donde el restaurante es favorito
    await tx.delete(favoriteTable).where(eq(favoriteTable.restaurantId, restaurantId));

    // Eliminar otros datos asociados al restaurante si es necesario
    //(AQUI, ANTES DE ELIMINAR LA TABLA RESTAURANTE)

    // Finalmente, eliminar el restaurante
    await tx.delete(restaurantTable).where(eq(restaurantTable.id, restaurantId));
  });
};

/**
 * Obtiene las reseñas de un restaurante junto con la información del usuario que las realizó.
 *
 * Esta función consulta la base de datos y devuelve una lista de reseñas asociadas a un restaurante
 * específico, incluyendo información relevante del usuario que publicó cada reseña.
 *
 * Las reseñas se devuelven ordenadas por fecha de creación, desde la más reciente a la más antigua.
 *
 * @param {number} restaurantId - El ID del restaurante del que se quieren obtener las reseñas.
 * @returns {Promise<IReviewWithUser[]>} - Una promesa que resuelve con una lista de reseñas,
 * cada una incluyendo datos del usuario que la creó.
 */
export const getReviewsByRestaurant = async (restaurantId: number) => {
  return await db
    .select({
      id: reviewTable.id,
      title: reviewTable.title,
      description: reviewTable.description,
      suitable: reviewTable.suitable,
      createdAt: reviewTable.createdAt,
      userName: userTable.name,
      userSurname: userTable.surname,
      userEmail: userTable.email,
      userPhoto: userTable.photo,
      digestiveCondition: userTable.digestive_condition,
    })
    .from(reviewTable)
    .innerJoin(userTable, eq(reviewTable.userId, userTable.id))
    .where(eq(reviewTable.restaurantId, restaurantId))
    .orderBy(desc(reviewTable.createdAt));
};


