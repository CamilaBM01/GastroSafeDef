export const createReview = async(data:FormData):Promise<IReview> =>{
    const userId = Number(data.get('user_id'));
    const restaurantId = Number(data.get('restaurant_id'));

    if (!userId || !restaurantId) {
    throw new Error("user_id y restaurant_id son obligatorios");
    }
  let review: IReview = {
    userId: Number(data.get('user_id')),
    restaurantId: Number(data.get('restaurant_id')),
    title: (data.get('title') as string) || '',
    description: (data.get('description') as string) || '',
    suitable: data.get('suitable') === 'true',
    createdAt: new Date(),
    updatedAt: new Date()
    };
  return review;
}