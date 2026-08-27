// components/admin/BlogForm.jsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ImageUploader from "./ImageUploader";
import RichTextEditor from "./RichTextEditor";

const inputClass =
  "w-full rounded-lg border border-black/10 bg-white px-3.5 py-2.5 text-[14.5px] text-[#141414] outline-none transition-all placeholder:text-[#A5A5A5] focus:border-[#BF9A3A] focus:ring-2 focus:ring-[#BF9A3A]/20";

const labelClass =
  "mb-1.5 block text-[12.5px] font-semibold uppercase tracking-[0.07em] text-[#6B6B6B]";

/* title se slug bana do */
const slugify = (s) =>
  s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

function Card({ title, description, children }) {
  return (
    <section className="rounded-2xl border border-black/10 bg-white p-5 sm:p-6">
      {title && (
        <div className="mb-5">
          <h2 className="text-[12.5px] font-semibold uppercase tracking-[0.1em] text-[#8A8A8A]">
            {title}
          </h2>
          {description && <p className="mt-1.5 text-[13.5px] text-[#8A8A8A]">{description}</p>}
        </div>
      )}
      {children}
    </section>
  );
}

function TextField({ label, value, onChange, type = "text", required = false, placeholder, hint }) {
  return (
    <div>
      <label className={labelClass}>
        {label}
        {required && <span className="ml-1 text-[#BF9A3A]">*</span>}
      </label>
      <input
        type={type}
        required={required}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className={inputClass}
      />
      {hint && <p className="mt-1.5 text-[12.5px] text-[#9A9A9A]">{hint}</p>}
    </div>
  );
}

