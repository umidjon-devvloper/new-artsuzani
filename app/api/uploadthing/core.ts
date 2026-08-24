import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { auth } from "@clerk/nextjs/server";
import dbConnect from "@/lib/connection";
import userModel from "@/models/user.model";

const f = createUploadthing();

/** Faqat admin foydalanuvchi rasm yuklay oladi. */
async function requireAdmin() {
  const { userId } = await auth();
  if (!userId) throw new UploadThingError("Avval tizimga kiring");

  await dbConnect();
  const user = await userModel
    .findOne({ clerkId: userId })
    .select("isAdmin")
    .lean<{ isAdmin?: boolean } | null>();

  if (!user?.isAdmin) throw new UploadThingError("Ruxsat yo'q");
  return { userId };
}

export const ourFileRouter = {
  // Mahsulot rasmlari — 8 tagacha
  productImage: f({ image: { maxFileSize: "8MB", maxFileCount: 8 } })
    .middleware(requireAdmin)
    .onUploadComplete(async ({ file }) => ({ url: file.ufsUrl, key: file.key })),

  // Kategoriya va blog uchun — bittadan
  singleImage: f({ image: { maxFileSize: "8MB", maxFileCount: 1 } })
    .middleware(requireAdmin)
    .onUploadComplete(async ({ file }) => ({ url: file.ufsUrl, key: file.key })),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
