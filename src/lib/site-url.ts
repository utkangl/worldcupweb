/**
 * Canonical site URL for sitemap, robots, and Open Graph metadata.
 * Set `NEXT_PUBLIC_SITE_URL` in production (e.g. `https://yourdomain.com`).
 */
export function getSiteUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (fromEnv) return fromEnv;
  if (process.env.VERCEL_URL)
    return `https://${process.env.VERCEL_URL.replace(/\/$/, "")}`;
  return "http://localhost:3000";
}