export default function BlogForm({ initialPost }) {
  const router = useRouter();
  const isEdit = Boolean(initialPost);

  const [form, setForm] = useState({
    title: initialPost?.title || "",
    slug: initialPost?.slug || "",
    excerpt: initialPost?.excerpt || "",
    content: initialPost?.content || "",
    coverImage: initialPost?.coverImage || "",
    coverImageAlt: initialPost?.coverImageAlt || "",
    metaTitle: initialPost?.metaTitle || "",
    metaDescription: initialPost?.metaDescription || "",
    keywords: initialPost?.keywords?.join(", ") || "",
  });
  const [slugTouched, setSlugTouched] = useState(isEdit);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  function update(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  /* naya post banate waqt title se slug apne aap bhar do */
  function updateTitle(value) {
    setForm((f) => ({
      ...f,
      title: value,
      slug: slugTouched ? f.slug : slugify(value),
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const payload = {
        ...form,
        keywords: form.keywords
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      };
      const url = isEdit ? `/api/blog/${initialPost._id}` : "/api/blog";
      const method = isEdit ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not save blog post");
      router.push("/admin/blog");
      router.refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  const metaLen = form.metaDescription.length;
  const keywordChips = form.keywords
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  return (
    <form onSubmit={handleSubmit}>
      {/* ---------- header ---------- */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-[24px] font-medium leading-tight tracking-[-0.01em] text-[#141414] sm:text-[28px]">
            {isEdit ? "Edit Post" : "New Post"}
          </h1>
          <p className="mt-1.5 text-[14.5px] text-[#6B6B6B]">
            {isEdit ? "Update this article and save your changes." : "Write and publish a new article."}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {isEdit && form.slug && (
            <Link
              href={`/blog/${form.slug}`}
              target="_blank"
              className="rounded-lg border border-black/10 px-4 py-2.5 text-[14px] font-medium text-[#5A5A5A] transition-colors hover:border-[#BF9A3A] hover:text-[#BF9A3A]"
            >
              Preview
            </Link>
          )}
          <Link
            href="/admin/blog"
            className="text-[14px] font-medium text-[#6B6B6B] transition-colors hover:text-[#BF9A3A]"
          >
            Cancel
          </Link>
        </div>
      </div>

      {/* ---------- body ---------- */}
      <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_330px] xl:items-start">
        {/* main column */}
        <div className="min-w-0 space-y-6">
          <Card title="Post details">
            <div className="space-y-5">
              <TextField
                label="Title"
                value={form.title}
                onChange={updateTitle}
                placeholder="Layering Necklaces Like a Pro"
                required
              />

              <div>
                <label className={labelClass}>
                  Slug <span className="ml-1 text-[#BF9A3A]">*</span>
                </label>
                <div className="flex items-stretch overflow-hidden rounded-lg border border-black/10 transition-all focus-within:border-[#BF9A3A] focus-within:ring-2 focus-within:ring-[#BF9A3A]/20">
                  <span className="flex shrink-0 items-center border-r border-black/10 bg-black/[0.03] px-3 text-[13.5px] text-[#8A8A8A]">
                    /blog/
                  </span>
                  <input
                    required
                    value={form.slug}
                    onChange={(e) => {
                      setSlugTouched(true);
                      update("slug", slugify(e.target.value));
                    }}
                    placeholder="layering-necklaces-like-a-pro"
                    className="w-full min-w-0 bg-white px-3.5 py-2.5 text-[14.5px] text-[#141414] outline-none placeholder:text-[#A5A5A5]"
                  />
                </div>
                <p className="mt-1.5 text-[12.5px] text-[#9A9A9A]">
                  {isEdit
                    ? "Careful — changing this breaks existing links."
                    : "Title se apne aap ban raha hai. Edit karoge to auto-fill ruk jayega."}
                </p>
              </div>

              <div>
                <label className={labelClass}>Excerpt</label>
                <textarea
                  value={form.excerpt}
                  onChange={(e) => update("excerpt", e.target.value)}
                  rows={3}
                  placeholder="Short summary shown on the blog list and homepage."
                  className={`${inputClass} resize-y`}
                />
              </div>
            </div>
          </Card>

          <Card title="Content">
            <RichTextEditor
              value={form.content}
              onChange={(html) => update("content", html)}
              placeholder="Write your article..."
            />
          </Card>
        </div>

        {/* sidebar */}
        <aside className="space-y-6 xl:sticky xl:top-32">
          {/* actions */}
          <Card>
            {error && (
              <div
                role="alert"
                className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3.5 py-2.5 text-[13.5px] text-red-700"
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={saving}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#141414] py-3 text-[15px] font-semibold text-white transition-colors hover:bg-[#BF9A3A] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving && (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
              )}
              {saving ? "Saving..." : isEdit ? "Update Post" : "Publish Post"}
            </button>
          </Card>

          <Card title="Cover image">
            <ImageUploader
              value={form.coverImage}
              onChange={(url) => update("coverImage", url)}
            />
            <div className="mt-4">
              <TextField
                label="Image Alt Text (SEO)"
                value={form.coverImageAlt}
                onChange={(v) => update("coverImageAlt", v)}
                placeholder="e.g. Model wearing layered gold necklaces"
                hint="Describes the image for search engines and screen readers."
              />
            </div>
          </Card>

          <Card title="SEO" description="Leave blank to fall back to the title and excerpt.">
            <div className="space-y-5">
              <TextField
                label="Meta Title"
                value={form.metaTitle}
                onChange={(v) => update("metaTitle", v)}
                placeholder={form.title || "Page title for Google"}
              />

              <div>
                <label className={labelClass}>Meta Description</label>
                <textarea
                  value={form.metaDescription}
                  onChange={(e) => update("metaDescription", e.target.value)}
                  rows={3}
                  maxLength={160}
                  placeholder="Snippet shown in search results."
                  className={`${inputClass} resize-y`}
                />
                <div className="mt-1.5 flex items-center justify-between text-[12.5px]">
                  <span className="text-[#9A9A9A]">Aim for 120–160</span>
                  <span className={metaLen > 150 ? "text-amber-600" : "text-[#9A9A9A]"}>
                    {metaLen}/160
                  </span>
                </div>
              </div>

              <div>
                <TextField
                  label="Keywords"
                  value={form.keywords}
                  onChange={(v) => update("keywords", v)}
                  placeholder="rings, diamonds, styling"
                  hint="Comma separated."
                />
                {keywordChips.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {keywordChips.map((k, i) => (
                      <span
                        key={`${k}-${i}`}
                        className="rounded-full bg-[#F7F1E5] px-2.5 py-1 text-[12px] font-medium text-[#8A6E1F]"
                      >
                        {k}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </Card>
        </aside>
      </div>

      {/* mobile pe sidebar neeche hai, isliye ek aur save button */}
      <div className="mt-6 xl:hidden">
        <button
          type="submit"
          disabled={saving}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#141414] py-3.5 text-[15px] font-semibold text-white transition-colors hover:bg-[#BF9A3A] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving && (
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
          )}
          {saving ? "Saving..." : isEdit ? "Update Post" : "Publish Post"}
        </button>
      </div>
    </form>
  );
}