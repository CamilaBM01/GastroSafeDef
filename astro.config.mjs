// @ts-check
import { defineConfig } from 'astro/config';
import dotenv from 'dotenv'
import tailwind from "@astrojs/tailwind";

dotenv.config();



// https://astro.build/config
export default defineConfig({
  output: "server",
  integrations: [tailwind()],


});