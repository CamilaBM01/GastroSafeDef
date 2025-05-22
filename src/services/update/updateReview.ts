export const updateReview = async(data:FormData):Promise<IReview> =>{
    const id = data.get("review_id");
  if (!id) {
    throw new Error("El ID de la reseña es obligatorio para actualizar");
  }
  let review: IReview = {
    id: Number(id),
    title : data.get('title') as string ||  '',
    description : data.get('description') as string ||  '',
    suitable: data.get("suitable") === "true",
    updatedAt: new Date()
    
  };
  return review;
}