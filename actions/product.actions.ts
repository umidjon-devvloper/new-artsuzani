"use server";

import dbConnect from "@/lib/connection";
import productModel from "@/models/product.model";
import categoryModel from "@/models/category.model";
import mongoose, { isValidObjectId, Types } from "mongoose";
import { z } from "zod";

/** ========= TYPES ========= */
export type ProductDTO = {
  _id: string;
  title: string;
  description?: string;
  price: number;
  images: string[];
  categoryId: string;
  categoryTitle?: string;
  createdAt?: string;
  updatedAt?: string;
};

type ActionError = { ok: false; error: string };

export type GetProductsResult = { ok: true; data: ProductDTO[] } | ActionError;
export type CreateProductResult = { ok: true; data: ProductDTO } | ActionError;
export type UpdateProductResult = { ok: true; data: ProductDTO } | ActionError;
export type DeleteProductResult = { ok: true } | ActionError;

/** ========= SCHEMAS ========= */
const base64ImageSchema = z
  .string()
  .regex(/^data:image\/[a-zA-Z0-9.+-]+;base64,[A-Za-z0-9+/=]+$/);

const createProductSchema = z.object({
  title: z.string().min(1, "Title kerak"),
  description: z.string().optional(),
  category: z.string().min(1, "Category kerak"),
  price: z.coerce.number().min(0, "Narx 0 dan katta boвЂlsin"),
  images: z
    .array(base64ImageSchema)
    .max(8, "Eng koвЂpi bilan 8ta rasm")
    .optional(),
});

const updateProductSchema = z.object({
  title: z.string().min(1, "Title kerak"),
  description: z.string().optional(),
  category: z.string().min(1, "Category kerak"),
  price: z.coerce.number().min(0, "Narx 0 dan katta boвЂlsin"),
  images: z.array(base64ImageSchema).max(8).optional(),
});

/** ========= HELPERS ========= */
type ProductLean = {
  _id: Types.ObjectId;
  title: string;
  description?: string;
  price: number;
  images?: string[];
  createdAt?: Date;
  updatedAt?: Date;
} & {
  category: Types.ObjectId | { _id: Types.ObjectId; title?: string }; // populated
};

function toDTO(d: ProductLean): ProductDTO {
  const catObj = d.category as any;
  const categoryId =
    catObj && typeof catObj === "object" && catObj._id
      ? String(catObj._id)
      : String(d.category);

  const categoryTitle =
    catObj && typeof catObj === "object" && typeof catObj.title === "string"
      ? catObj.title
      : undefined;

  return {
    _id: String(d._id),
    title: d.title,
    description: d.description ?? undefined,
    price: Number(d.price),
    images: Array.isArray(d.images) ? d.images : [],
    categoryId,
    categoryTitle,
    createdAt: d.createdAt ? d.createdAt.toISOString() : undefined,
    updatedAt: d.updatedAt ? d.updatedAt.toISOString() : undefined,
  };
}

function parseImagesField(
  imagesField: FormDataEntryValue | null
): string[] | undefined {
  if (
    !imagesField ||
    typeof imagesField !== "string" ||
    imagesField.trim() === ""
  )
    return undefined;
  try {
    const parsed = JSON.parse(imagesField);
    return Array.isArray(parsed) ? parsed : undefined;
  } catch {
    return undefined;
  }
}

/** ========= ACTIONS ========= */
export async function getProducts(): Promise<GetProductsResult> {
  try {
    await dbConnect();
    const docs = await productModel
      .find(
        {},
        {
          title: 1,
          description: 1,
          price: 1,
          images: 1,
          category: 1,
          createdAt: 1,
          updatedAt: 1,
        }
      )
      .populate({ path: "category", select: "title" })
      .sort({ createdAt: -1 })
      .lean<ProductLean[]>();

    return { ok: true, data: docs.map(toDTO) };
  } catch (err) {
    console.error("getProducts error:", err);
    return { ok: false, error: "Mahsulotlarni olishda xatolik" };
  }
}

export async function createProduct(
  formData: FormData
): Promise<CreateProductResult | ActionError> {
  await dbConnect();

  const raw = {
    title: (formData.get("title") || "").toString(),
    description: (formData.get("description") || "").toString(),
    category: (formData.get("category") || "").toString(),
    price: formData.get("price") as string,
    images: parseImagesField(formData.get("images")),
  };

  const parsed = createProductSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues.map((i) => i.message).join(", "),
    };
  }
  const { title, description, category, price, images } = parsed.data;

  if (!mongoose.Types.ObjectId.isValid(category)) {
    return { ok: false, error: "NotoвЂgвЂri kategoriya ID" };
  }

  // ixtiyoriy: kategoriya mavjudligini tekshirish
  const cat = await categoryModel.findById(category).select("_id").lean();
  if (!cat) return { ok: false, error: "Kategoriya topilmadi" };

  const created = await productModel.create({
    title,
    description,
    category: new mongoose.Types.ObjectId(category),
    price,
    images: images ?? [],
  });

  // qayta oвЂqib, populate qilamiz
  const doc = await productModel
    .findById(created._id)
    .populate({ path: "category", select: "title" })
    .lean<ProductLean>();

  if (!doc)
    return { ok: false, error: "Yaratildi, lekin qayta oвЂqib boвЂlmadi" };
  return { ok: true, data: toDTO(doc) };
}

export async function getCategoriesProducts(categoryId: string) {
  await dbConnect();

  if (!isValidObjectId(categoryId)) {
    throw new Error("Invalid category id");
  }

  const products = await productModel
    .find({ category: new mongoose.Types.ObjectId(categoryId) })
    .populate("category")
    .lean();

  return products; // [] bo'lishi mumkin
}

export async function updateProduct(
  id: string,
  formData: FormData
): Promise<UpdateProductResult | ActionError> {
  await dbConnect();

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return { ok: false, error: "NotoвЂgвЂri product id" };
  }

  const raw = {
    title: (formData.get("title") || "").toString(),
    description: (formData.get("description") || "").toString(),
    category: (formData.get("category") || "").toString(),
    price: formData.get("price") as string,
    images: parseImagesField(formData.get("images")),
  };

  const parsed = updateProductSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues.map((i) => i.message).join(", "),
    };
  }
  const { title, description, category, price, images } = parsed.data;

  if (!mongoose.Types.ObjectId.isValid(category)) {
    return { ok: false, error: "NotoвЂgвЂri kategoriya ID" };
  }

  const exists = await productModel.findById(id).select("_id").lean();
  if (!exists) return { ok: false, error: "Mahsulot topilmadi" };

  const updated = await productModel
    .findByIdAndUpdate(
      id,
      {
        title,
        description,
        category: new mongoose.Types.ObjectId(category),
        price,
        ...(images ? { images } : {}), // agar yuborilsa butunlay almashtiramiz
      },
      { new: true, runValidators: true }
    )
    .populate({ path: "category", select: "title" })
    .lean<ProductLean | null>();

  if (!updated) return { ok: false, error: "Yangilashda xatolik" };
  return { ok: true, data: toDTO(updated) };
}
export async function GetProductsID(id: string) {
  try {
    const product = await productModel.findById(id).populate("category");
    return product;
  } catch (error) {
    console.log(error);
  }
}

export async function deleteProduct(
  id: string
): Promise<DeleteProductResult | ActionError> {
  await dbConnect();

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return { ok: false, error: "NotoвЂgвЂri product id" };
  }

  const res = await productModel.deleteOne({ _id: id });
  if (res.deletedCount === 0) return { ok: false, error: "Mahsulot topilmadi" };

  return { ok: true };
}
