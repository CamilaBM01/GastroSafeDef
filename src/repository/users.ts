 // tu conexión Drizzle
import { eq } from "drizzle-orm";
import { restaurantTable, reviewTable, sessionTable, userTable } from "@/lib/schema"; // ajusta el path si es distinto
import { db } from "@/lib/db";

export async function getUserFromSession(sessionId: string) {
  const session = await db.select().from(sessionTable).where(eq(sessionTable.id, sessionId)).limit(1);
  if (session.length === 0) return null;

  const user = await db
    .select({
      id: userTable.id,
      name: userTable.name,
      email: userTable.email,
    })
    .from(userTable)
    .where(eq(userTable.id, session[0].userId))
    .limit(1);

  return user[0] || null;
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
export const listUsers = async () => {
  return await db.select().from(userTable);
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
                                roleId: user.roleId
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
