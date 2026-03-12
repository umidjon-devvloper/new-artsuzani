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
  console.log("Raw Cart Items:", rawItems); // Debugging line
  const items = rawItems.map((item: any) => ({
    _id: item._id,
    productId: item.productId,
    quantity: item.quantity,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
    // Add other CartItem properties if needed
  }));

  return (
    <div>
      <div className="mt-24">
        <h1 className="text-2xl text-center">{t("title")}</h1>
        <CartList userId={userId ?? ""} items={items} />
      </div>
    </div>
  );
};

export default Cart;
