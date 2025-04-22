import { deleteRestaurantById } from "@/repository/restaurants";

import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ request }) => {
    const formData = await request.formData();
    const id = formData.get("restaurantId");
  
    if (!id) {
      return new Response("ID no proporcionado", { status: 400 });
    }
  
    try {
      await deleteRestaurantById(Number(id)); 
      return new Response(null, {
        status: 302,
        headers: { Location: "/admin/restaurants/dashboardRestaurants" }, 
      });
    } catch (error) {
      console.error("Error al eliminar el restaurante:", error);
      return new Response("Error al eliminar", { status: 500 });
    }
  };