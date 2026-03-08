"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  createblog,
  getBlogs,
  updateBlog,
  deleteBlog,
} from "@/actions/blog.actions";

interface Blog {
  _id?: string;
  title: string;
  description: string;
  images: string;
}

const BlogsPage = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Blog>({
    title: "",
    description: "",
    images: "",
  });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const fetchBlogs = async () => {
    try {
      const data = await getBlogs();
      if (data) setBlogs(data);
    } catch (e: any) {
      setErr(e?.message || "Failed to load blogs");
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const resetForm = () => {
    setForm({ title: "", description: "", images: "" });
    setEditingId(null);
  };

  const handleCreateOrUpdate = async () => {
    try {
      setLoading(true);
      setErr(null);

      if (editingId) {
        await updateBlog(editingId, form);
      } else {
        await createblog(form);
      }

      resetForm();
      setShowForm(false);
      fetchBlogs();
    } catch (e: any) {
      setErr(e?.message || (editingId ? "Update failed" : "Create failed"));
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (blog: Blog) => {
    setEditingId(blog._id || null);
    setForm({
      title: blog.title,
      description: blog.description,
      images: blog.images || "",
    });
    setShowForm(true);
  };

  const handleDelete = async (id?: string) => {
    if (!id) return;
    const ok = confirm("Haqiqatan ham oвЂchirmoqchimisiz?");
    if (!ok) return;
    try {
      setLoading(true);
      await deleteBlog(id);
      // Optimistik yangilash
      setBlogs((prev) => prev.filter((b) => b._id !== id));
    } catch (e: any) {
      setErr(e?.message || "Delete failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3">
        <Button
          onClick={() => {
            if (showForm && editingId) {
              // Editdan chiqib Create rejimiga qaytish
              resetForm();
            }
            setShowForm(!showForm);
          }}
        >
          {showForm ? "Close" : "Create"}
        </Button>
        {loading && (
          <span className="text-sm text-gray-500">Processing...</span>
        )}
        {err && <span className="text-sm text-red-600">{err}</span>}
      </div>

      {showForm && (
        <Card className="p-4">
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">
                {editingId ? "Edit Blog" : "Create Blog"}
              </h3>
              {editingId && (
                <Button
                  variant="secondary"
                  onClick={() => {
                    resetForm();
                  }}
                >
                  Switch to Create
                </Button>
              )}
            </div>

            <Input
              placeholder="Title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
            <Textarea
              placeholder="Description"
              value={form.description}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                setForm({ ...form, description: e.target.value })
              }
            />
            <Input
              placeholder="Image URL"
              value={form.images}
              onChange={(e) => setForm({ ...form, images: e.target.value })}
            />

            <div className="flex gap-3">
              <Button onClick={handleCreateOrUpdate} disabled={loading}>
                {loading
                  ? "Saving..."
                  : editingId
                  ? "Save Changes"
                  : "Save Blog"}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  resetForm();
                  setShowForm(false);
                }}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {blogs.map((blog) => (
          <Card
            key={blog._id}
            className="shadow-lg rounded-2xl overflow-hidden"
          >
            {blog.images ? (
              <img
                src={blog.images}
                alt={blog.title}
                className="h-40 w-full object-cover"
              />
            ) : null}
            <CardContent className="p-4 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h2 className="text-xl font-bold break-all">{blog.title}</h2>
                  <p className="text-gray-600 break-all">{blog.description}</p>
                </div>
              </div>
              <div className="flex justify-end gap-2 shrink-0">
                <Button size="sm" onClick={() => startEdit(blog)}>
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDelete(blog._id)}
                >
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default BlogsPage;
