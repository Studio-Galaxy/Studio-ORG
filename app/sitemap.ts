import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: "https://studiogalaxy.org", changeFrequency: "monthly", priority: 1 },
    { url: "https://studiogalaxy.org/privacy", changeFrequency: "yearly", priority: 0.3 },
  ];
}
