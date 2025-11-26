import { defineConfig } from 'astro/config';
import tailwind from "@astrojs/tailwind";

export default defineConfig({
  integrations: [
    tailwind({
      applyBaseStyles: true, // автоматично додає базові стилі Tailwind
    }),
  ],
   site: 'https://domain.com',
});