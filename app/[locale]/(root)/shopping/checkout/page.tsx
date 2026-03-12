import React from "react";
import { GetCart } from "@/actions/cart.actions";
import { auth } from "@clerk/nextjs/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import CheckoutForm from "./checkout-form";
import { getTranslations } from "next-intl/server";

export default async function CheckoutPage() {
  const t = await getTranslations("Checkout");
  const { userId } = await auth();
  const cookieStore = await cookies();
  const guestId = cookieStore.get("guestId")?.value;

  const rawItems = await GetCart(userId || null, guestId);
  const items = rawItems.map((item: any) => ({
    _id: item._id,
    productId: item.productId,
    quantity: item.quantity,
  }));

  if (!items.length) {
    redirect("/shopping/cart");
  }

  const total = items.reduce(
    (sum: number, it: any) => sum + (it.productId?.price || 0) * (it.quantity || 0),
    0
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 mt-20">
      <h1 className="text-3xl font-serif font-bold text-foreground mb-8 pb-4 border-b border-border">
        Secure Checkout
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Col: Form */}
        <div className="lg:col-span-7 xl:col-span-8 order-2 lg:order-1">
          <CheckoutForm userId={userId || ""} guestId={guestId || ""} items={items} />
        </div>

        {/* Right Col: Order Summary */}
        <div className="lg:col-span-5 xl:col-span-4 order-1 lg:order-2 bg-white/60 backdrop-blur-md rounded-2xl shadow-soft border border-border/60 p-6 sticky top-28">
          <h2 className="text-xl font-serif font-bold text-foreground mb-6">
            Order Summary
          </h2>

          <div className="space-y-4 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
            {items.map((it: any) => {
              const p = it.productId || {};
              const price = typeof p.price === "number" ? p.price : 0;
              return (
                <div key={it._id} className="flex items-center gap-4 text-sm">
                  <div className="relative w-16 h-16 rounded-md overflow-hidden bg-muted shrink-0 border border-border">
                    {p.images?.[0] ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img src={p.images[0]} alt={p.title} className="object-cover w-full h-full" />
                    ) : (
                      <span className="grid place-items-center h-full text-xs text-muted-foreground">-</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate" title={p.title}>{p.title || "Untitled"}</p>
                    <p className="text-muted-foreground mt-1">Qty: {it.quantity}</p>
                  </div>
                  <div className="font-medium text-right font-serif">
                    ${(price * it.quantity).toFixed(2)}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 pt-6 border-t border-border space-y-3">
            <div className="flex justify-between text-muted-foreground text-sm">
              <span>Subtotal</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-muted-foreground text-sm">
              <span>Shipping</span>
              <span className="text-[#8C6239] font-medium">{t("shippingInfoTitle")}</span>
            </div>
            <div className="flex justify-between items-center text-lg font-bold text-foreground pt-4 border-t border-border">
              <span>Total</span>
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                ${total.toFixed(2)}
              </span>
            </div>
          </div>

          <div className="mt-6 p-4 bg-[#F5ECD5]/40 rounded-xl border border-[#E8DCC4]">
            <div className="flex items-center gap-2 text-[#8C6239] font-semibold text-sm mb-1">
              <span>🌍</span> {t("shippingInfoTitle")}
            </div>
            <p className="text-xs text-gray-600">
              {t("shippingInfoDesc")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
