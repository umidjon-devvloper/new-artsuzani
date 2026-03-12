import { GetCart } from "@/actions/cart.actions";
import { GetFavorite } from "@/actions/favorite.actions";
import { getOrdersByUserId, getGuestOrders } from "@/actions/orders.actions";
import Header from "@/components/shared/header";
import Footer from "@/components/shared/footer";
import MobileBottomNav from "@/components/shared/mobile-bottom-nav";
import { ClerkProvider } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { cookies } from "next/headers";
import React from "react";

const Layout = async ({ children }: { children: React.ReactNode }) => {
  const authResult = await auth();
  const cookieStore = await cookies();
  const guestId = cookieStore.get("guestId")?.value;

  const rawCart = await GetCart(authResult?.userId || null, guestId);
  const cartLen = Array.isArray(rawCart) ? rawCart.length : 0;
  const favorites = authResult?.userId
    ? await GetFavorite(authResult?.userId)
    : [];
  const favoriteLength1 = favorites?.length ? favorites.length : 0;

  let pendingOrderCount = 0;
  try {
    const orders = authResult?.userId
      ? await getOrdersByUserId(authResult.userId)
      : guestId
      ? await getGuestOrders(guestId)
      : [];
    if (Array.isArray(orders)) {
      pendingOrderCount = orders.filter((order: any) => order.status === "pending").length;
    }
  } catch (error) {
    console.error("Error fetching orders for badges:", error);
  }

  return (
    <ClerkProvider>
      <div className="relative min-h-screen flex flex-col">
        <Header favoriteLength={favoriteLength1} cartLength={cartLen} />
        {/* pb-24 on mobile ensures the mobile nav doesn't cover content */}
        <div className="relative z-10 flex-1 pb-24 md:pb-0">{children}</div>
        <Footer />
        <MobileBottomNav cartLength={cartLen} pendingOrderCount={pendingOrderCount} />
      </div>
    </ClerkProvider>
  );
};

export default Layout;
