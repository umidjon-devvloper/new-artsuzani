import { getHeaderCounts } from "@/actions/badges.actions";
import Header from "@/components/shared/header";
import Footer from "@/components/shared/footer";
import MobileBottomNav from "@/components/shared/mobile-bottom-nav";
import { auth } from "@clerk/nextjs/server";
import { cookies } from "next/headers";
import React from "react";

const Layout = async ({ children }: { children: React.ReactNode }) => {
  const [authResult, cookieStore] = await Promise.all([auth(), cookies()]);
  const guestId = cookieStore.get("guestId")?.value;

  const { cartCount, favoriteCount, pendingOrderCount } = await getHeaderCounts(
    authResult?.userId ?? null,
    guestId
  );

  // ClerkProvider yuqorida app/[locale]/layout.tsx da o'ralgan — bu yerda takrorlamaymiz
  return (
    <div className="relative min-h-screen flex flex-col">
      <Header favoriteLength={favoriteCount} cartLength={cartCount} />
      {/* pb-24 on mobile ensures the mobile nav doesn't cover content */}
      <div className="relative z-10 flex-1 pb-24 md:pb-0">{children}</div>
      <Footer />
      <MobileBottomNav
        cartLength={cartCount}
        pendingOrderCount={pendingOrderCount}
      />
    </div>
  );
};

export default Layout;
