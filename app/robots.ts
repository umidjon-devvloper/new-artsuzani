import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Manzillarda til prefiksi bor (/en/admin, /ru/admin ...), shuning uchun
      // "/admin" ning o'zi yetarli emas — wildcard shart.
      disallow: [
        "/admin",
        "/profile",
        "/*/admin",
        "/*/profile",
        "/api/",
        "/*/shopping/checkout",
        "/*/shopping/success",
      ],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
