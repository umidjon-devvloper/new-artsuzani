import mongoose, { Schema } from "mongoose";

const CategorySchema = new Schema(
  {
    title: { type: String, required: true, unique: true }, // Kategoriya nomi
    description: { type: String }, // Kategoriya tavsifi
    image: { type: String }, // Kategoriya rasmi (optional)
  },
  { timestamps: true }
);

// collision boвЂlsa qaytadan compile qilmaydi
export default mongoose.models.Category ||
  mongoose.model("Category", CategorySchema);
