import { getCategoriesProducts } from "@/actions/product.actions";
import Products from "@/components/shared/products";
import React from "react";

const ProductCategory = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  const products = await getCategoriesProducts(id);

  return (
    <div className="pt-24 px-4 sm:px-6 lg:px-8 max-w-8xl mx-auto">
      <Products
        products={
          products && products && Array.isArray(products as any)
            ? (products as any).map((p: any) => ({
                ...p,
                href: `/products/${p._id}`,
              }))
            : []
        }
        currency="USD"
      />
    </div>
  );
};

export default ProductCategory;
