"use client";

import type React from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Link } from "@/i18n/routing";
import Image from "next/image";
import { useTranslations } from "next-intl";

// === Types (unchanged) ===
type Product = {
  _id: string;
  title: string;
  description?: string;
  price?: number;
  images?: string[];
  categoryTitle?: string;
  createdAt?: string; // ISO
  href?: string; // ixtiyoriy: bo"lsa <a> bo"ladi
};

type Props = {
  products: Product[];
  onView?: (product: Product) => void;
  currency?: string; // masalan: "USD", "EUR"
};

// === Utils (unchanged logic) ===
const formatPrice = (value?: number, currency = "USD") => {
  if (typeof value !== "number") return "вЂ”";
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      maximumFractionDigits: 2,
    }).format(value);
  } catch {
    return `$${value.toFixed(2)}`;
  }
};

// === Component ===
const Products: React.FC<Props> = ({ products, currency = "USD" }) => {
  const t = useTranslations("Common");

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {products?.map((product, index) => (
        <Card
          key={product._id}
          className="group pt-0 cursor-pointer border-transparent bg-[var(--card-bg)] overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 rounded-[16px]"
          style={{
            animationDelay: `${index * 0.1}s`,
          }}
        >
          {/* Product Image Placeholder */}
          <div className="relative h-80 w-full overflow-hidden bg-black/5 rounded-t-[16px]">
            {product?.images?.at(0) ? (
              <Image
                src={product.images[0]}
                alt={product?.title || "Product"}
                fill
                className="object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
              />
            ) : (
               <div className="absolute inset-0 flex items-center justify-center text-muted-foreground font-serif">Image Unavailable</div>
            )}
            
            <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

            {/* Category Badge */}
            {product.categoryTitle && (
              <div className="absolute top-4 left-4 px-3 py-1 bg-[var(--card-bg)]/95 backdrop-blur-md text-[10px] font-semibold tracking-wide uppercase text-[var(--theme-accent)] shadow-sm rounded-full">
                {product.categoryTitle}
              </div>
            )}
          </div>

          <CardContent className="p-5 space-y-3">
            <div className="space-y-1">
              <h3 className="text-xl font-serif font-bold text-[var(--text-primary)] group-hover:text-[var(--theme-accent)] transition-colors duration-300 line-clamp-1">
                {product.title}
              </h3>

              <p className="text-[var(--text-secondary)] line-clamp-2 text-sm leading-relaxed font-sans">
                {product.description}
              </p>
            </div>

            <div className="flex flex-col gap-4 pt-4 border-t border-black/5">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold font-serif text-[var(--price-color)]">
                  {formatPrice(product.price)}
                </span>
                <span className="text-xs font-semibold px-2 py-1 bg-[#F5ECD5] text-[#8C6239] rounded-sm border border-[#E8DCC4] flex items-center gap-1 shadow-sm">
                  {t("freeShipping")}
                </span>
              </div>

              <Link
                href={`/products/${product?._id}`}
                className="flex items-center justify-center w-full py-2.5 bg-[var(--theme-accent)] hover:bg-[var(--theme-accent-focus)] text-white text-sm font-semibold tracking-wide uppercase rounded-[12px] transition-colors duration-300"
              >
                View Details
              </Link>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default Products;
