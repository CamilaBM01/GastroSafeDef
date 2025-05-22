import { deleteReview, deleteReviewById } from "@/repository/reviews";

import type { APIContext, APIRoute } from "astro";

/* export const POST: APIRoute = async ({ request }) => {
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
  }; */

  export async function POST({ request }: APIContext) {
    try {
      const data = await request.formData();
      const reviewId = data.get("review_id");
  
      if (!reviewId) {
        return new Response("ID de reseña no proporcionado", { status: 400 });
      }
  
      const success = await deleteReview(Number(reviewId));
      if (!success) {
        return new Response("No se pudo eliminar la reseña", { status: 500 });
      }
  
      // Redirección limpia
      return Response.redirect("/user/reviews", 302);
    } catch (err) {
      console.error(err);
      return new Response("Error al procesar la solicitud", { status: 500 });
    }
  }