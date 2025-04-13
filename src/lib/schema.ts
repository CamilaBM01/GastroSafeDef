import { mysqlTable, int, varchar, datetime, boolean } from 'drizzle-orm/mysql-core';

// Tabla de roles
export const roleTable = mysqlTable('roles', {
  id: int('id').primaryKey().autoincrement(),
  name: varchar('name', { length: 255 }).notNull()
});

// Tabla de usuarios
export const userTable = mysqlTable('users', {
  id: int('id').primaryKey().autoincrement(),
  name: varchar('name', { length: 255 }).notNull(),
  surname: varchar('surname', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  password: varchar('password', { length: 255 }).notNull(),
  roleId: int('role_id').references(() => roleTable.id),
  createdAt: datetime('created_at')
});

// Tabla de restaurantes
export const restaurantTable = mysqlTable('restaurants', {
  id: int('id').primaryKey().autoincrement(),
  name: varchar('name', { length: 255 }).notNull(),
  address: varchar('address', { length: 255 }).notNull(),
  website: varchar('website', { length: 255 }),
  mapsUrl: varchar('maps_url', { length: 255 }),
  photo: varchar('photo', { length: 255 }),
});

// Tabla de reseñas
export const reviewTable = mysqlTable('reviews', {
  id: int('id').primaryKey().autoincrement(),
  userId: int('user_id').references(() => userTable.id),
  restaurantId: int('restaurant_id').references(() => restaurantTable.id),
  title: varchar('title', { length: 255 }).notNull(),
  description: varchar('description', { length: 255 }).notNull(),
  suitable: boolean('suitable'),
  createdAt: datetime('created_at'),
  updatedAt: datetime('updated_at')
});

// Tabla de favoritos
export const favoriteTable = mysqlTable('favorites', {
  userId: int('user_id').primaryKey().references(() => userTable.id),
  restaurantId: int('restaurant_id').primaryKey().references(() => restaurantTable.id),
});

// Tabla de seguidores
export const followerTable = mysqlTable('followers', {
  followerId: int('follower_id').primaryKey().references(() => userTable.id),
  followedId: int('followed_id').primaryKey().references(() => userTable.id),
});

// Tabla de sesiones
export const sessionTable = mysqlTable('sessions', {
  id: varchar('id', { length: 255 }).primaryKey(),
  userId: int('user_id').notNull().references(() => userTable.id),
  expiresAt: datetime('expires_at').notNull()
});
