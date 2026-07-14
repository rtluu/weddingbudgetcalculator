import type { MetadataRoute } from "next";
import { PORTFOLIO } from "@/config/copy";

const BASE = "https://bymosaic.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "",
    "/about",
    "/services",
    "/portfolio",
    "/contact",
  ].map((path) => ({
    url: `${BASE}${path}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: path === "" ? 1 : 0.8,
  }));

  const eventRoutes = PORTFOLIO.map((event) => ({
    url: `${BASE}/portfolio/${event.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...eventRoutes];
}
