import { defineCollection, z } from "astro:content";
import { glob } from 'astro/loaders';


const poolsCollection = defineCollection({

  loader: glob({ pattern: "**/*.md", base: "./src/content/bassins" }),

  schema: ({image}) => z.object({
    metaTitle: z.string(),
    metaDesc: z.string(),
    title: z.string(),
    pool: z.object({
      name: z.string(),
      location: z.string(),
      desc: z.string(),
      image: z.object({
        path: image(),
        alt: z.string(),
      }),
      address: z.string(),
      link: z.object({
        url: z.string(),
        text: z.string(),
      }),
      services: z.array(
        z.object({
          name: z.string(),
          icon: z.string(),
          href: z.string(),
        })
      ),
      gallery: z.array(
        z.object({
          path: image(),
          alt: z.string(),
        })
      ),
    }),
  }),
});

export const collections = {
  bassins: poolsCollection,
};
