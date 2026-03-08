import { NextResponse } from "next/server";
import dbConnect from "@/lib/connection";
import productModel from "@/models/product.model";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.trim() || "";
  await dbConnect();

  const filter = q ? { title: { $regex: q, $options: "i" } } : {};
  const items = await productModel.find(filter).limit(10).lean();

  return NextResponse.json(items);
}
