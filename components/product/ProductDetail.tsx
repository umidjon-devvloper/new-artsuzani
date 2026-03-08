"use client";

import { ChevronLeft, ChevronRight, Heart } from "lucide-react";
import * as React from "react";
import { Button } from "../ui/button";
import { SignInButton, useAuth } from "@clerk/nextjs";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Image from "next/image";

type Category = {
  _id?: string;
  title?: string;
  description?: string;
  image?: string;
};
type Product = {
  _id?: string;
  title?: string;
  description?: string;
  category?: Category;
  price?: number;
  // Ehtimol: string[] yoki { url: string }[]
  images?: any[];
  createdAt?: string;
  updatedAt?: string;
};

const ASSET_BASE = process.env.NEXT_PUBLIC_ASSET_BASE || "";

// nisbiy yo"lni to"liq URLga aylantirish (ixtiyoriy)
function normalizeUrl(src: string) {
  if (!src) return "";
  if (/^https?:\/\//i.test(src)) return src;
  if (!ASSET_BASE) return src.replace(/^\/+/, "");
  return `${ASSET_BASE}/${src.replace(/^\/+/, "")}`;
}

function extractImages(raw?: any[]): string[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((it) => (typeof it === "string" ? it : it?.url))
    .filter(Boolean)
    .map((s) => normalizeUrl(String(s)));
}

export default function ProductDetail({
  product,
  isFavorited,
  onToggleFavorite,
  AddCart,
}: {
  product: Product;
  isFavorited: boolean;
  onToggleFavorite: (productId: string) => Promise<void>;
  AddCart: (productId: string) => Promise<void>; // вњ… Promise
}) {
  // вњ… Xavfsiz, moslashuvchan ekstraksiya
  const images = extractImages(product?.images);
  const [idx, setIdx] = React.useState(0);
  const total = images.length;
  const [adding, setAdding] = React.useState(false);
  const [quantity, setQuantity] = React.useState(1);
  const route = useRouter();

  // рџ§  optimistic state
  const [liked, setLiked] = React.useState(isFavorited);
  React.useEffect(() => setLiked(isFavorited), [isFavorited]);

  const next = () => setIdx((i) => (total ? (i + 1) % total : 0));
  const prev = () => setIdx((i) => (total ? (i - 1 + total) % total : 0));

  // Touch swipe
  const touchRef = React.useRef<{ x: number | null }>({ x: null });
  const onTouchStart = (e: React.TouchEvent) => {
    touchRef.current.x = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchRef.current.x == null) return;
    const dx = e.changedTouches[0].clientX - touchRef.current.x;
    if (dx > 40) prev();
    if (dx < -40) next();
    touchRef.current.x = null;
  };

  const handleLike = async () => {
    if (!product?._id) return;
    setLiked((v) => !v);
    try {
      await onToggleFavorite(String(product._id));
    } catch (e) {
      setLiked((v) => !v);
      console.error(e);
      toast.error("Failed to update favorites.");
    }
  };

  const currency = "USD";
  const itemNo = extractItemNo(product?.description);
  const isNew = product?.createdAt ? daysSince(product.createdAt) <= 14 : false;

  return (
    <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 py-8">
      {/* --- Left: Image carousel (Premium White Theme) --- */}
      <div className="flex flex-col space-y-4">
        <div
          className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl bg-[var(--card-bg)] shadow-soft border border-[var(--border-theme)]"
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
          aria-live="polite"
        >
          {total > 0 ? (
            <Image
              src={images[idx]}
              alt={`${product?.title || "Product"} - image ${idx + 1} of ${total}`}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-muted-foreground font-serif">
              Image unavailable
            </div>
          )}

          {total > 1 && (
            <>
              <button
                onClick={prev}
                className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full p-2.5 bg-[var(--card-bg)]/80 backdrop-blur-md shadow-sm text-[var(--text-primary)] hover:bg-[var(--card-bg)] transition-all hover:scale-110 cursor-pointer border border-[var(--border-theme)]/50"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={next}
                className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full p-2.5 bg-[var(--card-bg)]/80 backdrop-blur-md shadow-sm text-[var(--text-primary)] hover:bg-[var(--card-bg)] transition-all hover:scale-110 cursor-pointer border border-[var(--border-theme)]/50"
                aria-label="Next image"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-[var(--card-bg)]/90 px-3 py-1 text-xs font-medium text-[var(--text-primary)] shadow-sm backdrop-blur-md border border-[var(--border-theme)]/50">
                {idx + 1} / {total}
              </div>
            </>
          )}
        </div>

        {total > 1 && (
          <div className="grid grid-cols-5 gap-3 sm:grid-cols-6">
            {images.map((src, i) => (
              <button
                key={i}
                onClick={() => setIdx(i)}
                className={`relative aspect-square overflow-hidden rounded-xl transition-all duration-300 ${
                  idx === i
                    ? "ring-2 ring-[var(--theme-accent)] ring-offset-2 scale-95"
                    : "ring-1 ring-[var(--border-theme)] hover:ring-[var(--theme-accent)]/50 opacity-70 hover:opacity-100"
                }`}
                aria-label={`Go to image ${i + 1}`}
              >
                <Image
                  src={src}
                  alt={`Thumb ${i + 1}`}
                  fill
                  sizes="100px"
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* --- Right: Info panel (Elegant Typography) --- */}
      <div className="flex flex-col space-y-8 lg:py-4">
        <div className="space-y-4">
          {product?.category?.title && (
            <div className="text-sm font-medium tracking-wider text-[var(--theme-accent)] uppercase">
              {product.category.title.trim()}
            </div>
          )}
          
          <div className="flex justify-between items-start gap-4">
            <h1 className="text-3xl lg:text-4xl font-serif font-bold text-[var(--text-primary)] leading-tight">
              {product?.title?.trim() || "Untitled Piece"}
            </h1>

            <Button
              variant="outline"
              size="icon"
              className={`rounded-full shrink-0 h-12 w-12 transition-all duration-300 border-[var(--border-theme)] bg-[var(--card-bg)] hover:bg-[var(--bg-primary)] shadow-sm ${
                liked ? "border-[var(--theme-accent)] text-[var(--theme-accent)] hover:bg-[var(--theme-accent)]/5" : "text-[var(--text-secondary)]"
              }`}
              onClick={handleLike}
              aria-pressed={liked}
              title={liked ? "Remove from favorites" : "Add to favorites"}
            >
              <Heart
                className={`h-5 w-5 transition-transform duration-300 ${liked ? "scale-110" : "scale-100"}`}
                fill={liked ? "currentColor" : "none"}
              />
            </Button>
          </div>

          <div className="flex items-center gap-4 pt-2">
            <div className="text-3xl font-bold font-serif text-[var(--price-color)]">
              {formatPrice(product?.price, currency)}
            </div>
            {isNew && (
              <span className="rounded-full bg-[var(--theme-accent)]/10 px-3 py-1 text-xs font-semibold tracking-wide text-[var(--theme-accent)] border border-[var(--theme-accent)]/20">
                New Arrival
              </span>
            )}
            {itemNo && (
              <span className="rounded-full bg-[var(--card-bg)] px-3 py-1 text-xs font-medium text-[var(--text-secondary)] border border-[var(--border-theme)]">
                Ref: {itemNo}
              </span>
            )}
          </div>
        </div>

        <div className="h-px w-full bg-[var(--border-theme)]" />

        {product?.description && (
          <div className="prose prose-sm sm:prose-base text-[var(--text-secondary)] leading-relaxed whitespace-pre-wrap font-sans">
            {cleanDesc(product.description)}
          </div>
        )}

        <div className="space-y-5 pt-4">
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-[var(--text-primary)]">Quantity</span>
            <div className="flex items-center border border-[var(--border-theme)] rounded-full bg-[var(--card-bg)] shadow-sm overflow-hidden h-10">
              <button 
                className="px-4 hover:bg-[var(--bg-primary)] transition-colors h-full flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
              >
                -
              </button>
              <span className="px-4 min-w-[40px] text-center font-medium text-sm text-[var(--text-primary)]">{quantity}</span>
              <button 
                className="px-4 hover:bg-[var(--bg-primary)] transition-colors h-full flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                onClick={() => setQuantity(quantity + 1)}
              >
                +
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Button
              variant="outline"
              size="lg"
              disabled={adding}
              onClick={async () => {
                if (!product?._id) return;
                try {
                  setAdding(true);
                  // Iterate to add correct quantity (a simple loop since AddCart takes 1 string currently)
                  for (let i = 0; i < quantity; i++) {
                    await AddCart(String(product._id));
                  }
                  toast.success(`${quantity} item(s) added to cart`);
                } catch (e) {
                  console.error(e);
                  toast.error("Failed to add to cart");
                } finally {
                  setAdding(false);
                }
              }}
              className="w-full text-base h-14 rounded-full border-2 border-[var(--theme-accent)] text-[var(--theme-accent)] bg-[var(--card-bg)] hover:bg-[var(--theme-accent)]/10 transition-colors shadow-none font-semibold tracking-wide"
            >
              {adding ? "Adding..." : "Add to Cart"}
            </Button>
            
            <Button
              size="lg"
              disabled={adding}
              onClick={async () => {
                 if (!product?._id) return;
                 try {
                   setAdding(true);
                   for (let i = 0; i < quantity; i++) {
                     await AddCart(String(product._id));
                   }
                   route.push("/shopping/checkout");
                 } catch(e) {
                   toast.error("Failed to process checkout");
                 } finally {
                   setAdding(false);
                 }
              }}
              className="w-full text-base h-14 rounded-full bg-[var(--theme-accent)] hover:bg-[var(--theme-accent-focus)] text-white transition-colors shadow-elegant-light font-semibold tracking-wide border-none"
            >
              Buy Now
            </Button>
          </div>
        </div>

        {/* Trust features */}
        <div className="pt-6 grid grid-cols-3 gap-4 border-t border-[var(--border-theme)] text-center">
          <div className="flex flex-col items-center justify-center space-y-2 p-3 bg-[var(--card-bg)] rounded-xl border border-[var(--border-theme)]/50 shadow-sm">
            <svg className="w-5 h-5 text-[var(--theme-accent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
            <span className="text-[10px] sm:text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider">Secure Payment</span>
          </div>
          <div className="flex flex-col items-center justify-center space-y-2 p-3 bg-[var(--card-bg)] rounded-xl border border-[var(--border-theme)]/50 shadow-sm">
             <svg className="w-5 h-5 text-[var(--theme-accent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <span className="text-[10px] sm:text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider">Premium Quality</span>
          </div>
          <div className="flex flex-col items-center justify-center space-y-2 p-3 bg-[var(--card-bg)] rounded-xl border border-[var(--border-theme)]/50 shadow-sm">
             <svg className="w-5 h-5 text-[var(--theme-accent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-[10px] sm:text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider">Handcrafted</span>
          </div>
        </div>
      </div>
    </section>
  );
}

/* Helpers */
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
function cleanDesc(desc?: string) {
  if (!desc) return "";
  return desc.replace(/\r\n/g, "\n").trim();
}
function extractItemNo(desc?: string) {
  if (!desc) return null;
  const m = desc.match(/Item\s*No\.?\s*([A-Za-z0-9-]+)/i);
  return m?.[1] || null;
}
function daysSince(dateStr: string) {
  const d = new Date(dateStr).getTime();
  const now = Date.now();
  return Math.floor((now - d) / (1000 * 60 * 60 * 24));
}
