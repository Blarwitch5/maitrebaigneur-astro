import { defineConfig } from "astro/config";
// import image from "@astrojs/image";
import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  site: "https://maitrebaigneur.vercel.app",
  output: "static",
  vite: {
    build: {
      rollupOptions: {
        output: {
          assetFileNames: "assets/styles/[name][extname]",
        },
      },
    },
  },
  //changed because conflict in local with Local by Flywheel for port 3000
  server: {
    port: 8080,
  },
  integrations: [sitemap()],
  // image({
  // 	serviceEntryPoint: "@astrojs/image/sharp",
  // }),
});
