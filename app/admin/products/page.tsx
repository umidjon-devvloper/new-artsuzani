"use client";

import React, { useEffect, useState, useTransition } from "react";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  type ProductDTO,
  type GetProductsResult,
} from "@/actions/product.actions";
import { getCategories } from "@/actions/category.actions";

type Toast = { type: "success" | "error"; message: string };
type Category = { _id: string; title: string };

const Products: React.FC = () => {
  const [products, setProducts] = useState<ProductDTO[]>([]);
  const [loading, setLoading] = useState(true);

  const [categories, setCategories] = useState<Category[]>([]);
  const [catsLoading, setCatsLoading] = useState(true);

  // create toggle
  const [showCreate, setShowCreate] = useState(false);

  // create fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState<string>("0");
  const [imagesBase64, setImagesBase64] = useState<string[]>([]);

  // edit modal
  const [editOpen, setEditOpen] = useState(false);
  const [editing, setEditing] = useState<ProductDTO | null>(null);
  const [eTitle, setETitle] = useState("");
  const [eDescription, setEDescription] = useState("");
  const [eCategory, setECategory] = useState("");
  const [ePrice, setEPrice] = useState<string>("0");
  const [eImages, setEImages] = useState<string[]>([]);

  const [toast, setToast] = useState<Toast | null>(null);
  const [isPending, startTransition] = useTransition();

  // initial fetch
  useEffect(() => {
    (async () => {
      setLoading(true);
      const res: GetProductsResult = await getProducts();
      if (res.ok) setProducts(res.data);
      else
        setToast({
          type: "error",
          message: res.error || "Mahsulotlarni yuklab boвЂlmadi",
        });
      setLoading(false);
    })();
  }, []);

  // categories
  useEffect(() => {
    (async () => {
      try {
        setCatsLoading(true);
        const json = await getCategories();
        if (json?.ok) {
          setCategories(json.data || []);
          if (json.data && json.data.length > 0 && !category) {
            setCategory(json.data[0]._id);
          }
        } else {
          setToast({
            type: "error",
            message: json?.error || "Kategoriya topilmadi",
          });
        }
      } catch {
        setToast({ type: "error", message: "Kategoriya olishda xatolik" });
      } finally {
        setCatsLoading(false);
      }
    })();
  }, []);

  // helpers
  async function filesToB64(list: FileList | null): Promise<string[]> {
    if (!list || list.length === 0) return [];
    const arr = Array.from(list);
    const asB64 = await Promise.all(
      arr.map(
        (file) =>
          new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(String(reader.result));
            reader.onerror = reject;
            reader.readAsDataURL(file);
          })
      )
    );
    return asB64;
  }
  function removeCreateImage(idx: number) {
    setImagesBase64((prev) => prev.filter((_, i) => i !== idx));
  }
  function removeEditImage(idx: number) {
    setEImages((prev) => prev.filter((_, i) => i !== idx));
  }

  // CREATE
  async function onCreate(formData: FormData) {
    if (!category) {
      setToast({ type: "error", message: "Iltimos, kategoriyani tanlang." });
      return;
    }
    formData.set("images", JSON.stringify(imagesBase64));
    startTransition(async () => {
      const res = await createProduct(formData);
      if (res?.ok) {
        setProducts((prev) => [res.data, ...prev]);
        setToast({ type: "success", message: "Mahsulot yaratildi!" });
        setShowCreate(false);
        // reset fields
        setTitle("");
        setDescription("");
        setCategory(categories[0]?._id || "");
        setPrice("0");
        setImagesBase64([]);
      } else {
        setToast({
          type: "error",
          message: res?.error || "Xatolik sodir boвЂldi",
        });
      }
    });
  }

  // OPEN EDIT
  function openEdit(p: ProductDTO) {
    setEditing(p);
    setETitle(p.title);
    setEDescription(p.description || "");
    setECategory(p.categoryId);
    setEPrice(String(p.price));
    setEImages(p.images || []);
    setEditOpen(true);
  }
  function closeEdit() {
    setEditOpen(false);
    setEditing(null);
    setETitle("");
    setEDescription("");
    setECategory(categories[0]?._id || "");
    setEPrice("0");
    setEImages([]);
  }

  // UPDATE
  async function onUpdate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!editing) return;

    const fd = new FormData(e.currentTarget);
    fd.set("images", JSON.stringify(eImages));

    startTransition(async () => {
      const res = await updateProduct(editing._id, fd);
      if (res?.ok) {
        const updated = res.data;
        setProducts((prev) =>
          prev.map((x) => (x._id === updated._id ? updated : x))
        );
        setToast({ type: "success", message: "Yangilandi" });
        closeEdit();
      } else {
        setToast({
          type: "error",
          message: res?.error || "Yangilashda xatolik",
        });
      }
    });
  }

  // DELETE
  async function onDelete(id: string) {
    const yes = confirm("Rostdan oвЂchirmoqchimisiz?");
    if (!yes) return;
    startTransition(async () => {
      const res = await deleteProduct(id);
      if (res?.ok) {
        setProducts((prev) => prev.filter((x) => x._id !== id));
        setToast({ type: "success", message: "OвЂchirildi" });
      } else {
        setToast({
          type: "error",
          message: res?.error || "OвЂchirishda xatolik",
        });
      }
    });
  }

  return (
    <div className="min-h-screen w-full  py-10">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Mahsulotlar</h1>
            <p className="text-gray-600 mt-1">
              Mahsulot qo&apos;shish, tahrirlash va boshqarish.
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
            <h2 className="text-lg font-semibold">Yangi mahsulot</h2>

            <form action={onCreate} className="mt-4 grid grid-cols-1 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Title
                </label>
                <input
                  name="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Masalan: iPhone 15"
                  className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black/10"
                  required
                />
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Category
                  </label>
                  <select
                    name="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    disabled={catsLoading || categories.length === 0}
                    className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black/10 disabled:opacity-60"
                    required
                  >
                    {catsLoading && <option value="">Yuklanmoqda...</option>}
                    {!catsLoading && categories.length === 0 && (
                      <option value="">Kategoriya yoвЂq</option>
                    )}
                    {!catsLoading &&
                      categories.length > 0 &&
                      categories.map((c) => (
                        <option key={c._id} value={c._id}>
                          {c.title}
                        </option>
                      ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Narx
                  </label>
                  <input
                    name="price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black/10"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Tavsif
                </label>
                <textarea
                  name="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Mahsulot haqida qisqacha"
                  rows={4}
                  className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black/10"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Rasmlar (koвЂpi 8 ta)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={async (e) => {
                    const more = await filesToB64(e.target.files);
                    setImagesBase64((prev) => [...prev, ...more].slice(0, 8));
                  }}
                  className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black/10"
                />
                {imagesBase64.length > 0 && (
                  <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {imagesBase64.map((src, idx) => (
                      <div
                        key={idx}
                        className="group relative overflow-hidden rounded-2xl border border-gray-200"
                      >
                        <img
                          src={src}
                          alt={`preview-${idx}`}
                          className="h-32 w-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removeCreateImage(idx)}
                          className="absolute right-2 top-2 hidden rounded-full bg-white/90 px-2 py-1 text-xs shadow-sm group-hover:block"
                        >
                          OвЂchirish
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* images JSON */}
              <input
                type="hidden"
                name="images"
                value={JSON.stringify(imagesBase64)}
              />

              <div className="pt-2">
                <button
                  disabled={isPending}
                  className="inline-flex items-center justify-center rounded-2xl bg-black px-4 py-2 text-white transition hover:bg-black/90 disabled:opacity-60"
                >
                  {isPending ? "Saqlanmoqda..." : "Mahsulotni saqlash"}
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
          ) : products.length === 0 ? (
            <div className="mt-4 text-sm text-gray-500">
              Hozircha mahsulot yoвЂq.
            </div>
          ) : (
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((p) => (
                <div
                  key={p._id}
                  className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm"
                >
                  <div className="flex items-start gap-3">
                    <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl border bg-gray-50">
                      {p.images?.[0] ? (
                        <img
                          src={p.images[0]}
                          alt={p.title}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">
                          No image
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="font-semibold truncate">{p.title}</div>
                      <div className="text-sm text-gray-600 mt-0.5">
                        {p.categoryTitle ? p.categoryTitle : "вЂ”"} вЂў{" "}
                        {p.price}
                      </div>
                      {p.description && (
                        <div className="text-xs text-gray-500 mt-1 line-clamp-2">
                          {p.description}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-3 flex justify-end gap-2">
                    <button
                      onClick={() => openEdit(p)}
                      className="rounded-xl border border-gray-200 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(p._id)}
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
            <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Mahsulot tahrirlash</h3>
                <button
                  onClick={closeEdit}
                  className="rounded-lg px-2 py-1 text-sm hover:bg-gray-100"
                >
                  X
                </button>
              </div>

              <form onSubmit={onUpdate} className="mt-4 grid grid-cols-1 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Title
                  </label>
                  <input
                    name="title"
                    value={eTitle}
                    onChange={(e) => setETitle(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black/10"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Category
                    </label>
                    <select
                      name="category"
                      value={eCategory}
                      onChange={(e) => setECategory(e.target.value)}
                      disabled={catsLoading || categories.length === 0}
                      className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black/10 disabled:opacity-60"
                      required
                    >
                      {catsLoading && <option value="">Yuklanmoqda...</option>}
                      {!catsLoading && categories.length === 0 && (
                        <option value="">Kategoriya yoвЂq</option>
                      )}
                      {!catsLoading &&
                        categories.length > 0 &&
                        categories.map((c) => (
                          <option key={c._id} value={c._id}>
                            {c.title}
                          </option>
                        ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Narx
                    </label>
                    <input
                      name="price"
                      type="number"
                      step="0.01"
                      min="0"
                      value={ePrice}
                      onChange={(e) => setEPrice(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black/10"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Tavsif
                  </label>
                  <textarea
                    name="description"
                    value={eDescription}
                    onChange={(e) => setEDescription(e.target.value)}
                    rows={4}
                    className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black/10"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Rasmlar (koвЂpi 8 ta)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={async (e) => {
                      const more = await filesToB64(e.target.files);
                      setEImages((prev) => [...prev, ...more].slice(0, 8));
                    }}
                    className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black/10"
                  />

                  {eImages.length > 0 && (
                    <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                      {eImages.map((src, idx) => (
                        <div
                          key={idx}
                          className="group relative overflow-hidden rounded-2xl border border-gray-200"
                        >
                          <img
                            src={src}
                            alt={`preview-${idx}`}
                            className="h-32 w-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => removeEditImage(idx)}
                            className="absolute right-2 top-2 hidden rounded-full bg-white/90 px-2 py-1 text-xs shadow-sm group-hover:block"
                          >
                            OвЂchirish
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* images JSON */}
                <input
                  type="hidden"
                  name="images"
                  value={JSON.stringify(eImages)}
                />

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
          * Rasmlar <b>base64</b> koвЂrinishda saqlanadi. Katta hajmli media
          uchun S3/GCS kabi storage tavsiya etiladi.
        </p>
      </div>
    </div>
  );
};

export default Products;
