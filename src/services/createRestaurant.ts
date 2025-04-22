
export const createRestaurant = async(data:FormData):Promise<IRestaurant> =>{
  let restaurant: IRestaurant = {
    name : data.get('name') as string ||  '',
    address : data.get('address') as string ||  '',
    website : data.get('website') as string ||  '',
    maps_url : data.get('mapsUrl')as string || '',
    photo : data.get('photo')as string || 'No pHoto',
    
  };
  return restaurant;
}