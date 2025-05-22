import type { APIContext } from "astro";
import { deleteReview } from "@/repository/reviews";

export async function POST({ request }: APIContext) {
  try {
    const data = await request.formData();
    const reviewId = Number(data.get("review_id")?.toString());
    const userId = data.get("user_id");

    if (!reviewId || !userId) {
      return new Response("Datos incompletos: review_id o user_id faltan", { status: 400 });
    }
    if (isNaN(reviewId)) {
        console.error("ID inválido recibido:", data.get("review_id"));
        return new Response("ID inválido", { status: 400 });
      }
    const success = await deleteReview(Number(reviewId));

    if (!success) {
      return new Response("No se pudo eliminar la reseña", { status: 500 });
    }

    // Redirección correcta a la página de reseñas del usuario
    return new Response(null, {
      status: 302,
      headers: {
        Location: `/user/reviews/${userId}`,
      },
    });
  } catch (err) {
    console.error("Error al procesar la solicitud:", err);
    return new Response("Error interno del servidor", { status: 500 });
  }
}
