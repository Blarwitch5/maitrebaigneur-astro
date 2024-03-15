import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
	site: "https://maitrebaigneur.com",
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
	integrations: [react(), sitemap()],
	renderOptions: {
		// Ajoutez 'https://*.cdninstagram.com' à la liste des sources d'images autorisées
		imgSources: ["https://*.cdninstagram.com"],
	},
});
