
export const updateRestaurant = async(data:FormData):Promise<IRestaurant> =>{
    const id = Number(data.get("id")); //Antes tenia problemas con el id
  console.log("ID después de convertir:", id);
    if (!id) throw new Error("El ID del restaurante es obligatorio para actualizar");
    return{
      id,
      name : data.get('name') as string ||  '',
      address : data.get('address') as string ||  '',
      website : data.get('website') as string ||  '',
      maps_url : data.get('maps_url')as string || '',
      photo : data.get('photo')as string || 'No pHoto',
      
    };
    
  }