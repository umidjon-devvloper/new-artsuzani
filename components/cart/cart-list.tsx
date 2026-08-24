"use client";

import { useTransition } from "react";
import {
  IncrementCartItem,
  DecrementCartItem,
  RemoveCartItem,
} from "@/actions/cart.actions";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import Image from "next/image";

type Product = {
  _id: string;
  title: string;
  description?: string;
  price: number;
  images?: string[];
};

type CartItem = {
  _id: string;
  productId: Product; // populated
  quantity: number;
  createdAt?: string;
  updatedAt?: string;
};

export default function CartList({
  userId,
  items,
}: {
  userId: string;
  items: CartItem[];
}) {
  const [isPending, startTransition] = useTransition();
  const route = useRouter();

  const total = items.reduce(
    (sum, it) => sum + (it.productId?.price || 0) * (it.quantity || 0),
    0
  );

  const money = (n: number) =>
    // MUHIM: locale aniq berilishi kerak. `undefined` serverda server locale'ini,
    // brauzerda foydalanuvchi locale'ini oladi -> "85,00 $" vs "$85.00" va hydration mismatch.
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(n);

  const onInc = (id: string) =>
    startTransition(() => IncrementCartItem(userId, id));
  const onDec = (id: string) =>
    startTransition(() => DecrementCartItem(userId, id));
  const onRemove = (id: string) =>
    startTransition(() => RemoveCartItem(userId, id));

  const onCheckout = () => {
    route.push("/shopping/checkout");
  };

  if (!items.length) {
    return (
      <div className="max-w-3xl mx-auto p-12 text-center bg-card rounded-2xl shadow-soft border border-border mt-8">
        <p className="text-xl font-serif text-muted-foreground">Your cart is beautifully empty.</p>
        <Button onClick={() => route.push("/products")} className="mt-6 rounded-full px-8 bg-gradient-primary text-white shadow-sm hover:opacity-90">
          Explore Collection
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8 pt-0 md:pt-0 min-h-screen">
      <ul className="space-y-4">
        {items.map((it) => {
          const p = (it.productId as any) || {};
          const title =
            typeof p === "object" ? p.title || "Untitled" : "Untitled";
          const price = typeof p === "object" ? Number(p.price) || 0 : 0;
          const img = typeof p === "object" ? p.images?.[0] : undefined;

          return (
            <li
              key={it._id}
              className="bg-card border border-border/60 rounded-2xl p-4 flex gap-4 md:gap-6 items-center shadow-sm hover:shadow-elegant-light transition-shadow"
            >
              {/* Rasm */}
              <div className="w-20 h-20 md:w-24 md:h-24 relative rounded-xl overflow-hidden bg-gray-100 shrink-0">
                {img ? (
                  // Agar oldingi versiyada next/image ishlatgan bo"lsangiz, import qiling:
                  // import Image from "next/image";
                  <Image
                    src={img}
                    alt={title}
                    fill
                    sizes="96px"
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full grid place-items-center text-sm text-gray-500">
                    No image
                  </div>
                )}
              </div>

              {/* Matn + quantity */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="text-base md:text-lg font-medium truncate">
                      {title}
                    </h3>
                    <p className="text-sm text-gray-500 line-clamp-2">
                      {typeof p === "object" ? p.description || "" : ""}
                    </p>
                  </div>

                  <button
                    onClick={() => onRemove(it._id)}
                    disabled={isPending}
                    className="text-sm text-red-600 hover:underline disabled:opacity-50"
                    aria-label="Remove item"
                    title="Remove"
                  >
                    Remove
                  </button>
                </div>

                <div className="mt-3 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-4 border border-border rounded-full px-1 shadow-sm bg-gray-50/50">
                    <button
                      onClick={() => onDec(it._id)}
                      disabled={isPending}
                      className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white disabled:opacity-50 transition-colors text-muted-foreground hover:text-foreground"
                      aria-label="Decrease quantity"
                    >
                      -
                    </button>
                    <span className="w-6 text-center tabular-nums font-medium text-sm">
                      {it.quantity}
                    </span>
                    <button
                      onClick={() => onInc(it._id)}
                      disabled={isPending}
                      className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white disabled:opacity-50 transition-colors text-muted-foreground hover:text-foreground"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>

                  {/* Narx: birlik narxi x soni, va shu qator uchun jami */}
                  <div className="text-right shrink-0">
                    <div className="text-xs text-muted-foreground tabular-nums">
                      {money(price)} &times; {it.quantity}
                    </div>
                    <div className="font-serif text-lg font-bold text-[var(--price-color)] tabular-nums">
                      {money(price * it.quantity)}
                    </div>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
      
      <div className="mt-8 border-t border-border pt-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="text-lg font-medium text-muted-foreground font-serif">Estimated Total</span>
          <div className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">{money(total)}</div>
        </div>

      <div className="mt-8 flex justify-end">
        <Button onClick={onCheckout} size="lg" className="rounded-full px-12 bg-gradient-primary text-white hover:opacity-90 shadow-elegant-light transition-opacity text-lg tracking-wide border-none">
          Checkout Now
        </Button>
      </div>
      </div>
    </div>
  );
}
