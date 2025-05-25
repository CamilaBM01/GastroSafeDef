// 1. Importa dotenv para cargar las variables de entorno desde el archivo .env
import dotenv from 'dotenv';  
dotenv.config();  // Carga las variables de entorno

// 2. Importa mysql2/promise para crear una conexión a la base de datos
import mysql from 'mysql2/promise';  

// 3. Importa drizzle-orm y las tablas que has definido en el esquema
import { drizzle } from 'drizzle-orm/mysql2';
import { userTable, sessionTable } from './schema';  

// 4. Crea la conexión a la base de datos usando las variables de entorno
const connection = await mysql.createConnection({
  host: process.env.DB_HOST,     // 'localhost', que es el host de tu DB
  user: process.env.DB_USER,     // 'camila', el nombre de usuario para la DB
  password: process.env.DB_PASSWORD, // '123456789', la contraseña de la DB
  database: process.env.DB_NAME,    // 'GastroSafe', el nombre de la base de datos
});

// 5. Crea la instancia de Drizzle ORM para trabajar con la base de datos
export const db = drizzle(connection); 

// 6. Exporta las tablas definidas para que puedas usarlas en otros archivos
export { userTable, sessionTable };