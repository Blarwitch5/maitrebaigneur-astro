import { defineCollection, z } from "astro:content";

const poolsCollection = defineCollection({
  type: "content",
  schema: z.object({
    metaTitle: z.string(),
    metaDesc: z.string(),
    title: z.string(),
    pool: z.object({
      name: z.string(),
      location: z.string(),
      desc: z.string(),
      image: z.object({
        jpg: z.string(),
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
          webp: z.string(),
          jpg: z.string(),
          alt: z.string(),
        })
      ),
    }),
  }),
});

export const collections = {
  bassins: poolsCollection,
};
