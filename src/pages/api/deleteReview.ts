import { deleteReview, deleteReviewById } from "@/repository/reviews";

import type { APIContext, APIRoute } from "astro";

export const POST: APIRoute = async ({ request }) => {
    const formData = await request.formData();
    const id = formData.get("reviewId");
  
    if (!id) {
      return new Response("ID no proporcionado", { status: 400 });
    }
  
    try {
      await deleteReviewById(Number(id)); 
      return new Response(null, {
        status: 302,
        headers: { Location: "/admin/reviews/reviewsDashboard" }, 
      });
    } catch (error) {
      console.error("Error al eliminar la reseña:", error);
      return new Response("Error al eliminar", { status: 500 });
    }
  }; 

