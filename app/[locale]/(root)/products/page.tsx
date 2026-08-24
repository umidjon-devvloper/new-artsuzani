import { getProducts } from "@/actions/product.actions";
import { getFavoritedProductIds } from "@/actions/favorite.actions";
import Products from "@/components/shared/products";
import PageHeader from "@/components/shared/page-header";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { getTranslations } from "next-intl/server";
import { auth } from "@clerk/nextjs/server";
import type { Metadata } from "next";
import { absoluteUrl } from "@/lib/site";

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await props.params;
  return {
    title: "Collections",
    description:
      "Browse our full collection of handmade Suzani embroidery — bags, cushions, and textiles crafted in Bukhara, Uzbekistan.",
    alternates: { canonical: absoluteUrl(locale, "/products") },
  };
}

const ProductsAll = async (props: {
  searchParams: Promise<{ q?: string }>;
}) => {
  const { userId } = await auth();
  const [t, res, sp, favoritedIds] = await Promise.all([
    getTranslations("Navigation"),
    getProducts(),
    props.searchParams,
    getFavoritedProductIds(userId),
  ]);

  const all =
    "data" in res && Array.isArray(res.data)
      ? res.data.map((p) => ({ ...p, href: `/products/${p._id}` }))
      : [];

  // ?q= bilan qidiruv natijalari sahifasi (sitelinks searchbox va header
  // qidiruvi shu yerga yo'naltiradi). Ma'lumot allaqachon keshda — filtr arzon.
  const q = (sp?.q ?? "").trim();
  const list = q
    ? all.filter((p) => p.title?.toLowerCase().includes(q.toLowerCase()))
    : all;

  const serialized = JSON.parse(JSON.stringify(list));

  return (
    <div className="min-h-screen">
      <PageHeader
        eyebrow="Handmade in Bukhara"
        title={q ? `Results for “${q}”` : t("products")}
        description={
          q
            ? `${list.length} ${list.length === 1 ? "piece" : "pieces"} found.`
            : "Every piece is embroidered by hand — a unique blend of tradition and craft."
        }
      />

      <div className="px-4 sm:px-6 lg:px-8 max-w-8xl mx-auto py-14 mb-10">
        {list.length === 0 ? (
          <div className="mx-auto max-w-xl text-center bg-card border border-border/60 rounded-2xl shadow-soft p-12">
            <h2 className="font-serif text-2xl font-medium text-foreground mb-3">
              {q ? "No matching pieces found" : "No products yet"}
            </h2>
            <p className="text-muted-foreground mb-8">
              {q
                ? "Try a different search, or browse the full collection."
                : "New handmade pieces are coming soon."}
            </p>
            <Link href="/products">
              <Button
                size="lg"
                className="rounded-full px-8 bg-gradient-primary text-white border-none shadow-elegant hover:opacity-90"
              >
                View all collections
              </Button>
            </Link>
          </div>
        ) : (
          <Products
            products={serialized}
            currency="USD"
            favoritedIds={favoritedIds}
          />
        )}
      </div>
    </div>
  );
};

export default ProductsAll;
