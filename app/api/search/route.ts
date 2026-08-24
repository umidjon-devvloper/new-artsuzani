import { NextResponse } from "next/server";
import dbConnect from "@/lib/connection";
import productModel from "@/models/product.model";

function escapeRegex(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.trim() || "";

  if (!q) return NextResponse.json([]);

  await dbConnect();

  // Rasmlar endi CDN URL'lari (~100 bayt), shuning uchun bitta rasmni ham
  // qaytaramiz — dropdown'da kichik oldindan ko'rinish chiqadi.
  const items = await productModel
    .find(
      { title: { $regex: escapeRegex(q), $options: "i" } },
      { title: 1, price: 1, images: { $slice: 1 } }
    )
    .limit(10)
    .lean();

  return NextResponse.json(items, {
    headers: { "Cache-Control": "private, max-age=30" },
  });
}
