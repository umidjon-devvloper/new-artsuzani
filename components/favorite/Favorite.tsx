"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";

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
  if (typeof value !== "number") return "вЂ”";
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
    // рџ”Ґ Chiroyli empty state
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-neutral-900/40 p-12 text-center">
        {/* Icon */}
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10">
          <svg
            viewBox="0 0 24 24"
            className="h-7 w-7 text-red-500"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M12.1 21.35l-1.1-.99C5.14 15.24 2 12.32 2 8.98 2 6.42 4.07 4.5 6.75 4.5c1.54 0 3.04.7 4 1.81a5.3 5.3 0 014-1.81C17.93 4.5 20 6.42 20 8.98c0 3.34-3.14 6.26-8.99 11.38l-1 .99z" />
          </svg>
        </div>

        {/* Title */}
        <h2 className="text-xl font-semibold text-white">No favorites yet</h2>

        {/* Description */}
        <p className="mt-2 max-w-md text-sm text-white/70">
          Tap ❤️ on the products you like to save them. They will appear here
          and won’t disappear even if you refresh the page.
        </p>

        {/* Link button */}
        <Link
          href="/products"
          className="mt-6 inline-flex items-center rounded-xl bg-white/10 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/20"
        >
          Back to catalog
        </Link>
      </div>
    );
  }

  // рџ”І Grid koвЂrinish
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((p) => {
        const imgs = extractImages(p.images);
        const cover = imgs[0];

        return (
          <Link
            key={String(p._id)}
            href={`/products/${p._id}`}
            className="group overflow-hidden rounded-2xl border border-white/10 bg-neutral-900/40 transition hover:border-white/20 hover:shadow-lg hover:shadow-black/30"
          >
            <div className="aspect-[4/3] w-full overflow-hidden bg-black/30">
              {cover ? (
                <Image
                  src={cover}
                  alt={p.title || "Product"}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover transition group-hover:scale-[1.03]"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-white/40">
                  No image
                </div>
              )}
            </div>
            <div className="p-4">
              <div className="flex items-start justify-between gap-3">
                <h3 className="line-clamp-1 text-base font-semibold text-white">
                  {(p.title || "").trim() || "Untitled"}
                </h3>
                <span className="shrink-0 rounded-full bg-white/10 px-2 py-1 text-xs text-white/80">
                  {formatPrice(p.price)}
                </span>
              </div>
              {p.description && (
                <p className="mt-2 line-clamp-2 text-sm text-white/60">
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
