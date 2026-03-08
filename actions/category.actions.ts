"use server";

import dbConnect from "@/lib/connection";
import categoryModel from "@/models/category.model";
import mongoose, { Types } from "mongoose";
import { z } from "zod";

/** ===== TYPES ===== */
export type CategoryDTO = {
  _id: string;
  title: string;
  description?: string;
  image?: string;
};

type ActionError = { ok: false; error: string };

export type GetCategoriesResult =
  | { ok: true; data: CategoryDTO[] }
  | ActionError;
export type CreateCategoryResult =
  | { ok: true; data: CategoryDTO }
  | ActionError;
export type UpdateCategoryResult =
  | { ok: true; data: CategoryDTO }
  | { ok: false; error: string };

export type DeleteCategoryResult = { ok: true } | ActionError;

/** ===== SCHEMAS ===== */
const base64ImageSchema = z
  .string()
  .regex(/^data:image\/[a-zA-Z0-9.+-]+;base64,[A-Za-z0-9+/=]+$/)
  .optional();

const upsertCategorySchema = z.object({
  title: z.string().min(1, "Title kerak"),
  description: z.string().optional(),
  image: base64ImageSchema,
});

/** ===== HELPERS ===== */
function escapeRegex(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function toDTO(d: any): CategoryDTO {
  return {
    _id: String(d._id),
    title: String(d.title ?? ""),
    description: d.description ? String(d.description) : undefined,
    image: d.image ? String(d.image) : undefined,
  };
}

/** ===== ACTIONS ===== */
export async function getCategories(): Promise<GetCategoriesResult> {
  try {
    await dbConnect();
    const docs = await categoryModel
      .find({}, { _id: 1, title: 1, description: 1, image: 1 })
      .sort({ title: 1 })
      .lean();
    return { ok: true, data: docs.map(toDTO) };
  } catch (err) {
    console.error("getCategories error:", err);
    return { ok: false, error: "Kategoriya olishda xatolik" };
  }
}

export async function createCategories(
  formData: FormData
): Promise<CreateCategoryResult> {
  await dbConnect();

  const raw = {
    title: (formData.get("title") || "").toString(),
    description: (formData.get("description") || "").toString(),
    image: (formData.get("image") || undefined) as string | undefined,
  };

  const parsed = upsertCategorySchema.safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues.map((i) => i.message).join(", "),
    };
  }

  const { title, description, image } = parsed.data;

  const dup = await categoryModel
    .findOne({
      title: { $regex: `^${escapeRegex(title)}$`, $options: "i" },
    })
    .lean();
  if (dup)
    return { ok: false, error: "Bu nomdagi kategoriya allaqachon mavjud" };

  const doc = await categoryModel.create({ title, description, image });
  return { ok: true, data: toDTO(doc) };
}

export async function updateCategory(
  id: string,
  formData: FormData
): Promise<UpdateCategoryResult> {
  if (!Types.ObjectId.isValid(id)) {
    return { ok: false, error: "NotoвЂgвЂri category id" as const };
  }

  const title = (formData.get("title") || "").toString();
  const description = (formData.get("description") || "").toString();
  const image = (formData.get("image") || undefined) as string | undefined;

  // 1) Hamma fieldlarni tekshiramiz (hohlasang zod bilan)
  if (!title.trim()) {
    return { ok: false, error: "Title kerak" as const };
  }

  // 2) currentвЂ™ni aniq tip bilan olamiz
  type CategoryLean = {
    _id: Types.ObjectId;
    title: string;
    description?: string;
    image?: string;
  };

  const current = await categoryModel
    .findById(id)
    .select("title") // faqat kerakli field
    .lean<CategoryLean | null>() // <-- generic bilan aniq tur
    .exec();

  if (!current) {
    return { ok: false, error: "Kategoriya topilmadi" as const };
  }

  // 3) Title oвЂzgargan boвЂlsa, duplicate nomni tekshiramiz
  const escapeRegex = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  if (title.toLowerCase() !== current.title.toLowerCase()) {
    const dup = await categoryModel
      .findOne({
        _id: { $ne: new Types.ObjectId(id) },
        title: { $regex: `^${escapeRegex(title)}$`, $options: "i" },
      })
      .lean()
      .exec();

    if (dup) {
      return {
        ok: false,
        error: "Bu nomdagi kategoriya allaqachon mavjud" as const,
      };
    }
  }

  // 4) Yangilash
  const updated = await categoryModel
    .findByIdAndUpdate(
      id,
      { title, description, image },
      { new: true, runValidators: true }
    )
    .lean<CategoryLean | null>()
    .exec();

  if (!updated) {
    return { ok: false, error: "Yangilashda xatolik" as const };
  }

  // 5) DTO qaytaramiz
  return {
    ok: true as const,
    data: {
      _id: String(updated._id),
      title: updated.title,
      description: updated.description,
      image: updated.image,
    },
  };
}

export async function deleteCategory(
  id: string
): Promise<DeleteCategoryResult> {
  await dbConnect();

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return { ok: false, error: "NotoвЂgвЂri category id" };
  }

  const res = await categoryModel.deleteOne({ _id: id });
  if (res.deletedCount === 0) {
    return { ok: false, error: "Kategoriya topilmadi" };
  }
  return { ok: true };
}
