 // tu conexión Drizzle
import { eq, or, like, count } from "drizzle-orm";
import { favoriteTable, followerTable, restaurantTable, reviewTable, sessionTable, userTable } from "@/lib/schema"; // ajusta el path si es distinto
import { db } from "@/lib/db";
import { createHash } from "crypto";

// export async function getUserFromSession(sessionId: string) {
//   console.log("🔍 Buscando sesión con ID:", sessionId);
//   const session = await db.select().from(sessionTable).where(eq(sessionTable.id, sessionId)).limit(1);
//   console.log("📄 Resultado sesión:", session);
//   if (session.length === 0) return null;

//   const user = await db
//     .select({
//       id: userTable.id,
//       name: userTable.name,
//       email: userTable.email,
//     })
//     .from(userTable)
//     .where(eq(userTable.id, session[0].userId))
//     .limit(1);
    
//   console.log("✅ Usuario encontrado:", user);
//   return user[0] || null;
// }

/**
 * Recupera un usuario a partir del token de sesión.
 *
 * @param token - Token de sesión recibido desde la cookie.
 * @returns El usuario correspondiente, o null si no existe.
 */
export async function getUserFromSession(token: string) {
  const sessionId = createHash('sha256').update(token).digest('hex');

  const session = await db
    .select()
    .from(sessionTable)
    .where(eq(sessionTable.id, sessionId))
    .limit(1);

  if (session.length === 0) return null;

  const user = await db
    .select()
    .from(userTable)
    .where(eq(userTable.id, session[0].userId))
    .limit(1);

  return user[0] ?? null;
}

export const insertUser = async(user:IUser):Promise<boolean>=>{
  try {
    const result = await db.insert(userTable).values(user);
    console.log(result);
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

/**
 * Función asíncrona para obtener la lista de usuarios desde la base de datos.
 * Si se pasa un "query" (término de búsqueda), filtra los usuarios según ese término.
 * Si no se pasa un "query", devuelve todos los usuarios.
 * 
 * @param {string} [query] - Término de búsqueda que se usará para filtrar los usuarios (puede ser nombre, apellido o correo electrónico).
 * @returns {Promise} - Una promesa que resuelve con la lista de usuarios encontrados según el filtro aplicado o todos los usuarios si no se pasa filtro.
 */                                                               
export const listUsers = async (query?: string) => {
  if (!query) {
    return await db.select().from(userTable);
  }

  const q = `%${query}%`;

  return await db
    .select()
    .from(userTable)
    .where(
      or(
        like(userTable.name, q),
        like(userTable.surname, q),
        like(userTable.email, q)
      )
    );
};

/**
 * Funcion para editar un usuario ya existente e insertar los datos cambiados en la bd
 * @param user 
 * @returns 
 */
export const insertEditUser = async(user:IUser):Promise<boolean>=>{
  try{
    if (!user.id) {
      throw new Error("El ID del usuario es obligatorio para actualizar");
    }
    const result = await db.update(userTable)
                            .set({ 
                                id:user.id,
                                name: user.name,
                                surname: user.surname,
                                email: user.email,
                                digestive_condition: user.digestive_condition,
                                photo: user.photo,
                                role_id: user.role_id
                            })
                            .where(eq(userTable.id, user.id))
                            console.log("Usuaeio actualizado:", result);
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

/**
 * Encuentra un usuario en la base de datos.
 *
 * Esta función busca un usuario en la tabla `users` basándose en el `userId` proporcionado.
 * Si se encuentra el usuario, devuelve un objeto `IUser`.
 * Si no se encuentra el usuario, devuelve `null`.
 *
 * @param {number} userId - El ID del usuario que se busca.
 * @returns {Promise<IUser | null>} - Una promesa que resuelve con un objeto `IUser` si el usuario es encontrado, o `null` si no lo es.
 */
export const findUser = async (userId: number): Promise<IUser | null> => {
  if (typeof userId !== 'number' || isNaN(userId)) {
    throw new Error(`Invalid userId passed to findUser: ${userId}`);
  }
  const user = await db
    .select()
    .from(userTable)
    .where(eq(userTable.id, userId));

  return (user[0] as IUser) ?? null;
};


export const getReviewsByUser = async (userId: number) => {
  return await db
  .select({
    id: reviewTable.id,
    title: reviewTable.title,
    description: reviewTable.description,
    suitable: reviewTable.suitable,
    createdAt: reviewTable.createdAt,
    restaurantName: restaurantTable.name,
  })
  .from(reviewTable)
  .innerJoin(restaurantTable, eq(reviewTable.restaurantId, restaurantTable.id))
  .where(eq(reviewTable.userId, userId));
};


export const deleteUserById = async (userId: number) => {
  await db.transaction(async (tx) => {
    // Eliminar reseñas del usuario
    await tx.delete(reviewTable).where(eq(reviewTable.userId, userId));

    // Eliminar favoritos donde es el usuario
    await tx.delete(favoriteTable).where(eq(favoriteTable.userId, userId));

    // Eliminar seguidores: donde él sigue o lo siguen
    await tx.delete(followerTable).where(
      or(
        eq(followerTable.followerId, userId),
        eq(followerTable.followedId, userId)
      )
    );

    // Eliminar sesiones del usuario
    await tx.delete(sessionTable).where(eq(sessionTable.userId, userId));

    // Finalmente, eliminar al usuario
    await tx.delete(userTable).where(eq(userTable.id, userId));
  });
};

export const getUserStats = async (userId: number) => {
  const userInfo = await db
    .select({
      id: userTable.id,
      name: userTable.name,
      surname: userTable.surname,
      email: userTable.email,
      digestive_condition: userTable.digestive_condition,
      photo: userTable.photo,
      role_id: userTable.role_id,
      createdAt: userTable.created_at
    })
    .from(userTable)
    .where(eq(userTable.id, userId))
    .limit(1);

  const reviewCount = await db
    .select({ count: count() })
    .from(reviewTable)
    .where(eq(reviewTable.userId, userId));

  const favoriteCount = await db
    .select({ count: count() })
    .from(favoriteTable)
    .where(eq(favoriteTable.userId, userId));

  if (userInfo.length === 0) return null;

  return {
    ...userInfo[0],
    total_reviews: reviewCount[0].count,
    total_favorites: favoriteCount[0].count,
  };
};