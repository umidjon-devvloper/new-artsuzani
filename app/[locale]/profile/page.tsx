import React from "react";
import ProfileOrder from "./_components/profile-order";
import { getOrdersByUserId } from "@/actions/orders.actions";
import { getHeaderCounts } from "@/actions/badges.actions";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Header from "@/components/shared/header";

const Profile = async () => {
  const { userId } = await auth();
  if (!userId) redirect("/");

  const [counts, orders] = await Promise.all([
    getHeaderCounts(userId),
    getOrdersByUserId(userId),
  ]);

  return (
    <div>
      <Header
        favoriteLength={counts.favoriteCount}
        cartLength={counts.cartCount}
      />
      <ProfileOrder orders={orders} />
    </div>
  );
};

export default Profile;
