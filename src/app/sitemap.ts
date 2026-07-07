import type { MetadataRoute } from "next";
import { db } from "@/lib/db";

const BASE_URL = "https://hksalonformen.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await db.blogPost.findMany({
    where: { status: "published" },
    select: { slug: true, createdAt: true },
    orderBy: { createdAt: "desc" },
  });

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE_URL}/artists`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/blog`, changeFrequency: "weekly", priority: 0.8 },
  ];

  const postRoutes: MetadataRoute.Sitemap = posts.map((p) => ({
    url: `${BASE_URL}/blog/${p.slug}`,
    lastModified: p.createdAt,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...postRoutes];
}
