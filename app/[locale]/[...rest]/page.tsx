import { notFound } from "next/navigation";

/**
 * Barcha mos kelmagan manzillarni ushlaydi.
 *
 * next-intl `localePrefix: "always"` bilan ishlaganda, /en/mavjud-emas kabi
 * manzil hech qaysi route'ga tushmaydi va Next ildiz (root) 404'ini ko'rsatadi
 * — u esa saytning [locale] layout'idan tashqarida. Bu catch-all notFound()
 * chaqirib, manzilni [locale]/not-found.tsx ga yo'naltiradi (Header/Footer bilan).
 */
export default function CatchAllPage() {
  notFound();
}
