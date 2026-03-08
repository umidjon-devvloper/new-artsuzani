"use server";

import dbConnect from "@/lib/connection";
import productModel from "@/models/product.model";

type SearchState = { items: any[]; error?: string };

export async function searchActions(
  prevState: SearchState,
  formData: FormData
): Promise<SearchState> {
  try {
    const q = (formData.get("q") as string)?.trim() || "";
    await dbConnect();

    const filter = q ? { title: { $regex: q, $options: "i" } } : {};
    const items = await productModel.find(filter).limit(10).lean();

    return { items };
  } catch (e: any) {
    console.error("searchActions error:", e);
    return { items: [], error: "Qidiruvda xatolik yuz berdi" };
  }
}
