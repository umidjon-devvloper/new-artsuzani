"use server";

import dbConnect from "@/lib/connection";
import cartModel from "@/models/cart.model";
import { OrdersModel } from "@/models/orders.model";
import userModel from "@/models/user.model";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import "@/models/product.model";

export const createOrder = async (
  userId: string | null,
  items: { productId: string; quantity: number }[],
  fullName: string,
  location: string
) => {
  await dbConnect();
  
  let userMongoId = null;
  let guestId = null;

  if (userId) {
    const user = await userModel.findOne({ clerkId: userId }).select("_id");
    if (user) {
      userMongoId = user._id;
    }
  } else {
    const cookieStore = await cookies();
    guestId = cookieStore.get("guestId")?.value;
  }

  const orderData: any = {
    items,
    fullName,
    location,
    status: "pending",
  };

  if (userMongoId) {
    orderData.userId = userMongoId;
  } else if (guestId) {
    orderData.guestId = guestId;
  }

  const orders = await OrdersModel.create(orderData);
  
  if (orders) {
    // Clear the cart for this session
    if (userMongoId) {
      await cartModel.deleteMany({ userId: userMongoId });
    } else if (guestId) {
      await cartModel.deleteMany({ guestId });
    }
  }
  
  revalidatePath("/");
  return JSON.parse(JSON.stringify(orders));
};

export const getOrdersByUserId = async (userId: string) => {
  await dbConnect();
  const user = await userModel.findOne({ clerkId: userId }).select("_id");
  const orders = await OrdersModel.find({ userId: user?._id })
    .populate("items.productId")
    .sort({ createdAt: -1 });

  return JSON.parse(JSON.stringify(orders));
};

export const getGuestOrders = async (guestId: string) => {
  await dbConnect();
  
  const orders = await OrdersModel.find({ guestId })
    .populate("items.productId")
    .sort({ createdAt: -1 });

  return JSON.parse(JSON.stringify(orders));
};

export const getAllOrders = async () => {
  await dbConnect();

  const docs = await OrdersModel.find()
    .populate({ path: "userId", select: "fullName email picture" })
    .populate({
      path: "items.productId",
      select: "title price images description",
    })
    .sort({ createdAt: -1 })
    .lean();

  return docs;
};

const VALID = ["pending", "completed", "canceled"] as const;

export type OrderStatus = (typeof VALID)[number];

export const updateOrderStatus = async (orderId: string, status: string) => {
  await dbConnect();
  const order = await OrdersModel.findByIdAndUpdate(
    orderId,
    { status },
    { new: true }
  );
  revalidatePath("/admin/orders");
  return JSON.parse(JSON.stringify(order));
};

export const deleteOrder = async (orderId: string) => {
  await dbConnect();
  const order = await OrdersModel.findByIdAndDelete(orderId);
  revalidatePath("/admin/orders");
  return JSON.parse(JSON.stringify(order));
};
