/**
 * Saytning kanonik manzili — bitta manba.
 *
 * Buni o'zgartirish uchun .env faylida NEXT_PUBLIC_SITE_URL ni bering.
 * DIQQAT: NEXT_PUBLIC_APP_URL dan foydalanmang — u Vercel preview manzilini
 * ("...vercel.app") saqlaydi va canonical/OG havolalarida ishlatilsa
 * Google uchun dublikat kontent hosil bo'ladi.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://artsuzani.com"
).replace(/\/+$/, "");

/** Locale prefiksi bilan to'liq URL yasaydi: absoluteUrl("en", "/products") */
export function absoluteUrl(locale: string, path = "") {
  const clean = path && !path.startsWith("/") ? "/" + path : path;
  return `${SITE_URL}/${locale}${clean}`;
}
