import React from "react";
import { getOrdersByUserId, getGuestOrders } from "@/actions/orders.actions";
import { auth } from "@clerk/nextjs/server";
import { cookies } from "next/headers";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import OrderListClient from "./order-list-client";

export default async function OrdersPage() {
  const { userId } = await auth();
  const cookieStore = await cookies();
  const guestId = cookieStore.get("guestId")?.value;

  let rawOrders: any[] = [];

  if (userId) {
    rawOrders = await getOrdersByUserId(userId);
  } else if (guestId) {
    rawOrders = await getGuestOrders(guestId);
  }

  // Format orders for standardizing dates and populating totals
  let orders = rawOrders.map((o: any) => {
    const total = o.items.reduce((sum: number, it: any) => {
      return sum + (it.productId?.price || 0) * (it.quantity || 0);
    }, 0);
    return {
      _id: o._id,
      createdAt: o.createdAt,
      status: o.status,
      total,
      fullName: o.fullName,
      items: o.items.map((it: any) => ({
        quantity: it.quantity,
        product: it.productId,
      })),
    };
  });

  orders = JSON.parse(JSON.stringify(orders));

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 mt-20 min-h-[70vh]">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-4 border-b border-border">
        <div>
          <h1 className="text-3xl font-serif font-bold text-foreground">
            Order History
          </h1>
          <p className="text-muted-foreground mt-2">
            View your pending purchases and complete your payment.
          </p>
        </div>
        <Link href="/products">
          <Button variant="outline" className="rounded-full shadow-sm hover:bg-gray-50 border-border">
            Continue Shopping
          </Button>
        </Link>
      </div>

      {orders.length === 0 ? (
        <div className="text-center bg-white border border-border/60 rounded-2xl shadow-soft p-12">
          <div className="mx-auto w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
            <span className="text-4xl">🛍️</span>
          </div>
          <h2 className="text-2xl font-serif font-medium text-foreground mb-4">You have no active orders.</h2>
          <p className="text-muted-foreground mb-8">
            When you place an order, whether as a guest or securely logged in, you can track it here.
          </p>
          <Link href="/products">
            <Button size="lg" className="rounded-full px-8 bg-gradient-primary text-white shadow-elegant hover:opacity-90 transition-opacity border-none">
              Explore Our Collection
            </Button>
          </Link>
        </div>
      ) : (
        <OrderListClient orders={orders} />
      )}
    </div>
  );
}
