import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import vercel from "@astrojs/vercel";

// https://astro.build/config
export default defineConfig({
	site: "https://maitrebaigneur.com",
	adapter: vercel(),
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
		port: 3000,
	},
	integrations: [
		react(),
		sitemap({
			lastmod: new Date(),
			changefreq: "weekly",
		}),
	],
	renderOptions: {
		imgSources: ["https://*.cdninstagram.com"],
	},
});
