// components/admin/CategoryForm.jsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ImageUploader from "./ImageUploader";

const inputClass =
  "w-full rounded-lg border border-black/10 bg-white px-3.5 py-2.5 text-[14.5px] text-[#141414] outline-none transition-all placeholder:text-[#A5A5A5] focus:border-[#BF9A3A] focus:ring-2 focus:ring-[#BF9A3A]/20";

const labelClass =
  "mb-1.5 block text-[12.5px] font-semibold uppercase tracking-[0.07em] text-[#6B6B6B]";

const slugify = (s) =>
  s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

export default function CategoryForm({ initialCategory }) {
  const router = useRouter();
  const isEdit = Boolean(initialCategory);

  const [form, setForm] = useState({
    name: initialCategory?.name || "",
    slug: initialCategory?.slug || "",
    description: initialCategory?.description || "",
    image: initialCategory?.image || "",
    imageAlt: initialCategory?.imageAlt || "",
  });
  const [slugTouched, setSlugTouched] = useState(isEdit);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  /* naya banate waqt name se slug apne aap */
  function updateName(value) {
    setForm((f) => ({
      ...f,
      name: value,
      slug: slugTouched ? f.slug : slugify(value),
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSaved(false);
    try {
      const url = isEdit ? `/api/categories/${initialCategory._id}` : "/api/categories";
      const method = isEdit ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not save category");

      if (isEdit) {
        router.push("/admin/categories");
      } else {
        setForm({ name: "", slug: "", description: "", image: "", imageAlt: "" });
        setSlugTouched(false);
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
      router.refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="h-fit rounded-2xl border border-black/10 bg-white p-5 sm:p-6"
    >
      <h2 className="text-[12.5px] font-semibold uppercase tracking-[0.1em] text-[#8A8A8A]">
        {isEdit ? "Edit Category" : "Add Category"}
      </h2>

      <div className="mt-5 space-y-5">
        <div>
          <label className={labelClass}>
            Name <span className="ml-1 text-[#BF9A3A]">*</span>
          </label>
          <input
            required
            value={form.name}
            placeholder="Wedding Rings"
            onChange={(e) => updateName(e.target.value)}
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>
            Slug <span className="ml-1 text-[#BF9A3A]">*</span>
          </label>
          <div className="flex items-stretch overflow-hidden rounded-lg border border-black/10 transition-all focus-within:border-[#BF9A3A] focus-within:ring-2 focus-within:ring-[#BF9A3A]/20">
            <span className="hidden shrink-0 items-center border-r border-black/10 bg-black/[0.03] px-2.5 text-[12.5px] text-[#8A8A8A] sm:flex">
              /product-category/
            </span>
            <input
              required
              value={form.slug}
              placeholder="wedding-rings"
              onChange={(e) => {
                setSlugTouched(true);
                setForm((f) => ({ ...f, slug: slugify(e.target.value) }));
              }}
              className="w-full min-w-0 bg-white px-3.5 py-2.5 text-[14.5px] text-[#141414] outline-none placeholder:text-[#A5A5A5]"
            />
          </div>
          <p className="mt-1.5 text-[12.5px] text-[#9A9A9A]">
            {isEdit
              ? "Careful — changing this breaks existing links."
              : "Name se apne aap ban raha hai."}
          </p>
        </div>

        <div>
          <label className={labelClass}>Description</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={3}
            placeholder="Shown on the category page under the title."
            className={`${inputClass} resize-y`}
          />
        </div>

        <div>
          <label className={labelClass}>Category Image</label>
          <ImageUploader
            value={form.image}
            onChange={(url) => setForm({ ...form, image: url })}
          />
        </div>

        <div>
          <label className={labelClass}>Image Alt Text (SEO)</label>
          <input
            value={form.imageAlt}
            placeholder="e.g. Gold and diamond wedding rings on display"
            onChange={(e) => setForm({ ...form, imageAlt: e.target.value })}
            className={inputClass}
          />
          <p className="mt-1.5 text-[12.5px] text-[#9A9A9A]">
            Describes the image for search engines and screen readers.
          </p>
        </div>

        {error && (
          <div
            role="alert"
            className="rounded-lg border border-red-200 bg-red-50 px-3.5 py-2.5 text-[13.5px] text-red-700"
          >
            {error}
          </div>
        )}

        {saved && (
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-3.5 py-2.5 text-[13.5px] text-emerald-700">
            Category added.
          </div>
        )}

        <div className="flex items-center gap-3 pt-1">
          <button
            type="submit"
            disabled={saving}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#141414] py-3 text-[15px] font-semibold text-white transition-colors hover:bg-[#BF9A3A] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving && (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
            )}
            {saving ? "Saving..." : isEdit ? "Update Category" : "Add Category"}
          </button>

          {isEdit && (
            <Link
              href="/admin/categories"
              className="shrink-0 text-[14px] font-medium text-[#6B6B6B] transition-colors hover:text-[#BF9A3A]"
            >
              Cancel
            </Link>
          )}
        </div>
      </div>
    </form>
  );
}