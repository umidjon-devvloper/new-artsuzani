import { model, models, Schema } from "mongoose";

const ProductSchema = new Schema(
  {
    title: { type: String, required: true }, // Mahsulot nomi
    description: { type: String }, // Tavsif
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true }, // Category bilan bog'lanish
    price: { type: Number, required: true }, // Narx
    images: [{ type: String }], // Rasm URL'lari
    stripePriceId: { type: String },
    stripeProductId: { type: String },
  },
  { timestamps: true }
);

// Kategoriya bo'yicha filtrlash uchun (product-category sahifasi)
ProductSchema.index({ category: 1, createdAt: -1 });
// Ro'yxatni sanaga qarab saralash uchun (bosh sahifa, /products)
ProductSchema.index({ createdAt: -1 });

// collision bo'lsa qaytadan compile qilmaydi
export default models.Product || model("Product", ProductSchema);
