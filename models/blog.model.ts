// models/blog.model.ts
import mongoose, { Schema, Model, Document } from "mongoose";

interface IBlog extends Document {
  title: string;
  description: string;
  images: string;
}

const BlogSchema = new Schema<IBlog>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    images: { type: String, default: "" },
  },
  { timestamps: true }
);

// MUHIM: faqat mongoose.models orqali tekshiramiz
const Blog =
  (mongoose.models.Blog as Model<IBlog>) ||
  mongoose.model<IBlog>("Blog", BlogSchema);

export default Blog;
