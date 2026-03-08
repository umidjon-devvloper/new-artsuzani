import { model, models, Schema } from "mongoose";

const ProductSchema = new Schema(
  {
    title: { type: String, required: true }, // Mahsulot nomi
    description: { type: String }, // Tavsif
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true }, // Category bilan bog'lanish
    price: { type: Number, required: true }, // Narx
    images: [{ type: String }], // Rasmlar array sifatida
    stripePriceId: { type: String },
    stripeProductId: { type: String },
  },
  { timestamps: true }
);

// collision boвЂlsa qaytadan compile qilmaydi
export default models.Product || model("Product", ProductSchema);
