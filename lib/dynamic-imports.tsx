import dynamic from "next/dynamic";
import React from "react";

// Heavy components - dynamically imported to reduce initial bundle
export const DynamicHeroCarousel = dynamic(
  () =>
    import("@/components/hero-carousel").then((mod) => ({
      default: mod.HeroCarousel,
    })),
  {
    loading: () => (
      <div className="h-[52vh] min-h-[460px] max-h-[560px] bg-gradient-to-r from-muted to-muted/50 animate-pulse" />
    ),
    ssr: true,
  },
);

export const DynamicProductDetail = dynamic(
  () => import("@/components/product/ProductDetail"),
  {
    loading: () => <div className="h-96 bg-muted animate-pulse rounded-lg" />,
    ssr: true,
  },
);

export const DynamicFavorite = dynamic(
  () => import("@/components/favorite/Favorite"),
  {
    loading: () => <div className="h-96 bg-muted animate-pulse rounded-lg" />,
    ssr: true,
  },
);
