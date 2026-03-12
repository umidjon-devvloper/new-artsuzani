import { getBlogById } from "@/actions/blog.actions";
import React from "react";
import Image from "next/image";

export default async function BlogId({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const blog = await getBlogById(id);

  if (!blog) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Blog topilmadi</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen ">
      <main className="max-w-4xl mx-auto py-10 px-4 mt-24">
        {/* Title */}

        {/* Image */}
        {blog.images && (
          <div className="relative w-full h-96 mb-8 overflow-hidden rounded-2xl shadow-lg">
            <Image
              src={blog.images}
              alt={blog.title}
              fill
              className="object-cover"
            />
          </div>
        )}

        {/* Description */}
        <h1 className="text-3xl md:text-3xl break-all font-bold text-gray-900 mb-6 leading-snug">
          {blog.title}
        </h1>
        <p className="text-lg break-all text-gray-700 leading-relaxed whitespace-pre-line mb-8">
          {blog.description}
        </p>

        {/* Footer (date) */}
        <div className="text-sm text-gray-500 border-t pt-4">
          <span>
            Create Date:{" "}
            {new Date(blog.createdAt).toLocaleDateString("uz-UZ", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
        </div>
      </main>
    </div>
  );
}
