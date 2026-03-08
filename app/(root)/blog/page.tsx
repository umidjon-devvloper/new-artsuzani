import React from "react";
import Image from "next/image";
import Link from "next/link";
import { getBlogs } from "@/actions/blog.actions";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, ImageIcon } from "lucide-react";

// Helper to format ISO dates nicely for Asia/Tashkent
function formatDate(iso?: string) {
  if (!iso) return "";
  try {
    const d = new Date(iso);
    return d.toLocaleDateString("uz-UZ", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return iso;
  }
}

// Safe image component with graceful fallback
function BlogImage({
  src,
  alt,
  className,
  fill,
  priority,
}: {
  src?: string;
  alt: string;
  className?: string;
  fill?: boolean;
  priority?: boolean;
}) {
  const hasSrc = Boolean(src);
  if (!hasSrc) {
    return (
      <div className={`flex items-center justify-center bg-muted ${className}`}>
        <ImageIcon className="h-6 w-6 opacity-60" />
      </div>
    );
  }
  // next/image requires width/height OR fill
  return fill ? (
    <Image
      src={src!}
      alt={alt}
      fill
      className={`object-cover  ${className}`}
      sizes="(max-width: 768px) 100vw, 50vw"
      priority={priority}
    />
  ) : (
    <Image
      src={src!}
      alt={alt}
      width={800}
      height={500}
      className={`object-cover ${className}`}
      priority={priority}
    />
  );
}
interface Blog {
  _id: string;
  title: string;
  description?: string;
  images?: string;
  createdAt?: string;
}

// Horizontal (featured) card for the first blog
function FeaturedBlog({ blog }: { blog: Blog }) {
  return (
    <Card className="overflow-hidden border-0 shadow-lg p-0">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
        <div className="relative h-64 md:h-full min-h-64">
          <BlogImage
            src={blog?.images}
            alt={blog?.title ?? "Blog image"}
            fill
            className="rounded-lg"
            priority
          />
        </div>
        <div className="p-6 md:p-8 flex flex-col gap-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>{formatDate(blog?.createdAt)}</span>
            <Badge variant="secondary" className="ml-auto">
              Featured
            </Badge>
          </div>
          <h2 className="text-2xl md:text-3xl break-all font-semibold leading-tight line-clamp-2">
            {blog?.title || "Untitled"}
          </h2>
          {blog?.description && (
            <p className="text-muted-foreground break-all  dark:text-white/80 line-clamp-3">
              {blog.description}
            </p>
          )}
          <div className="flex justify-end">
            <Link
              href={`/blog/${blog?._id}`}
              className="inline-flex text-white items-center justify-center rounded-2xl px-4 py-2 text-sm font-medium bg-primary hover:opacity-90 transition"
            >
              View Article &rarr;
            </Link>
          </div>
        </div>
      </div>
    </Card>
  );
}

// Vertical standard card
function BlogCard({ blog }: { blog: any }) {
  return (
    <Card className="overflow-hidden transition hover:shadow-md p-0">
      <div className="relative h-48">
        <BlogImage src={blog?.images} alt={blog?.title ?? "Blog image"} fill />
      </div>
      <CardHeader>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Calendar className="h-3.5 w-3.5" />
          <span>{formatDate(blog?.createdAt)}</span>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <h3 className="text-lg font-semibold line-clamp-2 mb-1 break-all">
          {blog?.title || "Untitled"}
        </h3>
        {blog?.description && (
          <p className="text-sm text-muted-foreground line-clamp-2 break-all">
            {blog.description}
          </p>
        )}
        <div className="mt-4 mb-3">
          <Link
            href={`/blog/${blog?._id}`}
            className="text-sm text-primary hover:underline"
          >
            View Article &rarr;
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

export default async function Page() {
  const blogs = await getBlogs();
  const list = Array.isArray(blogs) ? blogs : [];
  return (
    <div className="min-h-screen ">
      <div className="container mx-auto px-4 md:px-6 max-w-6xl py-8 md:py-12 mt-20">
        <div className="mb-8 md:mb-10 text-center">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            Blogs
          </h1>
          <p className="text-muted-foreground mt-2">
            Latest articles, news, and helpful tips
          </p>
        </div>

        {/* Empty state */}
        {list.length === 0 && (
          <Card className="p-10 text-center">
            <p className="text-muted-foreground">
              No blogs for now. Updates coming soon.
            </p>
          </Card>
        )}

        {/* First horizontal card */}
        {list.length > 0 && (
          <div className="mb-8">
            <FeaturedBlog blog={list[0]} />
          </div>
        )}

        {/* Remaining vertical cards */}
        {list.length > 1 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {list.slice(1).map((b: any) => (
              <BlogCard key={b?._id || b?.title} blog={b} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
