interface IRestaurant {
    id?: number;  // ID del restaurante.
    name: string; // Nombre del restaurante.
    address: string; // Dirección del restaurante.
    website?: string; // URL del sitio web del restaurante (opcional).
    mapsUrl: string; // URL de Google Maps del restaurante.
    photo?: string; // URL de la foto del restaurante (opcional).
}