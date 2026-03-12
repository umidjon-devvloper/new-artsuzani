"use client";

import React, { useEffect, useState, useTransition } from "react";
import {
  createCategories,
  deleteCategory,
  getCategories,
  updateCategory,
  type CategoryDTO,
  type GetCategoriesResult,
  type CreateCategoryResult,
} from "@/actions/category.actions";

type Toast = { type: "success" | "error"; message: string };
type Category = CategoryDTO;

const Categories: React.FC = () => {
  const [cats, setCats] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Create panel toggle
  const [showCreate, setShowCreate] = useState(false);

  // Create fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageB64, setImageB64] = useState<string>("");

  // Edit modal state
  const [editOpen, setEditOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editImageB64, setEditImageB64] = useState<string>("");

  const [toast, setToast] = useState<Toast | null>(null);
  const [isPending, startTransition] = useTransition();

  // Initial load
  useEffect(() => {
    (async () => {
      setLoading(true);
      const res: GetCategoriesResult = await getCategories();
      if (res.ok) {
        setCats(res.data);
      } else {
        setToast({
          type: "error",
          message: res.error || "Kategoriya yuklab boвЂlmadi",
        });
      }
      setLoading(false);
    })();
  }, []);

  // helpers: file -> base64
  async function fileToB64(file: File | null): Promise<string> {
    if (!file) return "";
    const b64 = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
    return b64;
  }

  // CREATE
  async function onCreate(formData: FormData) {
    formData.set("image", imageB64); // base64 yoki boвЂsh
    startTransition(async () => {
      const res: CreateCategoryResult = await createCategories(formData);
      if (res.ok) {
        setToast({ type: "success", message: "Kategoriya yaratildi!" });
        setCats((prev) => [res.data, ...prev]);
        // reset fields
        setTitle("");
        setDescription("");
        setImageB64("");
        setShowCreate(false);
      } else {
        setToast({ type: "error", message: res.error || "Xatolik yuz berdi" });
      }
    });
  }

  // DELETE
  async function onDelete(id: string) {
    const yes = confirm("Rostdan oвЂchirmoqchimisiz?");
    if (!yes) return;

    startTransition(async () => {
      const res = await deleteCategory(id);
      if (res.ok) {
        setCats((prev) => prev.filter((c) => c._id !== id));
        setToast({ type: "success", message: "OвЂchirildi" });
      } else {
        setToast({
          type: "error",
          message: res.error || "OвЂchirishda xatolik",
        });
      }
    });
  }

  // EDIT open
  function openEdit(c: Category) {
    setEditing(c);
    setEditTitle(c.title);
    setEditDescription(c.description || "");
    setEditImageB64(c.image || "");
    setEditOpen(true);
  }
  function closeEdit() {
    setEditOpen(false);
    setEditing(null);
    setEditTitle("");
    setEditDescription("");
    setEditImageB64("");
  }

  // EDIT submit
  async function onUpdate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!editing) return;

    const fd = new FormData(e.currentTarget);
    fd.set("image", editImageB64); // base64 yoki boвЂsh

    startTransition(async () => {
      const res = await updateCategory(editing._id, fd);
      if (res.ok) {
        setCats((prev) =>
          prev?.map((c) => (c._id === res.data._id ? res.data : c))
        );
        setToast({ type: "success", message: "Yangilandi" });
        closeEdit();
      } else {
        setToast({
          type: "error",
          message: res.error || "Yangilashda xatolik",
        });
      }
    });
  }

  return (
    <div className="min-h-screen w-full  py-10">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Kategoriyalar</h1>
            <p className="text-gray-600 mt-1">
              Yangi kategoriya qo&apos;shing va mavjudlarini boshqaring.
            </p>
          </div>

          <button
            onClick={() => setShowCreate((s) => !s)}
            className="rounded-2xl bg-black px-4 py-2 text-white hover:bg-black/90"
          >
            {showCreate ? "Bekor qilish" : "Yaratish"}
          </button>
        </div>

        {/* Toast */}
        {toast && (
          <div
            className={`mt-4 rounded-xl px-4 py-3 text-sm ${
              toast.type === "success"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {toast.message}
          </div>
        )}

        {/* CREATE PANEL */}
        {showCreate && (
          <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
            <h2 className="text-lg font-semibold">Yangi kategoriya</h2>

            <form action={onCreate} className="mt-4 grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Title
                </label>
                <input
                  name="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Masalan: Smartfonlar"
                  className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black/10"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Tavsif
                </label>
                <textarea
                  name="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Qisqacha izoh"
                  rows={3}
                  className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black/10"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Rasm (ixtiyoriy)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={async (e) =>
                    setImageB64(await fileToB64(e.target.files?.[0] || null))
                  }
                  className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black/10"
                />

                {imageB64 && (
                  <div className="mt-3">
                    <img
                      src={imageB64}
                      alt="preview"
                      className="h-28 rounded-xl border object-cover"
                    />
                  </div>
                )}
              </div>

              <div className="pt-2">
                <button
                  disabled={isPending}
                  className="inline-flex items-center justify-center rounded-2xl bg-black px-4 py-2 text-white transition hover:bg-black/90 disabled:opacity-60"
                >
                  {isPending ? "Saqlanmoqda..." : "Kategoriya yaratish"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* LIST */}
        <div className="mt-8">
          <h2 className="text-lg font-semibold">Ro&apos;yxat</h2>

          {loading ? (
            <div className="mt-4 text-sm text-gray-500">Yuklanmoqda...</div>
          ) : cats.length === 0 ? (
            <div className="mt-4 text-sm text-gray-500">
              Hozircha kategoriya yoвЂq.
            </div>
          ) : (
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {cats.map((c) => (
                <div
                  key={c._id}
                  className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm"
                >
                  <div className="flex items-start gap-3">
                    <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl border bg-gray-50">
                      {c.image ? (
                        <img
                          src={c.image}
                          alt={c.title}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">
                          No image
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="font-semibold truncate">{c.title}</div>
                      {c.description && (
                        <div className="text-sm text-gray-600 mt-0.5 line-clamp-2">
                          {c.description}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-3 flex justify-end gap-2">
                    <button
                      onClick={() => openEdit(c)}
                      className="rounded-xl border border-gray-200 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(c._id)}
                      className="rounded-xl border border-gray-200 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50"
                      disabled={isPending}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* EDIT MODAL */}
        {editOpen && editing && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Kategoriya tahrirlash</h3>
                <button
                  onClick={closeEdit}
                  className="rounded-lg px-2 py-1 text-sm hover:bg-gray-100"
                >
                  X
                </button>
              </div>

              <form onSubmit={onUpdate} className="mt-4 grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Title
                  </label>
                  <input
                    name="title"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black/10"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Tavsif
                  </label>
                  <textarea
                    name="description"
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    rows={3}
                    className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black/10"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Rasm (ixtiyoriy)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={async (e) =>
                      setEditImageB64(
                        await fileToB64(e.target.files?.[0] || null)
                      )
                    }
                    className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black/10"
                  />

                  {editImageB64 && (
                    <div className="mt-3">
                      <img
                        src={editImageB64}
                        alt="preview"
                        className="h-28 rounded-xl border object-cover"
                      />
                    </div>
                  )}
                </div>

                <div className="mt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={closeEdit}
                    className="rounded-xl border border-gray-200 px-4 py-2 text-sm hover:bg-gray-50"
                  >
                    Bekor qilish
                  </button>
                  <button
                    type="submit"
                    disabled={isPending}
                    className="rounded-2xl bg-black px-4 py-2 text-sm text-white hover:bg-black/90 disabled:opacity-60"
                  >
                    {isPending ? "Saqlanmoqda..." : "Saqlash"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <p className="mt-10 text-xs text-gray-500">
          * Rasm <b>base64</b> koвЂrinishda saqlanadi. Katta hajmli fayllar
          uchun S3/GCS kabi storage ishlatish maвЂ™qul.
        </p>
      </div>
    </div>
  );
};

export default Categories;
