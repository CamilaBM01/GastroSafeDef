import { deleteUserById } from "@/repository/users";
import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ request }) => {
    const formData = await request.formData();
    const id = formData.get("userId");
  
    if (!id) {
      return new Response("ID no proporcionado", { status: 400 });
    }
  
    try {
      await deleteUserById(Number(id)); 
      return new Response(null, {
        status: 302,
        headers: { Location: "/admin/users/dashboardUsers" }, 
      });
    } catch (error) {
      console.error("Error al eliminar el usuario:", error);
      return new Response("Error al eliminar", { status: 500 });
    }
  };