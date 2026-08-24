"use server";

import dbConnect from "@/lib/connection";
import cartModel from "@/models/cart.model";
import favoriteModel from "@/models/favorite.model";
import { OrdersModel } from "@/models/orders.model";
import userModel from "@/models/user.model";
import type { Types } from "mongoose";

export type HeaderCounts = {
  cartCount: number;
  favoriteCount: number;
  pendingOrderCount: number;
};

const EMPTY: HeaderCounts = {
  cartCount: 0,
  favoriteCount: 0,
  pendingOrderCount: 0,
};

/**
 * Header va mobil navigatsiya badge'lari uchun sonlarni bitta joyda oladi.
 *
 * Avval layout uchta alohida so'rov qilar edi va ularning ikkitasi
 * `.populate()` orqali to'liq mahsulot hujjatlarini (rasmlar bilan) tortib,
 * faqat `.length` ni olardi. Endi faqat `countDocuments()` ishlatiladi va
 * so'rovlar parallel ketadi.
 */
export async function getHeaderCounts(
  clerkUserId: string | null,
  guestId?: string
): Promise<HeaderCounts> {
  if (!clerkUserId && !guestId) return EMPTY;

  try {
    await dbConnect();

    let userMongoId: Types.ObjectId | null = null;
    if (clerkUserId) {
      const user = await userModel
        .findOne({ clerkId: clerkUserId })
        .select("_id")
        .lean<{ _id: Types.ObjectId } | null>();
      userMongoId = user?._id ?? null;
    }

    // Cart va orders'da ro'yxatdan o'tgan va mehmon yozuvlari bo'lishi mumkin
    const ownerFilter =
      userMongoId && guestId
        ? { $or: [{ userId: userMongoId }, { guestId }] }
        : userMongoId
          ? { userId: userMongoId }
          : { guestId };

    const [cartCount, favoriteCount, pendingOrderCount] = await Promise.all([
      cartModel.countDocuments(ownerFilter),
      userMongoId
        ? favoriteModel.countDocuments({ userId: userMongoId })
        : Promise.resolve(0),
      OrdersModel.countDocuments({ ...ownerFilter, status: "pending" }),
    ]);

    return { cartCount, favoriteCount, pendingOrderCount };
  } catch (error) {
    // Badge sonlari uchun butun sahifani yiqitmaymiz
    console.error("getHeaderCounts error:", error);
    return EMPTY;
  }
}
