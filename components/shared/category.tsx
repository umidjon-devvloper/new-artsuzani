"use client";

import { Link } from "@/i18n/routing";
import Image from "next/image";
import { cn } from "@/lib/utils";

export type CategoryItem = {
  _id?: string;
  title: string;
  description?: string;
  image?: string;
  color?: string;
  href?: string;
  onClick?: () => void;
};

export type CategoryProps = {
  category?: CategoryItem[];
  colors?: string[];
  className?: string;
};

const DEFAULT_ITEMS: CategoryItem[] = [
  {
    title: "Home Decor",
    description: "Suzani & wall panels",
    image: "/categories/home-decor.webp",
  },
  {
    title: "Caftans & Wear",
    description: "Traditional robes",
    image: "/categories/caftans.webp",
  },
  {
    title: "Fabrics & Textiles",
    description: "Handwoven & embroidered",
    image: "/categories/fabrics.webp",
  },
  {
    title: "Accessories",
    description: "Bags, cushions & more",
    image: "/categories/accessories.webp",
  },
];

// next/image: o'rnatilgan lazy-loading + AVIF/WebP optimizatsiya.
// Avval oddiy <img> + qo'lda IntersectionObserver edi (forced reflow manbai).
const LazyCardImage = ({ src, alt }: { src: string; alt: string }) => {
  if (!src) return <div className="absolute inset-0 bg-[#f0ece4]" />;
  return (
    <div className="absolute inset-0 bg-[#f0ece4]">
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
        className="object-contain p-8"
      />
    </div>
  );
};

export default function Category({ category, className }: CategoryProps) {
  const items = (category?.length ? category : DEFAULT_ITEMS).map((item) => ({
    ...item,
    href: item.href ?? (item._id ? `/product-category/${item._id}` : undefined),
  })) as CategoryItem[];

  return (
    <div className={cn("w-full", className)}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {items.map((item, index) => {
          const inner = (
            <div
              className={cn(
                "group relative overflow-hidden rounded-2xl cursor-pointer",
                "h-[420px] md:h-[460px]",
                "border border-[var(--border-theme)] hover:border-[var(--theme-accent)]",
                "transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl",
              )}
            >
              {/* Image */}
              <LazyCardImage src={item.image ?? ""} alt={item.title} />

              {/* Pastki qorayish — oq matn har qanday (och) rasm ustida ham
                  o'qilishi uchun kuchli gradient. Avval from-black/50 edi va
                  och rangli rasmlarda matn ko'rinmay qolardi. */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent z-10 pointer-events-none rounded-2xl" />

              {/* Accent glow border on hover */}
              <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-[var(--theme-accent)]/80 transition-all duration-300 z-20 pointer-events-none" />

              {/* Index number — top left */}
              <div className="absolute top-4 left-4 z-20">
                <span className="font-display text-white/20 text-5xl font-bold leading-none select-none">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>

              {/* Gold line accent — top right */}
              <div className="absolute top-5 right-5 z-20 flex flex-col gap-1 items-end">
                <div className="w-6 h-px bg-[var(--theme-accent)]/60 group-hover:w-10 transition-all duration-300" />
                <div className="w-3 h-px bg-[var(--theme-accent)]/40 group-hover:w-6 transition-all duration-300" />
              </div>

              {/* Bottom content */}
              <div className="absolute bottom-0 left-0 right-0 z-20 p-6">
                {/* Divider */}
                <div className="w-8 h-px bg-[var(--theme-accent)] mb-3 group-hover:w-14 transition-all duration-300" />

                <h3 className="font-display text-white text-xl font-bold leading-tight mb-1 drop-shadow-sm">
                  {item.title}
                </h3>
                {item.description && (
                  <p className="font-body text-white/80 text-xs tracking-[0.18em] uppercase mb-4 drop-shadow-sm">
                    {item.description}
                  </p>
                )}

                {/* CTA — slides up on hover */}
                <span className="inline-flex items-center gap-2 text-[var(--theme-accent)] font-body text-xs tracking-widest uppercase opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                  Explore
                  <span className="text-base leading-none">→</span>
                </span>
              </div>
            </div>
          );

          return item.href ? (
            <Link
              key={`${item.title}-${index}`}
              href={item.href}
              onClick={item.onClick}
              className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-accent)]/50 rounded-2xl"
            >
              {inner}
            </Link>
          ) : (
            <button
              key={`${item.title}-${index}`}
              type="button"
              onClick={item.onClick}
              className="block w-full text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-accent)]/50 rounded-2xl"
            >
              {inner}
            </button>
          );
        })}
      </div>
    </div>
  );
}
