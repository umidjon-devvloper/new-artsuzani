"use server";

import dbConnect from "@/lib/connection";
import userModel from "@/models/user.model";

export interface ICreateUser {
  clerkId: string;
  email: string;
  fullName: string;
  picture: string;
}

export async function createUser(data: ICreateUser) {
  await dbConnect();

  const { clerkId, email, fullName, picture } = data;

  // clerkId boвЂyicha idempotent upsert
  await userModel.findOneAndUpdate(
    { clerkId },
    { $set: { email, fullName, picture, clerkId } },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );

  //   return user;
}
export const getUser = async (clerkId: string) => {
  try {
    console.log("clerkId", clerkId);
    await dbConnect();
    const user = await userModel
      .findOne({ clerkId })
      .select("fullName picture clerkId email role isAdmin");
    if (!user) return "notFound";
    console.log("user", user);
    return JSON.parse(JSON.stringify(user));
  } catch (error) {
    throw new Error("Error fetching user. Please try again.");
  }
};
export const getRole = async (clerkId: string) => {
  try {
    await dbConnect();
    const user = await userModel.findOne({ clerkId }).select("role isAdmin");
    return user;
  } catch (error) {
    throw new Error("Error getting role");
  }
};
