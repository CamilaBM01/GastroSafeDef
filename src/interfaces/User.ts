interface IUser {
    id?: number;  // ID del usuario.
    name: string; // Nombre del usuario.
    surname:string; // Apellido del usuario.
    email: string;  // Email del usuario.
    password: string; // Contraseña del usuario.
    createdAt:Date; // Fecha de creación del usuario.
    roleId:number; // ID del rol del usuario.
    digestive_condition: string; // Condición digestiva del usuario (opcional).
    photo?: string; // URL de la foto del usuario (opcional).

  }