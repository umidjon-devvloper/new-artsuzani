import { getCategoriesProducts } from "@/actions/product.actions";
import { getFavoritedProductIds } from "@/actions/favorite.actions";
import Products from "@/components/shared/products";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { auth } from "@clerk/nextjs/server";
import React from "react";

const ProductCategory = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  const { userId } = await auth();
  const [products, favoritedIds] = await Promise.all([
    getCategoriesProducts(id),
    getFavoritedProductIds(userId),
  ]);

  const title = products[0]?.categoryTitle;

  return (
    <div className="pt-24 px-4 sm:px-6 lg:px-8 max-w-8xl mx-auto mb-20">
      {title && (
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-foreground mb-8">
          {title}
        </h1>
      )}

      {products.length === 0 ? (
        <div className="text-center bg-card border border-border/60 rounded-2xl shadow-soft p-12 max-w-2xl mx-auto">
          <h2 className="text-2xl font-serif font-medium text-foreground mb-4">
            Bu kategoriyada hozircha mahsulot yo&apos;q.
          </h2>
          <p className="text-muted-foreground mb-8">
            Boshqa to&apos;plamlarni ko&apos;rib chiqing — tez orada yangi
            asarlar qo&apos;shiladi.
          </p>
          <Link href="/products">
            <Button
              size="lg"
              className="rounded-full px-8 bg-gradient-primary text-white shadow-elegant hover:opacity-90 border-none"
            >
              Barcha mahsulotlar
            </Button>
          </Link>
        </div>
      ) : (
        <Products
          products={products}
          currency="USD"
          favoritedIds={favoritedIds}
        />
      )}
    </div>
  );
};

export default ProductCategory;
