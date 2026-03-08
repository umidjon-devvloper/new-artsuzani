// actions/cart.actions.ts
"use server";

import dbConnect from "@/lib/connection";
import cartModel from "@/models/cart.model";
import userModel from "@/models/user.model";
import "@/models/product.model"; // MUHIM: Product modelini register qiladi
import { Types } from "mongoose";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

// Helper to get or set guest session
async function getOrCreateGuestId() {
  const cookieStore = await cookies();
  let guestId = cookieStore.get("guestId")?.value;
  if (!guestId) {
    guestId = "guest_" + Math.random().toString(36).substring(2, 15);
    cookieStore.set("guestId", guestId, { maxAge: 60 * 60 * 24 * 30 }); // 30 days
  }
  return guestId;
}

export const AddToCart = async (
  clerkUserId: string | null,
  productId: string,
  quantity: string | number
) => {
  await dbConnect();

  if (!productId) throw new Error("Missing productId");
  if (!Types.ObjectId.isValid(productId)) throw new Error("Invalid productId");

  // qty to'g'rilash
  const qty = Math.max(1, Number(quantity) || 1);

  let userId = null;
  let guestId = null;

  if (clerkUserId) {
    const user = await userModel.findOne({ clerkId: clerkUserId }).select("_id");
    if (!user) throw new Error("User not found");
    userId = user._id;
  } else {
    guestId = await getOrCreateGuestId();
  }

  const query = userId
    ? { userId, productId: new Types.ObjectId(productId) }
    : { guestId, productId: new Types.ObjectId(productId) };

  const cartItem = await cartModel.findOneAndUpdate(
    query,
    { $inc: { quantity: qty } },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );

  revalidatePath("/", "layout");
  return cartItem?.toObject?.() ?? cartItem;
};

export const GetCart = async (userId: string | null, guestId?: string) => {
  await dbConnect();
  
  let userMongoId = null;
  if (userId) {
    const user = await userModel.findOne({ clerkId: userId }).select("_id");
    userMongoId = user?._id;
  }

  const query: any = {};
  if (userMongoId && guestId) {
    // Optionally fetch both if we later want to merge them
    query.$or = [{ userId: userMongoId }, { guestId }];
  } else if (userMongoId) {
    query.userId = userMongoId;
  } else if (guestId) {
    query.guestId = guestId;
  } else {
    return [];
  }

  const items = await cartModel
    .find(query)
    .populate({
      path: "productId",
      select: "_id title description price images",
    })
    .sort({ createdAt: -1 })
    .lean();

  // JSONga tayyorlab qaytaramiz
  return JSON.parse(JSON.stringify(items));
};

export async function IncrementCartItem(
  clerkUserId: string | null,
  cartItemId: string
) {
  await dbConnect();

  let query: any = { _id: new Types.ObjectId(cartItemId) };
  if (clerkUserId) {
    const user = await userModel.findOne({ clerkId: clerkUserId }).select("_id");
    if (!user) return;
    query.userId = user._id;
  } else {
    const cookieStore = await cookies();
    const guestId = cookieStore.get("guestId")?.value;
    if (!guestId) return;
    query.guestId = guestId;
  }

  await cartModel.updateOne(query, { $inc: { quantity: 1 } });
  revalidatePath("/", "layout");
}

export async function DecrementCartItem(
  clerkUserId: string | null,
  cartItemId: string
) {
  await dbConnect();

  let query: any = { _id: new Types.ObjectId(cartItemId) };
  if (clerkUserId) {
    const user = await userModel.findOne({ clerkId: clerkUserId }).select("_id");
    if (!user) return;
    query.userId = user._id;
  } else {
    const cookieStore = await cookies();
    const guestId = cookieStore.get("guestId")?.value;
    if (!guestId) return;
    query.guestId = guestId;
  }

  const item = await cartModel.findOne(query);
  if (!item) return;

  if (item.quantity <= 1) {
    await cartModel.deleteOne(query);
  } else {
    await cartModel.updateOne(query, { $inc: { quantity: -1 } });
  }

  revalidatePath("/", "layout");
}

export async function RemoveCartItem(
  clerkUserId: string | null, 
  cartItemId: string
) {
  await dbConnect();

  let query: any = { _id: new Types.ObjectId(cartItemId) };
  if (clerkUserId) {
    const user = await userModel.findOne({ clerkId: clerkUserId }).select("_id");
    if (!user) return;
    query.userId = user._id;
  } else {
    const cookieStore = await cookies();
    const guestId = cookieStore.get("guestId")?.value;
    if (!guestId) return;
    query.guestId = guestId;
  }

  await cartModel.deleteOne(query);
  revalidatePath("/", "layout");
}
