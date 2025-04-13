// @ts-check
import { defineConfig } from 'astro/config';
import dotenv from 'dotenv'

import tailwindcss from '@tailwindcss/vite';

dotenv.config();



// https://astro.build/config
export default defineConfig({
  output: "server",

  vite: {
    plugins: [tailwindcss()]
  }
});