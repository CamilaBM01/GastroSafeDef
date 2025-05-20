interface IRestaurant {
    id?: number;               // ID único del restaurante
    name: string;             // Nombre del restaurante
    address: string;          // Dirección del restaurante
    website?: string | null;         // URL del sitio web del restaurante (opcional)
    maps_url?: string | null;         // URL del restaurante en Google Maps (opcional)
    photo?: string | null;  
}