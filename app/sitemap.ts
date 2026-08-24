import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { SITE_URL } from "@/lib/site";
import {
  getProductsForSitemap,
  getCategoriesForSitemap,
} from "@/lib/sitemap-data";

// Sitemap har soatda yangilanadi (har bir bot so'roviga bazaga bormaydi)
export const revalidate = 3600;

type Entry = MetadataRoute.Sitemap[number];

/**
 * Bitta sahifa uchun yozuv yasaydi.
 *
 * routing.localePrefix = "always" bo'lgani uchun URL'lar til prefiksi bilan
 * bo'lishi SHART. Prefiksisiz manzil (masalan /products) redirectga tushadi
 * va Google uni ortiqcha sakrash deb hisoblaydi.
 */
function entry(
  path: string,
  opts: {
    lastModified?: Date;
    changeFrequency?: Entry["changeFrequency"];
    priority?: number;
  } = {}
): Entry {
  return {
    url: `${SITE_URL}/${routing.defaultLocale}${path}`,
    lastModified: opts.lastModified ?? new Date(),
    changeFrequency: opts.changeFrequency ?? "weekly",
    priority: opts.priority ?? 0.7,
    alternates: {
      languages: Object.fromEntries(
        routing.locales.map((l) => [l, `${SITE_URL}/${l}${path}`])
      ),
    },
  };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, categories] = await Promise.all([
    getProductsForSitemap(),
    getCategoriesForSitemap(),
  ]);

  const staticPages: Entry[] = [
    entry("", { changeFrequency: "daily", priority: 1.0 }),
    entry("/products", { changeFrequency: "daily", priority: 0.9 }),
    entry("/workshop", { changeFrequency: "monthly", priority: 0.9 }),
    entry("/about", { changeFrequency: "monthly", priority: 0.8 }),
    entry("/blog", { changeFrequency: "weekly", priority: 0.7 }),
    entry("/marketplays", { changeFrequency: "monthly", priority: 0.6 }),
    entry("/contact", { changeFrequency: "yearly", priority: 0.5 }),
    entry("/shipping", { changeFrequency: "yearly", priority: 0.3 }),
    entry("/returns", { changeFrequency: "yearly", priority: 0.3 }),
    entry("/privacy", { changeFrequency: "yearly", priority: 0.3 }),
    entry("/terms", { changeFrequency: "yearly", priority: 0.3 }),
  ];

  const categoryPages = categories.map((c) =>
    entry(`/product-category/${c._id}`, {
      lastModified: c.updatedAt ?? c.createdAt ?? new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    })
  );

  const productPages = products.map((p) =>
    entry(`/products/${p._id}`, {
      lastModified: p.updatedAt ?? p.createdAt ?? new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    })
  );

  return [...staticPages, ...categoryPages, ...productPages];
}
