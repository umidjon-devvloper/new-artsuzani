import { getProducts } from "@/actions/product.actions";
import Products from "@/components/shared/products";
import React from "react";

const ProductsAll = async () => {
  const products = await getProducts();
  return (
    <div>
      <div className="mt-24 px-4 sm:px-6 lg:px-8 max-w-8xl mx-auto mb-20">
        <Products
          products={
            "data" in products && Array.isArray(products.data)
              ? JSON.parse(JSON.stringify(products.data.map((p: any) => ({
                  ...p,
                  href: `/products/${p._id}`,
                }))))
              : []
          }
          currency="USD"
        />
      </div>
    </div>
  );
};

export default ProductsAll;
