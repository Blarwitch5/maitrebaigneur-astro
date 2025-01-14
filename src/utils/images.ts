import type { ImageMetadata } from "astro";

export const images = import.meta.glob<{ default: ImageMetadata }>(
  "/src/assets/images/**/*.{jpg,jpeg,png,gif}",
  { eager: true }
);
