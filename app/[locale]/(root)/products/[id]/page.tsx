// app/(root)/products/[id]/page.tsx
import { AddToCart, GetCart } from "@/actions/cart.actions";
import {
  GetFavorite,
  isProductFavorited,
  toggleFavorite,
} from "@/actions/favorite.actions";
import { GetProductsID } from "@/actions/product.actions";
import ProductDetail from "@/components/product/ProductDetail";
import Header from "@/components/shared/header";
import { auth } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";
import { revalidatePath } from "next/cache";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;

  try {
    const product = await GetProductsID(id);
    const data = product && "data" in product ? product.data : product;
    if (!data)
      return {
        title: "Product not found",
        robots: { index: false, follow: false },
      };

    const p = JSON.parse(JSON.stringify(data)) as {
      _id?: string;
      title?: string;
      name?: string;
      slug?: string;
      description?: string;
      images?: string[]; // absolute yoki relative
      price?: number | string;
      currency?: string; // e.g. "USD"
      brand?: string;
      category?: string;
      sku?: string;
      rating?: { value?: number; count?: number };
    };

    const title = p.title || p.name || "Product";
    const desc =
      (p.description && p.description.slice(0, 160)) ||
      `${title} — detailed product information, price and availability.`;

    // Rasmlar absolute URL bo‘lishi kerak (agar /uploads/... bo‘lsa, domenni qo‘shing)
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL;
    const imagesAbs = (p.images || [])
      .filter(Boolean)
      .map((src) => (src.startsWith("http") ? src : `${baseUrl}${src}`));

    const url = `${baseUrl}/products/${id}`;

    return {
      title: `${title} | MyStore`,
      description: desc,
      keywords: [title, p.brand, p.category, "buy", "price"].filter(
        Boolean
      ) as string[],
      alternates: { canonical: url },
      openGraph: {
        type: "website",
        url,
        title: `${title} | MyStore`,
        description: desc,
        images: imagesAbs.length
          ? imagesAbs.map((u) => ({ url: u }))
          : [{ url: `${baseUrl}/og-default.jpg` }],
      },
      twitter: {
        card: "summary_large_image",
        title: `${title} | MyStore`,
        description: desc,
        images: imagesAbs.length ? imagesAbs : [`${baseUrl}/og-default.jpg`],
      },
      robots: {
        index: true,
        follow: true,
      },
    };
  } catch {
    return { title: "Product", robots: { index: false, follow: false } };
  }
}
export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { userId } = await auth();
  
  // --- Fetch product safely and ensure it's RSC-serializable ---
  let safeProduct: any = null;
  try {
    const product = await GetProductsID(id);
    const data = product && "data" in product ? product.data : product;
    if (!data) return notFound(); // 404 if missing
    // Strip non-serializable fields (ObjectId/Date/Methods) for RSC:
    safeProduct = JSON.parse(JSON.stringify(data));
  } catch (e) {
    // You’ll see details in server logs/dev, but shield prod users
    console.error("GetProductsID failed:", e);
    return notFound();
  }
  // --- Auth + favorites guarded ---

  let isFavorited = false;

  try {
    if (userId && safeProduct?._id) {
      isFavorited = await isProductFavorited(userId, String(safeProduct._id));
    }
  } catch (e) {
    // Don’t hard-fail the whole page if favorites choke
    console.warn("Favorite computation failed:", e);
  }

  // --- Server Actions (must only use serializable args) ---
  async function onToggleFavorite(productId: string) {
    "use server";
    const { userId } = await auth();
    if (!userId) throw new Error("Please sign in to favorite properties");
    await toggleFavorite(userId, productId);
    revalidatePath(`/products/${productId}`);
  }

  async function addCart(productId: string) {
    "use server";
    const { userId } = await auth();
    // No need to throw if !userId; guest cart will be used instead
    await AddToCart(userId, productId, 1);
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://artsuzani.com";
  const firstImage = Array.isArray(safeProduct.images) && safeProduct.images.length > 0 
    ? (safeProduct.images[0].startsWith("http") ? safeProduct.images[0] : `${baseUrl}${safeProduct.images[0]}`) 
    : undefined;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: safeProduct.title || safeProduct.name,
    image: firstImage,
    description: safeProduct.description,
    offers: {
      '@type': 'Offer',
      price: safeProduct.price,
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      url: `${baseUrl}/products/${safeProduct._id}`
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="mx-auto max-w-6xl px-4 py-8 mt-24">
        <ProductDetail
          product={safeProduct}
          isFavorited={isFavorited}
          onToggleFavorite={onToggleFavorite}
          AddCart={addCart}
        />
      </main>
    </>
  );
}
