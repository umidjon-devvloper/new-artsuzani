import { GetCart } from "@/actions/cart.actions";
import { auth } from "@clerk/nextjs/server";
import { cookies } from "next/headers";
import React from "react";
import CartList from "@/components/cart/cart-list";
import { getTranslations } from "next-intl/server";

const Cart = async () => {
  const t = await getTranslations("Cart");
  const { userId } = await auth();
  const cookieStore = await cookies();
  const guestId = cookieStore.get("guestId")?.value;
  
  const rawItems = await GetCart(userId || null, guestId);
  // Map rawItems to CartItem[]
  const items = rawItems.map((item: any) => ({
    _id: item._id,
    productId: item.productId,
    quantity: item.quantity,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
    // Add other CartItem properties if needed
  }));

  return (
    <div className="mt-24">
      <div className="max-w-5xl mx-auto px-4 md:px-8">
        <h1 className="text-3xl font-serif font-bold text-foreground mb-8 pb-4 border-b border-border">
          {t("title")}
        </h1>
      </div>
      <CartList userId={userId ?? ""} items={items} />
    </div>
  );
};

export default Cart;
