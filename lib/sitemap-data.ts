import dbConnect from "@/lib/connection";
import productModel from "@/models/product.model";
import categoryModel from "@/models/category.model";
import type { Types } from "mongoose";

type SitemapDoc = {
  _id: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
};

/**
 * Sitemap uchun faqat _id va sanalar.
 *
 * MUHIM: bu yerda `getProducts()` ishlatilmaydi — u barcha maydonlarni,
 * jumladan rasmlarni ham tortadi. Sitemap'ga esa faqat ID va sana kerak.
 */
export async function getProductsForSitemap(): Promise<SitemapDoc[]> {
  await dbConnect();
  return productModel
    .find({}, { _id: 1, createdAt: 1, updatedAt: 1 })
    .sort({ createdAt: -1 })
    .lean<SitemapDoc[]>();
}

export async function getCategoriesForSitemap(): Promise<SitemapDoc[]> {
  await dbConnect();
  return categoryModel
    .find({}, { _id: 1, createdAt: 1, updatedAt: 1 })
    .sort({ createdAt: -1 })
    .lean<SitemapDoc[]>();
}
