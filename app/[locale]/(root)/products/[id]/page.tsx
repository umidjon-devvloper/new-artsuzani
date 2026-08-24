// app/[locale]/(root)/products/[id]/page.tsx
import { AddToCart } from "@/actions/cart.actions";
import {
  isProductFavorited,
  toggleFavorite,
} from "@/actions/favorite.actions";
import { GetProductsID } from "@/actions/product.actions";
import ProductDetail from "@/components/product/ProductDetail";
import { auth } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";
import { revalidatePath } from "next/cache";
import type { Metadata } from "next";
import { routing } from "@/i18n/routing";
import { SITE_URL, absoluteUrl } from "@/lib/site";

type Params = Promise<{ locale: string; id: string }>;

/**
 * Ijtimoiy tarmoqlar uchun rasm manzillari.
 * base64 (`data:`) rasmlar OG rasm bo'la olmaydi — ular chiqarib tashlanadi.
 */
function toAbsoluteImages(images?: string[]): string[] {
  return (images || [])
    .filter((s): s is string => Boolean(s) && !s.startsWith("data:"))
    .map((s) => (s.startsWith("http") ? s : `${SITE_URL}${s}`));
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { locale, id } = await params;

  try {
    const product = await GetProductsID(id);
    if (!product) {
      return {
        title: "Product not found",
        robots: { index: false, follow: false },
      };
    }

    const p = JSON.parse(JSON.stringify(product)) as {
      title?: string;
      description?: string;
      images?: string[];
      price?: number;
      category?: { title?: string };
    };

    const title = p.title?.trim() || "Product";
    const desc =
      p.description?.trim().slice(0, 160) ||
      `${title} — detailed product information, price and availability.`;

    const url = absoluteUrl(locale, `/products/${id}`);
    const images = toAbsoluteImages(p.images);
    const ogImages = images.length ? images : [`${SITE_URL}/og-image.jpg`];

    return {
      // Sarlavha shabloni yuqoridagi layout'da: "%s | Artsuzani"
      title,
      description: desc,
      keywords: [title, p.category?.title, "buy", "price"].filter(
        Boolean
      ) as string[],
      alternates: {
        canonical: url,
        languages: Object.fromEntries(
          routing.locales.map((l) => [l, absoluteUrl(l, `/products/${id}`)])
        ),
      },
      openGraph: {
        type: "website",
        url,
        title,
        description: desc,
        images: ogImages.map((u) => ({ url: u })),
      },
      twitter: {
        card: "summary_large_image",
        title,
        description: desc,
        images: ogImages,
      },
      robots: { index: true, follow: true },
    };
  } catch {
    return { title: "Product", robots: { index: false, follow: false } };
  }
}

export default async function Page({ params }: { params: Params }) {
  const { locale, id } = await params;
  const { userId } = await auth();

  // --- Mahsulotni xavfsiz olamiz va RSC uchun serializable qilamiz ---
  let safeProduct: any = null;
  try {
    const product = await GetProductsID(id);
    if (!product) return notFound();
    safeProduct = JSON.parse(JSON.stringify(product));
  } catch (e) {
    console.error("GetProductsID failed:", e);
    return notFound();
  }

  let isFavorited = false;
  try {
    if (userId && safeProduct?._id) {
      isFavorited = await isProductFavorited(userId, String(safeProduct._id));
    }
  } catch (e) {
    // Sevimlilar ishlamasa ham sahifa ochilaversin
    console.warn("Favorite computation failed:", e);
  }

  // --- Server Actions (faqat serializable argumentlar) ---
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
    // !userId bo'lsa xato bermaymiz — mehmon savatchasi ishlatiladi
    await AddToCart(userId, productId, 1);
  }

  const productUrl = absoluteUrl(locale, `/products/${id}`);
  const ogImage = toAbsoluteImages(safeProduct.images)[0];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: safeProduct.title,
    ...(ogImage ? { image: ogImage } : {}),
    description: safeProduct.description,
    offers: {
      "@type": "Offer",
      price: safeProduct.price,
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      url: productUrl,
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
