import { defineConfig } from 'astro/config';
import dotenv from 'dotenv';
import tailwind from '@astrojs/tailwind';
import node from '@astrojs/node'; // 👈 esto es clave

dotenv.config();

export default defineConfig({
  output: 'server',
  adapter: node({
    mode: 'standalone', // 👈 IMPORTANTE
  }),
  integrations: [tailwind()],
});
