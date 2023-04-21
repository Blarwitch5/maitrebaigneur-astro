import { defineConfig } from "astro/config";

// import image from "@astrojs/image";

// https://astro.build/config
export default defineConfig({
  site: "https://maitrebaigneur.netlify.app",
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
  integrations: [
    // image({
    // 	serviceEntryPoint: "@astrojs/image/sharp",
    // }),
  ],
});
