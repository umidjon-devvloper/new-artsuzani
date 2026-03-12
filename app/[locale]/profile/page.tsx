import React from "react";
import ProfileOrder from "./_components/profile-order";
import { getOrdersByUserId } from "@/actions/orders.actions";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Header from "@/components/shared/header";
import { GetCart } from "@/actions/cart.actions";
import { GetFavorite } from "@/actions/favorite.actions";

const Profile = async () => {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");
  const favoriteLength = userId ? await GetCart(userId) : [];
  const cartLen = Array.isArray(favoriteLength) ? favoriteLength.length : 0;
  const favorites = userId ? await GetFavorite(userId) : [];
  const favoriteLength1 = favorites?.length ? favorites.length : 0;
  const orders = await getOrdersByUserId(userId);
  console.log("User Orders:", orders);
  return (
    <div>
      <Header favoriteLength={favoriteLength1} cartLength={cartLen} />
      <ProfileOrder orders={orders} />
    </div>
  );
};

export default Profile;
