// actions/favorite.actions.ts
import dbConnect from "@/lib/connection";
import favoriteModel from "@/models/favorite.model";
import userModel from "@/models/user.model";
import { Types } from "mongoose";

export async function isProductFavorited(
  clerkUserId: string,
  productId: string
) {
  const user = await userModel.findOne({ clerkId: clerkUserId }).select("_id");
  if (!user) return false;
  if (!Types.ObjectId.isValid(productId)) return false;

  const fav = await favoriteModel
    .findOne({
      userId: user._id,
      productId,
    })
    .lean();

  return !!fav;
}

export async function toggleFavorite(clerkUserId: string, productId: string) {
  if (!clerkUserId) throw new Error("Not authenticated");
  if (!productId) throw new Error("Missing productId");
  if (!Types.ObjectId.isValid(productId)) throw new Error("Invalid productId");

  const user = await userModel.findOne({ clerkId: clerkUserId }).select("_id");
  if (!user) throw new Error("User not found");

  const existing = await favoriteModel.findOne({
    userId: user._id,
    productId,
  });

  if (existing) {
    await favoriteModel.deleteOne({ _id: existing._id });
    return { liked: false };
  } else {
    await favoriteModel.create({ userId: user._id, productId });
    return { liked: true };
  }
}

export async function GetFavorite(clerkUserId: string) {
  await dbConnect();

  const user = await userModel
    .findOne({ clerkId: clerkUserId })
    .select("_id")
    .lean();
  if (!user || typeof user !== "object" || !("_id" in user)) return [];

  const favorites = await favoriteModel
    .find({ userId: (user as any)._id })
    .populate("productId")
    .lean();

  return favorites;
}
