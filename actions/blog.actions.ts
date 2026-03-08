// actions/blog.actions.ts
"use server";

import dbConnect from "@/lib/connection";
import Blog from "@/models/blog.model";

export const createblog = async (payload: {
  title: string;
  description: string;
  images: string;
}) => {
  await dbConnect();
  const doc = await Blog.create(payload);
  return JSON.parse(JSON.stringify(doc));
};

export const getBlogs = async () => {
  await dbConnect();
  const docs = await Blog.find().sort({ createdAt: -1 });
  return JSON.parse(JSON.stringify(docs));
};

export const getBlogById = async (id: string) => {
  await dbConnect();
  const doc = await Blog.findById(id);
  return JSON.parse(JSON.stringify(doc));
};

// рџ”Ѕ YANGI: UPDATE
export const updateBlog = async (
  id: string,
  payload: {
    title?: string;
    description?: string;
    images?: string;
  }
) => {
  await dbConnect();
  const updated = await Blog.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
  return JSON.parse(JSON.stringify(updated));
};

// рџ”Ѕ YANGI: DELETE
export const deleteBlog = async (id: string) => {
  await dbConnect();
  await Blog.findByIdAndDelete(id);
  return { ok: true };
};
