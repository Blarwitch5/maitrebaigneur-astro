import type { ImageMetadata } from "astro";

// Importer toutes les images dynamiquement
export const images = import.meta.glob<{ default: ImageMetadata }>(
  "/src/assets/images/**/*.{jpeg,jpg,png,gif}",
  { import: 'default' }
);
