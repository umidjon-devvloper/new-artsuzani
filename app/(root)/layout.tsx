import { GetCart } from "@/actions/cart.actions";
import { GetFavorite } from "@/actions/favorite.actions";
import Header from "@/components/shared/header";
import Footer from "@/components/shared/footer";
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

  return (
    <ClerkProvider>
      <div className="relative min-h-screen ">
        <Header favoriteLength={favoriteLength1} cartLength={cartLen} />
        <div className="relative z-10 flex-1">{children}</div>
        <Footer />
      </div>
    </ClerkProvider>
  );
};

export default Layout;
