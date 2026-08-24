// actions/favorite.actions.ts
"use server";

import dbConnect from "@/lib/connection";
import favoriteModel from "@/models/favorite.model";
import userModel from "@/models/user.model";
import "@/models/product.model"; // MUHIM: populate uchun Product modelini register qiladi
import { Types } from "mongoose";

export async function isProductFavorited(
  clerkUserId: string,
  productId: string
) {
  if (!clerkUserId) return false;
  if (!Types.ObjectId.isValid(productId)) return false;

  await dbConnect();

  const user = await userModel.findOne({ clerkId: clerkUserId }).select("_id");
  if (!user) return false;

  const fav = await favoriteModel
    .findOne({ userId: user._id, productId })
    .select("_id")
    .lean();

  return !!fav;
}

export async function toggleFavorite(clerkUserId: string, productId: string) {
  if (!clerkUserId) throw new Error("Not authenticated");
  if (!productId) throw new Error("Missing productId");
  if (!Types.ObjectId.isValid(productId)) throw new Error("Invalid productId");

  await dbConnect();

  const user = await userModel.findOne({ clerkId: clerkUserId }).select("_id");
  if (!user) throw new Error("User not found");

  const existing = await favoriteModel
    .findOne({ userId: user._id, productId })
    .select("_id");

  if (existing) {
    await favoriteModel.deleteOne({ _id: existing._id });
    return { liked: false };
  }

  await favoriteModel.create({ userId: user._id, productId });
  return { liked: true };
}

export async function GetFavorite(clerkUserId: string) {
  if (!clerkUserId) return [];

  await dbConnect();

  const user = await userModel
    .findOne({ clerkId: clerkUserId })
    .select("_id")
    .lean<{ _id: Types.ObjectId } | null>();
  if (!user) return [];

  const favorites = await favoriteModel
    .find({ userId: user._id })
    .populate({
      path: "productId",
      select: "_id title description price images",
    })
    .sort({ createdAt: -1 })
    .lean();

  return JSON.parse(JSON.stringify(favorites));
}


/** Mahsulot kartalaridagi like holati uchun — faqat yoqtirilgan ID'lar. */
export async function getFavoritedProductIds(
  clerkUserId: string | null
): Promise<string[]> {
  if (!clerkUserId) return [];

  await dbConnect();

  const user = await userModel
    .findOne({ clerkId: clerkUserId })
    .select("_id")
    .lean<{ _id: Types.ObjectId } | null>();
  if (!user) return [];

  const favs = await favoriteModel
    .find({ userId: user._id })
    .select("productId")
    .lean<{ productId: Types.ObjectId }[]>();

  return favs.map((f) => String(f.productId));
}
