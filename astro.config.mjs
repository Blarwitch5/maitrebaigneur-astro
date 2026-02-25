import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import vercel from "@astrojs/vercel";
import icon from "astro-icon";

// https://astro.build/config
export default defineConfig({
	site: "https://maitrebaigneur.com",
	adapter: vercel(),
	vite: {
		customLogger: {
			info(msg) {
				console.info(msg);
			},
			warn(msg, ...args) {
				// Supprime l'avertissement de dépréciation Vite "glob option as" (provenant d'Astro/deps)
				const text = typeof msg === "string" ? msg : String(msg ?? "");
				if (text.includes("glob option") && text.includes("as") && text.includes("deprecated")) {
					return;
				}
				console.warn(msg, ...args);
			},
			warnOnce(msg, ...args) {
				const text = typeof msg === "string" ? msg : String(msg ?? "");
				if (text.includes("glob option") && text.includes("as") && text.includes("deprecated")) {
					return;
				}
				console.warn(msg, ...args);
			},
			error(msg) {
				console.error(msg);
			},
			clearScreen() {},
			hasWarned: false,
		},
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
		icon({ iconDir: "src/assets/images/icons" }),
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
