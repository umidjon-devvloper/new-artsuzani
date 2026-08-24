"use client";

import * as React from "react";
import { Link } from "@/i18n/routing";
import Image from "next/image";
import { Button } from "@/components/ui/button";

type Product = {
  _id?: string;
  title?: string;
  description?: string;
  price?: number;
  images?: any[]; // string[] yoki {url}[]
  createdAt?: string;
};

function extractImages(raw?: any[]): string[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((it) => (typeof it === "string" ? it : it?.url))
    .filter(Boolean);
}

function formatPrice(value?: number, currency = "USD") {
  if (typeof value !== "number") return "—";
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
    }).format(value);
  } catch {
    return `$${value.toFixed(2)}`;
  }
}

export default function FavoriteProducts({
  products,
}: {
  products: Product[];
}) {
  if (!products || products.length === 0) {
    return (
      <div className="mx-auto flex max-w-2xl flex-col items-center justify-center rounded-2xl border border-border/60 bg-card p-12 text-center shadow-soft">
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          <svg
            viewBox="0 0 24 24"
            className="h-7 w-7 text-primary"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M12.1 21.35l-1.1-.99C5.14 15.24 2 12.32 2 8.98 2 6.42 4.07 4.5 6.75 4.5c1.54 0 3.04.7 4 1.81a5.3 5.3 0 014-1.81C17.93 4.5 20 6.42 20 8.98c0 3.34-3.14 6.26-8.99 11.38l-1 .99z" />
          </svg>
        </div>

        <h2 className="font-serif text-2xl font-medium text-foreground">
          Hozircha saqlangan mahsulot yo&apos;q
        </h2>

        <p className="mt-3 max-w-md text-sm text-muted-foreground">
          Yoqqan mahsulotlarga ❤️ bosing — ular shu yerda saqlanadi va sahifani
          yangilasangiz ham yo&apos;qolmaydi.
        </p>

        <Link href="/products" className="mt-8">
          <Button
            size="lg"
            className="rounded-full border-none bg-gradient-primary px-8 text-white shadow-elegant hover:opacity-90"
          >
            To&apos;plamga qaytish
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto grid max-w-8xl grid-cols-1 gap-6 px-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-3 lg:px-8">
      {products.map((p) => {
        const imgs = extractImages(p.images);
        const cover = imgs[0];

        return (
          <Link
            key={String(p._id)}
            href={`/products/${p._id}`}
            className="group overflow-hidden rounded-2xl border border-border/60 bg-card shadow-soft transition hover:-translate-y-1 hover:border-[var(--theme-accent)] hover:shadow-elegant-light"
          >
            {/* MUHIM: next/image fill uchun parent `relative` bo'lishi shart */}
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
              {cover ? (
                <Image
                  src={cover}
                  alt={p.title || "Product"}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover transition duration-500 group-hover:scale-[1.03]"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center font-serif text-muted-foreground">
                  Image unavailable
                </div>
              )}
            </div>

            <div className="p-5">
              <div className="flex items-start justify-between gap-3">
                <h3 className="line-clamp-1 font-serif text-lg font-bold text-foreground transition-colors group-hover:text-[var(--theme-accent)]">
                  {(p.title || "").trim() || "Untitled"}
                </h3>
                <span className="shrink-0 font-serif text-base font-bold text-[var(--price-color)]">
                  {formatPrice(p.price)}
                </span>
              </div>
              {p.description && (
                <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                  {p.description.replace(/\r\n/g, "\n").trim()}
                </p>
              )}
            </div>
          </Link>
        );
      })}
    </div>
  );
}
