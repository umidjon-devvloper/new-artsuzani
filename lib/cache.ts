/**
 * Kesh teglari — bitta manba.
 *
 * `unstable_cache` bilan o'qishlar shu teglar ostida saqlanadi; admin
 * o'zgartirish kiritganda `revalidateTag` chaqirilib, kesh yangilanadi.
 * Shunda bosh sahifa har so'rovda bazaga bormaydi, lekin ma'lumot ham
 * eskirib qolmaydi.
 */
export const CACHE_TAGS = {
  products: "products",
  categories: "categories",
  blogs: "blogs",
} as const;
