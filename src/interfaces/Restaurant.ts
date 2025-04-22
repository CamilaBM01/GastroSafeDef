interface IRestaurant {
    id?: number;               // ID único del restaurante
    name: string;             // Nombre del restaurante
    address: string;          // Dirección del restaurante
    website?: string;         // URL del sitio web del restaurante (opcional)
    maps_url?: string;         // URL del restaurante en Google Maps (opcional)
    photo?: string;  
}