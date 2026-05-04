import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site-url";

const ROUTES = [
  { path: "/", priority: 1 },
  { path: "/matches", priority: 0.9 },
  { path: "/simulator", priority: 0.85 },
  { path: "/predictions", priority: 0.85 },
  { path: "/games", priority: 0.85 },
  { path: "/privacy", priority: 0.4 },
  { path: "/terms", priority: 0.4 },
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteUrl();
  const now = new Date();
  return ROUTES.map(({ path, priority }) => ({
    url: `${base}${path}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority,
  }));
}
