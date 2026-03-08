"use client";

import type * as React from "react";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
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
    image: "https://apt68kvda7.ufs.sh/f/Azjyu7p3LN7D1mEXEEqDNLfbkoWclsrg5zOtdG371xFu4PMU",
    href: "/product-category/home-decor",
  },
  {
    title: "Caftans & Wear",
    description: "Traditional robes",
    image: "https://apt68kvda7.ufs.sh/f/Azjyu7p3LN7Da8YcoB41I9KXpFtkqhrg2YoBGN3OQsi4vwSZ",
    href: "/product-category/caftans",
  },
  {
    title: "Fabrics & Textiles",
    description: "Handwoven & embroidered",
    image: "https://apt68kvda7.ufs.sh/f/Azjyu7p3LN7DSVlkIP3P8I9XpQAuWlMfoVehT4YZNdzFmREw",
    href: "/product-category/fabrics",
  },
  {
    title: "Accessories",
    description: "Bags, cushions & more",
    image: "https://apt68kvda7.ufs.sh/f/Azjyu7p3LN7D7LwZOUvSjqBbRzaTsemdMnK6WDcwtFXZlo9A",
    href: "/product-category/accessories",
  },
];

const LazyCardImage = ({
  src,
  alt,
  objectPosition = "center center",
}: {
  src: string;
  alt: string;
  objectPosition?: string;
}) => {
  const [loaded, setLoaded] = useState(false);
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const timer = setTimeout(() => setInView(true), 1500);
    if (!("IntersectionObserver" in window)) { setInView(true); clearTimeout(timer); return; }
    const observer = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setInView(true); clearTimeout(timer); observer.disconnect(); } },
      { rootMargin: "600px", threshold: 0 }
    );
    observer.observe(el);
    return () => { observer.disconnect(); clearTimeout(timer); };
  }, []);

  return (
    <div ref={ref} className="absolute inset-0 bg-[#f0ece4]">
      {!loaded && (
        <div className="absolute inset-0" style={{
          background: "linear-gradient(90deg, #e8e4dc 25%, #d5d0c6 50%, #e8e4dc 75%)",
          backgroundSize: "200% 100%",
          animation: "catShimmer 1.6s ease-in-out infinite",
        }} />
      )}
      {inView && src && (
        <img
          src={src}
          alt={alt}
          className="absolute inset-0 w-full h-full object-contain transition-transform duration-700 ease-in-out group-hover:scale-105 p-8"
          style={{ opacity: loaded ? 1 : 0, transition: "opacity 0.5s ease", objectPosition }}
          onLoad={() => setLoaded(true)}
          onError={() => setLoaded(true)}
        />
      )}
      <style>{`@keyframes catShimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}`}</style>
    </div>
  );
};

export default function Category({ category, className }: CategoryProps) {
  const items = (category?.length ? category : DEFAULT_ITEMS) as CategoryItem[];

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
                "transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl",
              )}
              style={{ animationDelay: `${index * 120}ms` }}
            >
              {/* Image */}
              <LazyCardImage src={item.image ?? ""} alt={item.title} />

              {/* No dark overlay — image shows clearly */}

              {/* Subtle bottom fade only */}
              <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/50 to-transparent z-10 pointer-events-none rounded-b-2xl" />

              {/* Accent glow border on hover */}
              <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-[var(--theme-accent)]/80 transition-all duration-500 z-20 pointer-events-none" />

              {/* Index number — top left */}
              <div className="absolute top-4 left-4 z-20">
                <span className="font-display text-white/20 text-5xl font-bold leading-none select-none">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>

              {/* Gold line accent — top right */}
              <div className="absolute top-5 right-5 z-20 flex flex-col gap-1 items-end">
                <div className="w-6 h-px bg-[var(--theme-accent)]/60 group-hover:w-10 transition-all duration-500" />
                <div className="w-3 h-px bg-[var(--theme-accent)]/40 group-hover:w-6 transition-all duration-500" />
              </div>

              {/* Bottom content */}
              <div className="absolute bottom-0 left-0 right-0 z-20 p-6">
                {/* Divider */}
                <div className="w-8 h-px bg-[var(--theme-accent)] mb-3 group-hover:w-14 transition-all duration-500" />

                <h3 className="font-display text-white text-xl font-bold leading-tight mb-1 drop-shadow-sm">
                  {item.title}
                </h3>
                {item.description && (
                  <p className="font-body text-white/60 text-xs tracking-[0.18em] uppercase mb-4">
                    {item.description}
                  </p>
                )}

                {/* CTA — slides up on hover */}
                <span className="inline-flex items-center gap-2 text-[var(--theme-accent)] font-body text-xs tracking-widest uppercase opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-400">
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