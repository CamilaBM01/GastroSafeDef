import { db } from "@/lib/db";
import { restaurantTable, userTable } from "@/lib/schema";

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